"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Video, FileText, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { generateVideoThumbnail, formatVideoDuration } from "@/lib/video-utils"

interface VideoUploadData {
  title: string
  description: string
  level: string
  instrument: string
  duration: string
  file: File | null
  thumbnail: string | null
}

export default function TeacherUploadPage() {
  const [uploadData, setUploadData] = useState<VideoUploadData>({
    title: "",
    description: "",
    level: "",
    instrument: "",
    duration: "",
    file: null,
    thumbnail: null
  })
  
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState("")
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoPreviewRef = useRef<HTMLVideoElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('video/')) {
      setErrorMessage("Please select a valid video file")
      return
    }

    if (file.size > 500 * 1024 * 1024) { // 500MB limit
      setErrorMessage("File size must be less than 500MB")
      return
    }

    setUploadData(prev => ({ ...prev, file }))
    setErrorMessage("")

    // Generate thumbnail
    try {
      const videoUrl = URL.createObjectURL(file)
      const thumbnail = await generateVideoThumbnail({
        videoUrl,
        timeOffset: 5,
        width: 300,
        height: 200
      })
      setUploadData(prev => ({ ...prev, thumbnail }))
    } catch (error) {
      console.warn("Failed to generate thumbnail:", error)
    }
  }

  const handleInputChange = (field: keyof VideoUploadData, value: string) => {
    setUploadData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!uploadData.file || !uploadData.title || !uploadData.description) {
      setErrorMessage("Please fill in all required fields")
      return
    }

    setIsUploading(true)
    setUploadStatus('uploading')
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadStatus('success')
      
      // Reset form
      setUploadData({
        title: "",
        description: "",
        level: "",
        instrument: "",
        duration: "",
        file: null,
        thumbnail: null
      })
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      
    } catch (error) {
      setUploadStatus('error')
      setErrorMessage("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Upload Video Lesson</h1>
        <p className="text-xl text-muted-foreground">
          Share your musical expertise with students around the world
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Video Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="h-5 w-5 mr-2" />
              Video Upload
            </CardTitle>
            <CardDescription>
              Upload your video lesson (MP4, MOV, AVI supported, max 500MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {!uploadData.file ? (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Video File
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      or drag and drop your video here
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    {uploadData.thumbnail && (
                      <img
                        src={uploadData.thumbnail}
                        alt="Video thumbnail"
                        className="w-32 h-20 object-cover rounded"
                      />
                    )}
                    <div className="text-left">
                      <p className="font-medium">{uploadData.file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadData.file.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Video
                  </Button>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="flex items-center text-red-600">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lesson Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Lesson Details
            </CardTitle>
            <CardDescription>
              Provide information about your video lesson
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={uploadData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter lesson title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instrument">Instrument *</Label>
                <Select value={uploadData.instrument} onValueChange={(value) => handleInputChange('instrument', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select instrument" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="piano">Piano</SelectItem>
                    <SelectItem value="guitar">Guitar</SelectItem>
                    <SelectItem value="drums">Drums</SelectItem>
                    <SelectItem value="voice">Voice</SelectItem>
                    <SelectItem value="violin">Violin</SelectItem>
                    <SelectItem value="bass">Bass</SelectItem>
                    <SelectItem value="saxophone">Saxophone</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={uploadData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what students will learn in this lesson"
                rows={4}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="level">Skill Level *</Label>
                <Select value={uploadData.level} onValueChange={(value) => handleInputChange('level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="all">All Levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={uploadData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="e.g., 45"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Progress */}
        {isUploading && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uploading...</span>
                  <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Status */}
        {uploadStatus === 'success' && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Video uploaded successfully! It will be reviewed before going live.</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button 
            type="submit" 
            disabled={isUploading || !uploadData.file || !uploadData.title || !uploadData.description}
            className="min-w-[120px]"
          >
            {isUploading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Lesson"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
