import { prisma } from "@/lib/prisma";
import bcrypt from 'bcrypt';

export async function verifyUser(username: string, password: string){
    const user = await prisma.user.findUnique({
        where: {username: username},
        select:{
            password: true,
            role: true,
            username: true,
            id: true
        }
    })
    const verified = await bcrypt.compare(password, `${user?.password}`)
    return verified ? user : null;
}