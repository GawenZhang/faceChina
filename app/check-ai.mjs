import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const script = await readFile(new URL('./services/ai-service.js', import.meta.url), 'utf8');
const configScript = await readFile(new URL('./ai-config.js', import.meta.url), 'utf8');
let count = 0;
function harness(fetchImplementation = async () => { throw new Error('unexpected fetch'); }) {
  const context = vm.createContext({ URL, AbortController, setTimeout, clearTimeout, fetch: fetchImplementation, location: { origin: 'http://localhost:4800' } });
  context.window = context;
  vm.runInContext(configScript, context);
  vm.runInContext(script, context);
  return context;
}
function response(payload, status = 200, type = 'application/json') {
  return { ok: status >= 200 && status < 300, status, headers: { get: () => type }, json: async () => payload };
}
async function test(name, run) {
  await run();
  count++;
  console.log(`PASS ${name}`);
}

await test('stub reports not configured, no fabricated content and no network for all operations', async () => {
  let calls = 0;
  const { GeoAI } = harness(async () => { calls++; });
  const service = GeoAI.createService({ stubDelayMs: 0 });
  for (const operation of ['generate', 'detect', 'analyze']) {
    const states = [];
    const result = await service.request(operation, { text: '示例内容' }, { onStateChange: s => states.push(s) });
    assert.equal(result.status, 'not_configured');
    assert.equal(result.error.code, 'not_configured');
    assert.equal(result.data, null);
    assert.equal(result.ok, false);
    assert.deepEqual(states, ['loading', 'not_configured']);
  }
  assert.equal(calls, 0);
});

await test('stub cancellation closes loading state without returning later output', async () => {
  const { GeoAI } = harness();
  const controller = new AbortController();
  const states = [];
  const pending = GeoAI.request('generate', {}, { signal: controller.signal, onStateChange: s => states.push(s) });
  controller.abort();
  const result = await pending;
  assert.equal(result.status, 'cancelled');
  assert.deepEqual(states, ['loading', 'cancelled']);
});

await test('already cancelled requests never call the proxy', async () => {
  let calls = 0;
  const { GeoAI } = harness(async () => { calls++; });
  const controller = new AbortController();
  controller.abort();
  const result = await GeoAI.createService({ mode: 'proxy' }).request('detect', {}, { signal: controller.signal });
  assert.equal(result.status, 'cancelled');
  assert.equal(calls, 0);
});

await test('invalid input, signal and operation resolve explicit errors', async () => {
  const { GeoAI } = harness();
  assert.equal((await GeoAI.request('arbitrary', {})).error.code, 'invalid_operation');
  assert.equal((await GeoAI.request('generate', null)).error.code, 'invalid_input');
  assert.equal((await GeoAI.request('generate', [])).error.code, 'invalid_input');
  assert.equal((await GeoAI.request('generate', {}, { signal: {} })).error.code, 'invalid_input');
});

await test('proxy sends configured operation and input in the documented envelope', async () => {
  let sent;
  const { GeoAI } = harness(async (url, options) => {
    sent = { url, options };
    return response({ ok: true, data: { text: '由测试代理返回' } });
  });
  const states = [];
  const result = await GeoAI.createService({ mode: 'proxy', endpoint: '/custom/ai', operations: { generate: 'content.generate' } })
    .request('generate', { topic: '标题' }, { onStateChange: s => states.push(s) });
  assert.equal(sent.url, 'http://localhost:4800/custom/ai');
  assert.deepEqual(JSON.parse(sent.options.body), { operation: 'content.generate', input: { topic: '标题' } });
  assert.equal(sent.options.method, 'POST');
  assert.equal(sent.options.credentials, 'same-origin');
  assert.equal(sent.options.redirect, 'error');
  assert.equal(Object.keys(sent.options.headers).length, 2);
  assert.equal(result.status, 'success');
  assert.equal(result.data.text, '由测试代理返回');
  assert.deepEqual(states, ['loading', 'success']);
});

await test('unsafe or invalid proxy endpoints do not make network requests', async () => {
  let calls = 0;
  const { GeoAI } = harness(async () => { calls++; });
  for (const endpoint of ['https://other.invalid/api', '//other.invalid/api', 'javascript:void(0)', 'http://user:pass@localhost:4800/api', '/api#fragment', '', 42, null]) {
    const result = await GeoAI.createService({ mode: 'proxy', endpoint }).request('analyze', {});
    assert.equal(result.error.code, 'invalid_config', String(endpoint));
  }
  assert.equal((await GeoAI.createService({ mode: 'unknown' }).request('generate', {})).error.code, 'invalid_config');
  assert.equal(calls, 0);
});

await test('HTTP errors do not expose server response data', async () => {
  const { GeoAI } = harness(async () => response({ detail: 'private server diagnostic' }, 503));
  const result = await GeoAI.createService({ mode: 'proxy' }).request('detect', {});
  assert.equal(result.error.code, 'http_error');
  assert.equal(result.error.httpStatus, 503);
  assert.equal(result.data, null);
  assert.ok(!JSON.stringify(result).includes('private server diagnostic'));
});

await test('network failures return a stable error without exposing exception text', async () => {
  const { GeoAI } = harness(async () => { throw new Error('private network diagnostic'); });
  const result = await GeoAI.createService({ mode: 'proxy' }).request('analyze', {});
  assert.equal(result.error.code, 'network_error');
  assert.ok(!JSON.stringify(result).includes('private network diagnostic'));
});

await test('invalid content type, malformed JSON and incomplete envelopes are rejected', async () => {
  const cases = [
    response({}, 200, 'text/html'),
    response({}),
    response({ ok: true }),
    response({ ok: true, data: null }),
    response([]),
    { ...response({}), json: async () => { throw new SyntaxError('malformed'); } }
  ];
  for (const item of cases) {
    const { GeoAI } = harness(async () => item);
    assert.equal((await GeoAI.createService({ mode: 'proxy' }).request('analyze', {})).error.code, 'invalid_response');
  }
});

await test('backend operation failure is not displayed as a successful AI result', async () => {
  const { GeoAI } = harness(async () => response({ ok: false, error: { message: '<b>arbitrary response</b>' } }));
  const result = await GeoAI.createService({ mode: 'proxy' }).request('generate', {});
  assert.equal(result.status, 'error');
  assert.equal(result.error.code, 'service_error');
  assert.equal(result.data, null);
  assert.ok(!JSON.stringify(result).includes('arbitrary response'));
});

await test('timeout settles even when network implementation ignores abort', async () => {
  let requestSignal;
  const { GeoAI } = harness(async (url, options) => { requestSignal = options.signal; return new Promise(() => {}); });
  const states = [];
  const result = await GeoAI.createService({ mode: 'proxy', timeoutMs: 5 }).request('generate', {}, { onStateChange: s => states.push(s) });
  assert.equal(result.error.code, 'timeout');
  assert.equal(requestSignal.aborted, true);
  assert.deepEqual(states, ['loading', 'error']);
});

await test('timeout also covers stalled JSON body parsing', async () => {
  const { GeoAI } = harness(async () => ({ ...response({}), json: () => new Promise(() => {}) }));
  assert.equal((await GeoAI.createService({ mode: 'proxy', timeoutMs: 5 }).request('generate', {})).error.code, 'timeout');
});

await test('proxy cancellation aborts transport and prevents late success', async () => {
  let resolveResponse;
  let requestSignal;
  const { GeoAI } = harness((url, options) => {
    requestSignal = options.signal;
    return new Promise(resolve => { resolveResponse = resolve; });
  });
  const controller = new AbortController();
  const states = [];
  const pending = GeoAI.createService({ mode: 'proxy' }).request('detect', {}, { signal: controller.signal, onStateChange: s => states.push(s) });
  await Promise.resolve();
  controller.abort();
  const result = await pending;
  resolveResponse(response({ ok: true, data: { score: 100 } }));
  await new Promise(resolve => setTimeout(resolve, 1));
  assert.equal(result.status, 'cancelled');
  assert.equal(requestSignal.aborted, true);
  assert.deepEqual(states, ['loading', 'cancelled']);
});

await test('UI callback errors do not break request completion', async () => {
  const { GeoAI } = harness();
  const result = await GeoAI.createService({ stubDelayMs: 0 }).request('generate', {}, { onStateChange: () => { throw new Error('UI'); } });
  assert.equal(result.status, 'not_configured');
});

await test('circular input is rejected before network execution', async () => {
  let calls = 0;
  const { GeoAI } = harness(async () => { calls++; });
  const input = {}; input.circular = input;
  const result = await GeoAI.createService({ mode: 'proxy' }).request('analyze', input);
  assert.equal(result.error.code, 'invalid_input');
  assert.equal(calls, 0);
});

console.log(`${count} AI service checks passed. Browser UI and original-site mapping are outside these checks.`);
