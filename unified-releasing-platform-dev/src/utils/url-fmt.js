export function urlFmt (url) {
  if (!url) {
    return ''
  }
  return url.toString().replace(/&/g, '&amp;')
}
