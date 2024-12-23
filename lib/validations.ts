import { Types } from "mongoose";
import { z } from "zod";

export const ObjectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });
export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageNumber: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});
export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "please provide a valid email adress." }),
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
export const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." }),
  email: z.string().email({ message: "Please provide a valid email address." }),
  role: z.string().email({ message: "Please provide a valid role." }),
  image: z.string().url({ message: "Please provide a valid URL." }).optional(),
  phone: z.string().optional(),
  isStaff: z.boolean().optional(),
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
const ProductUnitSchema = z.object({
  unit: z.string().min(1, { message: "Unit ID is required." }),
  qty: z.number().default(0),
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
  category: ObjectIdSchema,
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
