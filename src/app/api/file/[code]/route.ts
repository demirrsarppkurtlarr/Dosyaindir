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

    return NextResponse.json(file)
  } catch (error) {
    console.error("File lookup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
