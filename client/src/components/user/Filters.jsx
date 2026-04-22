import CategoryFilter from "./CategoryFilter";
import BrandFilter from "./BrandFilter";
import ColorFilter from "./ColorFilter";
import PriceFilter from "./PriceFilter";
import React from "react";
import { getBrands, getcategories, getColors } from "@/api/api-call";

const Filters = async () => {
  const [category_response, color_response, brand_response] = await Promise.all([
    getcategories({ status: true }),
    getColors(),
    getBrands({ status: true })
  ]);

  const categories = category_response.data || [];
  const colors = color_response.data || [];
  const brands = brand_response.data || [];

  console.log(color_response.data)
  return (
    <aside className="text-sm space-y-8 sticky top-20">

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>

        <button className="text-xs text-blue-600 hover:underline">
          Clear All
        </button>
      </div>

      <CategoryFilter categories={categories} />
      <PriceFilter />
      <ColorFilter colors={colors} />
      <BrandFilter brands={brands} />

    </aside>
  );
};

export default Filters;