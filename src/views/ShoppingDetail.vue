<!-- 한국어 주석: 쇼핑 상세 뷰 -->
<template>
  <section>
    <div v-if="loading">로딩중...</div>
    <div v-else-if="error">오류: {{ error.message }}</div>
    <div v-else-if="item">
      <h1>{{ item.title }}</h1>
      <img :src="mainImage" :alt="item.title" style="max-width:800px; width:100%; height:auto; margin-bottom:12px" />
      <div v-if="detailImage" style="margin-bottom:12px">
        <h3>추가 이미지</h3>
        <img :src="detailImage" alt="추가 이미지" style="max-width:800px; width:100%; height:auto" />
      </div>

      <p><strong>주소:</strong> {{ combineAddress(item) }}</p>
      <p v-if="item.tel"><strong>전화:</strong> {{ item.tel }}</p>
      <p><strong>유형:</strong> {{ mapContentType(item.contenttypeid) }}</p>
    </div>
    <div v-else>데이터가 없습니다.</div>
  </section>
</template>

<script setup>
// 한국어 주석
import { useRoute } from 'vue-router'
import { useShoppingItem } from '../composables/useShoppingItem'

const route = useRoute()
const id = route.params.id || route.params.contentid || ''
const { item, loading, error, mainImage, detailImage } = useShoppingItem(id)

function combineAddress(it) { return [it.addr1, it.addr2].filter(Boolean).join(' ') }

function mapContentType(id) {
  const map = { '12':'관광지','14':'문화시설','15':'행사/축제','32':'숙박','38':'쇼핑','39':'음식점' }
  return map[String(id)] || '기타'
}
</script>

<style scoped>
section { max-width:960px; margin:0 auto; padding:16px; }
</style>