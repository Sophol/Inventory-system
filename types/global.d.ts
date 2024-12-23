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
  globalFilter: any;
}
interface SelectData {
  _id: string;
  title: string;
  status: string;
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
  product: any;
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
