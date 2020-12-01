/**
 * Created by yanhaoqi on 2018/1/22.
 */
export default{
  milliFormat: (() => {
    const ORIGIN_P = /(^|\s)-?\d+(?=\.?\d*($|\s))/g
    const DIST_P = /(?=(?!\b)(\d{3})+$)/g
    return (input) => input && input.toString().replace(ORIGIN_P, (m) => m.replace(DIST_P, ','))
  })(),
  /** 千位符号，小数点后不加千位符 */
  parseNumber(str) {
    return str && str.toString().replace(/^\d+/g, (m) => m.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,'))
  },
}
