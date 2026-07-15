// 한국어 주석: 단일 관광지를 id로 불러와 이미지 URL과 fallback을 제공
import { ref, computed, onMounted } from 'vue'
import { getAttractionById } from '../services/tourismService'

// 한국어 주석: 기본 이미지 경로(assets의 default-image.jpg 사용)
const defaultImage = new URL('../assets/default-image.jpg', import.meta.url).href

export function useAttraction(id) {
  const item = ref(null)
  const loading = ref(false)
  const error = ref(null)

  function load() {
    loading.value = true
    error.value = null
    try {
      item.value = getAttractionById(id)
      if (!item.value) {
        throw new Error('해당 ID의 관광지를 찾을 수 없습니다.')
      }
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  const mainImage = computed(() => {
    // JSON에 URL이 있으면 그대로 사용, 없으면 기본 이미지 사용
    return item.value?.firstimage || defaultImage
  })

  const detailImage = computed(() => {
    return item.value?.firstimage2 || null
  })

  onMounted(load)

  return { item, loading, error, mainImage, detailImage, load }
}