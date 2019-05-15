module.exports = {
  "globDirectory": "./",
  "importWorkboxFrom": "local",
  "globIgnores": [
    "node_modules/**/*",
    "package*",
    "workbox-config.js",
    "images/**/*",
    ".gitignore",
  ],
  "runtimeCaching": [{
    "urlPattern": /\.(?:png|gif|jpg|jpeg|svg)$/,
    "handler": "CacheFirst",
    "options": {
      "cacheName": "data-cache"
    }
  }],
  "globPatterns": [
    "**/*.{json,jpg,html,js,css}"
  ],
  "swDest": "service-worker.js"
};