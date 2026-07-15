// src/composables/useData.js
import { ref } from 'vue'

export function useData() {
  const allData = ref([])
  const isLoading = ref(false)

  const loadAllJsonData = async () => {
    isLoading.value = true
    // 6개의 모든 JSON 파일을 배열로 선언
    const files = [
      '구미_경북권_관광지.json', '구미_경북권_레포츠.json',
      '구미_경북권_문화시설.json', '구미_경북권_쇼핑.json',
      '구미_경북권_음식점.json', '구미_경북권_축제공연행사.json'
    ]
    
    try {
      // Promise.all을 사용하여 6개 파일을 병렬로 로드
      const promises = files.map(file => 
        fetch(`/data/${file}`).then(res => res.json())
      )
      const results = await Promise.all(promises)
      
      let mergedItems = []
      results.forEach(res => {
        if (res && res.items) {
          // 카테고리 구분을 위해 원본의 contentTypeId를 유지하며 병합
          mergedItems = mergedItems.concat(res.items)
        }
      })
      allData.value = mergedItems
      console.log(`총 ${mergedItems.length}개의 구미/경북권 데이터를 성공적으로 불러왔습니다.`)
    } catch (error) {
      console.error("데이터 로드 중 에러 발생:", error)
    } finally {
      isLoading.value = false
    }
  }

  return { allData, isLoading, loadAllJsonData }
}