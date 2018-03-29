module.exports = async (msg) => {
  msg.result = {
    status: 0,
    desc: 'ok',
  }
  msg.endResponse()
}
