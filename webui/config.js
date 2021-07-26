module.exports = {
    jwt: {
      secret: 'supersecret',
      expiration: '60s'
    },
    http: {
      port: 8080,
      hostname: 'localhost',
      tls: false
    }
  };