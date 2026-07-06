import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, FolderOpen, FileBadge, User, CheckCircle, FileText } from "lucide-react";
import { getDashboardStats } from "../../../services/projectService";
import { getAchievementStats } from "../../../services/achievementService";
import { getExperienceStats } from "../../../services/experienceService";
import { getResumeStats } from "../../../services/resumeService";
import { Briefcase } from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [totalAchievements, setTotalAchievements] = useState<number>(0);
  const [totalExperiences, setTotalExperiences] = useState<number>(0);
  const [totalResumes, setTotalResumes] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      const [projRes, achRes, expRes, resRes] = await Promise.allSettled([getDashboardStats(), getAchievementStats(), getExperienceStats(), getResumeStats()]);

      if (projRes.status === "fulfilled" && projRes.value?.success && projRes.value?.data) {
        setTotalProjects(projRes.value.data.totalProjects);
      } else if (projRes.status === "rejected") {
        console.error("Failed to load project stats:", projRes.reason);
      }

      if (achRes.status === "fulfilled" && achRes.value?.success && achRes.value?.data) {
        setTotalAchievements(achRes.value.data.totalAchievements);
      } else if (achRes.status === "rejected") {
        console.error("Failed to load achievement stats:", achRes.reason);
      }

      if (expRes.status === "fulfilled" && expRes.value?.success && expRes.value?.data) {
        setTotalExperiences(expRes.value.data.totalExperiences);
      } else if (expRes.status === "rejected") {
        console.error("Failed to load experience stats:", expRes.reason);
      }

      if (resRes.status === "fulfilled" && resRes.value?.success && resRes.value?.data) {
        setTotalResumes(resRes.value.data.totalResumes);
      } else if (resRes.status === "rejected") {
        console.error("Failed to load resume stats:", resRes.reason);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects.toString(),
      icon: <FolderOpen className="h-4 w-4 text-primary" />,
      description: "Proyek yang ditampilkan",
    },
    {
      title: "Total Achievements",
      value: totalAchievements.toString(),
      icon: <FileBadge className="h-4 w-4 text-primary" />,
      description: "Sertifikat & pencapaian",
    },
    {
      title: "Total Experiences",
      value: totalExperiences.toString(),
      icon: <Briefcase className="h-4 w-4 text-primary" />,
      description: "Pengalaman kerja & magang",
    },
    {
      title: "Total Resumes",
      value: totalResumes.toString(),
      icon: <FileText className="h-4 w-4 text-primary" />,
      description: "File resume & CV PDF",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang kembali, {user?.name || "Admin"}! Senang melihat Anda lagi.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border shadow-sm">
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

      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            Ringkasan Panel Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Ini adalah panel admin untuk mengelola data website portfolio Anda. Semua fitur manajemen konten dirancang dengan performa optimal dan keamanan tinggi.</p>
          <div className="rounded-md bg-muted p-4">
            <h4 className="mb-2 font-medium flex items-center gap-1.5 text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Fitur yang Telah Selesai:
            </h4>
            <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground ml-1">
              <li>Sistem Autentikasi Admin & Guard Route aman</li>
              <li>Manajemen data Proyek / Projects (Tambah, Edit, Hapus, Cari, Filter & Pagination)</li>
              <li>Manajemen data Pencapaian / Achievements (Tambah, Edit, Hapus, Cari, Filter Dinamis & Pagination)</li>
              <li>Manajemen data Pengalaman / Experiences (Tambah, Edit, Hapus, Cari & Pagination)</li>
              <li>Manajemen data Resume / CV (Upload, Edit, Hapus, Activate & Download)</li>
              <li>Integrasi upload dan hapus media secara otomatis di Cloudinary Cloud</li>
              <li>Dukungan konten Bilingual penuh (Bahasa Indonesia & English)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
