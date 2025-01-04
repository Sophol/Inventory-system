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
    title: "Dashboard",
    url: ROUTES.HOME,
    icon: AiTwotoneDashboard,
    isActive: true,
    permissions: ["admin", "branch", "report", "auditReport"], // Example permissions
  },
  {
    title: "Sale",
    url: "#",
    icon: SiSellfy,
    isActive: false,
    permissions: ["admin", "seller"],
    items: [
      {
        title: "Sale Order",
        url: "/sales/order",
        icon: ShoppingBag,
        permissions: ["admin", "seller"],
      },
      {
        title: "Pending Sale Order",
        url: "/sales/pending",
        icon: ShoppingBag,
        permissions: ["admin", "seller"],
      },
      {
        title: "Approved Sale Order",
        url: "/sales/approved",
        icon: ShoppingBag,
        permissions: ["admin", "seller"],
      },
      {
        title: "Invoice",
        url: "/sales/invoice",
        icon: LiaFileInvoiceSolid,
        permissions: ["admin", "seller"],
      },
      {
        title: "Customer",
        url: "/sales/customer",
        icon: FaUsers,
        permissions: ["admin", "seller"],
      },
    ],
  },
  {
    title: "Purchase",
    url: "#",
    icon: ShoppingCart,
    isActive: false,
    permissions: ["admin", "stock", "branch"],
    items: [
      {
        title: "Purchase Order",
        url: ROUTES.PURCHASES,
        icon: ShoppingBasket,
        permissions: ["admin", "stock", "branch"],
      },
      {
        title: "Supplier",
        url: ROUTES.SUPPLIERS,
        icon: FaUserTie,
        permissions: ["admin", "stock", "branch"],
      },
    ],
  },
  {
    title: "Expense",
    url: "#",
    icon: Blocks,
    isActive: false,
    permissions: ["admin", "branch"],
    items: [
      {
        title: "Salary Expense",
        url: ROUTES.SALARYEXPS,
        icon: BadgeDollarSign,
        permissions: ["admin", "branch"],
      },
      {
        title: "Mission Expense",
        url: ROUTES.MISSIONEXPS,
        icon: BriefcaseConveyorBelt,
        permissions: ["admin", "branch"],
      },
      {
        title: "General Expense",
        url: ROUTES.GENERALEXPS,
        icon: NotebookPen,
        permissions: ["admin", "branch"],
      },
    ],
  },
  {
    title: "Inventory",
    url: "#",
    icon: MdOutlineInventory2,
    isActive: false,
    permissions: ["admin", "stock", "seller"],
    items: [
      {
        title: "Category",
        url: ROUTES.CATEGORIES,
        icon: BiCategory,
        permissions: ["admin", "stock"],
      },
      {
        title: "Unit",
        url: ROUTES.UNITS,
        icon: Boxes,
        permissions: ["admin", "stock"],
      },
      {
        title: "Product",
        url: ROUTES.PRODUCTS,
        icon: AiOutlineProduct,
        permissions: ["admin", "stock", "seller"],
      },
    ],
  },
  {
    title: "Report",
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
        title: "Sale Report",
        url: "/reports/sale",
        icon: SiSellfy,
        permissions: ["admin", "report", "auditReport", "branch", "seller"],
      },
      {
        title: "Purchase Report",
        url: "/reports/purchase",
        icon: ShoppingCart,
        permissions: ["admin", "report", "auditReport", "stock", "branch"],
      },
      {
        title: "Product Report",
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
        title: "Profit Report",
        url: "/reports/profit",
        icon: GrMoney,
        permissions: ["admin", "report", "auditReport", "branch"],
      },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: IoSettingsOutline,
    isActive: false,
    permissions: ["admin", "stock", "seller", "branch"],
    items: [
      {
        title: "User",
        url: "/settings/user",
        icon: FaUserCog,
        permissions: ["admin", "branch"],
      },
      {
        title: "Branch",
        url: ROUTES.BRANCHES,
        icon: LucideWarehouse,
        permissions: ["admin", "stock", "branch", "seller"],
      },
      {
        title: "Setting",
        url: ROUTES.SETTING(settingId),
        icon: IoSettingsOutline,
        permissions: ["admin", "stock", "seller", "branch"],
      },
    ],
  },
];
