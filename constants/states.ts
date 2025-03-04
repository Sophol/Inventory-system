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
export const DEFAULT_UNAUTHORIZED = {
  title: "Oops! Unauthorized",
  message: "Please login other user to access this page.",
  button: {
    text: "Login",
    href: ROUTES.SIGN_IN,
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
export const PURCHASE_EMPTY = {
  title: "No Purchase Found",
  message:
    "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    text: "Add Purchase",
    href: ROUTES.ADDPURCHASE,
  },
};
export const USER_EMPTY = {
  title: "No User Found",
  message:
    "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    text: "Add User",
    href: ROUTES.ADDUSER,
  },
};
export const SALE_EMPTY = {
  title: "No SALE Found",
  message:
    "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    text: "Add SALE",
    href: ROUTES.ADDSALE,
  },
};
export const SALARY_EMPTY = {
  title: "No SALARY Found",
  message:
    "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    text: "Add Salary",
    href: ROUTES.ADDSALARYEXP,
  },
};
export const MISSION_EMPTY = {
  title: "No MISSION Found",
  message:
    "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    text: "Add Mission",
    href: ROUTES.ADDMISSIONEXP,
  },
};
export const GENERALEXP_EMPTY = {
  title: "No GeneralExp Found",
  message:
    "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    text: "Add GeneralExp",
    href: ROUTES.ADDGENERALEXP,
  },
};
