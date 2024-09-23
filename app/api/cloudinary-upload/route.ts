import { NextResponse } from "next/server"
import cloudinary from "cloudinary"
import formidable from "formidable"
import { IncomingMessage } from "http"
import { Readable } from "stream"

// Cloudinary 설정
cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
})

// Next.js 13에서 `config` 대신 `runtime` 설정을 사용
export const runtime = "nodejs"

// Formidable을 사용하여 파일 파싱하는 함수
async function parseForm(req: IncomingMessage) {
  const form = formidable({ multiples: true })

  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve({ fields, files })
      })
    },
  )
}

// Request를 Readable Stream으로 변환하는 함수
async function convertToIncomingMessage(
  request: Request,
): Promise<IncomingMessage> {
  const { headers, body } = request
  const reader = body?.getReader()
  const readable = new Readable()

  readable._read = () => {} // 빈 함수 설정

  if (reader) {
    let done = false
    while (!done) {
      const { done: isDone, value } = await reader.read()
      done = isDone
      if (value) {
        readable.push(Buffer.from(value))
      }
    }
    readable.push(null) // 끝을 알리기 위해 null을 푸시
  }

  const incomingMessage = Object.assign(readable, {
    headers: Object.fromEntries(headers.entries()),
    method: request.method,
    url: request.url,
  })

  return incomingMessage as IncomingMessage
}

export async function POST(request: Request) {
  try {
    // Request를 IncomingMessage로 변환
    const req = await convertToIncomingMessage(request)

    // `formidable`을 이용해 파일 파싱
    const { files } = await parseForm(req)

    let file = files.file as formidable.File | formidable.File[] | undefined

    // 파일이 없는 경우
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // 파일이 배열인 경우 첫 번째 파일만 선택
    if (Array.isArray(file)) {
      file = file[0]
    }

    // 이제 `file`은 `formidable.File` 타입입니다.

    // Cloudinary에 업로드
    const uploadResult = await cloudinary.v2.uploader.upload(file.filepath, {
      upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    })

    return NextResponse.json({ url: uploadResult.secure_url })
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
