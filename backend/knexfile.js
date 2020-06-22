// Update with your config settings.

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: process.env.BOXSO_DB_NAME,
      user: process.env.BOXSO_DB_USER,
      password: process.env.BOXSO_DB_PASSWORD
    },
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true
  },

  test: {
    client: 'postgresql',
    connection: {
      database: 'boxso_test',
      user: process.env.BOXSO_DB_USER,
      password: process.env.BOXSO_DB_PASSWORD
    },
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true
  }
}
