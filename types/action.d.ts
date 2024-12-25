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
