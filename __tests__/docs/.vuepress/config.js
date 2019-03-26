const { resolve } = require('path')

module.exports = {
  dest: resolve(__dirname, '../../dist'),

  plugins: [
    [require('../../..'), {
      pageChunkName ({ key, frontmatter }) {
        if (frontmatter.layout) return false
        return 'page' + key.slice(1)
      },
      layoutChunkName ({ componentName: name }) {
        return 'layout-' + name
      },
    }],
  ],

  evergreen: false,
}
