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
  CUSTOMERS: "/sales/customer",
  ADDCUSTOMER: "/sales/customer/form",
  CUSTOMER: (_id: string) => `/sales/customer/${_id}`,
  SUPPLIERS: "/purchases/supplier",
  ADDSUPPLIER: "/purchases/supplier/form",
  SUPPLIER: (_id: string) => `/purchases/supplier/${_id}`,
  BRANCHES: "/settings/branch",
  ADDBRANCH: "/settings/branch/form",
  BRANCH: (_id: string) => `/settings/branch/${_id}`,
  PURCHASES: "/purchases/order",
  ADDPURCHASE: "/purchases/order/form",
  PURCHASE: (_id: string) => `/purchases/order/${_id}`,
  USERS: "/settings/user",
  ADDUSER: "/settings/user/form",
  USER: (_id: string) => `/settings/user/${_id}`,
  SETTING: (_id: string) => `/settings/setting/${_id}`,

  SALES: "/sales/order",
  SALEPENDINGS: "/sales/pending",
  ADDSALE: "/sales/pending/form",
  SALE: (_id: string) => `/sales/order/${_id}`,
  APPROVEDSALES: "/sales/approved",
  APPROVEDSALE: (_id: string) => `/sales/approved/${_id}`,
  ADDINVOICE: "/sales/invoice/form",
  INVOICES: "/sales/invoice",
  APPROVEDINVOICE: (_id: string) => `/sales/approved/addInvoice/${_id}`,
  INVOICE: (_id: string) => `/sales/invoice/${_id}`,

  GENERALEXPS: "/expenses/general",
  ADDGENERALEXP: "/expenses/general/form",
  GENERALEXP: (_id: string) => `/expenses/general/${_id}`,

  MISSIONEXPS: "/expenses/mission",
  ADDMISSIONEXP: "/expenses/mission/form",
  MISSIONEXP: (_id: string) => `/expenses/mission/${_id}`,

  SALARYEXPS: "/expenses/salary",
  ADDSALARYEXP: "/expenses/salary/form",
  SALARYEXP: (_id: string) => `/expenses/salary/${_id}`,

  PRODUCTREPORT: "/reports/product",
  PURCHASEREPORT: "/reports/purchase",
  SALEREPORT: "/reports/sale",
  PROFITREPORT: "/reports/profit",
};
export default ROUTES;
