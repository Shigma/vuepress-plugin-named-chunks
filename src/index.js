module.exports = (options, context) => {
  const {
    pageChunkName = ({ key }) => 'page' + key.slice(1),
    layoutChunkName = false,
  } = options

  // override internal plugins
  const plugins = []

  if (pageChunkName) {
    plugins.push({
      name: '@vuepress/internal-page-components',

      extendPageData (page) {
        page._chunkName = pageChunkName(page)
      },

      async clientDynamicModules () {
        const content = `export default {\n${context.pages
          .filter(({ _filePath }) => _filePath)
          .map((page) => {
            const key = JSON.stringify(page.key)
            const filePath = JSON.stringify(page._filePath)
            const comment = page._chunkName
              ? `/* webpackChunkName: ${JSON.stringify(page._chunkName)} */`
              : ''
            return `  ${key}: () => import(${comment}${filePath})`
          })
          .join(',\n')} \n}`
        return { name: 'page-components.js', content, dirname: 'internal' }
      },
    })
  }

  if (layoutChunkName) {
    plugins.push({
      name: '@vuepress/internal-layout-components',

      async clientDynamicModules () {
        const { layoutComponentMap } = context.themeAPI
        const content = `export default {\n${Object.keys(layoutComponentMap)
          .map((name) => {
            const component = layoutComponentMap[name]
            const key = JSON.stringify(name)
            const filePath = JSON.stringify(component.path)
            const chunkName = layoutChunkName(component)
            const comment = chunkName
              ? `/* webpackChunkName: ${JSON.stringify(chunkName)} */`
              : ''
            return `  ${key}: () => import(${comment}${filePath})`
          })
          .join(',\n')} \n}`
        return { name: 'layout-components.js', content, dirname: 'internal' }
      },
    })
  }

  return {
    name: 'vuepress-plugin-named-chunks',

    plugins,
  }
}
