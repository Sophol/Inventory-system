import { z } from "zod";

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageNumber: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});
export const CustomerSearchParamsSchema = PaginatedSearchParamsSchema.extend({
  isDepo: z.boolean().optional(),
});
export const ProductSearchParamsSchema = PaginatedSearchParamsSchema.extend({
  categoryId: z.string().optional(),
  branchId: z.string().optional(),
});
export const PurchaseSearchParamsSchema = PaginatedSearchParamsSchema.extend({
  supplierId: z.string().optional(),
  branchId: z.string().optional(),
  dateRange: z.string().optional(),
  customerId: z.string().optional(),
  orderStatus: z.string().optional(),
});
export const SaleSearchParamsSchema = PaginatedSearchParamsSchema.extend({
  customerId: z.string().optional(),
  branchId: z.string().optional(),
  dateRange: z.string().optional(),
});
export const ExpenseSearchParamsSchema = PaginatedSearchParamsSchema.extend({
  staffId: z.string().optional(),
  branchId: z.string().optional(),
  dateRange: z.string().optional(),
});
export const SignInSchema = z.object({
  email: z.string().min(1, { message: "Username is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password cannot exceed 100 characters." }),
});
export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username cannot exceed 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." }),
  // .regex(/[^a-zA-Z0-9]/, {
  //   message: "Password must contain at least one special character.",
  // }),
});
export const ProfileSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." }),
  image: z.string().optional(),
});
export const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." }),
  email: z.string().email({ message: "Please provide a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password cannot exceed 100 characters." }),
  role: z
    .enum(
      ["stock", "seller", "admin", "report", "branch", "user", "auditReport"],
      {
        required_error: "Role is required",
      }
    )
    .default("user"),
  image: z.string().optional(),
  phone: z.string().optional(),
  isStaff: z.boolean().default(false),
  branch: z.string().min(1, { message: "Branch ID is required." }),
  salary: z.number().default(0),
});
export const AccountSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  image: z.string().url({ message: "Please provide a valid URL." }).optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: "Password must contain at least one special character.",
    // })
    .optional(),
  provider: z.string().min(1, { message: "Provider is required." }),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required." }),
});
export const DeleteUserParamSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
});
export const SignInWithOAuthSchema = z.object({
  provider: z.enum(["google", "github"]),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required" }),
  user: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long." }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please provide a valid email address." }),
    image: z.string().url("Invalid Image url").optional(),
  }),
});
export const CreateCategorySchema = z.object({
  title: z.string().min(1, { message: "Title ID is required." }),
  status: z.string().min(1, { message: "Status is required." }),
});
export const EditCategorySchema = CreateCategorySchema.extend({
  categoryId: z.string().min(1, { message: "Category ID is required." }),
});
export const GetCategorySchema = z.object({
  categoryId: z.string().min(1, { message: "Category ID is required." }),
});
export const CreateUnitSchema = z.object({
  title: z.string().min(1, { message: "Title ID is required." }),
  status: z.string().min(1, { message: "Status is required." }),
});
export const EditUnitSchema = CreateUnitSchema.extend({
  unitId: z.string().min(1, { message: "Unit ID is required." }),
});
export const GetUnitSchema = z.object({
  unitId: z.string().min(1, { message: "Unit ID is required." }),
});
export const ProductUnitSchema = z.object({
  unit: z.string().min(1, { message: "Unit ID is required." }),
  qty: z.number().positive().min(1, { message: "Qty is required." }),
  cost: z.number().default(0),
  price: z.number().default(0),
  wholeSalePrice: z.number().default(0),
  level: z.number().int().positive().default(1),
});
export const CreateProductSchema = z.object({
  code: z.string().min(1, { message: "Code is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  image: z.string().optional(),
  units: z
    .array(ProductUnitSchema)
    .min(1, { message: "At least one Unit is required." })
    .max(3, { message: "Cannot add more than 3 Units." }),
  category: z.string().min(1, { message: "Category ID is required." }),
  qtyOnHand: z.number().default(0),
  alertQty: z.number().default(0),
  status: z.enum(["active", "inactive"]).default("active"),
});
export const EditProductSchema = CreateProductSchema.extend({
  productId: z.string().min(1, { message: "Unit ID is required." }),
});
export const GetProductSchema = z.object({
  productId: z.string().min(1, { message: "Unit ID is required." }),
});
export const CreateBranchSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});
export const EditBranchSchema = CreateBranchSchema.extend({
  branchId: z.string().min(1, { message: "Branch ID is required." }),
});
export const GetBranchSchema = z.object({
  branchId: z.string().min(1, { message: "Branch ID is required." }),
});
export const CreateCustomerSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  email: z.string().optional(),
  socialLink: z.string().url({ message: "Invalid URL" }).optional(),
  location: z.string().min(1, { message: "Location is required" }),
  description: z.string().optional(),
  balance: z.number().default(0),
  saleType: z.enum(["retail", "wholesale"]).default("retail"),
  status: z.enum(["active", "inactive"]).default("active"),
  isDepo: z.boolean().default(false),
  attachmentUrl: z.string().optional(),
  province: z.string().min(1, { message: "Name is required" }),
  gender: z.enum(["male", "female"]).default("male"),
  idNumber: z.string().optional(),
  idIssueDate: z.date().optional(),
  address: z.string().optional(),
  guarantor1: z.string().optional(),
  guarantor2: z.string().optional(),
  product_brand: z.string().optional(),
});
export const EditCustomerSchema = CreateCustomerSchema.extend({
  customerId: z.string().min(1, { message: "Customer ID is required." }),
});
export const GetCustomerSchema = z.object({
  customerId: z.string().min(1, { message: "Customer ID is required." }),
});
export const CreateSupplierSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().optional(),
  socialLink: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export const EditSupplierSchema = CreateSupplierSchema.extend({
  supplierId: z.string().min(1, "Supplier ID is required"),
});
export const GetSupplierSchema = z.object({
  supplierId: z.string().min(1, "Supplier ID is required"),
});
export const PurchaseDetailSchema = z.object({
  product: z.string().min(1, { message: "Product ID is required." }),
  unit: z.string().min(1, { message: "Unit ID is required." }),
  description: z.string().optional(),
  discount: z.number().min(0).default(0),
  qty: z.number().min(0).default(0),
  cost: z.number().min(0).default(0),
  total: z.number().min(0).default(0),
});
export const CreatePurchaseDetailSchema = PurchaseDetailSchema.extend({
  purchase: z.string().min(1, "Purchase ID is required"),
});
export const CreatePurchaseSchema = z.object({
  supplier: z.string().min(1, "Supplier is required"),
  branch: z.string().min(1, "Branch is required"),
  referenceNo: z.string().min(1, "Reference number is required"),
  customer: z.string().optional(),
  description: z.string().optional(),
  purchaseDate: z.date(),
  discount: z.number().min(0).default(0),
  subtotal: z.number().min(0).default(0),
  grandtotal: z.number().min(0).default(0),
  paid: z.number().min(0).default(0),
  balance: z.number().min(0).default(0),
  exchangeRateD: z.number().min(0).default(0),
  exchangeRateT: z.number().min(0).default(0),
  deliveryIn: z.number().min(0).default(0),
  deliveryOut: z.number().min(0).default(0),
  shippingFee: z.number().min(0).default(0),
  serviceFee: z.number().min(0).default(0),
  paidBy: z.enum(["Cash", "ABA Bank", "ACLEDA Bank", "Others"]).optional(),
  orderStatus: z.enum(["pending", "approved", "completed"]).default("pending"),
  paymentStatus: z.enum(["pending", "credit", "completed"]).default("pending"),
  purchaseDetails: z
    .array(PurchaseDetailSchema)
    .min(1, { message: "At least one Unit is required." }),
});

export const EditPurchaseSchema = CreatePurchaseSchema.extend({
  purchaseId: z.string().min(1, "Purchase ID is required"),
});
export const GetPurchaseSchema = z.object({
  purchaseId: z.string().min(1, "Purchase ID is required"),
});
export const ApprovedPurchaseSchema = z.object({
  purchaseId: z.string().min(1, "Purchase ID is required"),
});

export const GetSettingSchema = z.object({
  settingId: z.string().min(1, "Setting ID is required"),
});

export const EditSettingSchema = z.object({
  settingId: z.string().min(1, "Setting ID is required"),
  companyName: z.string().min(1, "Company Name is required"),
  companyNameEnglish: z.string().min(1, "Company Name In English is required"),
  companyLogo: z.string().min(1, "Company Logo is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  companyOwner: z.string().min(1, "companyOwner is required"),
  vat_number: z.string().min(1, "vat_number is required"),
  exchangeRateD: z.number().min(0).default(0),
  exchangeRateT: z.number().min(0).default(0),
  bankAccount: z.string().min(1, "bankAccount is required"),
  bankName: z.string().min(1, "bankName is required"),
  bankNumber: z.string().min(1, "bankNumber is required"),
});

export const SaleDetailSchema = z.object({
  product: z.string().min(1, { message: "Product ID is required." }),
  unit: z.string().min(1, { message: "Unit ID is required." }),
  description: z.string().optional(),
  discount: z.number().min(0).default(0),
  qty: z.number().min(0).default(0),
  cost: z.number().min(0).default(0),
  price: z.number().min(0).default(0),
  totalCost: z.number().min(0).default(0),
  totalPrice: z.number().min(0).default(0),
});
export const CreateSaleDetailSchema = SaleDetailSchema.extend({
  sale: z.string().min(1, "Sale ID is required"),
});
export const CreateSaleSchema = z.object({
  customer: z.string().min(1, "Customer is required"),
  branch: z.string().min(1, "Branch is required"),
  seller: z.string().optional(),
  referenceNo: z.string().min(1, "Reference number is required"),
  description: z.string().optional(),
  orderDate: z.date(),
  dueDate: z.date().optional(),
  approvedDate: z.date(),
  invoicedDate: z.date(),
  tax: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  subtotal: z.number().min(0).default(0),
  delivery: z.number().min(0).default(0),
  grandtotal: z.number().min(0).default(0),
  paid: z.number().min(0).default(0),
  balance: z.number().min(0).default(0),
  exchangeRateD: z.number().min(0).default(0),
  exchangeRateT: z.number().min(0).default(0),
  paidBy: z
    .enum([
      "Cash",
      "ABA Bank",
      "ACLEDA Bank",
      "Sathapna Bank",
      "Vatanak Bank",
      "Others",
    ])
    .optional(),
  orderStatus: z
    .enum(["pending", "approved", "completed", "void"])
    .default("pending"),
  paymentStatus: z.enum(["pending", "credit", "completed"]).default("pending"),
  saleType: z.enum(["retail", "wholesale"]).default("retail"),
  saleDetails: z
    .array(SaleDetailSchema)
    .min(1, { message: "At least one Unit is required." }),
  isLogo: z.string().default("true"),
});

export const EditSaleSchema = CreateSaleSchema.extend({
  saleId: z.string().min(1, "Sale ID is required"),
});
export const GetSaleSchema = z.object({
  saleId: z.string().min(1, "Sale ID is required"),
});
export const ApprovedInvoiceSchema = z.object({
  saleId: z.string().min(1, "Sale ID is required"),
  dueDate: z.date(),
});

export const CreateSalarySchema = z.object({
  staffId: z.string().min(1, { message: "Staff ID is required." }),
  branch: z.string().min(1, { message: "Branch ID is required." }),
  description: z.string().optional(),
  salaryDate: z.date().default(() => new Date()),
  salary: z.number().min(0).default(0),
  allowance: z.number().min(0).default(0),
  deduction: z.number().min(0).default(0),
  exchangeRateD: z.number().min(0).default(0),
  exchangeRateT: z.number().min(0).default(0),
  netSalary: z.number().min(0).default(0),
});

export const EditSalarySchema = CreateSalarySchema.extend({
  salaryId: z.string().min(1, "Salary ID is required"),
});
export const GetSalarySchema = z.object({
  salaryId: z.string().min(1, "Salary  ID is required"),
});

export const CreateMissionSchema = z.object({
  staffName: z.string().min(1, { message: "Staff Name is required." }),
  branch: z.string().min(1, { message: "Branch ID is required." }),
  description: z.string().optional(),
  missionDate: z.date().default(new Date()),
  amount: z.number().min(0).default(0),
  exchangeRateD: z.number().min(0).default(0),
  exchangeRateT: z.number().min(0).default(0),
});

export const EditMissionSchema = CreateMissionSchema.extend({
  missionId: z.string().min(1, "Mission ID is required"),
});

export const GetMissionSchema = z.object({
  missionId: z.string().min(1, "Mission ID is required"),
});
export const CreateGeneralExpSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  branch: z.string().min(1, { message: "Branch ID is required." }),
  description: z.string().optional(),
  generalDate: z.date(),
  amount: z.number().min(0).default(0),
  exchangeRateD: z.number().min(0).default(0),
  exchangeRateT: z.number().min(0).default(0),
});

export const EditGeneralExpSchema = CreateGeneralExpSchema.extend({
  generalExpId: z.string().min(1, "General ID is required"),
});

export const GetGeneralExpSchema = z.object({
  generalExpId: z.string().min(1, "General ID is required"),
});

export const CreatePaymentSchema = z
  .object({
    sale: z.string().min(1, "Sale is required"),
    customer: z.string().min(1, "Customer is required"),
    branch: z.string().min(1, "Branch is required"),
    referenceNo: z.string().min(1, "Reference number is required"),
    description: z.string().optional(),
    paymentDate: z.date().default(new Date()),
    creditAmount: z.number().min(0, "Credit amount must be a positive number"),
    paidAmount: z.number().min(0.01, "Paid amount must be a positive number"),
    balance: z.number().min(0, "Balance must be a positive number"),
    paidBy: z.enum([
      "Cash",
      "ABA Bank",
      "ACLEDA Bank",
      "Sathapna Bank",
      "Vatanak Bank",
      "Others",
    ]),
    paymentStatus: z.enum(["pending", "credit", "completed"]),
  })
  .refine((data) => data.paidAmount <= data.creditAmount, {
    message: "Paid amount cannot be higher than credit amount",
    path: ["paidAmount"], // Path of the error
  });
export const GetPaymentSchema = z.object({
  saleId: z.string().min(1, { message: "Payment ID is required." }),
});
export const PaginatedSearchParamsInvoiceSchema =
  PaginatedSearchParamsSchema.extend({
    orderStatus: z.enum(["pending", "approved", "completed"]),
  });
export const PaginatedSearchParamsPaymentSchema =
  PaginatedSearchParamsSchema.extend({
    sale: z.string(),
  });
export const SearchAllExpenseSchema = z.object({
  searchMonth: z.string().min(1, { message: "Month is required." }),
  searchYear: z.number().min(1, { message: "Year is required." }),
});
export const SearchAnnualSummarySchema = z.object({
  searchYear: z.number().min(1, { message: "Year is required." }),
});
export const generateSerialNumberSchema = z.object({
  companyCode: z.string().min(2, { message: "Company code is required." }),
  productCode: z.string().min(2, { message: "Product code is required." }),
  productName: z.string().min(1, { message: "Product name is required." }),
  count: z.number().min(1, { message: "Count must be at least 1." }),
});

export const ProductQRSearchParamsSchema = PaginatedSearchParamsSchema.extend({
  is_print: z.boolean().optional(),
  status: z.number().optional(),
  generated_year: z.number().optional(),
});
