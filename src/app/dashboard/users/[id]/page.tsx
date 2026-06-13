import EditUserPage from "@/components/forms/EditUserPage";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditUser({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: { id },
        select:{
            id: true,
            username: true,
            role:true
        }
    })
    if(!user) notFound()
    return <EditUserPage user={user}/>
}