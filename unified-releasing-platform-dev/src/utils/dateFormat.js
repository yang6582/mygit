Number.prototype.padLeft = function (lng, chr) {
  if (!lng) lng = 0
  if (!chr) chr = '0'
  var vStr = this.toString()

  if (vStr.length > lng) {
    return vStr.substring(vStr.length - lng, vStr.length)
  } else if (vStr.length < lng) {
    var tnum = Math.pow(10, lng - vStr.length).toString()
    return tnum.substring(1, tnum.length).replace('0', chr) + this.toString()
  }
  return this.toString()
}
export function datefmt (dataObj, now) {
  if (dataObj instanceof Date) {
    return dataObj.getFullYear() +
      '-' + (dataObj.getMonth() + 1).padLeft(2) +
      '-' + dataObj.getDate().padLeft(2) +
      (typeof now === 'undefined' ? ' ' + dataObj.getHours().padLeft(2) +
        ':' + dataObj.getMinutes().padLeft(2) +
        ':' + dataObj.getSeconds().padLeft(2) : ' ' + now)
  }
}
