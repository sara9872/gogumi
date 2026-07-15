// 한국어 주석: 관광지 목록을 컴포넌트에서 쉽게 사용하도록 래핑합니다.
import { ref, onMounted } from 'vue'
import { getAllAttractions } from '../services/tourismService'

export function useAttractions() {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  function load() {
    loading.value = true
    error.value = null
    try {
      items.value = getAllAttractions()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return { items, loading, error, load }
}