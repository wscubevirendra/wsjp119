"use client"

import React, { useState } from 'react'
import { FaBarsStaggered } from "react-icons/fa6";
import Link from 'next/link';
import { RiDashboardLine } from "react-icons/ri";
import { MdCategory } from "react-icons/md";
import { FaProductHunt, FaFirstOrderAlt } from "react-icons/fa6";
import { usePathname } from 'next/navigation';


export default function Sidebar() {
    const [open, setOpen] = useState(true);
    const pathname = usePathname();

    const items = [
        {
            name: "DashBoard",
            icons: <RiDashboardLine />,
            path: "/admin"
        },
        {
            name: "Category",
            icons: <MdCategory />,
            path: "/admin/category"
        },
        {
            name: "Brand",
            icons: <FaProductHunt />,
            path: "/admin/brand"
        },
        {
            name: "Color",
            icons: <FaProductHunt />,
            path: "/admin/color"
        },
        {
            name: "Product",
            icons: <FaProductHunt />,
            path: "/admin/product"
        },
        {
            name: "Order",
            icons: <FaFirstOrderAlt />,
            path: "/admin/order"
        }
    ]
    return (
        <aside
            className={` ${open ? "w-64" : "w-20"} h-screen duration-300 flex flex-col bg-white border-r border-gray-200 p-4
  `}
        >
            <div className="flex justify-between items-center">
                {
                    open &&
                    <h2 className='font-bold text-2xl text-[#ff7b00]'> Ishop Admin</h2>
                }
                <FaBarsStaggered className=' cursor-pointer' onClick={() => setOpen(!open)} />
            </div>
            <nav className='flex-1 mt-10 space-y-3'>
                {
                    items.map((item, index) => (
                        <Link key={index} href={item.path} className={`flex items-center gap-3 ${pathname === item.path ?
                            "bg-[#ff7b00] text-white" : ""} text-md px-3 rounded-xl ${open ? "" : "justify-center"}  py-2`}>
                            {item.icons}
                            {
                                open &&
                                <span className='font-medium'>{item.name}</span>
                            }
                        </Link>
                    ))
                }

            </nav>

        </aside >
    )
}
