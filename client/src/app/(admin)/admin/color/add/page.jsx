"use client";
import { client, notify } from "@/utils/helper";
import { useRef, useState } from "react";
import { FiTag, FiLink } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function CategoryAdd() {
  const nameRef = useRef();
  const slugRef = useRef();
  const colorRef = useRef(); // ✅ color input ref added
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

    const payload = {
      name: nameRef.current.value,
      slug: slugRef.current.value, 
      color_code: colorRef.current.value 
    };

    setLoading(true);

    client
      .post("color/create", payload)
      .then((response) => {
        notify(response.data.message, response.data.success);

        if (response.data.success) {
          nameRef.current.value = "";
          slugRef.current.value = "";
          colorRef.current.value = ""; // 

          router.push("/admin/color");
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

        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Create Color 
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Clean structure with auto-generated slug
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">

            {/* NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                 Name
              </label>

              <div className="mt-2 flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3 focus-within:border-[#ff7b00]">
                <FiTag className="text-gray-400" />
                <input
                  type="text"
                  ref={nameRef}
                  onChange={(e) => createSlug(e.target.value)}
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

              <div className="mt-2 flex items-center gap-3 border bg-gray-50 rounded-xl px-4 py-3">
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

          {/* COLOR CODE */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Color Code
            </label>

            <div className="mt-2 border border-gray-300 rounded-xl px-4 py-3">
              <input
                type="color" // ✅ best UX
                ref={colorRef}
                className="w-full h-10 cursor-pointer"
              />
            </div>
          </div>

          {/* BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-3 rounded-xl text-white font-medium transition ${
                loading
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