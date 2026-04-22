"use client";
import { client } from "@/utils/helper";
import { useRef, useState, use, useEffect } from "react";
import { FiTag, FiLink, FiImage } from "react-icons/fi";
import { notify } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { findProductById } from "@/api/api-call";
import { CiCircleRemove } from "react-icons/ci";


export default function page({ params }) {
    const [baseUrl, setBaseUrl] = useState("")
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [product, setProduct] = useState({});
    const submitHandler = (event) => {
        event.preventDefault();
        const payload = new FormData();
        console.log(event.target.image.files)

        for (let image of event.target.image.files) {
            payload.append("images", image);
        }

        setLoading(true);

        client
            .post(`product/add-images/${id}`, payload)
            .then((response) => {
                notify(response.data.message, response.data.success);
                if (response.data.success) {
                    router.push("/admin/product");
                }
            })
            .catch((err) => {
                console.log(err);
                const message =
                    err?.response?.data?.message || "Internal server error";
                notify(message, false);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const removeImage = (name) => {
        client
            .put(`product/remove-image/${id}`, { image_name: name })
            .then((response) => {
                router.refresh()
                notify(response.data.message, response.data.success);
            })
            .catch((err) => {
                console.log(err);
                const message =
                    err?.response?.data?.message || "Internal server error";
                notify(message, false);
            })
            
    };

    async function getProduct() {
        setFetchLoading(true)
        try {
            const { data, meta } = await findProductById(id)
            setProduct(data)
            setBaseUrl(meta.imageBaseUrl)
        } catch (error) {
            console.log(error)
        } finally {
            setFetchLoading(false)
        }
    }

    useEffect(
        () => {
            getProduct();
        },
        [id]
    )


    if (fetchLoading) {
        return (
            < h2 className=" h-screen flex justify-center items-center" > Loading.......</h2 >
        )
    }

    console.log(baseUrl, "url")



    return (
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl p-6">

                {/* HEADER */}
                <div className="mb-4">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Add Images
                    </h1>

                </div>

                {/* FORM */}
                <form onSubmit={submitHandler} className="space-y-6">

                    {/* IMAGE UPLOAD UI (only UI, not sending) */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Image
                        </label>

                        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#ff7b00] transition">
                            <FiImage className="mx-auto text-2xl text-gray-400 mb-2" />

                            <input
                                type="file"
                                multiple
                                name="image"
                                accept="image/*"
                                className="mt-3 text-sm"
                            />
                        </div>
                        <div className="flex gap-6">
                            {
                                product?.images?.map((image) => {
                                    console.log(baseUrl)
                                    return (
                                        <div className=" relative">
                                            <img src={`${baseUrl}${image}`} alt="missing" className="w-30 h-20 my-2 " />
                                            <CiCircleRemove onClick={() => removeImage(image)} className=" absolute font-bold text-2xl text-red-800  top-[10px] left-[20px] z-20" />
                                        </div>
                                    )
                                })
                            }

                        </div>

                    </div>

                    {/* BUTTON */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px - 4 py - 3 rounded - xl text - white font - medium transition ${loading
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-[#ff7b00] hover:bg-[#e66f00]"
                                } `}
                        >
                            {loading ? "update....." : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}