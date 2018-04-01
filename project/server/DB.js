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
      name VARCHAR(64) NOT NULL,\
      password VARCHAR(64) NOT NULL,\
      create_date DATE,\
      login_date DATE,\
      PRIMARY KEY (id)\
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;')
  }

  selectDB(dbName) {
    this.query('CREATE DATABASE IF NOT EXISTS ' + dbName + ' DEFAULT CHARSET utf8 COLLATE utf8_general_ci;')
    this.query('USE ' + dbName + ';')
  }

  query(sql, callback) {
    this.connection.query(sql, callback)
  }
}

module.exports = DB
