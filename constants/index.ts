import { SiSellfy } from "react-icons/si";
import { AiTwotoneDashboard, AiOutlineProduct } from "react-icons/ai";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { Boxes, ShoppingBag, ShoppingBasket, ShoppingCart } from "lucide-react";
import { FaUserTie, FaUsers } from "react-icons/fa";
import { MdOutlineInventory2 } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { TbReportSearch } from "react-icons/tb";
import { GrMoney } from "react-icons/gr";

export const sidebarLinks = [
  {
    title: "Dashboard",
    url: "/",
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
        url: "/purchases/supplier",
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
        url: "/inventories/category",
        icon: BiCategory,
      },
      {
        title: "Unit",
        url: "/inventories/unit",
        icon: Boxes,
      },
      {
        title: "Product",
        url: "/inventories/product",
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
];
