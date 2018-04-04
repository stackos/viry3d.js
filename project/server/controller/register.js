const Logger = require('../Logger')

const TAG = 'Register'

// user: string
// password: string
module.exports = async (server, msg) => {
  const user = msg.query.user
  const password = msg.query.password

  if (user && password) {
    if (user.length >= 64 || password.length >= 64) {
      msg.result = {
        status: 2,
        desc: 'user or password is too long',
      }
    }

    server.db.query(`SELECT * FROM user WHERE name='${user}';`, (error, results) => {
      if (error) {
        msg.result = {
          status: 3,
          desc: 'query failed',
        }

        msg.endResponse()
      } else {
        if (results.length > 0) {
          msg.result = {
            status: 4,
            desc: 'user exist',
          }

          msg.endResponse()
        } else {
          server.db.query(`INSERT INTO user (name, password, create_date) VALUES ('${user}', '${password}', NOW());`, (error, results) => {
            if (error) {
              msg.result = {
                status: 5,
                desc: 'query failed',
              }
            } else {
              Logger.Log(TAG, `User ${user} register success`)

              msg.result = {
                status: 0,
                desc: 'ok',
              }
            }

            msg.endResponse()
          })
        }
      }
    })
  } else {
    msg.result = {
      status: 1,
      desc: 'user or password is empty',
    }

    msg.endResponse()
  }
}
