import { auth } from "@/auth";
import { isSuperAdmin } from "@/services/user";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function UsersLayout({ children }: { children: ReactNode }) {
    const session = await auth()
    if (!session) redirect("/login")
    if (!session.user?.name) redirect("/login")
    if (!(await isSuperAdmin(session.user.name))) redirect("/login")

    return children;
}