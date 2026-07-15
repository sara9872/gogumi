<!-- MainLayout.vue -->
<!-- 헤더와 푸터를 포함한 기본 레이아웃. 중앙에 슬롯으로 페이지 콘텐츠를 렌더링합니다. -->

<template>
  <div class="app-shell">
    <Header />
    <main class="main-content">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Header from './Header.vue'
import Footer from './Footer.vue'

export default defineComponent({
  name: 'MainLayout',
  components: { Header, Footer }
})
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main-content {
  flex: 1;
  padding: 16px;
}
</style>