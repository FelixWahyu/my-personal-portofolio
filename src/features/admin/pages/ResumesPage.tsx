import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getResumes, deleteResume, activateResume, Resume } from "../../../services/resumeService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, Edit2, Trash2, FileText, Star, ShieldAlert, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import axios from "axios";

const ResumesPage = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isActivating, setIsActivating] = useState<string | null>(null);

  // Search Debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const response = await getResumes({
        search: debouncedSearch,
        page,
        limit,
      });

      if (response.success && response.data) {
        setResumes(response.data.resumes);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages || 1);
      } else {
        toast.error("Gagal memuat data resume");
      }
    } catch (error) {
      console.error("Fetch resumes error:", error);
      toast.error("Terjadi kesalahan koneksi saat memuat resume");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [debouncedSearch, page]);

  const handleDelete = async () => {
    if (!resumeToDelete) return;
    setIsDeleting(true);
    try {
      const response = await deleteResume(resumeToDelete);
      if (response.success) {
        toast.success("Resume berhasil dihapus");
        const nextTotal = total - 1;
        const nextTotalPages = Math.ceil(nextTotal / limit) || 1;
        if (page > nextTotalPages) {
          setPage(nextTotalPages);
        } else {
          fetchResumes();
        }
      } else {
        toast.error(response.message || "Gagal menghapus resume");
      }
    } catch (error) {
      console.error("Delete resume error:", error);
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : "Terjadi kesalahan saat menghapus resume";
      toast.error(errorMessage || "Terjadi kesalahan saat menghapus resume");
    } finally {
      setIsDeleting(false);
      setResumeToDelete(null);
    }
  };

  const handleActivate = async (id: string) => {
    setIsActivating(id);
    try {
      const response = await activateResume(id);
      if (response.success) {
        toast.success("Resume berhasil diaktifkan");
        fetchResumes();
      } else {
        toast.error(response.message || "Gagal mengaktifkan resume");
      }
    } catch (error) {
      console.error("Activate resume error:", error);
      toast.error("Terjadi kesalahan saat mengaktifkan resume");
    } finally {
      setIsActivating(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const selectedDeleteResume = resumes.find(r => r.id === resumeToDelete);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Resumes</h1>
          <p className="text-muted-foreground text-sm">Manajemen file download CV/Resume PDF untuk halaman publik.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 shadow-md">
          <Link to="new" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Upload Resume
          </Link>
        </Button>
      </div>

      {/* Main Controls Card */}
      <Card className="bg-card border-border shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Daftar Resume PDF
          </CardTitle>
          <CardDescription>Kelola file resume Anda dan pilih resume aktif untuk diunduh pengunjung.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls: Search */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari berdasarkan nama file..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 focus-visible:ring-primary/40 border-border" />
            </div>
          </div>

          {/* Table / Content Section */}
          <div className="border border-border rounded-md overflow-hidden bg-background">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="border-border">
                  <TableHead className="text-foreground">Nama File</TableHead>
                  <TableHead className="w-[120px] text-foreground">Ukuran</TableHead>
                  <TableHead className="w-[120px] text-foreground">Status</TableHead>
                  <TableHead className="w-[150px] text-foreground">Tanggal Upload</TableHead>
                  <TableHead className="w-[160px] text-center text-foreground">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-60 text-center border-border">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <span className="text-muted-foreground text-sm font-medium animate-pulse">Memuat data resume...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : resumes.length === 0 ? (
                  <TableRow className="border-border">
                    <TableCell colSpan={5} className="h-60 text-center border-border">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <AlertCircle className="w-12 h-12 text-muted-foreground" />
                        <h3 className="font-semibold text-lg text-foreground">Tidak Ada Resume</h3>
                        <p className="text-muted-foreground text-sm max-w-sm">File resume belum ditambahkan atau tidak sesuai kata kunci pencarian Anda.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  resumes.map((resume) => (
                    <TableRow key={resume.id} className="border-border hover:bg-muted/10 transition-colors">
                      <TableCell className="font-medium align-middle">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="text-foreground text-sm font-semibold truncate max-w-[300px]" title={resume.fileName}>
                            {resume.fileName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle text-foreground/80 text-sm">
                        {formatFileSize(resume.fileSize)}
                      </TableCell>
                      <TableCell className="align-middle">
                        <button
                          disabled={resume.isActive || isActivating !== null}
                          onClick={() => handleActivate(resume.id)}
                          className={`inline-flex items-center transition-all ${resume.isActive ? "cursor-default" : "cursor-pointer"}`}
                          title={resume.isActive ? "Resume Aktif" : "Aktifkan Resume"}
                        >
                          {resume.isActive ? (
                            <Badge variant="default" className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 gap-1 text-[11px] py-0.5 select-none">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Aktif
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-muted hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/30 gap-1 text-[11px] py-0.5 transition-colors border border-transparent">
                              {isActivating === resume.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Star className="w-3.5 h-3.5" />
                              )}
                              Non-aktif
                            </Badge>
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="align-middle text-muted-foreground text-sm">
                        {formatDate(resume.createdAt)}
                      </TableCell>
                      <TableCell className="text-center align-middle">
                        <div className="flex items-center justify-center gap-2">
                          <Button asChild variant="outline" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors border-border">
                            <Link to={`${resume.id}/edit`}>
                              <Edit2 className="w-3.5 h-3.5" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={resume.isActive}
                            onClick={() => setResumeToDelete(resume.id)}
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors border-border"
                            title={resume.isActive ? "Tidak bisa menghapus resume aktif" : "Hapus Resume"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-muted-foreground">
                Menampilkan <span className="font-medium">{resumes.length}</span> dari <span className="font-medium">{total}</span> data
              </div>
              <Pagination className="w-auto m-0">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setPage((p) => Math.max(p - 1, 1))} className={`cursor-pointer select-none ${page === 1 ? "pointer-events-none opacity-40" : ""}`} />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <PaginationItem key={p} className="hidden sm:inline-block">
                      <PaginationLink onClick={() => setPage(p)} isActive={page === p} className="cursor-pointer select-none">
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext onClick={() => setPage((p) => Math.min(p + 1, totalPages))} className={`cursor-pointer select-none ${page === totalPages ? "pointer-events-none opacity-40" : ""}`} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={!!resumeToDelete} onOpenChange={(open) => !open && setResumeToDelete(null)}>
        <AlertDialogContent className="border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="w-5 h-5" />
              Hapus File Resume?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. File resume <strong>{selectedDeleteResume?.fileName}</strong> akan dihapus secara permanen dari server dan Cloudinary.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
  );
};

export default ResumesPage;
