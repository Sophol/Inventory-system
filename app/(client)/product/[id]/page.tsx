import { assets } from "@/assets/assets";
import Image from "next/image";
import React from "react";
import {
  getProductClient,
  getProductClients,
} from "@/lib/actions/product.action";
import { notFound, redirect } from "next/navigation";
import DataRenderer from "@/components/DataRenderer";
import ProductCard from "@/components/clients/ProductCard";
import { PRODUCT_EMPTY } from "@/constants/states";
import { getSetting } from "@/lib/actions/setting.action";
import { FaFacebookSquare, FaMapMarkerAlt, FaMobileAlt } from "react-icons/fa";
import Link from "next/link";

const ProductDetail = async ({ params }: RouteParams) => {
  const { id } = await params;
  const { data: product, success } = await getProductClient({ productId: id });

  if (!success || !product) return redirect("/404");
  const mainImage = product.product_images?.[0] ?? "/default-image.png";
  const {
    success: relatedProductSuccess,
    data,
    error: relatedProductError,
  } = await getProductClients({
    page: 1,
    pageSize: 10,
    categoryId: product.category || "",
  });
  const { products } = data || {};
  const { success: successSetting, data: setting } = await getSetting({
    settingId: process.env.SETTING_ID as string,
  });
  if (!successSetting) return notFound();
  if (!setting) return notFound();
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
            {/* <table className="table-auto border-collapse w-full max-w-72">
              <tbody>
                <tr>
                  <td className="text-gray-600 font-medium">Phone 1</td>
                  <td className="text-gray-800/50 ">Generic</td>
                </tr>
                <tr>
                  <td className="text-gray-600 font-medium">Color</td>
                  <td className="text-gray-800/50 ">Multi</td>
                </tr>
                <tr>
                  <td className="text-gray-600 font-medium">Category</td>
                  <td className="text-gray-800/50">{product.categoryTitle}</td>
                </tr>
              </tbody>
            </table> */}
            <div className="text-sm space-y-2">
              <p className="flex items-start text-gray-600">
                <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0" />
                {setting.address}
              </p>
              <p className="flex items-center text-gray-600">
                <FaMobileAlt className="mr-2" /> {setting.phone}
              </p>
              <p className="flex items-center text-gray-600">
                <FaMobileAlt className="mr-2" /> {setting.phone1}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <div className="text-sm flex flex-row gap-2">
              <Link target="_blank" href={setting.facebook}>
                <FaFacebookSquare className="text-blue-600 size-11" />
              </Link>
              <Link target="_blank" href={setting.telegram}>
                <Image
                  className="h-10 w-10"
                  src={assets.telegram}
                  alt="star_icon"
                />
              </Link>
            </div>
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
