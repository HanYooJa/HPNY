"use client"
/*global kakao*/

import Script from "next/script"
import { RoomType } from "@/interface"
import { useEffect } from "react"
import { FullPageLoader } from "../Loader"
import { DEFAULT_LAT, DEFAULT_LNG, ZOOM_LEVEL } from "@/constants"

declare global {
  interface Window {
    kakao: any
  }
}

export default function DetailRoomMap({ data }: { data: RoomType }) {
  const loadKakaoMap = () => {
    const lat = data.lat ?? DEFAULT_LAT
    const lng = data.lng ?? DEFAULT_LNG

    if (typeof lat === "undefined" || typeof lng === "undefined") {
      console.error("위도와 경도가 제공되지 않았습니다.")
      return
    }

    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById("map")
      if (!mapContainer) {
        console.error("지도 컨테이너를 찾을 수 없습니다.")
        return
      }

      const mapOption = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: ZOOM_LEVEL,
      }

      const map = new window.kakao.maps.Map(mapContainer, mapOption)

      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(lat, lng),
      })

      marker.setMap(map)

      const imageSrc = "/images/location-pin.png"
      const imageSize = new window.kakao.maps.Size(30, 30)
      const imageOption = { offset: new window.kakao.maps.Point(16, 46) }
      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption,
      )

      const content = `<div class="custom_overlay">${data.price?.toLocaleString()}원</div>`
      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: marker.getPosition(),
        content: content,
      })
      customOverlay.setMap(map)

      const mapTypeControl = new window.kakao.maps.MapTypeControl()
      map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT)

      const zoomControl = new window.kakao.maps.ZoomControl()
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT)
    })
  }

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      if (data.lat && data.lng) {
        loadKakaoMap()
      } else {
        console.error("위도와 경도 값이 제공되지 않았습니다.")
      }
    }
  }, [data])

  return (
    <>
      {data ? (
        <Script
          strategy="afterInteractive"
          type="text/javascript"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT}&libraries=services&autoload=false`}
          onLoad={() => {
            if (window.kakao && window.kakao.maps) {
              loadKakaoMap()
            }
          }}
        />
      ) : (
        <FullPageLoader />
      )}
      <div
        id="map"
        className="w-full h-[500px] lg:h-[600px] border border-gray-300 max-w-none"
      />{" "}
    </>
  )
}
