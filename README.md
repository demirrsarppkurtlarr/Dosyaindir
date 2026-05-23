# Dosyaindir - Premium File Sharing Platform

A modern, fast, and premium file sharing platform built with Next.js, Supabase, and optimized for Render deployment.

## Features

- **Instant File Sharing**: Upload any file type and get a unique share code (e.g., DSY-8F29KQ)
- **Large File Support**: Upload files up to 5GB with chunked uploads
- **Drag & Drop**: Intuitive drag and drop interface
- **File Preview**: Preview images, videos, audio, PDFs, and text files
- **Dark/Light Mode**: Beautiful dark and light theme with smooth transitions
- **Premium UI**: Modern, polished interface that surpasses competitors
- **Secure**: Built with Supabase security features
- **Fast**: Optimized for speed with instant code lookup
- **Scalable**: Architecture designed for growth on Supabase + Render

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Deployment**: Render
- **UI Components**: Custom components with Lucide icons

## Architecture

### Supabase Architecture

- **Database**: PostgreSQL with optimized indexes for fast lookups
- **Storage**: Supabase Storage for file hosting
- **Security**: Row Level Security (RLS) policies
- **Real-time**: Ready for real-time features

### Render Architecture

- **Web Service**: Next.js standalone output
- **Docker**: Optimized Dockerfile for production
- **Environment Variables**: Secure configuration management
- **Auto-scaling**: Ready for production scaling

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- Render account (free tier works)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Dosyaindir
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (usually 1-2 minutes)
3. Go to the SQL Editor in Supabase dashboard
4. Copy and run the SQL from `supabase/schema.sql`
5. Create a storage bucket named "files" (make it public)
6. Add storage policies (see comments in schema.sql)
7. Get your credentials:
   - Project URL: Settings → API → Project URL
   - Anon Key: Settings → API → anon/public key
   - Service Role Key: Settings → API → service_role key

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
MAX_FILE_SIZE=5368709120
CHUNK_SIZE=5242880
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Render

### Automatic Deployment with render.yaml (Recommended)

This project uses a `render.yaml` configuration file that automatically sets up **2 separate services**:

1. **dosyaindir** - Frontend Next.js application
2. **dosyaindir-backend** - Backend API service

#### Steps:

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/demirrsarppkurtlarr/Dosyaindir.git
   git push -u origin main
   ```

2. Go to [render.com](https://render.com)
3. Click "New +" → "New Blueprint"
4. Connect your GitHub repository: `demirrsarppkurtlarr/Dosyaindir`
5. Render will automatically detect the `render.yaml` file
6. Configure environment variables for both services:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (backend only)
   - `NEXT_PUBLIC_APP_URL` (frontend URL)
   - `NEXT_PUBLIC_API_URL` (backend URL)
   - `MAX_FILE_SIZE`
   - `CHUNK_SIZE`
7. Click "Apply Blueprint"

Render will automatically create and deploy both services.

### Environment Variables for Render

**Frontend Service (dosyaindir):**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `NEXT_PUBLIC_APP_URL` - Your frontend URL (e.g., https://dosyaindir.onrender.com)
- `NEXT_PUBLIC_API_URL` - Your backend URL (e.g., https://dosyaindir-backend.onrender.com)
- `MAX_FILE_SIZE` - Maximum file size in bytes (default: 21474836480 = 20GB)
- `CHUNK_SIZE` - Chunk size for uploads in bytes (default: 5242880 = 5MB)

**Backend Service (dosyaindir-backend):**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `NEXT_PUBLIC_APP_URL` - Your backend URL (e.g., https://dosyaindir-backend.onrender.com)
- `MAX_FILE_SIZE` - Maximum file size in bytes
- `CHUNK_SIZE` - Chunk size for uploads in bytes

## Database Schema

The database uses a single `files` table with the following structure:

- `id` - UUID primary key
- `share_code` - Unique 6-character code (e.g., DSY-8F29KQ)
- `file_name` - Original file name
- `file_size` - File size in bytes
- `mime_type` - MIME type of the file
- `storage_path` - Path in Supabase Storage
- `upload_timestamp` - Upload timestamp
- `expires_at` - Optional expiration date
- `download_count` - Number of downloads
- `max_downloads` - Optional maximum download limit
- `is_deleted` - Soft delete flag

## API Routes

### POST /api/upload
Upload files and generate share code.

### GET /api/file/[code]
Lookup file by share code.

### GET /api/download/[code]
Download file by share code.

### GET /api/preview/[code]
Preview file by share code.

## File Size Limits

- Default maximum: 5GB per file
- Chunk size: 5MB for uploads
- Configurable via environment variables

## Security Features

- Row Level Security (RLS) on database
- Secure file storage with Supabase
- Share code uniqueness validation
- Optional file expiration
- Optional download limits
- Input validation on all endpoints

## Performance Optimizations

- Database indexes on share_code and timestamps
- Optimized Supabase Storage queries
- Next.js static generation where possible
- Efficient file streaming
- CDN-ready architecture

## Future Enhancements

- User authentication
- File expiration settings
- Download limits
- File management dashboard
- Analytics and statistics
- Multi-file sharing
- Password protection
- Custom share codes
- Email notifications

## Troubleshooting

### Upload Fails

- Check Supabase Storage bucket exists and is public
- Verify storage policies allow uploads
- Check file size limits
- Review environment variables

### Download Fails

- Verify file exists in database
- Check if file has expired
- Verify download count hasn't exceeded limit
- Check storage policies

### Build Errors

- Ensure all dependencies are installed
- Check TypeScript configuration
- Verify Next.js version compatibility

## License

MIT License - feel free to use this project for personal or commercial use.

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Supabase, and Render.
