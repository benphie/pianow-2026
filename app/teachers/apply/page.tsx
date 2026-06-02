"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
// import { useToast } from "@/hooks/use-toast"

export default function TeacherApplicationPage() {
  // const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    
    // Professional Information
    instruments: [] as string[],
    experience: "",
    education: "",
    certifications: "",
    teachingExperience: "",
    
    // Availability
    timezone: "",
    availableHours: "",
    preferredAgeGroups: [] as string[],
    
    // Additional Information
    bio: "",
    teachingPhilosophy: "",
    sampleVideoUrl: "",
    references: "",
    
    // Terms and Conditions
    agreeToTerms: false,
    agreeToBackgroundCheck: false,
  })

  const instruments = [
    "Piano", "Guitar", "Drums", "Violin", "Viola", "Cello", "Bass", 
    "Saxophone", "Trumpet", "Flute", "Clarinet", "Voice", "Ukulele", 
    "Banjo", "Mandolin", "Harmonica", "Other"
  ]

  const ageGroups = [
    "Children (5-12)", "Teens (13-17)", "Adults (18+)", "Seniors (65+)"
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field as keyof typeof prev] as string[], value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setShowSuccess(true)
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        instruments: [],
        experience: "",
        education: "",
        certifications: "",
        teachingExperience: "",
        timezone: "",
        availableHours: "",
        preferredAgeGroups: [],
        bio: "",
        teachingPhilosophy: "",
        sampleVideoUrl: "",
        references: "",
        agreeToTerms: false,
        agreeToBackgroundCheck: false,
      })
    } catch (error) {
      alert("There was an error submitting your application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-green-600">Application Submitted!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Thank you for your interest in teaching with PIANOW. We'll review your application and get back to you within 3-5 business days.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/teachers">
              <Button variant="outline">Back to Teachers</Button>
            </Link>
            <Button onClick={() => setShowSuccess(false)}>
              Submit Another Application
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/teachers" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Teachers
        </Link>
        <h1 className="text-4xl font-bold mb-4">Apply to Teach</h1>
        <p className="text-xl text-muted-foreground">
          Join our community of passionate music educators and help students around the world learn to play.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Tell us about yourself</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Location (City, State/Country) *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., Los Angeles, CA"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>Your musical background and experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Instruments You Teach *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {instruments.map((instrument) => (
                  <div key={instrument} className="flex items-center space-x-2">
                    <Checkbox
                      id={instrument}
                      checked={formData.instruments.includes(instrument)}
                      onCheckedChange={(checked) => 
                        handleArrayChange("instruments", instrument, checked as boolean)
                      }
                    />
                    <Label htmlFor={instrument} className="text-sm">
                      {instrument}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="experience">Years of Musical Experience *</Label>
              <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-2">1-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="11-15">11-15 years</SelectItem>
                  <SelectItem value="16-20">16-20 years</SelectItem>
                  <SelectItem value="20+">20+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="education">Musical Education/Formal Training</Label>
              <Textarea
                id="education"
                value={formData.education}
                onChange={(e) => handleInputChange("education", e.target.value)}
                placeholder="Describe your musical education, degrees, conservatory training, etc."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="certifications">Certifications or Awards</Label>
              <Textarea
                id="certifications"
                value={formData.certifications}
                onChange={(e) => handleInputChange("certifications", e.target.value)}
                placeholder="List any relevant certifications, awards, or recognitions"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="teachingExperience">Teaching Experience *</Label>
              <Textarea
                id="teachingExperience"
                value={formData.teachingExperience}
                onChange={(e) => handleInputChange("teachingExperience", e.target.value)}
                placeholder="Describe your teaching experience, including private lessons, group classes, online teaching, etc."
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardHeader>
            <CardTitle>Availability & Preferences</CardTitle>
            <CardDescription>When and how you'd like to teach</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="timezone">Timezone *</Label>
              <Select value={formData.timezone} onValueChange={(value) => handleInputChange("timezone", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PST">Pacific Standard Time (PST)</SelectItem>
                  <SelectItem value="MST">Mountain Standard Time (MST)</SelectItem>
                  <SelectItem value="CST">Central Standard Time (CST)</SelectItem>
                  <SelectItem value="EST">Eastern Standard Time (EST)</SelectItem>
                  <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
                  <SelectItem value="CET">Central European Time (CET)</SelectItem>
                  <SelectItem value="JST">Japan Standard Time (JST)</SelectItem>
                  <SelectItem value="AEST">Australian Eastern Standard Time (AEST)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="availableHours">Available Teaching Hours *</Label>
              <Textarea
                id="availableHours"
                value={formData.availableHours}
                onChange={(e) => handleInputChange("availableHours", e.target.value)}
                placeholder="e.g., Monday-Friday 3-8 PM, Saturday 10 AM-2 PM"
                rows={2}
                required
              />
            </div>

            <div>
              <Label>Preferred Age Groups *</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {ageGroups.map((ageGroup) => (
                  <div key={ageGroup} className="flex items-center space-x-2">
                    <Checkbox
                      id={ageGroup}
                      checked={formData.preferredAgeGroups.includes(ageGroup)}
                      onCheckedChange={(checked) => 
                        handleArrayChange("preferredAgeGroups", ageGroup, checked as boolean)
                      }
                    />
                    <Label htmlFor={ageGroup} className="text-sm">
                      {ageGroup}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Help us get to know you better</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bio">Bio/About You *</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself, your musical journey, and what makes you passionate about teaching"
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="teachingPhilosophy">Teaching Philosophy *</Label>
              <Textarea
                id="teachingPhilosophy"
                value={formData.teachingPhilosophy}
                onChange={(e) => handleInputChange("teachingPhilosophy", e.target.value)}
                placeholder="Describe your approach to teaching music and how you help students learn"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="sampleVideoUrl">Sample Teaching Video (Optional)</Label>
              <Input
                id="sampleVideoUrl"
                type="url"
                value={formData.sampleVideoUrl}
                onChange={(e) => handleInputChange("sampleVideoUrl", e.target.value)}
                placeholder="YouTube, Vimeo, or other video platform URL"
              />
            </div>

            <div>
              <Label htmlFor="references">References (Optional)</Label>
              <Textarea
                id="references"
                value={formData.references}
                onChange={(e) => handleInputChange("references", e.target.value)}
                placeholder="Names and contact information of professional references"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <Card>
          <CardHeader>
            <CardTitle>Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                required
              />
              <Label htmlFor="agreeToTerms" className="text-sm">
                I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> *
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeToBackgroundCheck"
                checked={formData.agreeToBackgroundCheck}
                onCheckedChange={(checked) => handleInputChange("agreeToBackgroundCheck", checked)}
                required
              />
              <Label htmlFor="agreeToBackgroundCheck" className="text-sm">
                I consent to a background check as part of the application process *
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            size="lg" 
            disabled={isSubmitting || !formData.agreeToTerms || !formData.agreeToBackgroundCheck}
            className="min-w-[200px]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Application
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
