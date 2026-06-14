import { auth } from "@/auth";
import { UserRole } from "@/generated/prisma/enums";
import { isSuperAdmin } from "@/services/user";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function UsersLayout({ children }: { children: ReactNode }) {
    const session = await auth()
    if (!session) redirect("/login")
    if (!session.user?.name) redirect("/login")
    const admin = (session.user.role === UserRole.SUPER_ADMIN) || (session.user.role === UserRole.ADMIN)
    if (!admin) redirect("/login")
    const superAdmin = (session.user.role === UserRole.SUPER_ADMIN)
    if (!superAdmin) redirect("/login")

    return children;
}