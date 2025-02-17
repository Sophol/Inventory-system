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
interface CustomerSearchParams extends PaginatedSearchParams {
  isDepo?: boolean;
}
interface ProductSearchParams extends PaginatedSearchParams {
  categoryId?: string;
  branchId?: string;
}
interface PurchaseSearchParams extends PaginatedSearchParams {
  supplierId?: string;
  branchId?: string;
  dateRange?: string;
  customerId?: string;
}
interface SaleSearchParams extends PaginatedSearchParams {
  customerId?: string;
  branchId?: string;
  dateRange?: string;
}
interface ExpenseSearchParams extends PaginatedSearchParams {
  staffId?: string;
  branchId?: string;
  dateRange?: string;
}

interface PaginatedSearchParamsInvoice {
  orderStatus?: "pending" | "approved" | "completed";
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}

interface PaginatedSearchParamsPayment {
  sale: string;
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
  qtySmallUnit?: number;
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
  isDepo: boolean;
  attachmentUrl?: string;
  province?: string;
  idNumber?: string;
  idIssueDate?: Date;
  address?: string;
  guarantor1?: string;
  guarantor2?: string;
  product_brand?: string;
  gender: "male" | "female";
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
  supplier: { _id: string; title: string; phone?: string };
  branch: { _id: string; title: string };
  customer?: { _id: string; title: string };
  referenceNo: string;
  description?: string;
  purchaseDate: string;
  discount: number;
  subtotal: number;
  grandtotal: number;
  paid: number;
  balance: number;
  deliveryIn: number;
  deliveryOut: number;
  shippingFee: number;
  serviceFee: number;
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
  discount?: number;
  qty?: number;
  cost?: number;
  price?: number;
  totalCost: number;
  totalPrice: number;
  exchangeRateD?: number;
  exchangeRateT?: number;
}

interface Sale {
  _id: string;
  customer: { _id: string; title: string };
  branch: { _id: string; title: string };
  seller: { _id: string; title: string };
  referenceNo: string;
  description?: string;
  orderDate: string;
  approvedDate: string;
  dueDate?: Date;
  invoicedDate: string;
  discount: number;
  subtotal: number;
  delivery: number;
  grandtotal: number;
  paid: number;
  balance: number;
  exchangeRateD?: number;
  exchangeRateT?: number;
  tax: number;
  isLogo: string;
  paidBy?:
    | "Cash"
    | "ABA Bank"
    | "ACLEDA Bank"
    | "Sathapna Bank"
    | "Vatanak Bank"
    | "Others";
  orderStatus: "pending" | "approved" | "completed" | "void";
  paymentStatus: "pending" | "credit" | "completed";
  saleType?: "retail" | "wholesale";
  saleDetails: saleDetail[];
  sellerName?: string;
}
interface SaleComplete {
  _id: string;
  customer: { _id: string; name: string };
  branch: { _id: string; title: string };
  seller: { _id: string; title: string };
  referenceNo: string;
  description?: string;
  orderDate: string;
  approvedDate: string;
  dueDate?: Date;
  invoicedDate: string;
  discount: number;
  subtotal: number;
  delivery: number;
  grandtotal: number;
  paid: number;
  balance: number;
  exchangeRateD?: number;
  exchangeRateT?: number;
  tax: number;
  isLogo: string;
  paidBy?:
    | "Cash"
    | "ABA Bank"
    | "ACLEDA Bank"
    | "Sathapna Bank"
    | "Vatanak Bank"
    | "Others";
  orderStatus: "pending" | "approved" | "completed" | "void";
  paymentStatus: "pending" | "credit" | "completed";
  saleType?: "retail" | "wholesale";
  saleDetails: saleDetail[];
  sellerName?: string;
}
interface Setting {
  _id: string;
  companyName: string;
  companyNameEnglish: string;
  companyLogo: string;
  address: string;
  phone: string;
  companyOwner: string;
  vat_number: string;
  exchangeRateD: number;
  exchangeRateT: number;
  bankName: string;
  bankAccount: string;
  bankNumber: string;
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

interface Salary {
  _id: Types.ObjectId;
  staffId: Types.ObjectId;
  branch: Types.ObjectId;
  description?: string;
  salaryDate: Date;
  salary: number;
  allowance: number;
  deduction: number;
  exchangeRateD: number;
  exchangeRateT: number;
  netSalary: number;
  createdAt: Date;
  updatedAt: Date;
}
interface Mission {
  _id: string;
  staffName: string;
  branch: Types.ObjectId;
  description?: string;
  missionDate: Date | string;
  amount?: number;
  exchangeRateD?: number;
  exchangeRateT?: number;
}
interface GeneralExp {
  _id: string;
  title: string;
  branch: Types.ObjectId;
  description?: string;
  generalDate: Date | string;
  amount?: number;
  exchangeRateD?: number;
  exchangeRateT?: number;
}
interface Payment {
  _id: string;
  customer: string;
  branch: string;
  sale: string;
  referenceNo: string;
  paymentDate: string;
  creditAmount: number;
  paidAmount: number;
  balance: number;
  description?: string;
  paidBy:
    | "Cash"
    | "ABA Bank"
    | "ACLEDA Bank"
    | "Sathapna Bank"
    | "Vatanak Bank"
    | "Others";
  paymentStatus: "pending" | "credit" | "completed";
}
interface AnnualSummary {
  month: string;
  sale: number;
  purchase: number;
  profit: number;
}
interface AnnualSummaryByYear {
  year: string;
  sale: number;
  purchase: number;
  profit: number;
}
