"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function Footer() {
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isContactExpanded, setIsContactExpanded] = useState(false)

  return (
    <>
      <footer className="border-t bg-purple-100/95">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center">
                <img 
                  src="/pianow-logo.png" 
                  alt="PIANOW Logo" 
                  className="h-12 w-auto object-contain"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Learn, shop, and connect with music lovers worldwide. Your complete platform for musical education and growth.
              </p>
            </div>

          {/* Learn */}
          <div className="space-y-4">
            <h3 className="font-semibold text-purple-900">Learn</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/lessons" className="text-muted-foreground hover:text-purple-700 transition-colors">
                  Video Lessons
                </Link>
              </li>
              <li>
                <Link href="/lessons/youtube" className="text-muted-foreground hover:text-purple-700 transition-colors">
                  YouTube Lessons
                </Link>
              </li>
              <li>
                <Link href="/lessons/tracker" className="text-muted-foreground hover:text-purple-700 transition-colors">
                  Progress Tracker
                </Link>
              </li>
              <li>
                <Link href="/teachers" className="text-muted-foreground hover:text-purple-700 transition-colors">
                  Find Teachers
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="font-semibold text-purple-900">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-purple-700 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop/pianos" className="text-muted-foreground hover:text-purple-700 transition-colors">
                  Pianos
                </Link>
              </li>
              <li>
                <Link href="/shop/guitars" className="text-muted-foreground hover:text-purple-700 transition-colors">
                  Guitars
                </Link>
              </li>
              <li>
                <Link href="/shop/drums" className="text-muted-foreground hover:text-purple-700 transition-colors">
                  Drums
                </Link>
              </li>
              <li>
                <Link href="/shop/audio" className="text-muted-foreground hover:text-purple-700 transition-colors">
                  Audio Equipment
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-purple-900">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-0 h-auto text-muted-foreground hover:text-purple-700 transition-colors font-normal"
                  onClick={() => setIsAboutOpen(true)}
                >
                  About Us
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto text-muted-foreground hover:text-purple-700 transition-colors font-normal"
                  onClick={() => setIsContactExpanded(!isContactExpanded)}
                >
                  <span>Contact</span>
                  {isContactExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                {isContactExpanded && (
                  <ul className="mt-2 ml-4 space-y-1">
                    <li>
                      <a href="tel:0769397959" className="text-muted-foreground hover:text-purple-700 transition-colors block text-sm">
                        0769397959
                      </a>
                    </li>
                    <li>
                        <a href="tel:0781609660" className="text-muted-foreground hover:text-purple-700 transition-colors block text-sm">
                          0781609660
                        </a>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-purple-700 transition-colors">
                  Careers & Gigs
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-purple-700 transition-colors">
                  Blog & Musician Journal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">© 2024 PIANOW. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-purple-700 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-purple-700 transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-purple-700 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>

    {/* About Us Dialog */}
    <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-900">ABOUT US</DialogTitle>
          <DialogDescription className="sr-only">
            Learn more about PIANOW and our mission
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <p className="text-base text-gray-700 leading-relaxed">
            At <span className="font-semibold text-purple-700">PIANOW</span>, we exist to bridge the gap between your music inspirations and musical expression. We recognize that countless individuals from students and working professionals to gifted youths, children and dedicated ministers face barriers that suppress their desire for music such as limited access to credible teachers, effective instruments & equipment & a musical community.
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            Our mission is to avail the best musical concepts, techniques, instrumentation and Spirit-filled sound, providing comprehensive solutions to musical education. We equip you with the tools, trainings, and platform to transform your desire into music, unleashing the supernatural in sound to impact the world. Through our integrated services and unwavering vision, we are cultivating a global community where excellence in craft and anointing in spirit converge.
          </p>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
