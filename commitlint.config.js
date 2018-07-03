module.exports = {
  extends: ['@commitlint/config-angular'],
  wildcards: {
    release: [
      '/^\\d+\\.\\d+\\.\\d+$/'
    ]
  }
}
