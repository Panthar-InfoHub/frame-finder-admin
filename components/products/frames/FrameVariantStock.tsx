"use client"
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { updateFrameStockAction, updateSunglassStockAction } from "@/actions/vendors/products";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";


export function FrameVariantStock({ children, product }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedVariantId, setSelectedVariantId] = useState("");
    const [operation, setOperation] = useState("");
    const [quantity, setQuantity] = useState("");
    const router = useRouter()

    const OPTIONS = [
        {
            value: 'increase',
            label: "INCREASE",
            icon: TrendingUp,
            color: "text-stock-high"
        },
        {
            value: 'decrease',
            label: "DECREASE",
            icon: TrendingDown,
            color: "text-stock-low"
        },
    ];

    // Get all variants (including main product as a variant)
    const allVariants = [
        ...(product.variants || []).map((variant, index) => ({
            ...variant,
            name: `Variant ${index + 1}`,
        }))
    ];

    const selectedVariant = allVariants.find(v => v._id === selectedVariantId);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedVariantId || !operation || !quantity) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (parseInt(quantity) <= 0) {
            toast.error("Quantity must be greater than 0");
            return;
        }

        setLoading(true);

        try {
            const result = await updateFrameStockAction(
                product._id,
                operation,
                parseInt(quantity),
                selectedVariantId
            );

            if (result.success) {
                toast.success(result.message);
                setOpen(false);
                // Reset form
                setSelectedVariantId("");
                setOperation("");
                setQuantity("");
                router.refresh()
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const getStockBadgeVariant = (current, minimum) => {
        if (current <= minimum) return "destructive";
        if (current <= minimum * 2) return "secondary";
        return "default";
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Update Stock
                    </DialogTitle>
                    <DialogDescription>
                        Update stock levels for {product.brand_name} ({product.productCode})
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[500px] w-full" >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Variant Selection */}
                        <div className="space-y-3 w-full">
                            <Label htmlFor="variant">Select Variant *</Label>
                            <Select value={selectedVariantId} onValueChange={setSelectedVariantId} required >
                                <SelectTrigger className="w-full" >
                                    <SelectValue placeholder="Choose a variant to update" />
                                </SelectTrigger>
                                <SelectContent className="w-full" >
                                    {allVariants.map((variant) => (
                                        <SelectItem key={variant._id} value={variant._id} className="w-full" >
                                            <div className="flex items-center justify-between w-full py-2">
                                                <div>{variant.name}</div>
                                                <Badge variant={getStockBadgeVariant(variant.stock.current, variant.stock.minimum)}>
                                                    {variant.stock.current} units
                                                </Badge>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Current Stock Display */}
                        {selectedVariant && (
                            <Card>
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Current Stock</span>
                                            <Badge variant={getStockBadgeVariant(selectedVariant.stock.current, selectedVariant.stock.minimum)}>
                                                {selectedVariant.stock.current} units
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Minimum:</span>
                                                <div className="font-medium">{selectedVariant.stock.minimum}</div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Price:</span>
                                                <div className="font-medium">₹{selectedVariant.price.base_price}</div>
                                            </div>
                                        </div>
                                        {selectedVariant.frame_color && (
                                            <div className="text-sm">
                                                <span className="text-muted-foreground">Colors:</span>
                                                <div>{selectedVariant.frame_color.join(", ")} frame • {selectedVariant.lens_color?.join(", ")} lens</div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Operation Selection */}
                        <div className="space-y-3">
                            <Label htmlFor="operation">Operation *</Label>
                            <Select value={operation} onValueChange={setOperation} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select operation type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {OPTIONS.map((option) => {
                                        return (
                                            <SelectItem key={option.value} value={option.value} className="py-2" >
                                                <div className="flex items-center gap-2">
                                                    {option.label}
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Quantity Input */}
                        <div className="space-y-3">
                            <Label htmlFor="quantity">Quantity *</Label>
                            <Input
                                id="quantity"
                                name="quantity"
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="Enter quantity to add/remove"
                                required
                            />
                        </div>

                        {/* Preview of change */}
                        {selectedVariant && operation && quantity && parseInt(quantity) > 0 && (
                            <Card className="border-primary/20">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Preview:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">
                                                {selectedVariant.stock.current}
                                            </span>
                                            <span className="text-muted-foreground">→</span>
                                            <span className="font-bold text-primary">
                                                {operation === "increase"
                                                    ? selectedVariant.stock.current + parseInt(quantity)
                                                    : Math.max(0, selectedVariant.stock.current - parseInt(quantity))
                                                }
                                            </span>
                                            <span className="text-sm text-muted-foreground">units</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || !selectedVariantId || !operation || !quantity}
                            >
                                {loading ? "Updating..." : "Update Stock"}
                            </Button>
                        </div>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}