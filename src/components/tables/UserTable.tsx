import Link from "next/link";
import { UserRole } from "@/generated/prisma/enums";

type User = {
    id: string;
    username: string;
    role: UserRole | null;
    createdAt: Date;
};

interface UsersTableProps {
    users: User[];
}

export default function UsersTable({ users }: UsersTableProps) {
    return (
        <div>
            <div className="border border-slate-200 rounded-md overflow-hidden shadow-sm bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-slate-800 text-white uppercase text-xs tracking-wider">
                        <tr>
                            <th className="text-left p-3 font-medium">
                                Username
                            </th>
                            <th className="text-left p-3 font-medium">
                                Role
                            </th>
                            <th className="text-left p-3 font-medium">
                                Since
                            </th>
                            <th className="text-left p-3 font-medium">
                                Edit
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="hover:bg-slate-50 transition"
                            >
                                {/* Username */}
                                <td className="p-3">
                                    <Link
                                        href={`/dashboard/users/${user.id}`}
                                        className="block font-medium text-slate-700 hover:text-slate-900"
                                    >
                                        {user.username}
                                    </Link>
                                </td>

                                {/* Role */}
                                <td className="p-3 text-slate-600">
                                    {user.role ? (
                                        <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700">
                                            {user.role}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400">
                                            N/A
                                        </span>
                                    )}
                                </td>

                                {/* Since */}
                                <td className="p-3 text-slate-600">
                                    {new Date(user.createdAt).toLocaleString()}
                                </td>

                                {/* Edit */}
                                <td className="p-3">
                                    <Link
                                        href={`/dashboard/users/${user.id}`}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}

                        {users.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="p-8 text-center text-slate-500"
                                >
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}