module.exports = async (server, msg) => {
  msg.result = {
    status: 0,
    desc: 'ok',
  }
  msg.endResponse()
}
