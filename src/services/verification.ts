import { prisma } from "@/lib/prisma";
import bcrypt from 'bcrypt';

export async function verifyUser(username: string, password: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: {username: username},
        select:{
            password: true
        }
    })
    const verified = await bcrypt.compare(password, `${user?.password}`)
    return verified;
}