import { Building2, Mail, Phone, MapPin, Calendar, Star, CheckCircle, XCircle, ImageIcon, Clock } from "lucide-react"
export default function BusinessHeader({ resp }: { resp: any }) {
  // Format dates for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="bg-background border-b border-border/50">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-5xl  font-light text-foreground mb-2 text-balance">{resp.business_name}</h1>
              <p className="text-lg text-muted-foreground font-light">Led by {resp.business_owner}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50">
            {resp.isActive ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <span className="text-sm font-medium">{resp.isActive ? "Active Business" : "Inactive"}</span>
            <div className="w-px h-4 bg-border mx-2" />
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium">{resp.rating}/5</span>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Information */}
          <div className="bg-card rounded-lg p-8 border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="text-xl  font-medium text-foreground">Contact</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{resp.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{resp.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">GST: {resp.gst_number}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-card rounded-lg p-8 border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="text-xl  font-medium text-foreground">Location</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-foreground leading-relaxed">{resp.address.address_line_1}</p>
              <p className="text-sm text-foreground">
                {resp.address.city}, {resp.address.state}
              </p>
              <p className="text-sm text-muted-foreground">Pincode: {resp.address.pincode}</p>
            </div>
          </div>

          {/* Business Details */}
          <div className="bg-card rounded-lg p-8 border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="text-xl  font-medium text-foreground">Details</h3>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Role</span>
                <p className="text-sm text-foreground font-medium">{resp.role}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Business ID</span>
                <p className="text-xs text-muted-foreground font-mono">{resp._id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Media & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Media Information */}
          <div className="bg-card rounded-lg p-8 border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="text-xl  font-medium text-foreground">Media Assets</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border/30">
                <span className="text-sm text-muted-foreground">Logo</span>
                <span className="text-sm text-foreground">
                  {resp.logo !== "undefined" ? "✓ Uploaded" : "Not uploaded"}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-muted-foreground">Banner</span>
                <span className="text-sm text-foreground">
                  {resp.banner !== "undefined" ? "✓ Uploaded" : "Not uploaded"}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-card rounded-lg p-8 border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="text-xl  font-medium text-foreground">Timeline</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground block">Created</span>
                  <span className="text-sm text-foreground">{formatDate(resp.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground block">Last Updated</span>
                  <span className="text-sm text-foreground">{formatDate(resp.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
