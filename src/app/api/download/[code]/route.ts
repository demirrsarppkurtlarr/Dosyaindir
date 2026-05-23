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

    // Check max downloads
    if (file.max_downloads && file.download_count >= file.max_downloads) {
      return NextResponse.json({ error: "Maximum downloads reached" }, { status: 410 })
    }

    // Get file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("files")
      .download(file.storage_path)

    if (downloadError) {
      console.error("Download error:", downloadError)
      return NextResponse.json({ error: "Failed to download file" }, { status: 500 })
    }

    // Increment download count
    await supabase
      .from("files")
      .update({ download_count: file.download_count + 1 })
      .eq("id", file.id)

    // Return file with proper headers
    return new NextResponse(fileData, {
      headers: {
        "Content-Type": file.mime_type,
        "Content-Disposition": `attachment; filename="${file.file_name}"`,
        "Content-Length": file.file_size.toString(),
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
