import { getFrameById } from "@/actions/vendors/products";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import React, { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge" 
import { Package, Users, Calendar, Hash } from "lucide-react"

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <FrameDetails id={id} />
    </Suspense>
  );
};

interface SunglassImage {
  url: string
  _id: string
}

interface Vendor {
  _id: string
  business_name: string
  email: string
  phone: string
}

interface Stock {
  current: number
  minimum: number
  maximum: number
}

interface Sunglassresp {
  success: boolean
  message: string
  resp: {
    stock: Stock
    _id: string
    brand_name: string
    desc: string
    images: SunglassImage[]
    frame_color: string[]
    temple_color: string[]
    material: string[]
    shape: string[]
    style: string[]
    hsn_code: string
    price: number
    sizes: string[]
    gender: string[]
    vendorId: Vendor
    rating: number
    status: string
    productCode: string
    createdAt: string
    updatedAt: string
    __v: number
    variants: any[]
  }
}

interface SunglassDisplayProps {
  sunglassresp: Sunglassresp
}

const FrameDetails = async ({ id }: { id: string }) => {
  const resp = await getFrameById(id);
  if (!resp.success){
    return <div>unable to fetch the Frame detail</div>
  }

  console.log(resp)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price)
  }

  const getStockStatus = (stock: Stock) => {
    if (stock?.current <= stock?.minimum) return { status: "Low Stock", color: "bg-red-500" }
    if (stock?.current >= stock?.maximum * 0.8) return { status: "In Stock", color: "bg-green-500" }
    return { status: "Available", color: "bg-yellow-500" }
  }

  const stockInfo = getStockStatus(resp.stock)
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{resp.brand_name}</CardTitle>
              <p className="text-muted-foreground mt-1">{resp.desc}</p>
            </div>
            <div className="flex gap-2">
              <Badge className={`${stockInfo.color} text-white`}>{stockInfo.status}</Badge>
              <Badge variant="outline">{resp.status}</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Image Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Product Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={
                  resp.images?.[0]?.url || "/placeholder.svg?height=300&width=300&query=sunglasses" || "/placeholder.svg"
                }
                alt={`${resp.brand_name} - Main view`}
                className="w-full h-full object-cover"
              />
            </div>

            {resp.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {resp.images.map((image, index) => (
                  <div key={image._id} className="aspect-square rounded border overflow-hidden">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Details */}
        <div className="space-y-4">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Price:</span>
                  <div className="text-lg font-bold">{formatPrice(resp.price)}</div>
                </div>
                <div>
                  <span className="font-medium">Product Code:</span>
                  <div className="font-mono">{resp.productCode}</div>
                </div>
                <div>
                  <span className="font-medium">HSN Code:</span>
                  <div>{resp.hsn_code}</div>
                </div>
                <div>
                  <span className="font-medium">Rating:</span>
                  <div>{resp.rating}/5</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stock Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-4 h-4" />
                Stock Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Current:</span>
                  <div className="text-lg font-bold">{resp.stock?.current}</div>
                </div>
                <div>
                  <span className="font-medium">Minimum:</span>
                  <div>{resp.stock?.minimum}</div>
                </div>
                <div>
                  <span className="font-medium">Maximum:</span>
                  <div>{resp.stock?.maximum}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-4 h-4" />
                Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Frame Colors:</span>
                  <div className="flex gap-1 mt-1">
                    {resp.frame_color?.map((color) => (
                      <Badge key={color} variant="secondary" className="text-xs">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Temple Colors:</span>
                  <div className="flex gap-1 mt-1">
                    {resp.temple_color?.map((color) => (
                      <Badge key={color} variant="secondary" className="text-xs">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Material:</span>
                  <div>{resp.material?.join(", ")}</div>
                </div>
                <div>
                  <span className="font-medium">Shape:</span>
                  <div>{resp.shape?.join(", ")}</div>
                </div>
                <div>
                  <span className="font-medium">Style:</span>
                  <div>{resp.style?.join(", ")}</div>
                </div>
                <div>
                  <span className="font-medium">Gender:</span>
                  <div>{resp.gender?.join(", ")}</div>
                </div>
              </div>
              <div>
                <span className="font-medium">Available Sizes:</span>
                <div className="flex gap-1 mt-1">
                  {resp.sizes?.map((size) => (
                    <Badge key={size} variant="outline" className="text-xs">
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Vendor Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vendor Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Business Name:</span>
              <div>{resp.vendorId?.business_name}</div>
            </div>
            <div>
              <span className="font-medium">Email:</span>
              <div>{resp.vendorId?.email}</div>
            </div>
            <div>
              <span className="font-medium">Phone:</span>
              <div>{resp.vendorId?.phone}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Created:</span>
              <div>{new Date(resp.createdAt).toLocaleString()}</div>
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>
              <div>{new Date(resp.updatedAt).toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
