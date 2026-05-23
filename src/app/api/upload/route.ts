import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { generateShareCode } from "@/lib/utils"

export async function POST(req: NextRequest) {
  // Check if Supabase is configured
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
  }

  try {
    const formData = await req.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    // Generate unique share code
    let shareCode = generateShareCode()
    let codeExists = true
    let attempts = 0

    // Ensure unique share code
    while (codeExists && attempts < 10) {
      const { data } = await supabase
        .from("files")
        .select("share_code")
        .eq("share_code", shareCode)
        .single()

      if (!data) {
        codeExists = false
      } else {
        shareCode = generateShareCode()
        attempts++
      }
    }

    if (codeExists) {
      return NextResponse.json({ error: "Failed to generate unique code" }, { status: 500 })
    }

    // Upload files to Supabase Storage
    const uploadedFiles = []
    for (const file of files) {
      const fileExt = file.name.split(".").pop()
      const fileName = `${shareCode}/${Date.now()}-${file.name}`
      const filePath = `${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("files")
        .upload(filePath, file, {
          upsert: false,
        })

      if (uploadError) {
        console.error("Upload error:", uploadError)
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
      }

      uploadedFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        path: filePath,
      })
    }

    // Store file metadata in database
    for (const file of uploadedFiles) {
      const { error: dbError } = await supabase.from("files").insert({
        share_code: shareCode,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        storage_path: file.path,
        upload_timestamp: new Date().toISOString(),
        download_count: 0,
        is_deleted: false,
      })

      if (dbError) {
        console.error("Database error:", dbError)
        return NextResponse.json({ error: "Failed to save file metadata" }, { status: 500 })
      }
    }

    return NextResponse.json({ shareCode })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
