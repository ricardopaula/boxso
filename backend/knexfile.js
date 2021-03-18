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
    seeds: {
      directory: './src/database/seeds'
    },
    useNullAsDefault: true
  },

  test: {
    client: 'postgresql',
    connection: {
      database: 'boxso_test',
      user: process.env.BOXSO_DB_USER || 'postgres',
      password: process.env.BOXSO_DB_PASSWORD || 'postgres'
    },
    migrations: {
      directory: './src/database/migrations'
    },
    seeds: {
      directory: './src/database/seeds'
    },
    useNullAsDefault: true
  }
}
