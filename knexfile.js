module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/reddit-clone'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }

}
