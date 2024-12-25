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
export const PRODUCT_EMPTY = {
  title: "No Product Found",
  message:
    "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    text: "Add Product",
    href: ROUTES.ADDPRODUCT,
  },
};
export const CUSTOMER_EMPTY = {
  title: "No Customer Found",
  message:
    "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    text: "Add Customer",
    href: ROUTES.ADDCUSTOMER,
  },
};
export const SUPPLIER_EMPTY = {
  title: "No Supplier Found",
  message:
    "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    text: "Add Supplier",
    href: ROUTES.ADDSUPPLIER,
  },
};
export const BRANCH_EMPTY = {
  title: "No Branch Found",
  message:
    "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    text: "Add Branch",
    href: ROUTES.ADDBRANCH,
  },
};
