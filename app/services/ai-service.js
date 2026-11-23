/* Shared AI integration boundary. No provider keys or original-site calls. */
(function (root) {
  'use strict';

  var operationNames = ['generate', 'detect', 'analyze'];
  var messages = {
    not_configured: 'AI 服务尚未接入，请先配置服务接口。',
    invalid_operation: '不支持此 AI 操作。',
    invalid_input: '请提供有效的操作参数。',
    invalid_config: 'AI 服务配置无效。',
    cancelled: '已取消操作。',
    timeout: 'AI 服务响应超时，请重试。',
    network_error: '无法连接 AI 服务，请稍后重试。',
    http_error: 'AI 服务暂时不可用，请稍后重试。',
    invalid_response: 'AI 服务返回的数据格式不正确。',
    service_error: 'AI 操作失败，请稍后重试。'
  };

  function boundedInteger(value, fallback, minimum, maximum) {
    return Number.isInteger(value) && value >= minimum && value <= maximum ? value : fallback;
  }

  function createService(configuration) {
    var source = configuration || {};
    // Snapshot only public settings. Do not accept API keys or arbitrary headers.
    var mode = source.mode === undefined ? 'stub' : source.mode;
    var endpoint = source.endpoint === undefined ? '/api/ai' : source.endpoint;
    var timeoutMs = boundedInteger(source.timeoutMs, 30000, 1, 300000);
    var stubDelayMs = boundedInteger(source.stubDelayMs, 350, 0, 5000);
    var operationMap = {};
    operationNames.forEach(function (name) {
      operationMap[name] = source.operations && Object.prototype.hasOwnProperty.call(source.operations, name)
        ? source.operations[name] : name;
    });

    function request(operation, input, options) {
      options = options || {};
      return new Promise(function (resolve) {
        var settled = false;
        var timer;
        var controller;
        var signal = options.signal;
        var listening = false;

        function notify(status) {
          if (typeof options.onStateChange === 'function') {
            // A UI callback cannot turn a completed request into an unhandled rejection.
            try { options.onStateChange(status); } catch (ignored) { /* UI owns its errors. */ }
          }
        }

        function finish(status, code, data, httpStatus) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          if (listening) signal.removeEventListener('abort', abort);
          var result = {
            ok: status === 'success',
            status: status,
            operation: operation,
            data: status === 'success' ? data : null,
            error: code ? { code: code, message: messages[code] || messages.service_error } : null
          };
          if (httpStatus) result.error.httpStatus = httpStatus;
          notify(status);
          resolve(result);
        }

        function abort() {
          if (controller) controller.abort();
          finish('cancelled', 'cancelled');
        }

        notify('loading');
        if (signal && (typeof signal.addEventListener !== 'function' || typeof signal.removeEventListener !== 'function')) {
          finish('error', 'invalid_input');
          return;
        }
        if (signal && signal.aborted) {
          finish('cancelled', 'cancelled');
          return;
        }
        if (signal) {
          signal.addEventListener('abort', abort, { once: true });
          listening = true;
        }
        if (operationNames.indexOf(operation) === -1) {
          finish('error', 'invalid_operation');
          return;
        }
        if (!input || typeof input !== 'object' || Array.isArray(input)) {
          finish('error', 'invalid_input');
          return;
        }
        if (mode === 'stub') {
          timer = setTimeout(function () { finish('not_configured', 'not_configured'); }, stubDelayMs);
          return;
        }
        if (mode !== 'proxy' || typeof root.fetch !== 'function' || typeof root.AbortController !== 'function') {
          finish('error', 'invalid_config');
          return;
        }

        var url;
        var body;
        try {
          url = new URL(endpoint, root.location.origin);
          if (typeof endpoint !== 'string' || !endpoint.trim() || !/^https?:$/.test(url.protocol) ||
              url.origin !== root.location.origin || url.username || url.password || url.hash ||
              typeof operationMap[operation] !== 'string' || !operationMap[operation].trim()) {
            finish('error', 'invalid_config');
            return;
          }
          body = JSON.stringify({ operation: operationMap[operation], input: input });
        } catch (error) {
          finish('error', error instanceof TypeError && url ? 'invalid_input' : 'invalid_config');
          return;
        }

        controller = new root.AbortController();
        timer = setTimeout(function () {
          controller.abort();
          finish('error', 'timeout');
        }, timeoutMs);
        // Keep the complete fetch/body parsing chain under the same timeout and cancellation.
        Promise.resolve().then(function () {
          if (settled) return null;
          return root.fetch(url.href, {
            method: 'POST',
            credentials: 'same-origin',
            redirect: 'error',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: body,
            signal: controller.signal
          });
        }).then(function (response) {
          if (settled || !response) return;
          if (!response.ok) {
            finish('error', 'http_error', null, response.status);
            return;
          }
          var type = response.headers.get('content-type') || '';
          if (!/\bapplication\/(?:[a-z0-9.+-]+\+)?json\b/i.test(type)) {
            finish('error', 'invalid_response');
            return;
          }
          return response.json().then(function (payload) {
            if (settled) return;
            if (!payload || typeof payload !== 'object' || Array.isArray(payload) || typeof payload.ok !== 'boolean') {
              finish('error', 'invalid_response');
            } else if (!payload.ok) {
              finish('error', 'service_error');
            } else if (!Object.prototype.hasOwnProperty.call(payload, 'data') || payload.data === null || payload.data === undefined) {
              finish('error', 'invalid_response');
            } else {
              finish('success', null, payload.data);
            }
          }, function () { finish('error', 'invalid_response'); });
        }).catch(function () {
          if (!settled) finish('error', 'network_error');
        });
      });
    }

    return Object.freeze({ request: request });
  }

  var defaultService = createService(root.GEO_AI_CONFIG);
  root.GeoAI = Object.freeze({
    request: defaultService.request,
    createService: createService,
    operations: Object.freeze(operationNames.slice())
  });
}(typeof window === 'undefined' ? globalThis : window));
