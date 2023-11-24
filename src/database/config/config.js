const dotenv = require('dotenv');
dotenv.config()

console.log(process.env.USERNAMES,process.env.PASSWORD,process.env.DATABASE,process.env.HOST,process.env.PORT,);

module.exports = {
  development: {
    username: process.env.USERNAMES,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    port : process.env.PORT,
    dialect: "mysql",
  },
  test: {
    username: "root", 
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
