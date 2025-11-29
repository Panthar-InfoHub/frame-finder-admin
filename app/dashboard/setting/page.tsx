import { getSession } from "@/actions/session"
import { getVendorById } from "@/actions/vendors/vendors"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BankPaymentsSection from "@/components/vendors/setting/Bank-payments-section"
import NotificationsSection from "@/components/vendors/setting/Notifications-section"
import ProfileSection from "@/components/vendors/setting/Profile-section"
import ShippingSection from "@/components/vendors/setting/Shipping-section"
import SummarySection from "@/components/vendors/setting/Summary-section"
import TaxInvoiceSection from "@/components/vendors/setting/Tax-invoice-section"

export default async function VendorSettingsPage() {
    const { user } = await getSession();
    const res = await getVendorById(user?.id);
    const vendor = res?.data;


    return (
        <div className="min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold  mb-2">Vendor Settings</h1>
                    <p className="text-muted-foreground">Manage your business profile, payments, and preferences</p>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-6 mb-8">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="bank">Bank & Payments</TabsTrigger>
                        <TabsTrigger value="shipping">Shipping</TabsTrigger>
                        <TabsTrigger value="tax">Tax & Invoice</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <ProfileSection vendor={vendor} />
                    </TabsContent>

                    <TabsContent value="bank">
                        <BankPaymentsSection vendor={vendor} />
                    </TabsContent>

                    <TabsContent value="shipping">
                        <ShippingSection vendor={vendor} />
                    </TabsContent>

                    <TabsContent value="tax">
                        <TaxInvoiceSection vendor={vendor} />
                    </TabsContent>

                    <TabsContent value="notifications">
                        <NotificationsSection vendor={vendor} />
                    </TabsContent>

                    <TabsContent value="summary">
                        <SummarySection vendor={vendor} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
