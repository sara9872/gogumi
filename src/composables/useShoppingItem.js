// 한국어 주석: id로 단일 항목 조회 및 이미지 fallback 제공
import { ref, computed, onMounted } from 'vue'
import raw from '../data/구미_경북권_쇼핑.json'
import { normalizeList } from '../services/tourismService'

const defaultImage = new URL('../assets/default-image.jpg', import.meta.url).href

export function useShoppingItem(id) {
  const item = ref(null)
  const loading = ref(false)
  const error = ref(null)

  function load() {
    loading.value = true
    error.value = null
    try {
      const list = normalizeList(raw)
      item.value = list.find(i => String(i.id) === String(id)) || null
      if (!item.value) throw new Error('해당 항목을 찾을 수 없습니다.')
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  const mainImage = computed(() => item.value?.firstimage || defaultImage)
  const detailImage = computed(() => item.value?.firstimage2 || null)

  onMounted(load)

  return { item, loading, error, mainImage, detailImage, load }
}