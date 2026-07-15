<!-- 한국어 주석: 관광지 목록 뷰; JSON 내부의 이미지 URL을 그대로 사용 -->
<template>
  <section>
    <h1>관광지 목록</h1>

    <div v-if="loading">로딩중...</div>
    <div v-else-if="error">오류: {{ error.message }}</div>
    <ul v-else class="grid">
      <li v-for="it in items" :key="it.id" class="card">
        <router-link :to="`/tourist-attractions/${it.id}`">
          <!-- 한국어 주석: 이미지 필드가 URL이면 그대로 사용, 없으면 기본 이미지 -->
          <img :src="it.firstimage || defaultImage" :alt="it.title" />
          <h2>{{ it.title }}</h2>
          <p>{{ combineAddress(it) }}</p>
          <p v-if="it.tel">☎ {{ it.tel }}</p>
          <p>유형: {{ mapContentType(it.contenttypeid) }}</p>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { useAttractions } from '../composables/useAttractions'
const { items, loading, error } = useAttractions()

// 기본 이미지 경로
const defaultImage = new URL('../assets/default-image.jpg', import.meta.url).href

function combineAddress(it) {
  return [it.addr1, it.addr2].filter(Boolean).join(' ')
}

function mapContentType(id) {
  const map = { '12': '관광지', '14': '문화시설', '15': '행사/축제', '32': '숙박', '39': '음식점' }
  return map[String(id)] || '기타'
}
</script>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(220px,1fr)); gap: 16px; padding:0; list-style:none; }
.card { border:1px solid #eee; border-radius:6px; overflow:hidden; }
.card img { width:100%; height:140px; object-fit:cover; display:block; }
.card h2 { font-size:1rem; margin:8px; }
.card p { margin:4px 8px; font-size:0.9rem; color:#555; }
</style>