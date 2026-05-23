# Supabase SQL Setup Instructions

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up and create a new project
3. Wait for the project to be ready (1-2 minutes)

## Step 2: Run SQL Schema

Go to the SQL Editor in your Supabase dashboard and run the following SQL:

```sql
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
```

## Step 3: Create Storage Bucket

1. Go to Storage in your Supabase dashboard
2. Click "Create a new bucket"
3. Name it: `files`
4. Make it public: ✅
5. Click "Create bucket"

## Step 4: Add Storage Policies

In the Storage section, go to Policies and add these policies:

### Policy 1: Allow Public Download
```sql
CREATE POLICY "Allow public download" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'files');
```

### Policy 2: Allow Authenticated Upload
```sql
CREATE POLICY "Allow authenticated upload" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'files');
```

### Policy 3: Allow Authenticated Delete
```sql
CREATE POLICY "Allow authenticated delete" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'files');
```

## Step 5: Get Your Credentials

1. Go to Settings → API in Supabase dashboard
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 6: Update Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
MAX_FILE_SIZE=5368709120
CHUNK_SIZE=5242880
```

## Verification

To verify everything is set up correctly:

1. Check that the `files` table exists in your database
2. Check that the `files` storage bucket exists
3. Try uploading a small file through your app
4. Verify the file appears in Supabase Storage
5. Check that a record was created in the `files` table

## Troubleshooting

### Bucket creation fails
- Make sure you have the right permissions
- Try creating the bucket manually in the dashboard

### Storage policies not working
- Ensure RLS is enabled on the storage.objects table
- Check that the policy syntax is correct
- Verify the bucket_id matches exactly ('files')

### File upload fails
- Check that the anon key is correct
- Verify the storage bucket is public
- Check the browser console for error messages
