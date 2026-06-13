import { auth, signOut } from "@/auth";
import { isAdmin, isSuperAdmin } from "@/services/user";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react"
import { Toaster } from "react-hot-toast";
import { BiHome, BiInfoCircle, BiLogOut, BiMaleSign, BiMessage } from 'react-icons/bi';
import { BsGear } from 'react-icons/bs';
import { LuUsers } from "react-icons/lu";

export const dynamic = "force-dynamic";

const menu: { link: string, label: string, icon: ReactNode, forSuperAdmins: boolean }[] = [
    { link: "/dashboard", label: "Dashboard", icon: <BiHome size={15} />, forSuperAdmins: false },
    { link: "/dashboard/users", label: "Users", icon: <LuUsers size={15} />, forSuperAdmins: true },
    { link: "/dashboard/chats", label: "Chat Sessions", icon: <BiMessage size={15} />, forSuperAdmins: false },
    { link: "/dashboard/information", label: "Information", icon: <BiInfoCircle size={15} />, forSuperAdmins: false },
    { link: "/dashboard/leads", label: "Leads", icon: <BiMaleSign size={15} />, forSuperAdmins: false },
    { link: "/dashboard/settings", label: "Settings", icon: <BsGear size={15} />, forSuperAdmins: true },
]

function Logout() {
    return <button onClick={async () => {
        "use server";
        await signOut()
    }} className="flex p-2 items-center gap-2 hover:bg-white hover:text-primary rounded-lg">
        <BiLogOut size={15} /> Logout
    </button>
}

function MenuItem({ item }: { item: { link: string, label: string, icon: ReactNode } }) {
    return <Link href={item.link} className="flex p-2 items-center gap-2 hover:bg-white hover:text-primary rounded-lg">
        {item.icon}
        {item.label}
    </Link>
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session = await auth()
    if(!session) redirect("/login")
    if(!session.user?.name) redirect("/login")
    if(!(await isAdmin(session.user.name))) redirect("/login")
        
    const superAdmin = await isSuperAdmin(session.user.name)

    return <div className="flex items-start">
        <Toaster/>
        <div className="w-fit h-screen sticky top-0 flex flex-col py-6 gap-5 bg-primary text-white p-3 px-4">
            <div className="my-2 px-2">
                {session.user.name}
            </div>
            {menu.map((item, index) => {
                if(item.forSuperAdmins && !superAdmin){
                    return null;
                }
                return <MenuItem key={index} item={item} />
            })}
            <Logout />
        </div>
        <div className="flex-1">
            {children}
        </div>
    </div>
}