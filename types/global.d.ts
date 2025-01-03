type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};
type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}

interface GlobalFilter {
  globalFilter: string | number | boolean | null;
}
interface SelectData {
  _id: string;
  title: string;
}

interface Category {
  _id: string;
  title: string;
  status: string;
}
interface Unit {
  _id: string;
  title: string;
  status: string;
}
interface ProductUnit {
  unit: string;
  product: string;
  qty: number;
  cost?: number;
  price?: number;
  wholeSalePrice?: number;
  level?: number;
  unitTitle?: string;
}
interface Product {
  _id: string;
  code: string;
  title: string;
  description?: string;
  image?: string;
  units: ProductUnit[];
  category: string;
  qtyOnHand: number;
  alertQty: number;
  status: "active" | "inactive";
  categoryTitle?: string;
}
interface Branch {
  _id: string;
  title: string;
  phone: string;
  location: string;
  description?: string;
  status: "active" | "inactive";
}

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  socialLink?: string;
  location: string;
  description?: string;
  balance?: number;
  saleType: "retail" | "wholesale";
  status: "active" | "inactive";
}
interface Supplier {
  _id: string;
  companyName: string;
  name: string;
  phone: string;
  email?: string;
  socialLink?: string;
  location: string;
  description?: string;
  status: "active" | "inactive";
}
interface PurchaseDetail {
  _id: string;
  purchase: string;
  product: string;
  unit: string;
  selectedProduct?: { _id: string; title: string };
  selectedUnit?: { _id: string; title: string };
  description?: string;
  discount: number;
  qty: number;
  cost: number;
  total: number;
  exchangeRateD?: number;
  exchangeRateT?: number;
}

interface Purchase {
  _id: string;
  supplier: { _id: string; title: string };
  branch: { _id: string; title: string };
  referenceNo: string;
  description?: string;
  purchaseDate: string;
  discount: number;
  subtotal: number;
  grandtotal: number;
  paid: number;
  balance: number;
  exchangeRateD?: number;
  exchangeRateT?: number;
  paidBy?: "Cash" | "ABA Bank" | "ACLEDA Bank" | "Others";
  orderStatus: "pending" | "approved" | "completed";
  paymentStatus: "pending" | "credit" | "completed";
  purchaseDetails: PurchaseDetail[];
}


interface saleDetail {
  _id: string;
  sale: string;
  product: string;
  unit: string;
  selectedProduct?: { _id: string; title: string };
  selectedUnit?: { _id: string; title: string };
  description?: string;
  discount: number;
  qty: number;
  cost: number;
  total: number;
  exchangeRateD?: number;
  exchangeRateT?: number;
}

interface Sale {
  _id: string;
  customer: { _id: string; title: string };
  branch: { _id: string; title: string };
  referenceNo: string;
  description?: string;
  orderDate: string;
  approvedDate: string;
  invoicedDate: string;
  discount: number;
  subtotal: number;
  grandtotal: number;
  paid: number;
  balance: number;
  exchangeRateD?: number;
  exchangeRateT?: number;
  tax: number;
  paidBy?: "Cash" | "ABA Bank" | "ACLEDA Bank" | "Others";
  orderStatus: "pending" | "approved" | "completed";
  paymentStatus: "pending" | "credit" | "completed";
  saleDetails: PurchaseDetail[];
}

interface Setting {
  _id: string;
  companyName: string;
  companyLogo: string;
  address: string;
  phone: string;
  exchangeRateD: number;
  exchangeRateT: number;
}
interface User {
  _id: string;
  name: string;
  username: string;
  password: string;
  email: string;
  role: string;
  image?: string;
  phone?: string;
  isStaff: boolean;
  branch: { _id: string; title: string };
  salary?: number;
  status: "active" | "inactive";
}
