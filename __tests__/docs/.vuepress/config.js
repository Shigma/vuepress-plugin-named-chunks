const { resolve } = require('path')
const { hash } = require('@vuepress/shared-utils')
const CSSExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  dest: resolve(__dirname, '../../dist'),

  plugins: [
    // do not use SSR in 404.html
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

  extendPageData (page) {
    // generate page keys depending on relative path
    page.key = 'v-' + hash(page.path)
  },

  evergreen: false,

  chainWebpack (config) {
    // do not use chunk hash in js
    config
      .output.filename('assets/js/[name].js')

    // do not use chunk hash in css
    config
      .plugin('extract-css')
      .use(CSSExtractPlugin, [{
        filename: 'assets/css/styles.css',
      }])
  },
}
