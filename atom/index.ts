import { DEFAULT_LAT, DEFAULT_LNG, ZOOM_LEVEL } from "@/constants";
import { DetailFilterType, FilterProps, LocationType, RoomType } from "@/interface";
import { atom } from 'recoil'

export const selectedRoomState = atom<RoomType | null>({
  key: 'room',
  default: null,
})

export const locationState = atom<LocationType>({
  key: 'location',
  default: {
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
    zoom: ZOOM_LEVEL,
  }
})

export const detailFilterState = atom<DetailFilterType | null>({
  key: 'detailFilter',
  default: null,
})

export const filterState = atom<FilterProps>({
  key: 'filter',
  default: {
      location: '',
      checkIn: '',
      checkOut: '',
      guest: 0,
      category: '',
  },
})