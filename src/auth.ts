import NextAuth, { User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { verifyUser } from "./services/verification"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Credentials({
        credentials: {
            username: {
                type: "username",
                label: "Username"
            },
            password: {
                type: "password",
                label: "Password"
            }
        },
        authorize: async (credentials) => {
            const user: User = {}
            const username = credentials.username
            const password = credentials.password
            const verified = await verifyUser(`${username}`, `${password}`)
            if (verified) {
                user.name = username as string;
                return user;
            }
            throw new Error("Invalid Credentials")
        }
    })],
})