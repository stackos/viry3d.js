export default class Base64 {
  static Decode(base64) {
    if (Base64.table == null) {
      Base64.table = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
        'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
        'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'
      ]
    }

    let i = 0
    let bin = []
    let x = 0, code = 0, eq = 0
    while (i < base64.length) {
      let c = base64.charAt(i++)
      let idx = Base64.table.indexOf(c)
      if (idx == -1) {
        switch (c) {
          case '=': idx = 0; eq++; break
          case ' ':
          case '\n':
          case "\r":
          case '\t':
            continue
        }
      }

      code = code << 6 | idx
      if (++x != 4)
        continue
      bin.push(code >> 16)
      bin.push(code >> 8 & 0xff)
      bin.push(code & 0xff)
      code = x = 0
    }
    if (eq == 1)
      bin.pop()
    else if (eq == 2) {
      bin.pop()
      bin.pop()
    }

    return new Uint8Array(bin).buffer
  }
}
