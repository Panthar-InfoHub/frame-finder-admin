"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SummarySectionProps {
  vendor: any
}

export default function SummarySection({ vendor }: SummarySectionProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Settings Summary</CardTitle>
          <CardDescription>Review all your current settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-muted-foreground mb-4">Business Information</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-slate-600">Business:</span> {vendor.business_name}
                </p>
                <p>
                  <span className="text-slate-600">Owner:</span> {vendor.business_owner}
                </p>
                <p>
                  <span className="text-slate-600">Email:</span> {vendor.email}
                </p>
                <p>
                  <span className="text-slate-600">Phone:</span> {vendor.phone}
                </p>
                <p>
                  <span className="text-slate-600">GST:</span> {vendor.gst_number}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-muted-foreground mb-4">Bank Details</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-slate-600">Account Holder:</span> {vendor.bank_details?.account_holder_name}
                </p>
                <p>
                  <span className="text-slate-600">Account:</span> ****{vendor.bank_details?.account_number.slice(-4)}
                </p>
                <p>
                  <span className="text-slate-600">IFSC:</span> {vendor.bank_details?.ifsc_code}
                </p>
                <p>
                  <span className="text-slate-600">Payout Frequency:</span> {vendor?.payment_preferences}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-muted-foreground mb-4">Shipping Settings</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-slate-600">Courier:</span> {vendor.shipping?.preferred_courier}
                </p>
                <p>
                  <span className="text-slate-600">Shipping Charges:</span>{" "}
                  {vendor.shipping?.shipping_charges_setup ? "Enabled" : "Disabled"}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-muted-foreground mb-4">Tax Settings</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-slate-600">GST %:</span> {vendor.tax_invoice?.gst_percentage}%
                </p>
                <p>
                  <span className="text-slate-600">Auto Tax:</span>{" "}
                  {vendor.tax_invoice?.auto_tax_calculation ? "Enabled" : "Disabled"}
                </p>
                <p>
                  <span className="text-slate-600">Format:</span> {vendor.tax_invoice?.invoice_format}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
