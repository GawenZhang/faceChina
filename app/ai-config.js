/* Public browser configuration. Keep provider API keys on your server only. */
window.GEO_AI_CONFIG = {
  mode: 'stub',
  endpoint: '/api/ai',
  timeoutMs: 30000,
  stubDelayMs: 350,
  operations: {
    generate: 'generate',
    detect: 'detect',
    analyze: 'analyze'
  }
};
