import {
  BadgeDollarSign,
  Blocks,
  Boxes,
  BriefcaseConveyorBelt,
  LucideWarehouse,
  NotebookPen,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
} from "lucide-react";
import { AiTwotoneDashboard, AiOutlineProduct } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { FaUserCog, FaUserTie, FaUsers } from "react-icons/fa";
import { GrMoney } from "react-icons/gr";
import { IoSettingsOutline } from "react-icons/io5";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { MdOutlineInventory2 } from "react-icons/md";
import { SiSellfy } from "react-icons/si";
import { TbReportSearch } from "react-icons/tb";

import ROUTES from "./routes";

const settingId =
  (process.env.SETTING_ID as string) || "6770f9d30b15822465aec2ac";
interface Link {
  title: string;
  url: string;
  icon: React.ComponentType;
  isActive?: boolean;
  items?: Link[];
  permissions?: string[]; // Add permissions property
}

export const adminLinks: Link[] = [
  {
    title: "dashboard",
    url: ROUTES.HOME,
    icon: AiTwotoneDashboard,
    isActive: true,
    permissions: ["admin", "branch", "report", "auditReport"], // Example permissions
  },
  {
    title: "sale",
    url: "#",
    icon: SiSellfy,
    isActive: false,
    permissions: ["admin", "seller"],
    items: [
      {
        title: "saleOrder",
        url: "/sales/order",
        icon: ShoppingBag,
        permissions: ["admin", "seller"],
      },
      {
        title: "pendingSaleOrder",
        url: "/sales/pending",
        icon: ShoppingBag,
        permissions: ["admin", "seller"],
      },
      {
        title: "approvedSaleOrder",
        url: "/sales/approved",
        icon: ShoppingBag,
        permissions: ["admin", "seller"],
      },
      {
        title: "invoice",
        url: "/sales/invoice",
        icon: LiaFileInvoiceSolid,
        permissions: ["admin", "seller"],
      },
      {
        title: "customer",
        url: "/sales/customer",
        icon: FaUsers,
        permissions: ["admin", "seller"],
      },
    ],
  },
  {
    title: "purchase",
    url: "#",
    icon: ShoppingCart,
    isActive: false,
    permissions: ["admin", "stock", "branch"],
    items: [
      {
        title: "pendingPurchase",
        url: ROUTES.PURCHASES,
        icon: ShoppingBasket,
        permissions: ["admin", "stock", "branch"],
      },
      {
        title: "approvedPurchase",
        url: ROUTES.PURCHASECOMPLETES,
        icon: ShoppingBasket,
        permissions: ["admin", "stock", "branch"],
      },
      {
        title: "supplier",
        url: ROUTES.SUPPLIERS,
        icon: FaUserTie,
        permissions: ["admin", "stock", "branch"],
      },
    ],
  },
  {
    title: "expense",
    url: "#",
    icon: Blocks,
    isActive: false,
    permissions: ["admin", "branch"],
    items: [
      {
        title: "salaryExpense",
        url: ROUTES.SALARYEXPS,
        icon: BadgeDollarSign,
        permissions: ["admin", "branch"],
      },
      {
        title: "missionExpense",
        url: ROUTES.MISSIONEXPS,
        icon: BriefcaseConveyorBelt,
        permissions: ["admin", "branch"],
      },
      {
        title: "generalExpense",
        url: ROUTES.GENERALEXPS,
        icon: NotebookPen,
        permissions: ["admin", "branch"],
      },
    ],
  },
  {
    title: "inventory",
    url: "#",
    icon: MdOutlineInventory2,
    isActive: false,
    permissions: ["admin", "stock", "seller"],
    items: [
      {
        title: "category",
        url: ROUTES.CATEGORIES,
        icon: BiCategory,
        permissions: ["admin", "stock"],
      },
      {
        title: "unit",
        url: ROUTES.UNITS,
        icon: Boxes,
        permissions: ["admin", "stock"],
      },
      {
        title: "product",
        url: ROUTES.PRODUCTS,
        icon: AiOutlineProduct,
        permissions: ["admin", "stock", "seller"],
      },
    ],
  },
  {
    title: "report",
    url: "#",
    icon: TbReportSearch,
    isActive: false,
    permissions: [
      "admin",
      "report",
      "auditReport",
      "stock",
      "seller",
      "branch",
    ],
    items: [
      {
        title: "saleReport",
        url: "/reports/sale",
        icon: SiSellfy,
        permissions: ["admin", "report", "auditReport", "branch", "seller"],
      },
      {
        title: "purchaseReport",
        url: "/reports/purchase",
        icon: ShoppingCart,
        permissions: ["admin", "report", "auditReport", "stock", "branch"],
      },
      {
        title: "productReport",
        url: "/reports/product",
        icon: AiOutlineProduct,
        permissions: [
          "admin",
          "report",
          "auditReport",
          "stock",
          "seller",
          "branch",
        ],
      },
      {
        title: "profitReport",
        url: "/reports/profit",
        icon: GrMoney,
        permissions: ["admin", "report", "auditReport", "branch"],
      },
      {
        title: "alertQtyReport",
        url: "/reports/alertQty",
        icon: GrMoney,
        permissions: ["admin", "report", "auditReport", "branch"],
      },
    ],
  },
  {
    title: "settings",
    url: "#",
    icon: IoSettingsOutline,
    isActive: false,
    permissions: ["admin", "stock", "seller", "branch"],
    items: [
      {
        title: "user",
        url: "/settings/user",
        icon: FaUserCog,
        permissions: ["admin", "branch"],
      },
      {
        title: "branch",
        url: ROUTES.BRANCHES,
        icon: LucideWarehouse,
        permissions: ["admin", "stock", "branch", "seller"],
      },
      {
        title: "settings",
        url: ROUTES.SETTING(settingId),
        icon: IoSettingsOutline,
        permissions: ["admin", "stock", "seller", "branch"],
      },
    ],
  },
];
