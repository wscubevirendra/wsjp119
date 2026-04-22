import { getBrands } from "@/api/api-call";
import { FiEdit, FiPlus } from "react-icons/fi";
import Link from "next/link";
import StatusBtn from "@/components/admin/StatusBtn";
import DeleteBtn from "@/components/admin/DeleteBtn";


export default async function Category() {
  let brands = [];
  let meta = {};

  try {
    const res = await getBrands();
    brands = res.data;
    meta = res.meta;
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Brand Management</h2>

        <Link href="/admin/brand/add">
          <button className="flex items-center gap-2 bg-[#ff7b00] text-white px-5 py-2 rounded-xl hover:opacity-90 transition font-semibold">
            <FiPlus size={18} />
            Add Brand
          </button>
        </Link>
      </div>

      {/* EMPTY STATE */}
      {brands.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-medium">No Brand Found</p>
          <p className="text-sm">Start by adding a new category</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl ">
          <table className="w-full text-sm">
            {/* TABLE HEAD */}
            <thead className="bg-gray-100 text-gray-600 sticky top-0">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Slug</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            {/* TABLE BODY */}
            <tbody>
              {brands.map((brand) => (
                <tr
                  key={brand._id}
                  className=" hover:bg-orange-50 transition"
                >
                  {/* IMAGE */}
                  <td className="p-4">
                    <img
                      className=" rounded-lg"
                      src={`${meta.imageBaseUrl}${brand.image}`}
                      width={30}
                      height={30}
                      alt={brand.name}
                    />
                  </td>

                  {/* NAME */}
                  <td className="p-4 font-medium text-gray-800">
                    {brand.name}
                  </td>

                  {/* SLUG */}
                  <td className="p-4 text-gray-500">
                    {brand.slug}
                  </td>

                  {/* STATUS GROUP */}
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <StatusBtn value={brand.status} id={brand._id} field="status" />
                      <StatusBtn value={brand.is_home} id={brand._id} field="is_home" />
                      <StatusBtn value={brand.is_top} id={brand._id} field="is_top" />
                      <StatusBtn value={brand.is_best} id={brand._id} field="is_best" />
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/brand/edit/${brand._id}`}>
                        <button className="p-2 rounded-lg bg-orange-100 text-[#ff7b00] hover:bg-orange-200 transition">
                          <FiEdit size={16} />
                        </button>
                      </Link>

                      <DeleteBtn API={`brand/delete/${brand._id}`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}