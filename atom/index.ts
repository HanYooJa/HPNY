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

// 판매자와 사용자 역할을 관리
export const roleState = atom<string>({
  key: "roleState",
  default: "USER",
  effects_UNSTABLE: [persistAtom],
})

export const selectedRoomState = atom<RoomType | null>({
  key: "room",
  default: null,
})

export const selectedActivityState = atom<ActivityType | null>({
  key: "activity",
  default: null,
})

export const locationState = atom<LocationType>({
  key: "location",
  default: {
    lat: 37.5665, // 기본값으로 서울 위도
    lng: 126.978, // 기본값으로 서울 경도
    zoom: 12, // 기본 줌 레벨
  },
})

export const detailFilterState = atom<DetailFilterType | null>({
  key: "detailFilter",
  default: null,
})

// 필터 상태를 관리하는 filterState
export const filterState = atom<FilterProps>({
  key: "filter",
  default: {
    location: "",
    checkIn: "",
    checkOut: "",
    guest: 0,
    category: "",
  },
})

export const roomFormState = atom<RoomFormType | null>({
  key: "roomRegisterForm",
  default: {
    images: [],
    title: "",
    address: "",
    desc: "",
    bedroomDesc: "",
    price: 0,
    category: "",
    lat: 0,
    lng: 0,
    freeCancel: false,
    selfCheckIn: false,
    officeSpace: false,
    hasMountainView: false,
    hasShampoo: false,
    hasFreeLaundry: false,
    hasAirConditioner: false,
    hasWifi: false,
    hasBarbeque: false,
    hasFreeParking: false,
  },
  effects_UNSTABLE: [persistAtom],
})

export const activityFormState = atom<ActivityFormType | null>({
  key: "activityRegisterForm",
  default: {
    images: [],
    title: "",
    desc: "",
    price: 0,
    category: "",
    lat: 0,
    lng: 0,
    address: "",
  },
  effects_UNSTABLE: [persistAtom],
})

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
