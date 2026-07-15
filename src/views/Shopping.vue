<!-- 한국어 주석: 쇼핑 목록 뷰 -->
<template>
  <section>
    <h1>쇼핑</h1>

    <div v-if="loading">로딩중...</div>
    <div v-else-if="error">오류: {{ error.message }}</div>
    <ul v-else class="grid">
      <li v-for="it in items" :key="it.id" class="card">
        <router-link :to="`/shopping/${it.id}`">
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
// 한국어 주석
import { useShopping } from '../composables/useShopping'
const { items, loading, error, defaultImage } = useShopping()

function combineAddress(it) {
  return [it.addr1, it.addr2].filter(Boolean).join(' ')
}

// 한국어 주석: contenttypeid 매핑(샘플)
function mapContentType(id) {
  const map = {
    '12': '관광지',
    '14': '문화시설',
    '15': '행사/축제',
    '32': '숙박',
    '38': '쇼핑',
    '39': '음식점'
  }
  return map[String(id)] || '기타'
}
</script>

<style scoped>
.grid { display:grid; grid-template-columns: repeat(auto-fill,minmax(220px,1fr)); gap:16px; padding:0; list-style:none; }
.card { border:1px solid #eee; border-radius:6px; overflow:hidden; }
.card img { width:100%; height:140px; object-fit:cover; display:block; }
.card h2 { font-size:1rem; margin:8px; }
.card p { margin:4px 8px; font-size:0.9rem; color:#555; }
</style>