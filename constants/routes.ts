const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  CATEGORIES: "/inventories/category",
  ADDCATEGORY: "/inventories/category/form",
  PROFILE: (_id: string) => `/profile/${_id}`,
};
export default ROUTES;
