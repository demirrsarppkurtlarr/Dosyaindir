# Dosyaindir - Quick Setup Guide

## Windows PowerShell Execution Policy Issue

If you're seeing PowerShell execution policy errors, follow these steps:

### Option 1: Use the Setup Script (Recommended)

1. Double-click `setup.bat` in the project directory
2. This will attempt to install dependencies using a batch file

### Option 2: Enable PowerShell Scripts

1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Confirm with "Y"
4. Navigate to the project directory: `cd c:\Users\Demir\Downloads\Dosyaindir`
5. Run: `npm install`

### Option 3: Use Command Prompt

1. Open Command Prompt (cmd.exe)
2. Navigate to the project directory: `cd c:\Users\Demir\Downloads\osyaindir`
3. Run: `npm install`

## After Installing Dependencies

### 1. Configure Environment Variables

Copy the example environment file:
```cmd
copy .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
MAX_FILE_SIZE=5368709120
CHUNK_SIZE=5242880
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (1-2 minutes)
3. Go to SQL Editor in Supabase dashboard
4. Copy and run the SQL from `supabase/schema.sql`
5. Create a storage bucket named "files" (make it public)
6. Get your credentials from Settings → API

### 3. Run the Development Server

```cmd
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting

### npm install fails
- Try using Command Prompt instead of PowerShell
- Or enable PowerShell scripts as shown in Option 2 above

### Supabase connection errors
- Verify your credentials in `.env.local`
- Make sure Supabase project is active
- Check that storage bucket exists and is public

### Build errors
- Ensure all dependencies are installed
- Check that Node.js version is 18 or higher
- Verify TypeScript configuration

## Deployment to Render

Once everything works locally:

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new Web Service
4. Connect your GitHub repository
5. Add environment variables (same as .env.local)
6. Deploy

See README.md for detailed deployment instructions.
