import { assets } from "@/assets/assets";
import Image from "next/image";
import React from "react";
import { getProduct, getProducts } from "@/lib/actions/product.action";
import { redirect } from "next/navigation";
import DataRenderer from "@/components/DataRenderer";
import ProductCard from "@/components/clients/ProductCard";
import { PRODUCT_EMPTY } from "@/constants/states";

const ProductDetail = async ({ params }: RouteParams) => {
  const { id } = await params;
  const { data: product, success } = await getProduct({ productId: id });

  if (!success || !product) return redirect("/404");
  const mainImage = product.product_images?.[0] ?? "/default-image.png";
  const {
    success: relatedProductSuccess,
    data,
    error: relatedProductError,
  } = await getProducts({
    page: 1,
    pageSize: 10,
    categoryId: product.category || "",
  });
  const { products } = data || {};
  return (
    <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="px-5 lg:px-16 xl:px-20">
          <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
            <Image
              src={mainImage}
              alt="alt"
              className="w-full h-auto object-cover mix-blend-multiply"
              width={1280}
              height={720}
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            {product.product_images?.map((image, index) => (
              <div
                key={index}
                className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
              >
                <Image
                  src={image}
                  alt="alt"
                  className="w-full h-auto object-cover mix-blend-multiply"
                  width={1280}
                  height={720}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
            {product.title}
          </h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Image
                className="h-4 w-4"
                src={assets.star_icon}
                alt="star_icon"
              />
              <Image
                className="h-4 w-4"
                src={assets.star_icon}
                alt="star_icon"
              />
              <Image
                className="h-4 w-4"
                src={assets.star_icon}
                alt="star_icon"
              />
              <Image
                className="h-4 w-4"
                src={assets.star_icon}
                alt="star_icon"
              />
              <Image
                className="h-4 w-4"
                src={assets.star_dull_icon}
                alt="star_dull_icon"
              />
            </div>
            <p>(4.5)</p>
          </div>
          <p className="text-gray-600 mt-3">{product.description}</p>
          <p className="text-3xl font-medium mt-6">
            ${product.units?.[0]?.price?.toFixed(2) ?? "N/A"}
            {/* <span className="text-base font-normal text-gray-800/60 line-through ml-2">
             
            </span> */}
          </p>
          <hr className="bg-gray-600 my-6" />
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse w-full max-w-72">
              <tbody>
                {/* <tr>
                  <td className="text-gray-600 font-medium">Brand</td>
                  <td className="text-gray-800/50 ">Generic</td>
                </tr>
                <tr>
                  <td className="text-gray-600 font-medium">Color</td>
                  <td className="text-gray-800/50 ">Multi</td>
                </tr> */}
                <tr>
                  <td className="text-gray-600 font-medium">Category</td>
                  <td className="text-gray-800/50">{product.categoryTitle}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center mt-10 gap-4">
            <button className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition">
              Add to Cart
            </button>
            <button className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition">
              Buy now
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center mb-4 mt-16">
          <p className="text-3xl font-medium">
            Related{" "}
            <span className="font-medium text-orange-600">Products</span>
          </p>
          <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
          <DataRenderer
            data={products}
            error={relatedProductError}
            success={relatedProductSuccess}
            empty={PRODUCT_EMPTY}
            render={(products) =>
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
