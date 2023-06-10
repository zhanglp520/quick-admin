import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'
// import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default (setting: any) => {
  const { command, mode } = setting
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const { VITE_APP_TITLE, VITE_PORT, VITE_APP_BASE_URL } = env
  return {
    base: './',
    plugins: [
      vue(),
      createHtmlPlugin({
        inject: {
          data: {
            title: VITE_APP_TITLE
          }
        }
      })
    ],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: fileURLToPath(new URL('./src', import.meta.url))
        },
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js'
        }
      ]
    },
    server: {
      https: false, // 运行服务是否以https方式
      host: true,
      port: VITE_PORT,
      open: true,
      proxy: {
        [VITE_APP_BASE_URL]: {
          target: 'http://localhost:3103/', // 代理的目标地址-本地
          // target: 'https://api.quick.ainiteam.com/', // 代理的目标地址-线上
          changeOrigin: true, // 开发模式，默认的origin是真实的 origin:localhost:3102 代理服务会把origin修改为目标地址
          secure: true, // 是否https接
          ws: false, // 是否代理websockets
          rewrite: (path: string) => path.replace(/^\/dev-api/, '') // 路径重写
        }
      }
    },
    preview: {
      https: false, // 运行服务是否以https方式
      host: true,
      port: 3103,
      open: false,
      proxy: {
        [VITE_APP_BASE_URL]: {
          target: 'http://localhost:3103/', // 代理的目标地址-本地
          // target: 'https://api.quick.ainiteam.com/', // 代理的目标地址-线上
          changeOrigin: true, // 开发模式，默认的origin是真实的 origin:localhost:3000 代理服务会把origin修改为目标地址
          secure: false, // 是否https接口
          ws: false, // 是否代理websockets
          rewrite: (path: string) => path.replace(/^\/prod-api/, '') // 路径重写
        }
      }
    }
  }
}
