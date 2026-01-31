import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Globe, FileText, Newspaper, Users } from "lucide-react";
import connectToDatabase from "@/lib/db";
import { BettingSite } from "@/models/BettingSite";
import { Blog } from "@/models/Blog";
import { News } from "@/models/News";
import { User } from "@/models/User";

// Force dynamic rendering to ensure stats are fresh
export const dynamic = 'force-dynamic';

async function getDashboardStats() {
    await connectToDatabase();

    const [siteCount, blogCount, newsCount, userCount] = await Promise.all([
        BettingSite.countDocuments({}),
        Blog.countDocuments({}),
        News.countDocuments({}),
        User.countDocuments({})
    ]);

    return {
        sites: siteCount,
        blogs: blogCount,
        news: newsCount,
        users: userCount
    };
}

export default async function DashboardPage() {
    const statsData = await getDashboardStats();

    const stats = [
        { title: "Total Sites", value: statsData.sites, icon: Globe, color: "text-blue-500" },
        { title: "Published Blogs", value: statsData.blogs, icon: FileText, color: "text-green-500" },
        { title: "News Articles", value: statsData.news, icon: Newspaper, color: "text-purple-500" },
        { title: "Total Users", value: statsData.users, icon: Users, color: "text-orange-500" },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-dark">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome to Admin Panel</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500">
                            Use the sidebar to manage betting sites, blogs, news, and home page configuration.
                            <br />
                            <strong>Home Config:</strong> Control which sites/blogs appear on the main landing page.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
