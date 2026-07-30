module.exports = {
  apps: [
    {
      name: "fit-isp-frontend",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: "3048"
      }
    }
  ]
};