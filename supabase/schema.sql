-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  share_code TEXT UNIQUE NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  upload_timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ,
  download_count INTEGER DEFAULT 0 NOT NULL,
  max_downloads INTEGER,
  is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_files_share_code ON files(share_code);
CREATE INDEX IF NOT EXISTS idx_files_upload_timestamp ON files(upload_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_files_is_deleted ON files(is_deleted);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for files (run this in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('files', 'files', true);

-- Storage policies (run these in Supabase dashboard or via API)
-- Policy to allow public download
-- CREATE POLICY "Allow public download" ON storage.objects FOR SELECT USING (bucket_id = 'files');

-- Policy to allow authenticated upload
-- CREATE POLICY "Allow authenticated upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'files');

-- Policy to allow authenticated delete
-- CREATE POLICY "Allow authenticated delete" ON storage.objects FOR DELETE USING (bucket_id = 'files');

-- Row Level Security for files table
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access to non-deleted files
CREATE POLICY "Allow public read access to files"
  ON files FOR SELECT
  USING (is_deleted = false);

-- Policy to allow insert (for the API)
CREATE POLICY "Allow insert files"
  ON files FOR INSERT
  WITH CHECK (true);

-- Policy to allow update (for download count)
CREATE POLICY "Allow update files"
  ON files FOR UPDATE
  WITH CHECK (true);
