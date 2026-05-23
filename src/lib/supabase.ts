import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface FileRecord {
  id: string
  share_code: string
  file_name: string
  file_size: number
  mime_type: string
  storage_path: string
  upload_timestamp: string
  expires_at: string | null
  download_count: number
  max_downloads: number | null
  is_deleted: boolean
}
