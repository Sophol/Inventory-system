import ROUTES from "./routes";

export const DEFAULT_EMPTY = {
  title: "No Data Found",
  message:
    "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    text: "Add Data",
    href: ROUTES.HOME,
  },
};

export const DEFAULT_ERROR = {
  title: "Something Went Wrong",
  message: "Even our code can have a bad day. Give it another shot.",
  button: {
    text: "Retry Request",
    href: ROUTES.HOME,
  },
};
export const CATEGORY_EMPTY = {
  title: "No Category Found",
  message:
    "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    text: "Add Category",
    href: ROUTES.ADDCATEGORY,
  },
};
export const UNIT_EMPTY = {
  title: "No Unit Found",
  message:
    "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    text: "Add Unit",
    href: ROUTES.ADDUNIT,
  },
};
export const UNIT_PRODUCT = {
  title: "No Product Found",
  message:
    "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    text: "Add Product",
    href: ROUTES.ADDPRODUCT,
  },
};
