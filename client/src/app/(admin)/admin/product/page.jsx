import { getcategories, getProducts } from "@/api/api-call";
import { FiEdit, FiPlus } from "react-icons/fi";
import Link from "next/link";
import StatusBtn from "@/components/admin/StatusBtn";
import DeleteBtn from "@/components/admin/DeleteBtn";
import { FaImages } from "react-icons/fa";

import Image from "next/image";
import ViewButton from "@/components/admin/ViewButton";

export default async function productView() {
    let products = [];
    let meta = {};
    try {
        const res = await getProducts();
        products = res.data;
        meta = res.meta;
    } catch (error) {
        console.log(error);
    }



    return (
        <div className="bg-white rounded-2xl shadow p-6">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold">Product Management</h2>

                <Link href="/admin/product/add">
                    <button className="flex items-center gap-2 bg-[#ff7b00] text-white px-5 py-2 rounded-xl hover:opacity-90 transition font-semibold">
                        <FiPlus size={18} />
                        Add Product
                    </button>
                </Link>
            </div>

            {/* EMPTY STATE */}
            {products.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <p className="text-lg font-medium">No Product Found</p>
                    <p className="text-sm">Start by adding a new category</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl ">
                    <table className="w-full text-sm">
                        {/* TABLE HEAD */}
                        <thead className="bg-gray-100 text-gray-600 sticky top-0">
                            <tr>
                                <th className="p-4 text-left">thumbnail</th>
                                <th className="p-4 text-left">Name</th>
                                <th className="p-4 text-left">category</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        {/* TABLE BODY */}
                        <tbody>
                            {products.map((prod) => (
                                <tr
                                    key={prod._id}
                                    className=" hover:bg-orange-50 transition"
                                >
                                    {/* IMAGE */}
                                    <td className="p-4">
                                        <img
                                            className=" rounded-lg"
                                            src={`${meta.imageBaseUrl}${prod.thumbnail}`}
                                            width={30}
                                            height={30}
                                            alt={"category"}
                                        />
                                    </td>

                                    {/* NAME */}
                                    <td className="p-4 font-medium text-gray-800">
                                        {prod.name}
                                    </td>

                                    {/* SLUG */}
                                    <td className="p-4 text-gray-500">
                                        {prod?.category_id.name}
                                    </td>

                                    {/* STATUS GROUP */}
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-2">
                                            <StatusBtn value={prod.status} id={prod._id} field="status" />
                                        </div>

                                    </td>

                                    {/* ACTIONS */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/product/edit/${prod._id}`}>
                                                <button className="p-2 rounded-lg bg-orange-100 text-[#ff7b00] hover:bg-orange-200 transition">
                                                    <FiEdit size={16} />
                                                </button>
                                            </Link>
                                            <Link href={`/admin/product/add-images/${prod._id}`}>
                                                <button className="p-2 rounded-lg bg-orange-100 text-[#ff7b00] hover:bg-orange-200 transition">

                                                    <FaImages size={16} />
                                                </button>
                                            </Link>


                                            <DeleteBtn API={`product/delete/${prod._id}`} />
                                            <ViewButton baseUrl={`${meta.imageBaseUrl}`} prod={prod} />
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