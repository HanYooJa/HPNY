import { NextResponse } from "next/server"
import cloudinary from "cloudinary"
import formidable from "formidable"
import { IncomingMessage } from "http"
import { Readable } from "stream"
import fs from "fs"

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
})

export const runtime = "nodejs"

// 업로드 디렉토리 확인 및 생성
const uploadDir = "./uploads"
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

// Formidable을 사용하여 파일 파싱
async function parseForm(req: IncomingMessage) {
  const form = formidable({
    multiples: true,
    uploadDir: uploadDir, // 업로드 디렉토리 지정
    keepExtensions: true, // 파일 확장자 유지
  })

  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve({ fields, files })
      })
    },
  )
}

// Request를 Readable Stream으로 변환
async function convertToIncomingMessage(
  request: Request,
): Promise<IncomingMessage> {
  const { headers, body } = request
  const reader = body?.getReader()
  const readable = new Readable()

  readable._read = () => {}

  if (reader) {
    let done = false
    while (!done) {
      const { done: isDone, value } = await reader.read()
      done = isDone
      if (value) {
        readable.push(Buffer.from(value))
      }
    }
    readable.push(null)
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
    const req = await convertToIncomingMessage(request)
    const { files } = await parseForm(req)

    let file = files.file as formidable.File | formidable.File[] | undefined

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (Array.isArray(file)) {
      file = file[0]
    }

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
