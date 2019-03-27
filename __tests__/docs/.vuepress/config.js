const { resolve } = require('path')
const CSSExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  dest: resolve(__dirname, '../../dist'),

  plugins: [
    [require('vuepress-plugin-dehydrate')],
    [require('../../..'), {
      pageChunkName ({ key, frontmatter }) {
        const name = frontmatter.layout || key.slice(2)
        return 'page-' + name
      },
      layoutChunkName ({ componentName: name }) {
        return 'layout-' + name
      },
    }],
  ],

  evergreen: false,

  chainWebpack (config) {
    config
      .output.filename('assets/js/[name].js')

    config
      .plugin('extract-css')
      .use(CSSExtractPlugin, [{
        filename: 'assets/css/styles.css',
      }])
  },
}
