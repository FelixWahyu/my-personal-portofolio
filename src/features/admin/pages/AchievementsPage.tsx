import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAchievements, deleteAchievement, getAchievementTypes, Achievement } from "../../../services/achievementService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit2, Trash2, Award, Calendar, ShieldAlert, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import axios from "axios";

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [achievementToDelete, setAchievementToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search Debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search change
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  const fetchTypes = async () => {
    try {
      const response = await getAchievementTypes();
      if (response.success && response.data) {
        setTypes(response.data);
      }
    } catch (error) {
      console.error("Fetch types error:", error);
    }
  };

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const response = await getAchievements({
        search: debouncedSearch,
        type: selectedType === "All" ? undefined : selectedType,
        page,
        limit,
      });

      if (response.success && response.data) {
        setAchievements(response.data.achievements);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages || 1);
      } else {
        toast.error("Gagal memuat data achievement");
      }
    } catch (error) {
      console.error("Fetch achievements error:", error);
      toast.error("Terjadi kesalahan koneksi saat memuat achievement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  useEffect(() => {
    fetchAchievements();
  }, [debouncedSearch, selectedType, page]);

  const handleDelete = async () => {
    if (!achievementToDelete) return;
    setIsDeleting(true);
    try {
      const response = await deleteAchievement(achievementToDelete);
      if (response.success) {
        toast.success("Achievement berhasil dihapus");
        // Update types dynamic filter list in case the deleted one had a unique type
        fetchTypes();
        // Refetch and adjust page if necessary
        const nextTotal = total - 1;
        const nextTotalPages = Math.ceil(nextTotal / limit) || 1;
        if (page > nextTotalPages) {
          setPage(nextTotalPages);
        } else {
          fetchAchievements();
        }
      } else {
        toast.error(response.message || "Gagal menghapus achievement");
      }
    } catch (error) {
      console.error("Delete achievement error:", error);
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : "Terjadi kesalahan saat menghapus achievement";
      toast.error(errorMessage || "Terjadi kesalahan saat menghapus achievement");
    } finally {
      setIsDeleting(false);
      setAchievementToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Achievements</h1>
          <p className="text-muted-foreground text-sm">Manajemen data sertifikat, penghargaan, dan pencapaian portfolio yang ditampilkan pada halaman publik.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 shadow-md">
          <Link to="new" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah Achievement
          </Link>
        </Button>
      </div>

      {/* Main Controls Card */}
      <Card className="bg-card border-border shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Daftar Pencapaian
          </CardTitle>
          <CardDescription>Cari, filter, dan kelola semua pencapaian Anda di sini.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls: Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari berdasarkan judul, penerbit, deskripsi..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 focus-visible:ring-primary/40 border-border" />
            </div>

            {/* Type Filter Dropdown */}
            <div className="w-full md:w-[180px] shrink-0">
              <Select
                value={selectedType}
                onValueChange={(val) => {
                  setSelectedType(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="focus:ring-primary/40 border-border bg-background">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent className="border-border">
                  <SelectItem value="All">Semua Kategori</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table Container */}
          <div className="border border-border rounded-lg overflow-hidden bg-background">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="text-foreground font-semibold">Gambar</TableHead>
                  <TableHead className="text-foreground font-semibold">Judul</TableHead>
                  <TableHead className="text-foreground font-semibold">Penerbit</TableHead>
                  <TableHead className="text-foreground font-semibold">Tipe</TableHead>
                  <TableHead className="text-foreground font-semibold">Tanggal</TableHead>
                  <TableHead className="text-foreground font-semibold">Status</TableHead>
                  <TableHead className="text-center text-foreground font-semibold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={7} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="text-muted-foreground text-sm">Memuat data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : achievements.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                      Tidak ada data achievement ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  achievements.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors border-border">
                      <TableCell>
                        <div className="w-[70px] h-[45px] rounded-md overflow-hidden bg-muted border border-border">
                          <img
                            src={item.image}
                            alt={item.titleId}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.png";
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[250px]">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-foreground truncate block" title={item.titleId}>
                            {item.titleId}
                          </span>
                          <span className="text-xs text-muted-foreground truncate block" title={item.titleEn}>
                            {item.titleEn}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium text-foreground truncate block">{item.issuerTextId}</span>
                          <span className="text-xs text-muted-foreground truncate block">{item.issuerTextEn}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 items-start">
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px]">
                            {item.type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs text-foreground">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{item.dateId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.isPublished ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500 border hover:bg-emerald-500/20 font-semibold border-emerald-500/20 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            Published
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/10 text-amber-500 border hover:bg-amber-500/20 font-semibold border-amber-500/20 flex items-center gap-1 w-fit">
                            <AlertCircle className="w-3 h-3" />
                            Draft
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild size="icon" variant="outline" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors border-border">
                            <Link to={`${item.id}/edit`}>
                              <Edit2 className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button size="icon" variant="outline" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors border-border" onClick={() => setAchievementToDelete(item.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-muted-foreground">
                Menampilkan <strong>{achievements.length}</strong> dari <strong>{total}</strong> data
              </span>
              <Pagination className="w-auto mx-0">
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
                        className={`w-8 h-8 text-xs font-semibold rounded-md border transition-all ${page === idx + 1 ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted text-foreground"}`}
                      >
                        {idx + 1}
                      </button>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={achievementToDelete !== null} onOpenChange={(open) => !open && setAchievementToDelete(null)}>
        <AlertDialogContent className="border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="w-5 h-5" />
              Hapus Achievement?
            </AlertDialogTitle>
            <AlertDialogDescription>Apakah Anda yakin ingin menghapus data achievement ini? Tindakan ini tidak dapat dibatalkan dan file gambar di Cloudinary juga akan dihapus secara permanen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={handleDelete} disabled={isDeleting}>
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

export default AchievementsPage;
