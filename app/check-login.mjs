import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const loginHtml = await readFile(new URL('login.html', import.meta.url), 'utf8');
const loginCode = await readFile(new URL('login.js', import.meta.url), 'utf8');
let checks = 0;
function verify(description, action) {
  action();
  checks += 1;
  console.log('PASS ' + description);
}
function storage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
}
function environment(session = {}, remembered = {}) {
  const events = {};
  const nodes = {};
  for (const id of ['login-form', 'login-feedback', 'username', 'password', 'agree_input', 'keeplogin', 'demo-content', 'logout']) {
    nodes[id] = { value: '', checked: false, hidden: true, addEventListener: (name, callback) => { events[id + ':' + name] = callback; } };
  }
  nodes.agree_input.checked = true;
  const destinations = [];
  const messages = [];
  const context = {
    document: { getElementById: id => nodes[id] },
    sessionStorage: storage(session),
    localStorage: storage(remembered),
    window: { location: { assign: url => destinations.push(url), replace: url => destinations.push(url) }, layer: { msg: text => messages.push(text) } },
    setTimeout, clearTimeout
  };
  vm.createContext(context);
  return { context, nodes, events, destinations, messages };
}
function runLogin() {
  const env = environment();
  vm.runInContext(loginCode, env.context);
  env.submit = () => env.events['login-form:submit']({ preventDefault() {} });
  return env;
}

verify('both empty fields declare native required validation (HTML only)', () => {
  for (const id of ['username', 'password']) {
    const input = loginHtml.match(new RegExp('<input\\b[^>]*id="' + id + '"[^>]*>'))?.[0];
    assert.ok(input && /\brequired\b/.test(input));
  }
});
verify('login page does not redirect automatically', () => assert.equal(runLogin().destinations.length, 0));
verify('unchecked agreement blocks the local submission', () => {
  const env = runLogin();
  env.nodes.agree_input.checked = false;
  env.submit();
  assert.equal(env.messages[0], '请阅读并勾选用户协议');
  assert.equal(env.destinations.length, 0);
});
verify('incorrect demo login displays a demo error', () => {
  const env = runLogin();
  env.nodes.username.value = 'invalid';
  env.nodes.password.value = 'invalid';
  env.submit();
  assert.equal(env.messages[0], '演示账号或密码错误');
  assert.equal(env.destinations.length, 0);
});
verify('valid demo login stores a session and opens the demonstration', () => {
  const env = runLogin();
  env.nodes.username.value = 'demo';
  env.nodes.password.value = 'demo123';
  env.submit();
  assert.equal(env.context.sessionStorage.getItem('geo-demo-session'), 'active');
  assert.equal(env.context.localStorage.getItem('geo-demo-remember'), null);
  assert.deepEqual(env.destinations, ['/user/index/index']);
});
verify('remember option persists a marker without storing a password', () => {
  const env = runLogin();
  env.nodes.username.value = 'demo';
  env.nodes.password.value = 'demo123';
  env.nodes.keeplogin.checked = true;
  env.submit();
  assert.equal(env.context.localStorage.getItem('geo-demo-remember'), 'active');
});
console.log(checks + ' logic/HTML checks passed. These are not browser or visual checks.');

