const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  PROFILE: (_id: string) => `/profile/${_id}`,
  CATEGORIES: "/inventories/category",
  ADDCATEGORY: "/inventories/category/form",
  CATEGORY: (_id: string) => `/inventories/category/${_id}`,
  UNITS: "/inventories/unit",
  ADDUNIT: "/inventories/unit/form",
  UNIT: (_id: string) => `/inventories/unit/${_id}`,
  PRODUCTS: "/inventories/product",
  ADDPRODUCT: "/inventories/product/form",
  PRODUCT: (_id: string) => `/inventories/product/${_id}`,
  PRODUCTDETAIL: (_id: string) => `/inventories/product/detail/${_id}`,
};
export default ROUTES;
