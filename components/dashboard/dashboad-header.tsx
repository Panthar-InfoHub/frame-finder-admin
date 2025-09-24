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
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-8">
        {/* Business Name and Owner */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-foreground mb-2">{resp.business_name}</h1>
          <p className="text-xl text-muted-foreground">Owner: {resp.business_owner}</p>
        </div>

        {/* Business Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Contact Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Email:</span> {resp.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {resp.phone}
              </p>
              <p>
                <span className="font-medium">GST Number:</span> {resp.gst_number}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Address</h3>
            <div className="space-y-1 text-sm">
              <p>{resp.address.address_line_1}</p>
              <p>
                {resp.address.city}, {resp.address.state}
              </p>
              <p>
                <span className="font-medium">Pincode:</span> {resp.address.pincode}
              </p>
            </div>
          </div>

          {/* Business Status */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Business Status</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Role:</span> {resp.role}
              </p>
              <p>
                <span className="font-medium">Rating:</span> {resp.rating}/5
              </p>
              <p>
                <span className="font-medium">Status:</span>
                <span
                  className={`ml-1 px-2 py-1 rounded-full text-xs ${
                    resp.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {resp.isActive ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Media Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Media</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Logo:</span> {resp.logo !== "undefined" ? resp.logo : "Not uploaded"}
              </p>
              <p>
                <span className="font-medium">Banner:</span>{" "}
                {resp.banner !== "undefined" ? resp.banner : "Not uploaded"}
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Timestamps</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Created:</span> {formatDate(resp.createdAt)}
              </p>
              <p>
                <span className="font-medium">Updated:</span> {formatDate(resp.updatedAt)}
              </p>
              <p>
                <span className="font-medium">ID:</span> {resp._id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
