import { atom } from "recoil"
import { DEFAULT_LAT, DEFAULT_LNG, ZOOM_LEVEL } from "@/constants"
import {
  DetailFilterType,
  FilterProps,
  LocationType,
  RoomFormType,
  RoomType,
  SearchProps,
  ActivityFormType,
  ActivityType,
} from "@/interface"

import { recoilPersist } from "recoil-persist"

const { persistAtom } = recoilPersist()

// DEFAULT_LAT과 DEFAULT_LNG를 숫자로 변환
export const DEFAULT_LAT_NUMBER = Number(DEFAULT_LAT)
export const DEFAULT_LNG_NUMBER = Number(DEFAULT_LNG)

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
    lat: DEFAULT_LAT_NUMBER, // 숫자로 변환된 값을 사용
    lng: DEFAULT_LNG_NUMBER, // 숫자로 변환된 값을 사용
    zoom: ZOOM_LEVEL,
  },
})

export const detailFilterState = atom<DetailFilterType | null>({
  key: "detailFilter",
  default: null,
})

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
    lat: 0, // lat을 number 타입으로 설정
    lng: 0, // lng을 number 타입으로 설정
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
    lat: 0, // lat을 number 타입으로 설정
    lng: 0, // lng을 number 타입으로 설정
    address: "",
  },
  effects_UNSTABLE: [persistAtom],
})

export const searchState = atom<SearchProps>({
  key: "search",
  default: {
    q: null,
  },
})

export const sortState = atom({
  key: "sortState",
  default: "views", // 기본 정렬은 조회수 순
})
