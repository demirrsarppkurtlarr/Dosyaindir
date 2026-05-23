import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, Shield, Zap, Cloud, Lock } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cloud className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Dosyaindir
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/upload">
              <Button variant="ghost">Upload</Button>
            </Link>
            <Link href="/download">
              <Button>Download</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Share Files
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent block mt-2">
              Instantly & Securely
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The premium file sharing platform. Upload any file, get a unique code, and share instantly. 
            No limits, no hassle, just fast and secure transfers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upload">
              <Button size="lg" className="text-lg px-8">
                <Upload className="mr-2 h-5 w-5" />
                Upload Files
              </Button>
            </Link>
            <Link href="/download">
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Download className="mr-2 h-5 w-5" />
                Download Files
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Upload and download files at blazing speeds with our optimized infrastructure
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                End-to-end encryption and secure storage ensure your files stay private
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <Lock className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Unique Codes</CardTitle>
              <CardDescription>
                Each file gets a unique share code. Simple, secure, and easy to remember
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-white/50 dark:bg-gray-800/50 rounded-3xl">
        <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">1. Upload</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Drag and drop your files or click to upload. Any file type, any size
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Cloud className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">2. Get Code</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Receive a unique share code like DSY-8F29KQ instantly
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Download className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">3. Share</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Share the code and anyone can download your files instantly
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 Dosyaindir. Premium file sharing platform.</p>
        </div>
      </footer>
    </div>
  )
}
