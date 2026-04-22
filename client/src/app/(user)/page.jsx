import Link from "next/link";
import {
  FiMonitor,
  FiCpu,
  FiSmartphone,
  FiTablet,
  FiCamera,
} from "react-icons/fi";
import HeroBanner from "@/components/user/HeroBanner";
import { getcategories } from "@/api/api-call";


export default async function home() {
  const category_response = await getcategories({ limit: 5, is_home: true, status: true });
  const imageUrl = category_response?.meta?.imageBaseUrl;
  const categories = category_response?.data || []

  return (
    <div className=" max-w-7xl mx-auto">
      <div className="grid grid-cols-1 max-w-7xl mx-auto lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-4">Category</h3>

          <ul className="space-y-3">
            {categories?.map((cat, index) => (
              <Link href={`/products/${cat.slug}`} key={index}>
                <li className="flex items-center mt-4 justify-between px-4 py-3 rounded-lg border hover:border-teal-500 transition cursor-pointer">

                  <div className="flex items-center gap-3">
                    {/* Image */}
                    <img
                      className="w-5 h-5 rounded-md"
                      src={imageUrl + cat.image}
                      alt={cat.name}
                    />

                    {/* Name */}
                    <Link href={`/products/${cat.slug}`} className="flex items-center gap-3">
                      <span className="text-sm font-medium">{cat.name}</span>

                    </Link>
                  </div>

                  {/* Count */}
                  <span className="text-xs bg-teal-100 text-teal-600 w-6 h-6 flex items-center justify-center rounded-full">
                    {cat.count || 0}
                  </span>
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <HeroBanner />

      </div>



    </div>

  );
}