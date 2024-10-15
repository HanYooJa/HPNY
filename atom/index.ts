import { atom } from "recoil"
import { recoilPersist } from "recoil-persist"
import {
  DetailFilterType,
  FilterProps,
  LocationType,
  RoomFormType,
  RoomType,
  ActivityFormType,
  ActivityType,
  SearchProps,
} from "@/interface"

const { persistAtom } = recoilPersist()

// 판매자와 사용자 역할을 관리하는 roleState
export const roleState = atom<string>({
  key: "roleState",
  default: "USER", // 기본값을 USER로 설정
  effects_UNSTABLE: [persistAtom], // 상태를 persist 시켜 로그인 후에도 유지
})

// 선택된 방 정보를 관리하는 selectedRoomState
export const selectedRoomState = atom<RoomType | null>({
  key: "room",
  default: null,
})

// 선택된 활동 정보를 관리하는 selectedActivityState
export const selectedActivityState = atom<ActivityType | null>({
  key: "activity",
  default: null,
})

// 위치 상태를 관리하는 locationState
export const locationState = atom<LocationType>({
  key: "location",
  default: {
    lat: 37.5665, // 기본값으로 서울 위도
    lng: 126.978, // 기본값으로 서울 경도
    zoom: 12, // 기본 줌 레벨
  },
})

// 필터 상세 정보를 관리하는 detailFilterState
export const detailFilterState = atom<DetailFilterType | null>({
  key: "detailFilter",
  default: null,
})

// 필터 상태를 관리하는 filterState
export const filterState = atom<FilterProps>({
  key: "filter",
  default: {
    location: "", // 기본 위치값
    checkIn: "", // 체크인 날짜 기본값
    checkOut: "", // 체크아웃 날짜 기본값
    guest: 0, // 게스트 수 기본값
    category: "", // 카테고리 기본값
  },
})

// 방 등록 양식 상태를 관리하는 roomFormState
export const roomFormState = atom<RoomFormType | null>({
  key: "roomRegisterForm",
  default: {
    images: [], // 이미지 배열
    title: "", // 방 제목
    address: "", // 주소
    desc: "", // 설명
    bedroomDesc: "", // 침실 설명
    price: 0, // 가격
    category: "", // 카테고리
    lat: 0, // 위도
    lng: 0, // 경도
    freeCancel: false, // 무료 취소 여부
    selfCheckIn: false, // 셀프 체크인 여부
    officeSpace: false, // 오피스 공간 여부
    hasMountainView: false, // 산 전망 여부
    hasShampoo: false, // 샴푸 제공 여부
    hasFreeLaundry: false, // 무료 세탁기 여부
    hasAirConditioner: false, // 에어컨 여부
    hasWifi: false, // 와이파이 여부
    hasBarbeque: false, // 바베큐 여부
    hasFreeParking: false, // 무료 주차 여부
  },
  effects_UNSTABLE: [persistAtom], // 양식 상태를 persist
})

// 활동 등록 양식 상태를 관리하는 activityFormState
export const activityFormState = atom<ActivityFormType | null>({
  key: "activityRegisterForm",
  default: {
    images: [], // 이미지 배열
    title: "", // 활동 제목
    desc: "", // 활동 설명
    price: 0, // 활동 가격
    category: "", // 카테고리
    lat: 0, // 위도
    lng: 0, // 경도
    address: "", // 주소
  },
  effects_UNSTABLE: [persistAtom], // 양식 상태를 persist
})

// 검색 상태를 관리하는 searchState
export const searchState = atom<SearchProps>({
  key: "search",
  default: {
    q: null, // 기본 검색 쿼리
  },
})

// 정렬 상태를 관리하는 sortState
export const sortState = atom({
  key: "sortState",
  default: "views", // 기본 정렬 옵션을 조회수로 설정
})
