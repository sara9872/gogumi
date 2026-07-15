// 한국어 주석: 정적 JSON을 import 해서 뷰에서 쉽게 사용하는 composable 예시
import { ref, onMounted } from 'vue'
import raw from '../data/구미_경북권_쇼핑.json' // 파일을 프로젝트에 복사하세요
import { normalizeList } from '../services/tourismService'

// 한국어 주석: 기본 이미지 경로 (src/assets/default-image.jpg 준비)
const defaultImage = new URL('../assets/default-image.jpg', import.meta.url).href

export function useShopping() {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  function load() {
    loading.value = true
    error.value = null
    try {
      items.value = normalizeList(raw)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return { items, loading, error, defaultImage, load }
}