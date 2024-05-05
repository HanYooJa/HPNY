import { ReactNode } from "react"

export type DetailFilterType = 'location' | 'checkIn' | 'checkOut' | 'guest'
export interface FilterProps {
  location: string
  checkIn: string
  checkOut: string
  guest: number
  category: string
}

export interface FilterComponentProps {
  filterValue: FilterProps
  setFilterValue: React.Dispatch<React.SetStateAction<FilterProps>>
  setDetailFilter: React.Dispatch<React.SetStateAction<DetailFilterType | null>>
}

export interface FilterLayoutProps {
  title: string
  children: ReactNode
  isShow: boolean
}

export interface RoomType {
  id: number
  images: string[]
  title: string
  address: string
  desc?: string
  bedroomDesc?: string
  price: number
  category: string
  lat: string
  lng: string
  user?: UserType
  userId?: number
  freeCancel: boolean
  selfCheckIn: boolean
  officeSpace: boolean
  hasMountainView: boolean
  hasShampoo: boolean
  hasFreeLaundry: boolean
  hasAirConditioner: boolean
  hasWifi: boolean
  hasBarbeque: boolean
  hasFreeParking: boolean
}

interface Account {
  id: string
  provider: string
}

export interface UserType {
  id: number
  email: string
  name: string
  image: string
  desc?: string
  rooms?: RoomType[]
  accounts: Account[]
  address?: string
  phone?: string
}

export interface FaqType {
  id: number
  title: string
  desc: string
}

export interface LocationType {
  lat?: string | null
  lng?: string | null
  zoom?: number
}

export interface ParamsProps {
  params: { id: string }
}