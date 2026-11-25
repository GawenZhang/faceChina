/* Small lazy CommonJS bridge for the vendored MIT modules. */
export function t(factory) { let module; return function() { if (!module) { module = { exports: {} }; factory(module.exports, module); } return module.exports; }; }
