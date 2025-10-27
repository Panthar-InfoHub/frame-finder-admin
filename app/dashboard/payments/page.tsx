import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, DollarSign, FileText } from "lucide-react";

const paymentDetails = {
  nextPayment: {
    amount: "₹5,240.50",
    penalties: "₹125.00",
    waivers: "₹50.00",
    netAmount: "₹5,315.50",
  },
  lastPayment: {
    amount: "₹4,890.25",
    penalties: "₹0.00",
    waivers: "₹0.00",
    netAmount: "₹4,890.25",
  },
}
const page = () => {
  return <div className="max-w-7xl mx-auto">
    {/* Header */}
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Payments</h1>
      <p className="text-muted-foreground">Manage and track your payment information</p>
    </div>

    {/* Payment Details Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Next Payment */}
      <Card className="relative overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16" />
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg text-foreground">Next Payment</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Estimated value of your upcoming payment. The final amount may vary based on any returns or penalties
              processed before the next payouts.
            </p>
          </div>

          <div className="p-2 bg-blue-500/10 rounded-lg">
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-foreground font-medium">Amount</span>
              <span className="text-foreground font-semibold">{paymentDetails.nextPayment.amount}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-foreground font-medium">Penalties</span>
              <span className="text-foreground font-semibold">{paymentDetails.nextPayment.penalties}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-foreground font-medium">Waivers & Commission</span>
              <span className="text-foreground font-semibold">{paymentDetails.nextPayment.waivers}</span>
            </div>
            <div className="flex justify-between items-center pt-3 bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
              <span className="text-foreground font-bold">Net Amount</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                {paymentDetails.nextPayment.netAmount}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Payment */}
      <Card className="relative overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-16 -mt-16" />
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg text-foreground">Last Payment</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Amount credited to your account on the previous payout date.
            </p>
          </div>
          <div className="p-2 bg-green-500/10 rounded-lg">
            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-foreground font-medium">Amount</span>
              <span className="text-foreground font-semibold">{paymentDetails.lastPayment.amount}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-foreground font-medium">Penalties</span>
              <span className="text-foreground font-semibold">{paymentDetails.lastPayment.penalties}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-foreground font-medium">Waivers & Commission</span>
              <span className="text-foreground font-semibold">{paymentDetails.lastPayment.waivers}</span>
            </div>
            <div className="flex justify-between items-center pt-3 bg-green-50 dark:bg-green-950 p-3 rounded-lg">
              <span className="text-foreground font-bold">Net Amount</span>
              <span className="text-green-600 dark:text-green-400 font-bold text-lg">{paymentDetails.lastPayment.netAmount}</span>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Previous Payments */}
      <Card className="relative overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-500/10 to-transparent rounded-full -mr-16 -mt-16" />
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg text-foreground">Previous Payments</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Record of payments credited to your account.</p>
          </div>
          <div className="p-2 bg-slate-500/10 rounded-lg">
            <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-foreground font-medium">Amount</span>
              <span className="text-foreground font-semibold">₹4,500.00</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-foreground font-medium">Penalties</span>
              <span className="text-foreground font-semibold">₹0.00</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-foreground font-medium">Waivers & Commission</span>
              <span className="text-foreground font-semibold">₹0.00</span>
            </div>
            <div className="flex justify-between items-center pt-3 bg-slate-200 dark:bg-slate-950 p-3 rounded-lg">
              <span className="text-foreground font-bold">Net Amount</span>
              <span className="text-slate-600 dark:text-slate-400 font-bold text-lg">₹4,500.00</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commission Tax Invoice */}
      <Card className="relative overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-16 -mt-16" />
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg text-foreground">Commission Tax Invoice</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">History of commission tax invoices.</p>
          </div>
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">No invoices available yet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
};

export default page;
