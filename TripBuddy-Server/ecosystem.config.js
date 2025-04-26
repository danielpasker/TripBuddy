module.exports = {
    apps : [{
      name   : "TripBuddy",
      script : "./dist/app.js",
      env_production : {
        NODE_ENV: "production"
      }
    }]
  }
  