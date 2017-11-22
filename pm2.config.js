module.exports = {
  apps: [
    {
      name: "air-data-server",
      script: __dirname + "/app.js",
      watch: true,
      env: {
        "PORT": 7000,
        "NODE_ENV": "production"
      }
    }
  ]
}
