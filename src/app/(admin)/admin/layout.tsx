import { AuthProvider } from "@/components/providers/AuthProvider";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full bg-neutral-light dark:bg-gray-950">
            <AuthProvider>
                <AdminSidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <AdminTopbar />
                    <main className="flex-1 overflow-auto p-6">
                        {children}
                    </main>
                </div>
            </AuthProvider>
        </div>
    );
}
