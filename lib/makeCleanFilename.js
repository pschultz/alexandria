module.exports = function(originalFilename) {
  return originalFilename
    .replace('&', 'and')
    .replace(/[^a-z0-9-_.äöüßÄÖÜ]+/gi, '.')
    .replace(/^\.*(.*?)\.*$/, "$1")
    .replace(/\/+/g, '/')
    .trim();
}
