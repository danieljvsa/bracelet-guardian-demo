require('dotenv').config()
module.exports = {
    development: {
      client: 'pg',
      connection: {
        host : process.env.DB_HOST,
        port : process.env.DB_PORT,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_DATABASE
      },
      migrations: {
        tabelName: 'knex_migrations',
        directory: `${__dirname}/src/database/migrations`
      },
      useNullAsDefault: true,
      seeds: {
        directory: `${__dirname}/src/database/seeds`
      }
    
    },

  

};
