<!-- 파일: src/views/EditPost.vue -->
<template>
  <section>
    <h1>글 수정</h1>
    <p>글 수정 플레이스홀더 (ID: {{ id }})</p>
  </section>
</template>

<script setup>
import { toRef } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = toRef(route.params, 'id')
// 한국어 주석: 수정 화면에서 id를 받아 표시(실제 수정 로직은 없음)
</script>