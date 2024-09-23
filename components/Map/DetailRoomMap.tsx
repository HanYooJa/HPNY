"use client"
/*global kakao*/

import Script from "next/script"
import { useQuery } from "react-query"
import axios from "axios"
import { RoomType } from "@/interface"

import { DEFAULT_LAT, DEFAULT_LNG, ZOOM_LEVEL } from "@/constants"
import { FullPageLoader } from "../Loader"

declare global {
  interface Window {
    kakao: any
  }
}

export default function DetailRoomMap({ data }: { data: RoomType }) {
  // Kakao Map을 로드하는 함수
  const loadKakaoMap = () => {
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById("map")
      const mapOption = {
        center: new window.kakao.maps.LatLng(
          data?.lat || DEFAULT_LAT,
          data?.lng || DEFAULT_LNG,
        ),
        level: ZOOM_LEVEL,
      }

      const map = new window.kakao.maps.Map(mapContainer, mapOption)

      // 마커 위치 설정
      const markerPosition = new window.kakao.maps.LatLng(data.lat, data.lng)

      // 마커 이미지 설정
      const imageSrc = "/images/location-pin.png"
      const imageSize = new window.kakao.maps.Size(30, 30)
      const imageOption = { offset: new window.kakao.maps.Point(16, 46) }

      // 마커 이미지를 생성
      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption,
      )

      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      })

      // 마커를 지도에 표시
      marker.setMap(map)

      // 커스텀 오버레이 설정
      const content = `<div class="custom_overlay">${data.price?.toLocaleString()}원</div>`
      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: markerPosition,
        content: content,
      })
      customOverlay.setMap(map)

      // 지도 타입 컨트롤 설정
      const mapTypeControl = new window.kakao.maps.MapTypeControl()
      map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT)

      // 줌 컨트롤 설정
      const zoomControl = new window.kakao.maps.ZoomControl()
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT)
    })
  }

  return (
    <>
      {data ? (
        <Script
          strategy="afterInteractive"
          type="text/javascript"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT}&autoload=false`}
          onLoad={loadKakaoMap} // onReady -> onLoad로 수정
        />
      ) : (
        <FullPageLoader />
      )}
      <div id="map" className="w-full h-[500px] border border-gray-300" />
    </>
  )
}
