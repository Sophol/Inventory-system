import { LayoutDashboard, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import ROUTES from "@/constants/routes";
interface SummarySaleProps {
  totalOrderPending: number;
  totalOrderApproved: number;
  totalInvPaymentPending: number;
  totalInvPaymentComplete: number;
  totalSalesAmount: number;
}
function SummarySale({
  totalOrderPending,
  totalOrderApproved,
  totalInvPaymentPending,
  totalInvPaymentComplete,
  totalSalesAmount,
}: SummarySaleProps) {
  const t = useTranslations("erp");
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 sm:grid-cols-2 xs:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("totalOrderPending")}
          </CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">{totalOrderPending}</div>
          <Button variant="link" className="px-0 text-xs text-muted-foreground">
            <Link href={ROUTES.SALEPENDINGS}>{t("viewDetails")}</Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("totalOrderApproved")}
          </CardTitle>
          <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">
            {formatCurrency(totalOrderApproved)}
          </div>
          <Button variant="link" className="px-0 text-xs text-muted-foreground">
            <Link href={ROUTES.APPROVEDSALES}>{t("viewDetails")}</Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("invoicePendingPayment")}
          </CardTitle>
          <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">
            {formatCurrency(totalInvPaymentPending)}
          </div>
          <Button variant="link" className="px-0 text-xs text-muted-foreground">
            <Link href={ROUTES.INVOICES}>{t("viewDetails")}</Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("invoiceCompletePayment")}
          </CardTitle>
          <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">
            {formatCurrency(totalInvPaymentComplete)}
          </div>
          <Button variant="link" className="px-0 text-xs text-muted-foreground">
            <Link href={ROUTES.INVOICES}>{t("viewDetails")}</Link>
          </Button>
        </CardContent>
      </Card>
      <Card className="xs:col-span-2 md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("totalRevenue")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">
            {formatCurrency(totalSalesAmount)}
          </div>
          <Button variant="link" className="px-0 text-xs text-muted-foreground">
            <Link href={ROUTES.INVOICES}>{t("viewDetails")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
export default SummarySale;
