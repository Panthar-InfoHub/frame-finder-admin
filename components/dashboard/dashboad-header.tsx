"use client"

import { Eye, User, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface BusinessData {
  businessName: string
  businessOwner: string
  gstNumber: string
  logoUrl?: string
  bannerUrl?: string
}

interface BusinessHeaderProps {
  businessData: BusinessData
  onViewAll?: () => void
}

export function BusinessHeader({ businessData, onViewAll }: BusinessHeaderProps) {
  const { businessName, businessOwner, gstNumber, logoUrl, bannerUrl } = businessData

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50">
      {/* Banner Background */}
      {bannerUrl && (
        <div className="absolute inset-0 overflow-hidden">
          <Image src={bannerUrl || "/placeholder.svg"} alt="Business banner" fill className="object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/85 to-slate-900/90" />
        </div>
      )}

      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="relative px-8 py-10">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-8">
            {logoUrl && (
              <div className="flex-shrink-0">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl ring-1 ring-white/10">
                  <Image
                    src={logoUrl || "/placeholder.svg"}
                    alt={`${businessName} logo`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent leading-tight">
                  {businessName}
                </h1>
                <p className="text-xl text-slate-300 font-light">Welcome to {businessName} Admin Panel</p>
              </div>

              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <User className="w-4 h-4 text-blue-400" />
                  <div className="text-sm">
                    <span className="text-slate-400">Owner:</span>
                    <span className="ml-2 text-white font-medium">{businessOwner}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <FileText className="w-4 h-4 text-green-400" />
                  <div className="text-sm">
                    <span className="text-slate-400">GST:</span>
                    <span className="ml-2 text-white font-medium font-mono">{gstNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {onViewAll && (
            <Button
              variant="outline"
              onClick={onViewAll}
              className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200 shadow-lg"
            >
              <Eye className="w-4 h-4" />
              View All
            </Button>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}