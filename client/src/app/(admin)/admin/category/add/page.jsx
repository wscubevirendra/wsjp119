"use client";

import { client } from "@/utils/helper";
import { useEffect, useRef, useState } from "react";
import { FiTag, FiLink, FiImage } from "react-icons/fi";
import { notify } from "@/utils/helper";
import { useRouter } from "next/navigation";

export default function CategoryAdd() {
  const nameRef = useRef();
  const slugRef = useRef();
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  function createSlug(value) {
    if (!slugRef.current) return;

    const generated = value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    slugRef.current.value = generated;
  }

  const submitHandler = (event) => {
    event.preventDefault();

    const payload = new FormData();
    payload.append("image", event.target.image.files[0]);
    payload.append("name", nameRef.current.value);
    payload.append("slug", slugRef.current.value);

    setLoading(true);

    client
      .post("category/create", payload)
      .then((response) => {
        notify(response.data.message, response.data.success);

        if (response.data.success) {
          nameRef.current.value = "";
          slugRef.current.value = "";
          router.push("/admin/category");
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


  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl p-6">

        {/* HEADER */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Create Category
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Clean structure with auto-generated slug
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">

            {/* NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Category Name
              </label>

              <div className="mt-2 flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3 focus-within:border-[#ff7b00] transition">
                <FiTag className="text-gray-400" />
                <input
                  type="text"
                  ref={nameRef}
                  onChange={(e) => createSlug(e.target.value)}  // ✅ FIX
                  placeholder="e.g. Men's Fashion"
                  className="w-full outline-none text-sm bg-transparent"
                />
              </div>
            </div>

            {/* SLUG */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Slug
              </label>

              <div className="mt-2 flex items-center gap-3 border border-gray-200 bg-gray-50 rounded-xl px-4 py-3">
                <FiLink className="text-gray-400" />
                <input
                  type="text"
                  ref={slugRef}
                  readOnly
                  className="w-full outline-none text-sm bg-transparent text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* IMAGE UPLOAD UI (only UI, not sending) */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Category Image
            </label>

            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#ff7b00] transition">
              <FiImage className="mx-auto text-2xl text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                Click to upload or drag & drop
              </p>

              <input
                type="file"
                name="image"
                accept="image/*"
                className="mt-3 text-sm"
              />
            </div>
          </div>

          {/* BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-3 rounded-xl text-white font-medium transition ${loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#ff7b00] hover:bg-[#e66f00]"
                }`}
            >
              {loading ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}