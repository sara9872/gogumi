<!-- Footer.vue -->
<!-- 페이지 하단 푸터(간단한 예시) -->

<template>
  <footer class="site-footer">
    <div class="container">
      <small>© 2026 GoGumi - 대학팀 프로젝트</small>
    </div>
  </footer>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Footer'
})
</script>

<style scoped>
.site-footer {
  background: #f8f9fa;
  padding: 12px 16px;
  text-align: center;
}
</style>