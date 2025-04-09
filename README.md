# Bracelet Guardian Demo

Demo API to serve as an intermediate between bracelet software and web administration.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Technologies](#technologies)
- [Setup](#setup)
- [Usage](#usage)
- [License](#license)

## About

The Bracelet Guardian Demo is designed to facilitate communication between bracelet devices and a web-based administration interface. It acts as a middleware, ensuring seamless data exchange and management.

## Features

- Middleware API for bracelet devices
- Integration with web administration platforms
- Built with Node.js and Express.js
- Utilizes PostgreSQL for data storage
- Dockerized for easy deployment

## Technologies

This project leverages the following technologies:

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Knex.js](http://knexjs.org/)
- [Docker](https://www.docker.com/)
- [Twilio](https://www.twilio.com/)

## Setup

To set up the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/danieljvsa/bracelet-guardian-demo.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd bracelet-guardian-demo
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Set up the database:**

   Ensure you have PostgreSQL installed and running. Update the `knexfile.js` with your database configuration.

   ```javascript
   module.exports = {
     development: {
       client: 'postgresql',
       connection: {
         database: 'your_database_name',
         user: 'your_database_user',
         password: 'your_database_password'
       },
       migrations: {
         tableName: 'knex_migrations'
       }
     }
   };
   ```

5. **Run migrations:**

   ```bash
   npx knex migrate:latest
   ```

6. **Start the application:**

   ```bash
   npm start
   ```

   The API should now be running on `http://localhost:3000`.

## Usage

After setting up and starting the application, you can interact with the API endpoints to manage bracelet data and integrate with the web administration interface. Refer to the source code and comments for detailed information on available endpoints and their usage.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

