import { UserRole } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export async function isSuperAdmin(username: string){
    const user = await prisma.user.findUnique({
        where:{username},
        select:{
            role: true
        }
    })
    return user?.role === UserRole.SUPER_ADMIN;
}

export async function isAdmin(username: string){
    const user = await prisma.user.findUnique({
        where:{username},
        select:{
            role: true
        }
    })
    return (user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.ADMIN);
}

