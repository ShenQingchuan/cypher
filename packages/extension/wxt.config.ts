import UnoCss from 'unocss/vite'
import { defineConfig } from 'wxt'

// @ts-expect-error - pass here
import { version } from '../package.json'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: [
    '@wxt-dev/auto-icons',
    '@wxt-dev/module-react',
  ],
  dev: {
    server: {
      port: 3888,
    },
  },
  manifest: {
    name: 'Cypher',
    description: '网络请求筛选分析工具',
    version,
    permissions: [],
    host_permissions: [
      '<all_urls>',
    ],
    devtools_page: 'devtools/index.html',
  },
  outDir: '.output',
  srcDir: 'src',
  runner: {
    disabled: false,
    startUrls: ['http://localhost:5173'], // 测试Web应用地址
  },
  vite: () => {
    return {
      plugins: [
        UnoCss(),
      ],
    }
  },
})
