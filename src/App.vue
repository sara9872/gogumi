<!-- App.vue -->
<!-- 앱 루트 컴포넌트입니다. 전역 레이아웃(MainLayout)으로 감싸고 라우트 뷰를 렌더합니다. -->

<template>
  <MainLayout>
    <router-view />
  </MainLayout>
</template>

<script>
import { defineComponent } from 'vue'
import MainLayout from './components/layout/MainLayout.vue'

export default defineComponent({
  name: 'App',
  components: {
    MainLayout
  }
})
</script>

<style>
/* 전역 스타일(간단한 기본값) */
/* 초심자용 기본 스타일만 포함합니다. 실제 디자인은 추후 추가하세요. */
html, body, #app {
  height: 100%;
  margin: 0;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}
</style>