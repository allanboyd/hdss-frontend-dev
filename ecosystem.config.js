module.exports = {
    apps: [
      {
        name: 'nextjs-app',
        script: 'npm',
        args: 'run start',
        env: {
          NODE_ENV: 'production',
          PORT: 3000
        }
      }
    ]
  };
  };