import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, FolderOpen, FileBadge, User } from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Projects",
      value: "0",
      icon: <FolderOpen className="h-4 w-4 text-primary" />,
      description: "Proyek yang ditampilkan",
    },
    {
      title: "Total Achievements",
      value: "0",
      icon: <FileBadge className="h-4 w-4 text-primary" />,
      description: "Sertifikat & pencapaian",
    },
    {
      title: "User Role",
      value: user?.role || "Admin",
      icon: <User className="h-4 w-4 text-primary" />,
      description: "Hak akses saat ini",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali, {user?.name || "Admin"}! Senang melihat Anda lagi.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            Ringkasan Panel Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Ini adalah panel admin untuk mengelola data website portfolio Anda. Di Phase 1 ini, 
            kita baru saja menyelesaikan sistem autentikasi dan layout dasar.
          </p>
          <div className="rounded-md bg-muted p-4">
            <h4 className="mb-2 font-medium">Langkah selanjutnya (Phase Berikutnya):</h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Manajemen data Proyek (CRUD)</li>
              <li>Manajemen data Pencapaian (CRUD)</li>
              <li>Integrasi upload gambar ke Cloudinary/Vercel Blob</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
