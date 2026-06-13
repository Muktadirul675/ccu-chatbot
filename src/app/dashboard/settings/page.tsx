import { auth } from "@/auth";
import SettingsForm from "@/components/forms/SettingsForm";
import { getAllSettings } from "@/services/settings";
import { isSuperAdmin } from "@/services/user";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const session = await auth()
    if (!session) redirect("/login")
    if (!session.user?.name) redirect("/login")
    if (!(await isSuperAdmin(session.user.name))) redirect("/login")
    const allSettings = await getAllSettings();
    return <SettingsForm settings={allSettings} />
}