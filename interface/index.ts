import { ReactNode } from "react"

export type DetailFilterType = "location" | "checkIn" | "checkOut" | "guest"
export interface FilterProps {
  location: string
  checkIn: string
  checkOut: string
  guest: number
  category: string
  startDate?: string
  endDate?: string
  role?: "USER" | "SELLER"
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

export interface LikeType {
  id: number
  roomId?: number
  activityId?: number
  userId: number
  createdAt: string
  room?: RoomType
  activity?: ActivityType
}

export interface CommentType {
  id: number
  createdAt: string
  roomId?: number
  activityId?: number
  userId: string
  body: string
  room?: RoomType
  activity?: ActivityType
  user: UserType
}

export interface CommentApiType {
  totalCount: number
  data: CommentType[]
  page?: number
  totalPage?: number
}

export interface RoomType {
  id: number
  activityId?: number
  images: string[]
  imageUrl?: string
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
  comments?: CommentType[]
  bookings?: BookingType[]
  createdAt?: string
  updatedAt?: string
  status?: "AVAILABLE" | "UNAVAILABLE"
  views?: number
}

interface Account {
  id: string
  provider: string
  providerAccountId?: string
}

export interface UserType {
  id: number
  email: string
  name: string
  image: string
  desc?: string
  rooms?: RoomType[]
  activities?: ActivityType[]
  accounts: Account[]
  address?: string
  phone?: string
  comments?: CommentType[]
  bookings?: BookingType[]
  role?: "USER" | "SELLER"
}

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

export interface BookingType {
  id: number
  roomId?: number
  activityId?: number
  userId: string
  checkIn: string
  checkOut: string
  guestCount: number
  totalAmount: number
  totalDays: number
  status: "SUCCESS" | "PENDING" | "CANCEL"
  room?: RoomType
  activity?: ActivityType
  user: UserType
  createdAt: string
  updatedAt: string
  cancellationReason?: string
  freeCancel?: boolean
}

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
  description?: string
  price: number
  userId: string
  createdAt: string
  imageUrl?: string
  likes?: LikeType[]
  comments?: CommentType[]
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
