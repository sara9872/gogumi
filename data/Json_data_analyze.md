# LocalHub 구미·경북권 JSON 데이터 구조 분석

## 1. 분석 목적

LocalHub 프로젝트에서 제공된 구미·경북권 공공데이터 JSON 파일의 구조와 품질을 확인하고, 다음 작업에 활용하기 위해 분석하였다.

- Vue 화면에 표시할 데이터 항목 선정
- 8개 카테고리의 공통 데이터 모델 설계
- 검색·필터·지도·챗봇 기능 구현 범위 결정
- 이미지·주소 등 누락 데이터 처리 방식 정의
- 화면 및 컴포넌트 구조 설계

---

## 2. 제공 데이터 현황

제공된 데이터는 총 **8개 카테고리, 1,667건**이다.

| 카테고리 | `contentTypeId` | 데이터 수 | 주요 활용 |
|---|---:|---:|---|
| 관광지 | 12 | 499건 | 관광지 탐색, 지도, 추천 |
| 문화시설 | 14 | 112건 | 박물관·공연장·문화시설 탐색 |
| 축제·공연·행사 | 15 | 30건 | 축제 일정, 행사 상세, 챗봇 |
| 여행코스 | 25 | 31건 | 추천 여행 코스 |
| 레포츠 | 28 | 110건 | 체육·캠핑·레저시설 탐색 |
| 숙박 | 32 | 80건 | 호텔·숙박시설 탐색 |
| 쇼핑 | 38 | 411건 | 전통시장·쇼핑시설 탐색 |
| 음식점 | 39 | 394건 | 맛집·음식점 탐색 |
| **합계** |  | **1,667건** |  |

---

## 3. JSON 최상위 구조

8개 파일은 모두 동일한 최상위 구조를 사용한다.

```json
{
  "region": "구미_경북권",
  "contentType": "관광지",
  "contentTypeId": 12,
  "total": 499,
  "items": [
    {
      "contentid": "3032819",
      "title": "검성지 생태공원",
      "addr1": "경상북도 구미시 황상동",
      "firstimage": "https://...",
      "mapx": "128.4380860000",
      "mapy": "36.1148440000"
    }
  ]
}
```

### 최상위 필드

| 필드 | 타입 | 의미 |
|---|---|---|
| `region` | String | 데이터 권역 |
| `contentType` | String | 관광지·음식점 등 카테고리명 |
| `contentTypeId` | Number | 카테고리 식별 번호 |
| `total` | Number | 전체 데이터 개수 |
| `items` | Array | 실제 장소 데이터 배열 |

### 개발 시 활용

```javascript
const category = jsonData.contentType;
const places = jsonData.items;
```

실제 화면에 표시할 데이터는 `items` 배열에서 가져오면 된다.

---

## 4. 공통 데이터 필드 분석

축제 데이터를 제외한 7개 카테고리는 기본적으로 동일한 공통 필드를 가진다.

| 원본 필드 | 의미 | 원본 타입 | 화면 활용 | 처리 방법 |
|---|---|---|---|---|
| `contentid` | 콘텐츠 고유번호 | String | 상세 페이지 ID | 그대로 사용 |
| `contenttypeid` | 콘텐츠 유형 | String | 카테고리 구분 | Number 변환 가능 |
| `title` | 장소명 | String | 카드 및 상세 제목 | 필수 사용 |
| `addr1` | 기본 주소 | String | 카드·상세·검색 | 빈값 처리 |
| `addr2` | 상세 주소 | String | 상세 화면 | `addr1`과 결합 |
| `firstimage` | 대표 이미지 | String | 목록 카드·상세 화면 | 기본 이미지 처리 |
| `firstimage2` | 보조 이미지 | String | 상세 화면 | 선택적으로 사용 |
| `mapx` | 경도 | String | 지도 마커 | Number 변환 |
| `mapy` | 위도 | String | 지도 마커 | Number 변환 |
| `tel` | 전화번호 | String | 상세 화면 | 빈값 시 미표시 |
| `zipcode` | 우편번호 | String | 상세 화면 | 선택적으로 표시 |
| `cpyrhtDivCd` | 이미지 저작권 유형 | String | 라이선스 관리 | 빈값 확인 필요 |
| `createdtime` | 최초 등록일 | String | 내부 데이터 관리 | 날짜 변환 |
| `modifiedtime` | 최종 수정일 | String | 최신 정보 표시 | 날짜 변환 |
| `mlevel` | 지도 확대 수준 | String | 지도 기능 | 필요 시 사용 |
| `areacode` | 지역 코드 | String | 지역 필터 | 누락 많음 |
| `sigungucode` | 시군구 코드 | String | 지역 필터 | 누락 많음 |
| `cat1~3` | 기존 분류 코드 | String | 세부 필터 | 일부 데이터만 존재 |
| `lDongRegnCd` | 법정동 광역 코드 | String | 지역 구분 | 필요 시 사용 |
| `lDongSignguCd` | 법정동 시군구 코드 | String | 지역 구분 | 필요 시 사용 |
| `lclsSystm1~3` | 신규 분류 코드 | String | 세부 카테고리 | 코드 매핑 필요 |

---

## 5. 핵심 데이터 품질 분석

### 5.1 지도 기능에 적합한 구조

모든 카테고리 데이터에 `mapx`, `mapy` 좌표값이 포함되어 있어 지도 마커 시각화에 적합하다.

- `mapx`: 경도
- `mapy`: 위도

단, 좌표값은 문자열이므로 숫자로 변환해야 한다.

```javascript
longitude: Number(item.mapx),
latitude: Number(item.mapy)
```

활용 가능한 기능:

- 전체 장소 지도 표시
- 카테고리별 지도 필터
- 상세 페이지 위치 표시
- 주변 장소 추천
- 위치 기반 챗봇 추천

### 5.2 이미지 누락 데이터 존재

특히 음식점과 숙박 카테고리에서 이미지 누락이 많다.

따라서 공통 카드 컴포넌트에는 기본 이미지 처리가 필요하다.

```javascript
const imageUrl =
  item.firstimage || "/images/default-place.png";
```

카테고리별 기본 이미지를 따로 준비하면 UI 완성도가 높아진다.

```text
default-tourist.png
default-food.png
default-hotel.png
default-festival.png
default-shopping.png
```

### 5.3 HTTP 이미지 주소 처리 필요

일부 이미지 URL이 `http://` 형식으로 제공된다.

Netlify는 HTTPS 환경으로 배포되므로 Mixed Content 문제가 발생할 수 있다.

```javascript
function normalizeImageUrl(url) {
  if (!url) return "/images/default-place.png";
  return url.replace(/^http:\/\//, "https://");
}
```

### 5.4 전화번호 정보 부족

일반 장소 데이터의 `tel` 필드는 대부분 비어 있다.

축제·행사 데이터에는 전화번호가 포함된 경우가 있다.

따라서 전화번호는 조건부로 렌더링한다.

```vue
<p v-if="place.phone">
  문의: {{ place.phone }}
</p>
```

### 5.5 여행코스 주소 누락

여행코스는 `addr1`이 비어 있는 항목이 많다.

따라서 여행코스 화면에서는 주소보다 다음 정보를 중심으로 구성한다.

- 코스명
- 대표 이미지
- 지도 위치
- 위치 보기 버튼

```javascript
address: item.addr1 || "상세 위치 정보 없음"
```

### 5.6 일반 장소의 상세 설명 부족

관광지·음식점·숙박 등 일반 데이터에는 다음 정보가 거의 없다.

- 상세 소개
- 대표 메뉴
- 가격
- 운영 시간
- 주차 정보
- 실시간 영업 상태

따라서 일반 장소 상세 화면은 이미지·주소·지도 중심으로 구성하는 것이 적절하다.

---

## 6. 축제·공연·행사 데이터의 확장 구조

축제 데이터는 공통 필드 외에 행사 관련 필드를 추가로 가진다.

| 필드 | 의미 | 활용 화면 |
|---|---|---|
| `eventstartdate` | 행사 시작일 | 축제 카드, 캘린더 |
| `eventenddate` | 행사 종료일 | 축제 카드, 캘린더 |
| `eventplace` | 행사 장소 | 상세 화면 |
| `playtime` | 운영 시간 | 상세 화면 |
| `program` | 행사 프로그램 | 상세 화면, 챗봇 |
| `subevent` | 부대 행사 | 상세 화면 |
| `sponsor1` | 주최 기관 | 상세 화면 |
| `sponsor1tel` | 문의 전화번호 | 상세 화면 |
| `sponsor2` | 주관 기관 | 상세 화면 |
| `eventhomepage` | 행사 홈페이지 | 외부 링크 |
| `bookingplace` | 예매처 | 상세 화면 |
| `agelimit` | 관람 연령 | 상세 화면 |
| `usetimefestival` | 이용 요금 | 상세 화면 |
| `spendtimefestival` | 소요 시간 | 상세 화면 |

### 축제 데이터 예시

```json
{
  "title": "구미라면 축제",
  "eventstartdate": "20261106",
  "eventenddate": "20261108",
  "eventplace": "구미역 일원",
  "playtime": "10:00~22:00",
  "sponsor1": "구미시",
  "usetimefestival": "무료"
}
```

날짜는 화면에 표시하기 전에 변환한다.

```javascript
function normalizeDate(date) {
  if (!date || date.length !== 8) return "";
  return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
}
```

---

## 7. 공통 데이터 모델 제안

8개 JSON 파일을 화면에서 각각 처리하지 않고, 하나의 공통 구조로 변환해서 사용하는 것을 권장한다.

```javascript
{
  id: "3032819",
  typeId: 12,
  typeName: "관광지",

  title: "검성지 생태공원",
  address: "경상북도 구미시 황상동",

  imageUrl: "https://...",
  thumbnailUrl: "https://...",

  longitude: 128.438086,
  latitude: 36.114844,

  phone: "",
  zipcode: "39428",

  categoryCodes: {
    main: "NA",
    middle: "NA04",
    detail: "NA040500"
  },

  copyrightType: "Type3",
  createdAt: "2023-08-31",
  modifiedAt: "2026-06-16",

  festival: null
}
```

축제 데이터는 `festival` 객체에 전용 정보를 추가한다.

```javascript
festival: {
  startDate: "2026-11-06",
  endDate: "2026-11-08",
  place: "구미역 일원",
  playtime: "10:00~22:00",
  program: "행사 프로그램 내용",
  host: "구미시",
  price: "무료"
}
```

---

## 8. 데이터 정규화 규칙

### 필드명 통일

| 원본 필드 | 공통 모델 |
|---|---|
| `contentid` | `id` |
| `contenttypeid` | `typeId` |
| `contentType` | `typeName` |
| `title` | `title` |
| `addr1 + addr2` | `address` |
| `firstimage` | `imageUrl` |
| `firstimage2` | `thumbnailUrl` |
| `mapx` | `longitude` |
| `mapy` | `latitude` |
| `tel` | `phone` |
| `cpyrhtDivCd` | `copyrightType` |

### 데이터 변환 규칙

| 데이터 | 처리 방식 |
|---|---|
| 빈 이미지 | 카테고리 기본 이미지 사용 |
| HTTP 이미지 | HTTPS로 변경 |
| 좌표 | String → Number |
| 주소 | `addr1`, `addr2` 결합 |
| 빈 주소 | `상세 위치 정보 없음` |
| 전화번호 없음 | 해당 영역 숨김 |
| 날짜 | `YYYYMMDD` → `YYYY-MM-DD` |
| 축제 추가 정보 | `festival` 객체로 분리 |
| 저작권 유형 없음 | `확인 필요` 처리 |

---

## 9. 데이터 정규화 함수 예시

```javascript
const CATEGORY_NAME_MAP = {
  12: "관광지",
  14: "문화시설",
  15: "축제·행사",
  25: "여행코스",
  28: "레포츠",
  32: "숙박",
  38: "쇼핑",
  39: "음식점",
};

function normalizeDate(value) {
  if (!value || value.length !== 8) return "";

  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

function normalizeImageUrl(url, typeName) {
  if (!url) {
    return `/images/default-${typeName}.png`;
  }

  return url.replace(/^http:\/\//, "https://");
}

function normalizePlace(item, contentType) {
  const typeId = Number(item.contenttypeid);
  const isFestival = typeId === 15;

  return {
    id: item.contentid,
    typeId,
    typeName: contentType,

    title: item.title || "이름 없음",

    address:
      [item.addr1, item.addr2].filter(Boolean).join(" ") ||
      "상세 위치 정보 없음",

    imageUrl: normalizeImageUrl(
      item.firstimage,
      contentType
    ),

    thumbnailUrl: normalizeImageUrl(
      item.firstimage2,
      contentType
    ),

    longitude: Number(item.mapx),
    latitude: Number(item.mapy),

    phone: item.tel || "",
    zipcode: item.zipcode || "",

    categoryCodes: {
      main: item.lclsSystm1 || item.cat1 || "",
      middle: item.lclsSystm2 || item.cat2 || "",
      detail: item.lclsSystm3 || item.cat3 || "",
    },

    copyrightType:
      item.cpyrhtDivCd || "확인 필요",

    createdAt: item.createdtime || "",
    modifiedAt: item.modifiedtime || "",

    festival: isFestival
      ? {
          startDate: normalizeDate(item.eventstartdate),
          endDate: normalizeDate(item.eventenddate),
          place: item.eventplace || "",
          playtime: item.playtime || "",
          program: item.program || "",
          host: item.sponsor1 || "",
          contact:
            item.sponsor1tel || item.tel || "",
          price: item.usetimefestival || "",
        }
      : null,
  };
}
```

---

## 10. UI 설계 반영사항

### 10.1 공통 장소 카드

모든 카테고리에서 다음 정보를 공통으로 표시한다.

```text
대표 이미지
카테고리 배지
장소명
주소
상세보기 버튼
```

축제 카드는 행사 기간을 추가한다.

```text
대표 이미지
축제명
행사 기간
행사 장소
상세보기
```

### 10.2 일반 장소 상세 화면

```text
대표 이미지
카테고리
장소명
주소
지도
우편번호
최근 정보 수정일
같은 카테고리 장소 추천
```

### 10.3 축제 상세 화면

```text
대표 이미지
축제명
행사 기간
행사 장소
운영 시간
이용 요금
프로그램
주최 기관
문의 전화번호
지도
```

### 10.4 지도 기능

모든 데이터에 좌표가 있으므로 다음 기능 구현이 가능하다.

- 전체 장소 지도 표시
- 카테고리별 마커 필터
- 상세 화면 단일 마커
- 현재 장소 주변 추천
- 관광지·음식점·숙박 복합 필터

선택 기능으로는 **지도 시각화가 데이터 활용도와 시연 효과가 가장 높다.**

---

## 11. 챗봇 활용 범위

### 답변 가능한 질문 예시

```text
구미 관광지를 추천해줘.
구미에 있는 음식점을 알려줘.
금오산 주변 숙박시설을 찾아줘.
2026년 7월에 열리는 축제를 알려줘.
무료로 참여할 수 있는 축제를 알려줘.
구미역 근처 관광지를 알려줘.
이미지가 있는 여행코스를 추천해줘.
```

### 답변이 어려운 질문 예시

```text
이 음식점의 대표 메뉴는 무엇인가요?
숙박시설의 객실 가격은 얼마인가요?
이 관광지의 자세한 역사와 특징을 알려주세요.
주차가 가능한가요?
오늘 실제 영업 중인가요?
```

### 챗봇 프롬프트 제한 조건

> 제공된 JSON 데이터에 없는 정보는 임의로 생성하지 않고, 확인할 수 없는 정보라고 안내한다.

---

## 12. 팀에서 결정해야 할 사항

### 12.1 서비스 범위

현재 파일명은 `구미_경북권`이지만 일부 데이터에는 구미 외 지역이 포함될 수 있다.

#### 방안 A: 구미·경북 전체 서비스

```text
서비스명: 구미·경북 LocalHub
```

#### 방안 B: 구미 중심 서비스

```text
서비스명: 구미 LocalHub
```

주소에 `구미시`가 포함된 데이터만 필터링한다.

```javascript
const gumiItems = items.filter((item) =>
  item.addr1.includes("구미시")
);
```

여행코스처럼 주소가 없는 데이터는 별도의 필터 기준이 필요하다.

### 12.2 카테고리 노출 방식

홈 화면 우선 노출:

```text
관광지
음식점
축제·행사
숙박
```

전체 카테고리 메뉴:

```text
문화시설
여행코스
레포츠
쇼핑
```

### 12.3 세부 분류 코드 사용 여부

`lclsSystm1~3` 코드가 존재하지만 코드 설명표가 제공되지 않았다.

별도의 코드 매핑 자료가 없다면 초기 버전에서는 8개 대분류만 사용하는 것이 안전하다.

---

## 13. 개발 우선순위 제안

### 1순위: 데이터 로딩 및 정규화

- JSON 8개 import
- `items` 배열 추출
- 공통 모델 변환
- 전체 데이터 병합

### 2순위: 목록 및 검색

- 카테고리 필터
- 장소명 검색
- 주소 검색
- 카드 목록 표시

### 3순위: 상세 화면

- 장소 기본 정보
- 지도 마커
- 축제 전용 정보
- 빈값 조건부 렌더링

### 4순위: 지도 기능

- 전체 마커 표시
- 카테고리별 필터
- 마커 클릭 시 장소 정보 표시

### 5순위: 챗봇 데이터 연동

- 사용자 질문에서 카테고리·장소명·날짜 추출
- 관련 데이터 선별
- 필요한 데이터만 OpenAI API에 전달

---

## 14. 담당 업무 요약

| 순서 | 작업 | 결과물 |
|---:|---|---|
| 1 | 8개 JSON 구조 분석 | 카테고리별 데이터 분석표 |
| 2 | 누락·형식 오류 확인 | 데이터 품질 및 예외 처리 기준 |
| 3 | 공통 필드 선정 | 공통 데이터 모델 |
| 4 | 데이터 변환 규칙 정의 | 정규화 함수 |
| 5 | UI 표시 필드 결정 | 카드·상세 화면 데이터 명세 |
| 6 | 컴포넌트 전달 규격 정의 | Props 데이터 구조 |
| 7 | 챗봇 활용 가능 범위 정의 | 질문 유형과 제한사항 |
| 8 | 팀원에게 공유 | 본 분석 문서 |

---

## 팀 공유용 한 줄 요약

> 구미·경북권 데이터는 총 8개 카테고리 1,667건이며, 모든 항목에 지도 좌표가 있어 지도 기능 구현에 적합하다. 다만 음식점과 숙박의 이미지 누락, 다수의 HTTP 이미지 주소, 여행코스의 주소 누락, 일반 장소의 상세 설명 및 전화번호 부족 문제가 있어 공통 데이터 정규화와 기본 이미지·빈값 처리가 필요하다. 일반 장소는 하나의 공통 모델과 카드 컴포넌트를 사용하고, 일정·프로그램 정보가 풍부한 축제 데이터는 별도의 확장 객체와 전용 상세 컴포넌트로 처리하는 방향을 제안한다.
