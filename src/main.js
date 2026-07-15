// main.js
// 애플리케이션 진입점입니다. 앱을 생성하고 라우터(와 선택적 Pinia)를 연결합니다.

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Pinia를 사용할 경우 아래 주석을 해제하세요.
// import { createPinia } from 'pinia'
// const pinia = createPinia()

const app = createApp(App)

// 라우터 등록
app.use(router)

// Pinia 등록 (선택)
// app.use(pinia)

app.mount('#app')