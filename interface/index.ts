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
  roomId?: number
  activityId?: number // 활동 ID 추가
  userId: number
  createdAt: string
  room?: RoomType
  activity?: ActivityType // 활동과의 관계 추가
}

export interface CommentType {
  id: number
  createdAt: string
  roomId?: number
  activityId?: number // 활동 ID 추가
  userId: string
  body: string
  room?: RoomType
  activity?: ActivityType // 활동과의 관계 추가
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
  activityId?: number // 선택적 속성으로 변경
  images: string[] // 여러 이미지를 저장하는 배열
  imageUrl?: string // 대표 이미지 URL 속성 추가
  imageKeys?: string[]
  title: string
  name?: string
  address: string
  desc?: string
  bedroomDesc?: string
  price: number
  category: string
  lat: number
  lng: number
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
  comments?: CommentType[] // 댓글 추가
  bookings?: BookingType[]
  createdAt?: string
  updatedAt?: string
  status?: "AVAILABLE" | "UNAVAILABLE"
  views?: number
}

// Account 인터페이스 정의
interface Account {
  id: string
  provider: string
  providerAccountId?: string
}

// UserType 인터페이스 정의
export interface UserType {
  id: number
  email: string
  name: string
  image: string
  desc?: string
  rooms?: RoomType[]
  activities?: ActivityType[] // 활동 추가
  accounts: Account[]
  address?: string
  phone?: string
  comments?: CommentType[] // 댓글 추가 (Comment -> CommentType 수정)
  bookings?: BookingType[]
  role?: "USER" | "SELLER"
}

// FaqType, LocationType 인터페이스 정의
export interface FaqType {
  id: number
  title: string
  desc: string
}

export interface LocationType {
  lat?: number | null
  lng?: number | null
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
  roomId?: number
  activityId?: number // 활동 예약 추가
  userId: string
  checkIn: string
  checkOut: string
  guestCount: number
  totalAmount: number
  totalDays: number
  status: "SUCCESS" | "PENDING" | "CANCEL" // 명확한 상태 타입 정의
  room?: RoomType // 숙소 정보
  activity?: ActivityType // 활동 정보 추가
  user: UserType
  createdAt: string
  updatedAt: string
  cancellationReason?: string
  freeCancel?: boolean
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
  lat?: number
  lng?: number
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
  lat?: number
  lng?: number
  category: string
  desc?: string
  description?: string // 추가된 description 속성
  price: number
  userId: string
  createdAt: string
  imageUrl?: string // 대표 이미지 URL 속성 추가
  likes?: LikeType[]
  comments?: CommentType[] // 댓글 추가
  bookings?: BookingType[]
  user: UserType
  updatedAt: string
  status?: "ACTIVE" | "INACTIVE"
  views?: number
}

export interface ActivityFormType {
  title: string
  desc: string
  price: number
  address?: string
  images: string[]
  category?: string
  lat?: number
  lng?: number
}
