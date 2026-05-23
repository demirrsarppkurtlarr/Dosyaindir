"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, Cloud, CheckCircle, XCircle, Copy, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import { formatFileSize } from "@/lib/utils"

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [shareCode, setShareCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    setError(null)
    setShareCode(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 2 * 1024 * 1024 * 1024, // 2GB
  })

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("files", file)
      })

      // Use XMLHttpRequest for real progress tracking
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        // Show progress bar immediately
        setUploadProgress(0)

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100)
            setUploadProgress(progress)
          }
        })

        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.responseText)
              // Ensure progress bar is visible for at least 500ms
              setTimeout(() => {
                setShareCode(data.shareCode)
                setUploadProgress(100)
                resolve(data)
              }, 500)
            } catch (e) {
              reject(new Error("Failed to parse response"))
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText)
              reject(new Error(errorData.error || `Upload failed with status ${xhr.status}`))
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}`))
            }
          }
        })

        xhr.addEventListener("error", () => {
          reject(new Error("Network error during upload"))
        })

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload aborted"))
        })

        xhr.open("POST", "/api/upload")
        xhr.setRequestHeader("Accept", "application/json")
        xhr.send(formData)
      })
    } catch (err) {
      setError(`Failed to upload files: ${err instanceof Error ? err.message : 'Unknown error'}`)
      console.error("Upload error:", err)
      setUploadProgress(0)
    } finally {
      setUploading(false)
    }
  }

  const copyToClipboard = () => {
    if (shareCode) {
      navigator.clipboard.writeText(shareCode)
    }
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
            <Link href="/download">
              <Button>Download</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Upload Files</h1>

          {!shareCode ? (
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Drop your files here</CardTitle>
                <CardDescription>
                  Upload any file type. Maximum file size: 2GB
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 dark:border-gray-700 hover:border-primary/50"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  {isDragActive ? (
                    <p className="text-lg">Drop the files here...</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-lg">Drag & drop files here, or click to select</p>
                      <p className="text-sm text-gray-500">
                        Supports all file types up to 5GB
                      </p>
                    </div>
                  )}
                </div>

                {files.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Selected Files:</h3>
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Cloud className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFiles(files.filter((_, i) => i !== index))}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {uploading && (
                      <div className="space-y-2">
                        <Progress value={uploadProgress} />
                        <p className="text-sm text-center text-gray-500">
                          {uploadProgress === 0 ? "Starting upload..." : `Uploading... ${uploadProgress}%`}
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={() => {
                        console.log("Upload button clicked, files:", files.length)
                        handleUpload()
                      }}
                      disabled={uploading}
                      className="w-full"
                      size="lg"
                    >
                      {uploading ? "Uploading..." : "Upload Files"}
                    </Button>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-green-500/50">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-center text-green-600 dark:text-green-400">
                  Upload Successful!
                </CardTitle>
                <CardDescription className="text-center">
                  Your files have been uploaded successfully
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-2">Your Share Code:</p>
                  <div className="flex items-center justify-center space-x-4">
                    <code className="text-3xl font-mono font-bold text-primary">
                      {shareCode}
                    </code>
                    <Button variant="outline" size="icon" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/download" className="flex-1">
                    <Button className="w-full" variant="outline">
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Test Download
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      setFiles([])
                      setShareCode(null)
                      setUploadProgress(0)
                    }}
                    className="flex-1"
                  >
                    Upload More
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
