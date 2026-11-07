// The web build for GitHub Pages lives under /deepstash-clone, so it sets WEB_BASE_URL (see deploy-web.yml).
// Local development and the phone app keep serving from the root.
module.exports = ({ config }) => ({
  ...config,
  experiments: { ...config.experiments, ...(process.env.WEB_BASE_URL ? { baseUrl: process.env.WEB_BASE_URL } : {}) },
});
