import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params

    // Lookup file by share code
    const { data: file, error } = await supabase
      .from("files")
      .select("*")
      .eq("share_code", code.toUpperCase())
      .eq("is_deleted", false)
      .single()

    if (error || !file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Check if file has expired
    if (file.expires_at && new Date(file.expires_at) < new Date()) {
      return NextResponse.json({ error: "File has expired" }, { status: 410 })
    }

    // Get file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("files")
      .download(file.storage_path)

    if (downloadError) {
      console.error("Preview error:", downloadError)
      return NextResponse.json({ error: "Failed to preview file" }, { status: 500 })
    }

    // Return file with inline disposition for preview
    return new NextResponse(fileData, {
      headers: {
        "Content-Type": file.mime_type,
        "Content-Disposition": `inline; filename="${file.file_name}"`,
        "Content-Length": file.file_size.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Preview error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
