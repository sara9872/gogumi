<!-- 한국어 주석: 관광지 상세 뷰; JSON의 이미지 URL(firstimage, firstimage2)을 사용 -->
<template>
  <section>
    <div v-if="loading">로딩중...</div>
    <div v-else-if="error">오류: {{ error.message }}</div>
    <div v-else-if="item">
      <h1>{{ item.title }}</h1>
      <img :src="mainImage" :alt="item.title" style="max-width:640px; width:100%; height:auto; margin-bottom:12px" />
      <div v-if="detailImage" style="margin-bottom:12px">
        <h3>추가 이미지</h3>
        <img :src="detailImage" alt="추가 이미지" style="max-width:640px; width:100%; height:auto" />
      </div>

      <p><strong>주소:</strong> {{ combineAddress(item) }}</p>
      <p v-if="item.tel"><strong>전화:</strong> {{ item.tel }}</p>
      <p><strong>유형:</strong> {{ mapContentType(item.contenttypeid) }}</p>
    </div>
    <div v-else>데이터가 없습니다.</div>
  </section>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAttraction } from '../composables/useAttraction'

const route = useRoute()
const id = route.params.id || route.params.contentid || route.params.cid
const { item, loading, error, mainImage, detailImage } = useAttraction(id)

function combineAddress(it) {
  return [it.addr1, it.addr2].filter(Boolean).join(' ')
}

function mapContentType(id) {
  const map = { '12': '관광지', '14': '문화시설', '15': '행사/축제', '32': '숙박', '39': '음식점' }
  return map[String(id)] || '기타'
}
</script>

<style scoped>
section { max-width:960px; margin:0 auto; padding:16px; }
</style>