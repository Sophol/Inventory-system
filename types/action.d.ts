interface SignInWithOAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: {
    name: string;
    username: string;
    image: string;
  };
}
interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}
interface CreateCategoryParams {
  title: string;
  status: string;
}

interface EditCategoryParams extends CreateCategoryParams {
  categoryId: string;
}
interface GetCategoryParams {
  categoryId: string;
}
interface CreateUnitParams {
  title: string;
  status: string;
}

interface EditUnitParams extends CreateUnitParams {
  unitId: string;
}
interface GetUnitParams {
  unitId: string;
}
interface ProductUnitParams {
  unit: string;
  qty: number;
  cost: number;
  price: number;
  wholeSalePrice: number;
  level: number;
}
interface CreateProductParams {
  code: string;
  title: string;
  description?: string;
  image?: string;
  units: ProductUnitParams[];
  category: string;
  qtyOnHand: number;
  alertQty: number;
  status: "active" | "inactive";
}
interface EditProductParams extends CreateProductParams {
  productId: string;
}
interface GetProductParams {
  productId: string;
}
interface CreateBranchParams {
  title: string;
  phone: string;
  location: string;
  description?: string;
  status: "active" | "inactive";
}
interface EditBranchParams extends CreateBranchParams {
  branchId: string;
}
interface GetBranchParams {
  branchId: string;
}
interface CreateCustomerParams {
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
interface EditCustomerParams extends CreateCustomerParams {
  customerId: string;
}
interface GetCustomerParams {
  customerId: string;
}
interface CreateSupplierParams {
  companyName: string;
  name: string;
  phone: string;
  email?: string;
  socialLink?: string;
  location: string;
  description?: string;
  status: "active" | "inactive";
}

interface EditSupplierParams extends CreateSupplierParams {
  supplierId: string;
}

interface GetSupplierParams {
  supplierId: string;
}
interface PurchaseDetailParams {
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

interface CreatePurchaseParams {
  supplier: string;
  branch: string;
  referenceNo: string;
  description?: string;
  purchaseDate?: Date | string;
  discount?: number;
  subtotal?: number;
  grandtotal?: number;
  paid?: number;
  balance?: number;
  exchangeRateD?: number;
  exchangeRateT?: number;
  paidBy?: "Cash" | "ABA Bank" | "ACLEDA Bank" | "Others";
  orderStatus?: "pending" | "approved" | "completed";
  paymentStatus?: "pending" | "credit" | "completed";
  purchaseDetails: PurchaseDetailParams[];
}

interface EditPurchaseParams extends CreatePurchaseParams {
  purchaseId: string;
}
interface GetPurchaseParams {
  purchaseId: string;
}

interface GetSettingParams {
  settingId: string;
}

interface EditSettingParams {
  settingId: string;
  companyName: string;
  companyLogo: string;
  address: string;
  phone: string;
  exchangeRateD: number;
  exchangeRateT: number;
}

interface SaleDetailParams {
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

interface CreateSaleParams {
  customer: string;
  branch: string;
  referenceNo: string;
  description?: string;
  saleDate?: Date | string;
  discount?: number;
  subtotal?: number;
  grandtotal?: number;
  paid?: number;
  balance?: number;
  exchangeRateD?: number;
  exchangeRateT?: number;
  paidBy?: "Cash" | "ABA Bank" | "ACLEDA Bank" | "Others";
  orderStatus?: "pending" | "approved" | "completed";
  paymentStatus?: "pending" | "credit" | "completed";
  saleDetails: SaleDetailParams[];
}

interface EditSaleParams extends CreateSaleParams {
  saleId: string;
}
interface GetSaleParams {
  saleId: string;
}

interface CreatePaymentParams {
  customer: string;
  branch: string;
  referenceNo: string;
  description?: string;
  paymentDate?: Date | string;
  creditAmount?: number;
  paidAmount?: number;
  balance?: number;
  paidBy?: "Cash" | "ABA Bank" | "ACLEDA Bank" | "Others";
  paymentStatus?: "pending" | "credit" | "completed";
}