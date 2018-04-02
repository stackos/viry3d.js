const TAG = 'Login'

// user: string
// password: string
module.exports = async (server, msg) => {
  const user = msg.query.user
  const password = msg.query.password

  if (user && password) {
    server.db.query(`SELECT * FROM user WHERE name='${user}' AND password='${password}';`, (error, results) => {
      if (error) {
        msg.result = {
          status: 2,
          desc: 'query failed',
        }

        msg.endResponse()
      } else {
        if (results.length == 0) {
          msg.result = {
            status: 3,
            desc: 'user not exist or password error',
          }

          msg.endResponse()
        } else {
          server.db.query(`UPDATE user SET login_date = NOW() WHERE name='${user}';`, (error, results) => {
            if (error) {
              msg.result = {
                status: 4,
                desc: 'query failed',
              }
            } else {
              Logger.log(TAG, `User ${user} login success`)

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
