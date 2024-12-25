import {
  Boxes,
  LucideWarehouse,
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

export const sidebarLinks = [
  {
    title: "Dashboard",
    url: ROUTES.HOME,
    icon: AiTwotoneDashboard,
    isActive: true,
  },
  {
    title: "sale",
    url: "#",
    icon: SiSellfy,
    isActive: false,
    items: [
      {
        title: "Sale Order",
        url: "/sales/order",
        icon: ShoppingBag,
      },
      {
        title: "pending sale Order",
        url: "/sales/pending",
        icon: ShoppingBag,
      },
      {
        title: "approved sale order",
        url: "/sales/approved",
        icon: ShoppingBag,
      },
      {
        title: "invoice",
        url: "/sales/invoice",
        icon: LiaFileInvoiceSolid,
      },
      {
        title: "customer",
        url: "/sales/customer",
        icon: FaUsers,
      },
    ],
  },
  {
    title: "Purchase",
    url: "#",
    icon: ShoppingCart,
    isActive: false,
    items: [
      {
        title: "Purchase Order",
        url: "/purchases/order",
        icon: ShoppingBasket,
      },
      {
        title: "Supplier",
        url: ROUTES.SUPPLIERS,
        icon: FaUserTie,
      },
    ],
  },
  {
    title: "Inventory",
    url: "#",
    icon: MdOutlineInventory2,
    isActive: false,
    items: [
      {
        title: "Category",
        url: ROUTES.CATEGORIES,
        icon: BiCategory,
      },
      {
        title: "Unit",
        url: ROUTES.UNITS,
        icon: Boxes,
      },
      {
        title: "Product",
        url: ROUTES.PRODUCTS,
        icon: AiOutlineProduct,
      },
    ],
  },
  {
    title: "Report",
    url: "#",
    icon: TbReportSearch,
    isActive: false,
    items: [
      {
        title: "Sale Report",
        url: "/reports/sale",
        icon: SiSellfy,
      },
      {
        title: "Purchase Report",
        url: "/reports/purchase",
        icon: ShoppingCart,
      },
      {
        title: "Product Report",
        url: "/reports/product",
        icon: AiOutlineProduct,
      },
      {
        title: "Profit Report",
        url: "/reports/profit",
        icon: GrMoney,
      },
    ],
  },
  {
    title: "SETTINGS",
    url: "#",
    icon: IoSettingsOutline,
    isActive: false,
    items: [
      {
        title: "User",
        url: "/settings/user",
        icon: FaUserCog,
      },
      {
        title: "Branch",
        url: ROUTES.BRANCHES,
        icon: LucideWarehouse,
      },
    ],
  },
];
