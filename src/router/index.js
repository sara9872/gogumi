import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/board',
    name: 'Board',
    component: () => import('../views/Board.vue')
  },
  {
    path: '/board/write',
    name: 'WritePost',
    component: () => import('../views/WritePost.vue')
  },
  {
    path: '/board/:id',
    name: 'BoardDetail',
    component: () => import('../views/BoardDetail.vue'),
    props: true
  },
  {
    path: '/board/:id/edit',
    name: 'EditPost',
    component: () => import('../views/EditPost.vue'),
    props: true
  },
  {
    path: '/chatbot',
    name: 'Chatbot',
    component: () => import('../views/Chatbot.vue')
  },
  {
    path: '/tourism',
    name: 'Tourism',
    component: () => import('../views/Attractions.vue')
  },
  {
    path: '/not-found',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/not-found'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router