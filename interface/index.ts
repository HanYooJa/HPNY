import { ReactNode } from "react"

// DetailFilterType과 FilterProps 인터페이스 정의
export type DetailFilterType = "location" | "checkIn" | "checkOut" | "guest"
export interface FilterProps {
  location: string
  checkIn: string
  checkOut: string
  guest: number
  category: string
  startDate?: string
  endDate?: string
  role?: "USER" | "SELLER" // 역할 필터 추가
}

// 필터 관련 인터페이스 정의
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

// LikeType과 CommentType 인터페이스 정의
export interface LikeType {
  id: number
  roomId: number
  userId: number
  createdAt: string
  room: RoomType
}

export interface CommentType {
  id: number
  createdAt: string
  roomId: number
  userId: string
  body: string
  room: RoomType
  user: UserType
}

export interface CommentApiType {
  totalCount: number
  data: CommentType[]
  page?: number
  totalPage?: number
}

// RoomType 인터페이스 정의
export interface RoomType {
  id: number
  images: string[]
  imageKeys?: string[]
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
  likes?: LikeType[]
  comments?: CommentType[]
  bookings?: BookingType[]
  createdAt?: string
  updatedAt?: string
  status?: "AVAILABLE" | "UNAVAILABLE" // 상태 필드 추가
  views?: number // 조회수 필드 추가
}

// Account 인터페이스 정의
interface Account {
  id: string
  provider: string
  providerAccountId?: string // 제공자 계정 ID 추가
}

// UserType 인터페이스 정의
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
  comments?: Comment[]
  bookings?: BookingType[]
  role?: "USER" | "SELLER" // 역할 필드 추가
}

// FaqType, LocationType 인터페이스 정의
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

// ParamsProps와 BookingParamsProps 인터페이스 정의
export interface ParamsProps {
  params: { id: string }
}

export interface BookingParamsProps {
  params: { id: string }
  searchParams: {
    checkIn: string
    checkOut: string
    guestCount: string
    totalAmount: string
    totalDays: string
  }
}

// BookingType 인터페이스 정의
export interface BookingType {
  id: number
  roomId: number
  userId: string
  checkIn: string
  checkOut: string
  guestCount: number
  totalAmount: number
  totalDays: number
  status: "SUCCESS" | "CANCEL"
  room: RoomType
  user: UserType
  createAt: string
  updatedAt: string
  cancellationReason?: string // 취소 사유 추가
}

// RoomFormType, SearchProps 인터페이스 정의
export interface RoomFormType {
  images?: string[]
  imageKeys?: string[]
  title?: string
  address?: string
  desc?: string
  bedroomDesc?: string
  price?: number
  category?: string
  lat?: string
  lng?: string
  userId?: number
  freeCancel?: boolean
  selfCheckIn?: boolean
  officeSpace?: boolean
  hasMountainView?: boolean
  hasShampoo?: boolean
  hasFreeLaundry?: boolean
  hasAirConditioner?: boolean
  hasWifi?: boolean
  hasBarbeque?: boolean
  hasFreeParking?: boolean
}

export interface SearchProps {
  q: string | null
}

// ActivityType 및 ActivityFormType 인터페이스 정의
export interface ActivityType {
  id: number
  title: string
  images: string[]
  imageKeys: string[]
  address?: string
  lat?: string
  lng?: string
  category: string
  desc?: string
  price: number
  userId: string
  createdAt: string
  likes?: LikeType[]
  comments?: Comment[]
  bookings?: BookingType[]
  user: UserType
  updatedAt: string
  status?: "ACTIVE" | "INACTIVE" // 상태 필드 추가
  views?: number // 조회수 필드 추가
}

export interface ActivityFormType {
  title: string
  desc: string
  price: number
  address?: string
  images: string[]
  category?: string
  lat?: string
  lng?: string
}
