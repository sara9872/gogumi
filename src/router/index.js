// router/index.js
// 라우터 설정 파일입니다. 라우트는 lazy-load(지연 로드) 방식으로 구성해 초기 로드 부담을 줄입니다.

import { createRouter, createWebHistory } from 'vue-router'

// 뷰 컴포넌트는 views 폴더에 위치해야 합니다.
// 실제로는 아래 파일들을 생성: HomeView.vue, BoardView.vue, ChatbotView.vue, TourismView.vue, NotFoundView.vue

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue') // 홈 페이지
  },
  {
    path: '/board',
    name: 'Board',
    component: () => import('../views/BoardView.vue') // 게시판 메인
  },
  {
    path: '/chatbot',
    name: 'Chatbot',
    component: () => import('../views/ChatbotView.vue') // 챗봇 페이지
  },
  {
    path: '/tourism',
    name: 'Tourism',
    component: () => import('../views/TourismView.vue') // 관광 관련 페이지
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue') // 404 페이지
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router