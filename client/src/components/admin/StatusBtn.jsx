"use client"
import { client, notify } from "@/utils/helper";
import { useRouter } from "next/navigation";

function StatusBtn({ value, id, field }) {
    const router = useRouter();

    function statusHandler() {
        client.patch(`category/status-update/${id}`, { field }).then(
            (response) => {
                notify(response.data.message, response.data.success)
                if (response.data.success) {
                    router.refresh();
                }
            }
        ).catch(
            (err) => {
                const message =
                    err?.response?.data?.message || "Internal server error";
                notify(message, false);
            }
        )
    }
    const lable = {
        status: ["Active", "Inactive"],
        is_home: ["Home", "Not home"],
        is_top: ["Top", "Not Top"],
        is_popular: ["Popular", "Not Popular"]
    }
    // console.log(lable[field])
    const [TrueLable, FalseLable] = lable[field] || ["Yes", "NO"];

    const base =
        "px-3 py-1 rounded-full text-sm font-medium ";

    return (
        <button onClick={statusHandler} className={`${base} bg-red-100 text-red-600`}>
            {value ? TrueLable : FalseLable}
        </button>
    );
}


export default StatusBtn;