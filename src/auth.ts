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
                user.name = verified.username as string;
                user.id = verified.id
                user.role = `${verified.role}`
                return user;
            }
            throw new Error("Invalid Credentials")
        },
    })],
    session: { strategy: 'jwt' },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
            }
            return session;
        },
    }
})