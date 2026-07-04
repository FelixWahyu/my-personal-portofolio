import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getExperiences, deleteExperience, Experience } from "../../../services/experienceService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, Edit2, Trash2, Briefcase, ShieldAlert, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import axios from "axios";

const ExperiencesPage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [experienceToDelete, setExperienceToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search Debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search change
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const response = await getExperiences({
        search: debouncedSearch,
        page,
        limit,
      });

      if (response.success && response.data) {
        setExperiences(response.data.experiences);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages || 1);
      } else {
        toast.error("Gagal memuat data experience");
      }
    } catch (error) {
      console.error("Fetch experiences error:", error);
      toast.error("Terjadi kesalahan koneksi saat memuat experience");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [debouncedSearch, page]);

  const handleDelete = async () => {
    if (!experienceToDelete) return;
    setIsDeleting(true);
    try {
      const response = await deleteExperience(experienceToDelete);
      if (response.success) {
        toast.success("Experience berhasil dihapus");
        const nextTotal = total - 1;
        const nextTotalPages = Math.ceil(nextTotal / limit) || 1;
        if (page > nextTotalPages) {
          setPage(nextTotalPages);
        } else {
          fetchExperiences();
        }
      } else {
        toast.error(response.message || "Gagal menghapus experience");
      }
    } catch (error) {
      console.error("Delete experience error:", error);
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : "Terjadi kesalahan saat menghapus experience";
      toast.error(errorMessage || "Terjadi kesalahan saat menghapus experience");
    } finally {
      setIsDeleting(false);
      setExperienceToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Experiences</h1>
          <p className="text-muted-foreground text-sm">Manajemen data pengalaman kerja dan magang yang ditampilkan pada halaman publik.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 shadow-md">
          <Link to="new" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah Experience
          </Link>
        </Button>
      </div>

      {/* Main Controls Card */}
      <Card className="bg-card border-border shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Daftar Pengalaman
          </CardTitle>
          <CardDescription>Cari dan kelola semua riwayat pekerjaan Anda di sini.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls: Search */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari berdasarkan peran, perusahaan..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 focus-visible:ring-primary/40 border-border" />
            </div>
          </div>

          {/* Table / Content Section */}
          <div className="border border-border rounded-md overflow-hidden bg-background">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="border-border">
                  <TableHead className="w-[200px]">Peran (ID/EN)</TableHead>
                  <TableHead>Perusahaan (ID/EN)</TableHead>
                  <TableHead className="w-[150px]">Periode (ID/EN)</TableHead>
                  <TableHead className="w-[100px]">Tipe / Mode</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[120px] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-60 text-center border-border">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <span className="text-muted-foreground text-sm font-medium animate-pulse">Memuat data experience...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : experiences.length === 0 ? (
                  <TableRow className="border-border">
                    <TableCell colSpan={6} className="h-60 text-center border-border">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <AlertCircle className="w-12 h-12 text-muted-foreground" />
                        <h3 className="font-semibold text-lg text-foreground">Tidak Ada Experience</h3>
                        <p className="text-muted-foreground text-sm max-w-sm">Data experience belum ditambahkan atau tidak sesuai kata kunci pencarian Anda.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  experiences.map((exp) => (
                    <TableRow key={exp.id} className="border-border hover:bg-muted/10 transition-colors">
                      <TableCell className="font-medium align-top">
                        <div className="flex flex-col gap-1">
                          <span className="text-foreground text-sm font-semibold">{exp.roleId}</span>
                          <span className="text-muted-foreground text-xs italic">({exp.roleEn})</span>
                        </div>
                      </TableCell>
                      <TableCell className="align-top text-foreground/80">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm">{exp.companyId}</span>
                          <span className="text-muted-foreground text-xs italic">{exp.locationId}</span>
                        </div>
                      </TableCell>
                      <TableCell className="align-top text-muted-foreground text-sm">
                        <div className="flex flex-col gap-0.5">
                          <span>{exp.periodId}</span>
                          <span className="text-xs italic">({exp.periodEn})</span>
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex flex-col gap-1.5">
                          <Badge variant="outline" className="w-fit text-[10px] bg-accent/10 border-accent/20 text-foreground py-0.5">
                            {exp.typeId}
                          </Badge>
                          <Badge variant="secondary" className="w-fit text-[10px] py-0.5">
                            {exp.modeId}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        {exp.isPublished ? (
                          <Badge variant="default" className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 gap-1 text-[11px] py-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground gap-1 text-[11px] py-0.5">
                            Draft
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right align-top">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="outline" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors border-border">
                            <Link to={`${exp.id}/edit`}>
                              <Edit2 className="w-3.5 h-3.5" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => setExperienceToDelete(exp.id)} className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors border-border">
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
                Menampilkan <span className="font-medium">{experiences.length}</span> dari <span className="font-medium">{total}</span> data
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
      <AlertDialog open={!!experienceToDelete} onOpenChange={(open) => !open && setExperienceToDelete(null)}>
        <AlertDialogContent className="border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="w-5 h-5" />
              Hapus Data Experience?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Pengalaman kerja ini akan dihapus secara permanen dari server dan tidak akan ditampilkan lagi di halaman portofolio utama.
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

export default ExperiencesPage;
