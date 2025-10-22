"use client";

import { useEffect, useState } from "react";
import { getOrderById } from "@/actions/orders";
import { Order } from "@/types/order";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Package, MapPin, Phone, Mail, CreditCard, Truck } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrderDetailsModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsModal({ orderId, isOpen, onClose }: OrderDetailsModalProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !isOpen) {
        setOrder(null);
        setError("");
        return;
      }

      setLoading(true);
      setError("");
      setOrder(null);

      try {
        const result = await getOrderById(orderId);

        if (result.success && result.data) {
          setOrder(result.data);
        } else {
          setError(result.message || "Failed to fetch order details");
        }
      } catch (err) {
        console.error("Error in fetchOrder:", err);
        setError("An error occurred while fetching order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, isOpen]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500 text-white";
      case "shipped":
        return "bg-blue-500 text-white";
      case "processing":
        return "bg-yellow-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    if (!amount || isNaN(amount)) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>{order && `Order Code: ${order.orderCode}`}</DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">{error}</div>
        )}

        {!loading && !error && order && (
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6">
              {/* Order Status and Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Status</p>
                  <Badge className={`${getStatusColor(order.order_status)} mt-1`}>
                    {order.order_status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium mt-1">{formatDate(order.createdAt)}</p>
                </div>
                {order.tracking_id && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Tracking ID
                    </p>
                    <code className="text-sm bg-muted px-2 py-1 rounded mt-1 inline-block">
                      {order.tracking_id}
                    </code>
                  </div>
                )}
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.productName}</h4>
                          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <p>Type: {item.onModel}</p>
                            <p>Quantity: {item.quantity}</p>
                            {item.variantId && <p>Variant ID: {item.variantId}</p>}
                            {item.lens_package_detail && (
                              <div className="mt-2 p-2 bg-muted rounded">
                                <p className="font-medium text-foreground">Lens Package:</p>
                                {item.lens_package_detail.package_type && (
                                  <p>Type: {item.lens_package_detail.package_type}</p>
                                )}
                                {item.lens_package_detail.package_design && (
                                  <p>Design: {item.lens_package_detail.package_design}</p>
                                )}
                                {item.lens_package_detail.package_price && (
                                  <p>
                                    Price: {formatCurrency(item.lens_package_detail.package_price)}
                                  </p>
                                )}
                              </div>
                            )}
                            {item.prescription && (
                              <div className="mt-2 p-2 bg-muted rounded">
                                <p className="font-medium text-foreground">Prescription:</p>
                                <pre className="text-xs mt-1">
                                  {JSON.stringify(item.prescription, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(item.price)}</p>
                          <p className="text-sm text-muted-foreground">per unit</p>
                          <p className="font-bold mt-2">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </h3>
                <div className="p-4 border rounded-lg space-y-2">
                  <p>{order.shipping_address.address_line_1}</p>
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.state}
                  </p>
                  <p>PIN: {order.shipping_address.pincode}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{order.shipping_address.phone}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5" />
                  Order Summary
                </h3>
                <div className="space-y-2 p-4 border rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>
                      {formatCurrency(
                        order.total_amount -
                          (order.tax || 0) -
                          (order.shipping_cost || 0) +
                          (order.discount || 0)
                      )}
                    </span>
                  </div>
                  {order.tax !== undefined && order.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{formatCurrency(order.tax)}</span>
                    </div>
                  )}
                  {order.shipping_cost !== undefined && order.shipping_cost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping Cost</span>
                      <span>{formatCurrency(order.shipping_cost)}</span>
                    </div>
                  )}
                  {order.discount !== undefined && order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span>{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created At</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{formatDate(order.updatedAt)}</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
