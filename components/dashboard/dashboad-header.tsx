import { Building2, Mail, Phone, MapPin, Star, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BusinessHeader({ resp }: { resp: any }) {
  return (
    <div className="relative p-8">
      {/* Compact Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Business Info */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center ${
                resp.isActive ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {resp.isActive ? (
                <CheckCircle className="w-3 h-3 text-white" />
              ) : (
                <XCircle className="w-3 h-3 text-white" />
              )}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-1">{resp.business_name}</h1>
            <p className="text-muted-foreground mb-3">Led by {resp.business_owner}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant={resp.isActive ? "default" : "destructive"} className="font-medium">
                {resp.isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                {resp.rating}/5
              </Badge>
              <Badge variant="outline">{resp.role}</Badge>
            </div>
          </div>
        </div>

        {/* Quick Contact Info */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span className="truncate max-w-[200px]">{resp.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{resp.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate max-w-[200px]">
              {resp.address.city}, {resp.address.state}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Details Strip */}
      <div className="mt-6 pt-6 border-t border-border/50 flex flex-wrap gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium">GST:</span>
          <span className="font-mono">{resp.gst_number}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Business ID:</span>
          <span className="font-mono">{resp._id.slice(0, 12)}...</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Logo:</span>
          <span className={resp.logo !== "undefined" ? "text-green-600" : "text-muted-foreground"}>
            {resp.logo !== "undefined" ? "✓ Uploaded" : "Not uploaded"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Banner:</span>
          <span
            className={resp.banner !== "undefined" ? "text-green-600" : "text-muted-foreground"}
          >
            {resp.banner !== "undefined" ? "✓ Uploaded" : "Not uploaded"}
          </span>
        </div>
      </div>
    </div>
  );
}
