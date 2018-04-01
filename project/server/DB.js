const mysql = require('mysql')

class DB {
  constructor() {
    this.connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '000000',
    })
    this.connection.connect()
    this.selectDB('wegame')
    this.query('CREATE TABLE IF NOT EXISTS user(\
      id INT NOT NULL AUTO_INCREMENT,\
      name VARCHAR(100) NOT NULL,\
      create_date DATE,\
      PRIMARY KEY (id)\
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;')

    this.showTables()

    this.query('SELECT * FROM user;', (error, results) => {
      console.log(error, results)
    })
  }

  selectDB(dbName) {
    this.query('CREATE DATABASE IF NOT EXISTS ' + dbName + ' DEFAULT CHARSET utf8 COLLATE utf8_general_ci;')
    this.query('USE ' + dbName + ';')
  }

  showTables() {
    this.query('SHOW TABLES;', (error, results) => {
      console.log(error, results)
    })
  }

  query(sql, callback) {
    this.connection.query(sql, callback)
  }
}

module.exports = DB
