import { getColors } from "@/api/api-call";
import { FiEdit, FiPlus } from "react-icons/fi";
import Link from "next/link";
import StatusBtn from "@/components/admin/StatusBtn";
import DeleteBtn from "@/components/admin/DeleteBtn";


export default async function Category() {
  let colors = [];
  let meta = {};
  try {
    const res = await getColors();
    colors = res.data;
    meta = res.meta;
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Color Management</h2>

        <Link href="/admin/color/add">
          <button className="flex items-center gap-2 bg-[#ff7b00] text-white px-5 py-2 rounded-xl hover:opacity-90 transition font-semibold">
            <FiPlus size={18} />
            Add Colors
          </button>
        </Link>
      </div>

      {/* EMPTY STATE */}
      {colors.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-medium">No Colors Found</p>
          <p className="text-sm">Start by adding a new color</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl ">
          <table className="w-full text-sm">
            {/* TABLE HEAD */}
            <thead className="bg-gray-100 text-gray-600 sticky top-0">
              <tr>
                <th className="p-4 text-left">Color</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Slug</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            {/* TABLE BODY */}
            <tbody>
              {colors.map((color) => (
                <tr
                  key={color._id}
                  className=" hover:bg-orange-50 transition"
                >
                  {/* IMAGE */}
                  <td className="p-4">
                    <div style={{
                      background:color.color_code
                    }} className={`w-15 text-white rounded-xl  h-6`}>{color.color_code}</div>
                  </td>

                  {/* NAME */}
                  <td className="p-4 font-medium text-gray-800">
                    {color.name}
                  </td>

                  {/* SLUG */}
                  <td className="p-4 text-gray-500">
                    {color.slug}
                  </td>

                  {/* STATUS GROUP */}
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <StatusBtn value={color.status} id={color._id} field="status" />
                  
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/color/edit/${color._id}`}>
                        <button className="p-2 rounded-lg bg-orange-100 text-[#ff7b00] hover:bg-orange-200 transition">
                          <FiEdit size={16} />
                        </button>
                      </Link>


                      <DeleteBtn id={color._id} />
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