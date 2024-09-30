'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UploadCloud, FileText, Download, Trash2, Check, Zap } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import AnimatedText from '@/components/animated-text'

interface TranscribedFile {
  name: string;
  url: string;
  data: object | string;
}

export function InvoiceAiColorful() {
  const [isPaidTier, setIsPaidTier] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [transcribedFiles, setTranscribedFiles] = useState<TranscribedFile[]>([])
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      if (!isPaidTier && files.length + newFiles.length > 3) {
        alert("Free tier is limited to 3 files. Upgrade to process more!")
        return
      }
      setFiles(prevFiles => [...prevFiles, ...newFiles])
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.dataTransfer.files) {
      const newFiles = Array.from(event.dataTransfer.files)
      if (!isPaidTier && files.length + newFiles.length > 3) {
        alert("Free tier is limited to 3 files. Upgrade to process more!")
        return
      }
      setFiles(prevFiles => [...prevFiles, ...newFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
  }

  const handleTranscribe = async () => {
    setError(null);
    setIsTranscribing(true)
    const transcribed: TranscribedFile[] = []
  
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
  
      try {
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        })
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const result = await response.json()
        if (result.success) {
          transcribed.push({
            name: file.name,
            url: URL.createObjectURL(new Blob([JSON.stringify(result.data, null, 2)], { type: 'text/plain' })),
            data: result.data,
          });
        } else {
          setError(result.error || "Transcription failed");
        }
      } catch (error) {
        console.error("Error during transcription:", error);
        setError("Transcription failed");
      }
    }
  
    // Update the state with all transcribed files at once
    setTranscribedFiles(prevFiles => [...prevFiles, ...transcribed]);
    setIsTranscribing(false)
  }

  const handleSelectFiles = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-yellow-400 mr-2" />
            <span className="text-2xl font-bold">InvoiceAI</span>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="text-indigo-100 hover:text-white">Home</a></li>
              <li><a href="#" className="text-indigo-100 hover:text-white">Features</a></li>
              <li><a href="#" className="text-indigo-100 hover:text-white">Pricing</a></li>
              <li><a href="#" className="text-indigo-100 hover:text-white">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
        <AnimatedText 
        staticStart="Convert your"
        animatedWords={[" JPG ", " PDF "]}
        staticEnd="to text with our AI"
        interval={2000}
        animation="bounce"
      />
          <p className="text-xl text-gray-600">Upload, transcribe, and download with the power of AI</p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex justify-center items-center space-x-4 mb-8 hidden">
            <span className={`text-lg ${isPaidTier ? 'text-gray-500' : 'text-indigo-600 font-semibold'}`}>Free Tier</span>
            <Switch
              checked={isPaidTier}
              onCheckedChange={setIsPaidTier}
              className="data-[state=checked]:bg-pink-500"
            />
            <span className={`text-lg ${isPaidTier ? 'text-pink-600 font-semibold' : 'text-gray-500'}`}>Pro Tier</span>
          </div>

          <Card className="bg-white shadow-xl">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hidden">
              <CardTitle className="text-2xl">Invoice Transcriber</CardTitle>
              <CardDescription className="text-indigo-100">Upload invoice images and get transcribed text files</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div
                className="border-dashed border-2 border-indigo-300 rounded-lg p-8 text-center cursor-pointer hover:bg-indigo-50 transition-colors duration-200"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <UploadCloud className="mx-auto h-12 w-12 text-indigo-400" />
                <p className="mt-2 text-sm text-gray-600">Drag and drop files here, or click to select files</p>
                <Input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*"
                />
                <Button 
                  onClick={handleSelectFiles}
                  variant="outline" 
                  className="mt-4 border-indigo-500 text-indigo-500 hover:bg-indigo-50"
                >
                  Select Files
                </Button>
              </div>

              {files.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Uploaded Files:</h3>
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-indigo-50 p-2 rounded">
                        <span className="flex items-center text-indigo-600">
                          <FileText className="mr-2 h-4 w-4" />
                          {file.name}
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(index)} className="text-pink-500 hover:text-pink-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {transcribedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Transcribed Files:</h3>
                  <ul className="space-y-2">
                    {transcribedFiles.map((file, index) => (
                      <li key={index} className="flex flex-col bg-green-50 p-2 rounded">
                        <div className="flex items-center justify-between">
                          <span className="text-green-600">{file.name}</span>
                          <a href={file.url} download={`${file.name}.json`}>
                            <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-600">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </a>
                        </div>
                        <pre className="mt-2 p-2 bg-white rounded text-sm overflow-x-auto">
                          {JSON.stringify(file.data, null, 2)}
                        </pre>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {error && <div className="text-red-500 mt-4">{error}</div>}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                onClick={handleTranscribe}
                disabled={files.length === 0 || isTranscribing || (!isPaidTier && files.length > 3)}
              >
                {isTranscribing ? 'Transcribing...' : 'Transcribe Invoices'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto hidden">
          <h2 className="text-3xl font-bold text-center mb-8 text-indigo-600">Choose Your Plan</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white shadow-xl">
              <CardHeader className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white">
                <CardTitle className="text-2xl">Free Tier</CardTitle>
                <CardDescription className="text-indigo-100">Perfect for occasional use</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-4xl font-bold mb-4 text-indigo-600">$0<span className="text-lg font-normal text-gray-600">/month</span></p>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600"><Check className="h-5 w-5 text-green-500 mr-2" /> Up to 3 files per batch</li>
                  <li className="flex items-center text-gray-600"><Check className="h-5 w-5 text-green-500 mr-2" /> Basic transcription accuracy</li>
                  <li className="flex items-center text-gray-600"><Check className="h-5 w-5 text-green-500 mr-2" /> 24-hour support</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full border-indigo-500 text-indigo-500 hover:bg-indigo-50" variant="outline">Current Plan</Button>
              </CardFooter>
            </Card>
            <Card className="bg-white shadow-xl">
              <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                <CardTitle className="text-2xl">Pro Tier</CardTitle>
                <CardDescription className="text-pink-100">For businesses with high volume needs</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-4xl font-bold mb-4 text-pink-600">$29<span className="text-lg font-normal text-gray-600">/month</span></p>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600"><Check className="h-5 w-5 text-green-500 mr-2" /> Unlimited files per batch</li>
                  <li className="flex items-center text-gray-600"><Check className="h-5 w-5 text-green-500 mr-2" /> Advanced AI-powered accuracy</li>
                  <li className="flex items-center text-gray-600"><Check className="h-5 w-5 text-green-500 mr-2" /> Priority 24/7 support</li>
                  <li className="flex items-center text-gray-600"><Check className="h-5 w-5 text-green-500 mr-2" /> Custom integrations</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">Upgrade Now</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-indigo-400">InvoiceAI</h3>
              <p className="text-sm text-gray-400">Transforming invoice processing with cutting-edge AI technology.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-indigo-400">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-indigo-300">Home</a></li>
                <li><a href="#" className="hover:text-indigo-300">Features</a></li>
                <li><a href="#" className="hover:text-indigo-300">Pricing</a></li>
                <li><a href="#" className="hover:text-indigo-300">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-indigo-400">Contact Us</h3>
              <p className="text-sm text-gray-400">Email: support@invoiceai.com</p>
              <p className="text-sm text-gray-400">Phone: (555) 123-4567</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            © 2023 InvoiceAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
