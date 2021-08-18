module.exports = {
    jwt: {
      secret: 'supersecret',
      expiration: '15m'
    },
    http: {
      port: 8080,
      hostname: 'localhost',
      tls: false
    }
  };