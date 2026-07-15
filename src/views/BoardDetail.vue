<!-- 파일: src/views/BoardDetail.vue -->
<template>
  <section>
    <h1>게시글 상세</h1>
    <p>게시글 상세 보기 플레이스홀더 (ID: {{ id }})</p>
  </section>
</template>

<script setup>
import { toRef } from 'vue'
import { useRoute } from 'vue-router'

// 한국어 주석: URL 파라미터 id를 표시하는 예시(읽기 전용, 비즈니스 로직 없음)
const route = useRoute()
const id = toRef(route.params, 'id')
</script>