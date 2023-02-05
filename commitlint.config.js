module.exports = {
  extends: ['@commitlint/config-conventional'],
  // overwrite config-conventional config to enable some different rules
  rules: {
    // unset some maximum line length
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
  }
}
