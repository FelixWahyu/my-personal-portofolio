import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProjects, deleteProject, Project } from "../../../services/projectService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Search, Edit2, Trash2, FolderOpen, ExternalLink, Globe, LayoutGrid, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import axios from "axios";

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search Debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search change
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await getProjects({
        search: debouncedSearch,
        category: category === "All" ? undefined : category,
        page,
        limit,
      });

      if (response.success && response.data) {
        setProjects(response.data.projects);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages || 1);
      } else {
        toast.error("Gagal memuat data project");
      }
    } catch (error) {
      console.error("Fetch projects error:", error);
      toast.error("Terjadi kesalahan koneksi saat memuat project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [debouncedSearch, category, page]);

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      const response = await deleteProject(projectToDelete);
      if (response.success) {
        toast.success("Project berhasil dihapus");
        // Refetch and adjust page if necessary
        const nextTotal = total - 1;
        const nextTotalPages = Math.ceil(nextTotal / limit) || 1;
        if (page > nextTotalPages) {
          setPage(nextTotalPages);
        } else {
          fetchProjects();
        }
      } else {
        toast.error(response.message || "Gagal menghapus project");
      }
    } catch (error) {
      console.error("Delete project error:", error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Terjadi kesalahan saat menghapus project";
      toast.error(errorMessage || "Terjadi kesalahan saat menghapus project");
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm">
            Manajemen data proyek portfolio yang akan ditampilkan pada halaman publik.
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 shadow-md">
          <Link to="new" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah Project
          </Link>
        </Button>
      </div>

      {/* Main Controls Card */}
      <Card className="bg-card border-border shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" />
            Daftar Proyek
          </CardTitle>
          <CardDescription>Cari, filter, dan kelola semua project Anda di sini.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls: Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama proyek..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 focus-visible:ring-primary/40 border-border"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex bg-muted p-1 rounded-lg border border-border self-start md:self-auto">
              {["All", "Web", "Mobile"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setPage(1);
                  }}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${category === cat
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-[100px] text-muted-foreground font-semibold">Gambar</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Proyek</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Kategori</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Tech Stack</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-center">Urutan</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
                  <TableHead className="w-[120px] text-right text-muted-foreground font-semibold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeletons
                  Array.from({ length: limit }).map((_, idx) => (
                    <TableRow key={idx} className="border-border animate-pulse">
                      <TableCell><div className="w-[70px] h-[45px] bg-muted rounded-md" /></TableCell>
                      <TableCell>
                        <div className="h-4 bg-muted rounded w-48 mb-2" />
                        <div className="h-3 bg-muted rounded w-32" />
                      </TableCell>
                      <TableCell><div className="h-5 bg-muted rounded-full w-12" /></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded w-36" /></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded w-6 mx-auto" /></TableCell>
                      <TableCell><div className="h-5 bg-muted rounded-full w-16" /></TableCell>
                      <TableCell className="text-right"><div className="h-8 bg-muted rounded-md w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : projects.length === 0 ? (
                  // Empty state
                  <TableRow>
                    <TableCell colSpan={7} className="h-56 text-center border-border">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="p-3 bg-muted rounded-full text-muted-foreground">
                          <FolderOpen className="w-8 h-8" />
                        </div>
                        <h3 className="font-semibold text-base text-foreground">Tidak ada proyek ditemukan</h3>
                        <p className="text-xs text-muted-foreground max-w-sm">
                          {search
                            ? "Coba sesuaikan kata kunci pencarian atau bersihkan filter."
                            : "Mulai tambahkan proyek pertama Anda untuk menampilkannya di portfolio."}
                        </p>
                        {search && (
                          <Button variant="outline" size="sm" onClick={() => setSearch("")}>
                            Clear Search
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // Project Rows
                  projects.map((project) => (
                    <TableRow key={project.id} className="border-border hover:bg-muted/10 transition-colors">
                      <TableCell>
                        <div className="relative w-[70px] h-[45px] rounded-md overflow-hidden bg-muted border border-border group shrink-0">
                          <img
                            src={project.image}
                            alt={project.titleId}
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder-project.webp";
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[250px]">
                        <div className="font-semibold text-sm line-clamp-1 text-foreground" title={project.titleId}>
                          {project.titleId}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Globe className="w-3.5 h-3.5" />
                          <span className="line-clamp-1" title={project.titleEn}>{project.titleEn}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`font-semibold ${project.category.toLowerCase() === "web"
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/25"
                          : "bg-purple-500/10 text-purple-500 border-purple-500/25"
                          }`}>
                          {project.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {project.tech.slice(0, 3).map((t) => (
                            <span key={t} className="px-1.5 py-0.5 text-[10px] font-semibold bg-muted rounded border border-border text-muted-foreground">
                              {t}
                            </span>
                          ))}
                          {project.tech.length > 3 && (
                            <span className="px-1 py-0.5 text-[10px] font-semibold text-muted-foreground">
                              +{project.tech.length - 3}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium text-sm text-foreground">
                        {project.sortOrder}
                      </TableCell>
                      <TableCell>
                        {project.isPublished ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 font-semibold hover:bg-emerald-500/15 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            Published
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/25 font-semibold hover:bg-amber-500/15 flex items-center gap-1 w-fit">
                            <AlertCircle className="w-3 h-3" />
                            Draft
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground"
                            onClick={() => navigate(`${project.id}/edit`)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-red-500/10 text-muted-foreground hover:text-red-500"
                                onClick={() => setProjectToDelete(project.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card border-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-foreground">Apakah Anda sangat yakin?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground text-sm">
                                  Tindakan ini tidak dapat dibatalkan. Project <strong>{project.titleId}</strong> dan file gambarnya yang tersimpan di Cloudinary akan dihapus secara permanen.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-muted text-foreground border-border hover:bg-muted/80">Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDelete}
                                  className="bg-red-500 text-white hover:bg-red-600 border-none flex items-center gap-2"
                                  disabled={isDeleting}
                                >
                                  {isDeleting ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Menghapus...
                                    </>
                                  ) : (
                                    "Hapus"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-muted-foreground">
                Menampilkan <strong>{projects.length}</strong> dari <strong>{total}</strong> project
              </div>
              <Pagination className="w-auto m-0">
                <PaginationContent>
                  <PaginationItem>
                    <button
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="px-3 py-1.5 text-xs font-semibold rounded-md border border-border hover:bg-muted text-foreground disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
                    >
                      <PaginationPrevious className="hidden" />
                      Previous
                    </button>
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <PaginationItem key={idx}>
                      <button
                        onClick={() => setPage(idx + 1)}
                        className={`w-8 h-8 text-xs font-semibold rounded-md border transition-all ${page === idx + 1
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:bg-muted text-foreground"
                          }`}
                      >
                        {idx + 1}
                      </button>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <button
                      onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                      disabled={page === totalPages}
                      className="px-3 py-1.5 text-xs font-semibold rounded-md border border-border hover:bg-muted text-foreground disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
                    >
                      <PaginationNext className="hidden" />
                      Next
                    </button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsPage;
