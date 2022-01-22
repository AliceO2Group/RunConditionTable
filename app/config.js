/**
 * here are private properties for backend */


module.exports = {
    jwt: {
      secret: 'supersecret',
      expiration: '10m'
    },
    http: {
      port: 8080,
      hostname: 'localhost',
      tls: false
    },
    database: {
        hostname: 'localhost',
        port: 5432,
    }
  };