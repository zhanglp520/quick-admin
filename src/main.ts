// import './assets/main.css'
import './assets/styles/element-plus/index.scss'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import * as Elicons from '@element-plus/icons-vue'
import quickUI from '@ainiteam/quick-vue3-ui'
import '@ainiteam/quick-vue3-ui/dist/style.css'
import * as echarts from 'echarts'
import { io } from 'socket.io-client'
import App from './App.vue'
import { router } from './router'
import pinia from './store'
import i18n from './i18n'
import { useAppStore } from './store/modules/app'

// const client = io('http://localhost:3000')

// client.on('connect', () => {
//   console.log('socket connect success')
//   const content = {
//     username: 'admin',
//     password: '123456',
//   }
//   console.log('开始登录', content)
//   client.emit('events', content)
// })

// client.on('message', (data) => {
//   console.log('message', data)
// })
// console.log('ElementPlus', ElementPlus)
// console.log('quickUI', quickUI)

const app = createApp(App)
const appStore = useAppStore(pinia)

app.config.globalProperties.$echarts = echarts
Object.keys(Elicons).forEach((key) => {
  app.component(key, Elicons[key])
})
app
  .use(ElementPlus, {
    locale: appStore.getLanguage === 'zh' ? zhCn : en
  })
  .use(quickUI)
  .use(pinia)
  .use(router)
  .use(i18n)
  .mount('#app')

