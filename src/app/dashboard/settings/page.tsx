import { auth } from "@/auth";
import SettingsForm from "@/components/forms/SettingsForm";
import { UserRole } from "@/generated/prisma/enums";
import { getAllSettings } from "@/services/settings";
import { isSuperAdmin } from "@/services/user";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const session = await auth()
    if (!session) redirect("/login")
    if (!session.user?.name) redirect("/login")
    const admin = (session.user.role === UserRole.SUPER_ADMIN) || (session.user.role === UserRole.ADMIN)
    if (!admin) redirect("/login")
    const superAdmin = (session.user.role === UserRole.SUPER_ADMIN)
    if (!superAdmin) redirect("/login")
    const allSettings = await getAllSettings();

    return <SettingsForm settings={allSettings} />
}