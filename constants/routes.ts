const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  CATEGORIES: "/inventories/category",
  ADDCATEGORY: "/inventories/category/form",
  PROFILE: (_id: string) => `/profile/${_id}`,
  CATEGORY: (_id: string) => `/inventories/category/${_id}`,
};
export default ROUTES;
