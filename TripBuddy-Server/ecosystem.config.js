module.exports = {
    apps : [{
      name   : "TripBuddy",
      script : "./dist/src/app.js",
      env_production : {
        NODE_ENV: "production"
      }
    }]
  }
  