"use client";

import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";
import { getcategories, getBrands, getColors } from "@/api/api-call";
import { Editor } from 'primereact/editor';
import { notify, client } from "@/utils/helper";
const ProductFormUI = () => {
    const [text, setText] = useState("");
    const [categories, setCategories] = useState([]);
    const [selColors, setSelColors] = useState([]);
    const [brands, setBrands] = useState([]);
    const [colors, setColors] = useState([]);
    const nameRef = useRef();
    const slugRef = useRef();
    const original_price_ref = useRef();
    const final_price_ref = useRef();
    const discound_price_ref = useRef();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    function colorSelect(cat) {
        const selectItem = cat.map((cat) => cat.value)
        setSelColors(selectItem)
    }

    const getData = async () => {
        const [catRes, colorRes, brandRes] = await Promise.all([
            getcategories(),
            getColors(),
            getBrands()
        ]);

        setCategories(catRes?.data?.map((cat) => ({ name: cat.name, value: cat._id })) || []);
        setColors(colorRes?.data?.map((color) => ({ name: color.name, value: color._id })) || []);
        setBrands(brandRes?.data?.map((brand) => ({ name: brand.name, value: brand._id })) || []);

    }



    useEffect(
        () => {
            getData()
        },
        []
    )

    console.log(categories)


    function createSlug() {
        let value = nameRef.current.value;
        if (!value) return;
        const generated = value
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        slugRef.current.value = generated;
    }

    function calculatePrice() {
        let op = parseInt(original_price_ref.current.value);
        let fp = parseInt(final_price_ref.current.value);

        if (op <= 0 || fp < 0 || fp > op) {
            discound_price_ref.current.value = 0;
            return;
        }

        let dp = Math.floor(((op - fp) / op) * 100);
        discound_price_ref.current.value = dp;
    }


    const submitHandler = (event) => {
        event.preventDefault();
        const payload = new FormData();
        payload.append("thumbnail", event.target.thumbnail.files[0]);
        payload.append("name", nameRef.current.value);
        payload.append("slug", slugRef.current.value);
        payload.append("original_price", original_price_ref.current.value);
        payload.append("final_price", final_price_ref.current.value);
        payload.append("discount_price", discound_price_ref.current.value);
        payload.append("color_ids", JSON.stringify(selColors));
        payload.append("category_id", event.target.category.value);
        payload.append("brand_id", event.target.brand.value);
        payload.append("short_description", event.target.short_description.value);
        payload.append("long_description", text);


        setLoading(true);

        client
            .post("product/create", payload)
            .then((response) => {
                notify(response.data.message, response.data.success);

                if (response.data.success) {
                    nameRef.current.value = "";
                    slugRef.current.value = "";
                    original_price_ref.current.value = "";
                    final_price_ref.current.value = "";
                    discound_price_ref.current.value = "";
                    slugRef.current.value = "";
                    event.target.reset()
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
    return (
        <form onSubmit={submitHandler} className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Product Name */}
            <div>
                <label className="block mb-1 font-semibold">Name</label>
                <input
                    type="text"
                    ref={nameRef}
                    onChange={createSlug}
                    placeholder="Enter product name"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Slug */}
            <div>
                <label className="block mb-1 font-semibold">Slug</label>
                <input
                    type="text"
                    ref={slugRef}
                    placeholder="Auto generated slug"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-100"
                    readOnly
                />
            </div>

            {/* Short Description */}
            <div className="md:col-span-2">
                <label className="block mb-1 font-semibold">Short Description</label>
                <textarea
                    rows={2}
                    name="short_description"
                    placeholder="Enter short description"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Long Description */}
            <div className="md:col-span-2">
                <label className="block mb-1 font-semibold">Long Description</label>
                <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '320px' }} />
            </div>

            {/* Price Section */}
            <div className="col-span-2 grid grid-cols-3 gap-6">
                <div>
                    <label className="block mb-1 font-semibold">Original Price</label>
                    <input
                        type="number"
                        onChange={calculatePrice}
                        ref={original_price_ref}
                        placeholder="Enter price"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Discount %</label>
                    <input
                        type="number"
                        readOnly
                        ref={discound_price_ref}
                        placeholder="Enter discount"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Final Price</label>
                    <input
                        type="number"
                        ref={final_price_ref}
                        onChange={calculatePrice}
                        placeholder="Auto calculated"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-100"
                    />
                </div>
            </div>

            {/* Category */}
            <div className="col-span-full grid grid-cols-3 gap-6">
                <div>
                    <label className="block mb-1 font-semibold">Category</label>
                    <Select
                        name="category"
                        className="w-full outline-none  " options={
                            categories.map((cat) => (
                                { value: cat.value, label: cat.name }
                            ))
                        }
                    />
                </div>

                {/* Brand */}
                <div>
                    <label className="block mb-1 font-semibold">Brand</label>
                    <Select
                        name="brand"
                        className="w-full outline-none  " options={
                            brands.map((cat) => (
                                { value: cat.value, label: cat.name }
                            ))
                        }
                    />
                </div>
                {/* Colors */}
                <div >
                    <label className="block mb-1 font-semibold">Colors</label>
                    <Select
                        isMulti
                        onChange={colorSelect}
                        closeMenuOnSelect={false}
                        className="w-full outline-none text-sm bg-transparent text-gray-600" options={
                            colors.map((color) => (
                                { value: color.value, label: color.name }
                            ))
                        }
                    />
                </div>
            </div>


            {/* Thumbnail */}
            <div className="md:col-span-2">
                <label className="block mb-1 font-semibold">Thumbnail Image</label>
                <input
                    type="file"
                    name="thumbnail"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Submit */}
            <div className="md:col-span-2 text-right">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all duration-300"
                >
                    Submit Product
                </button>
            </div>
        </form>
    );
};

export default ProductFormUI;