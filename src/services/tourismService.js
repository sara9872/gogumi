// 한국어 주석: JSON 구조(items 배열)을 받아 항목을 정규화하는 유틸(서비스)입니다.
// 여러 데이터 파일에 공통으로 사용합니다.

export function normalizeItem(raw) {
  // 한국어 주석: 원본 필드명을 여러 가지 가능성으로 안전하게 읽어서 통일된 키로 반환
  const id = raw.contentid ?? raw.contentId ?? raw.id ?? ''
  const title = raw.title ?? raw.시설명 ?? raw.name ?? ''
  const addr1 = raw.addr1 ?? ''
  const addr2 = raw.addr2 ?? ''
  const firstimage = raw.firstimage ?? raw.firstImage ?? raw.image ?? ''
  const firstimage2 = raw.firstimage2 ?? raw.firstImage2 ?? raw.image2 ?? ''
  const tel = raw.tel ?? raw.전화번호 ?? ''
  const contenttypeid = raw.contenttypeid ?? raw.contentTypeId ?? raw.content_type_id ?? ''

  return {
    id: String(id),
    title: title ?? '',
    addr1,
    addr2,
    firstimage,
    firstimage2,
    tel,
    contenttypeid
  }
}

export function normalizeList(raw) {
  // 한국어 주석: raw가 { items: [...] } 형식이거나 바로 배열일 수 있으므로 처리
  const list = Array.isArray(raw) ? raw : (Array.isArray(raw?.items) ? raw.items : [])
  return list.map(normalizeItem)
}