import CreateUserForm from "@/components/forms/CreateUserForm";
import UsersTable from "@/components/tables/UserTable";
import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            createdAt: true,
            role: true
        }
    })
    return <div className="p-5">
        <h3 className="text-2xl font-semibold">
            Users
        </h3>
        <div className="my-3">
            <CreateUserForm />
        </div>
        <div className="mb-3">
            <UsersTable users={users} />
        </div>
    </div>
}
