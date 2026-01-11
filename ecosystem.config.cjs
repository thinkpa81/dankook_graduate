module.exports = {
  apps: [
    {
      name: 'webapp',
      script: 'dist/index.cjs',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
