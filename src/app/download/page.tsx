"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Download, Cloud, Search, FileText, Download as DownloadIcon, Calendar, HardDrive } from "lucide-react"
import Link from "next/link"
import { formatFileSize } from "@/lib/utils"

export default function DownloadPage() {
  const [code, setCode] = useState("")
  const [searching, setSearching] = useState(false)
  const [fileInfo, setFileInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!code.trim()) return

    setSearching(true)
    setError(null)
    setFileInfo(null)

    try {
      const response = await fetch(`/api/file/${code.toUpperCase()}`)
      
      if (!response.ok) {
        throw new Error("File not found")
      }

      const data = await response.json()
      setFileInfo(data)
    } catch (err) {
      setError("File not found or has expired")
      console.error(err)
    } finally {
      setSearching(false)
    }
  }

  const handleDownload = async () => {
    if (!fileInfo) return

    try {
      const response = await fetch(`/api/download/${code.toUpperCase()}`)
      
      if (!response.ok) {
        throw new Error("Download failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileInfo.file_name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError("Failed to download file")
      console.error(err)
    }
  }

  const getPreviewComponent = () => {
    if (!fileInfo) return null

    const mimeType = fileInfo.mime_type.toLowerCase()

    if (mimeType.startsWith("image/")) {
      return (
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <img
            src={`/api/preview/${code.toUpperCase()}`}
            alt={fileInfo.file_name}
            className="w-full h-full object-contain"
          />
        </div>
      )
    }

    if (mimeType.startsWith("video/")) {
      return (
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <video
            src={`/api/preview/${code.toUpperCase()}`}
            controls
            className="w-full h-full"
          />
        </div>
      )
    }

    if (mimeType.startsWith("audio/")) {
      return (
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <audio
            src={`/api/preview/${code.toUpperCase()}`}
            controls
            className="w-full"
          />
        </div>
      )
    }

    if (mimeType === "application/pdf") {
      return (
        <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <iframe
            src={`/api/preview/${code.toUpperCase()}`}
            className="w-full h-full"
            title="PDF Preview"
          />
        </div>
      )
    }

    if (mimeType.startsWith("text/") || mimeType.includes("json") || mimeType.includes("xml")) {
      return (
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg max-h-96 overflow-auto">
          <FileText className="h-12 w-12 text-primary mb-4" />
          <p className="text-sm text-gray-500">Text file preview available</p>
        </div>
      )
    }

    return (
      <div className="p-12 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Preview not available for this file type</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Cloud className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Dosyaindir
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/upload">
              <Button>Upload</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Download Files</h1>

          <Card className="border-2 mb-8">
            <CardHeader>
              <CardTitle>Enter Share Code</CardTitle>
              <CardDescription>
                Enter the 6-character code to access your files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="e.g., DSY-8F29KQ"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="text-2xl font-mono text-center tracking-widest"
                  maxLength={10}
                />
                <Button onClick={handleSearch} disabled={searching} size="lg">
                  {searching ? "Searching..." : <Search className="h-5 w-5" />}
                </Button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {fileInfo && (
            <Card className="border-2 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cloud className="h-6 w-6 text-primary" />
                  <span>{fileInfo.file_name}</span>
                </CardTitle>
                <CardDescription>
                  File ready for download
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {getPreviewComponent()}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <HardDrive className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Size</p>
                      <p className="font-semibold">{formatFileSize(fileInfo.file_size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Uploaded</p>
                      <p className="font-semibold">
                        {new Date(fileInfo.upload_timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleDownload} className="w-full" size="lg">
                  <DownloadIcon className="mr-2 h-5 w-5" />
                  Download File
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
