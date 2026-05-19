import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getAchievementById, createAchievement, updateAchievement } from "../../../services/achievementService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload, Plus, X, Loader2, Globe, Calendar, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import axios from "axios";

const PRESET_TYPES = [
  "Profesional",
  "Course",
  "Organisasi",
  "Kompetisi",
  "Seminar",
  "Workshop",
  "Akademik",
  "Lainnya"
];

const AchievementFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Non-translatable fields state
  const [typeSelect, setTypeSelect] = useState<string>("Profesional");
  const [customType, setCustomType] = useState<string>("");
  const [credentialCode, setCredentialCode] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isPublished, setIsPublished] = useState<boolean>(true);

  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Translatable fields state (Indonesia)
  const [titleId, setTitleId] = useState("");
  const [issuerTextId, setIssuerTextId] = useState("");
  const [descriptionId, setDescriptionId] = useState("");
  const [dateId, setDateId] = useState("");
  const [tagsId, setTagsId] = useState<string[]>([]);
  const [tagIdInput, setTagIdInput] = useState("");

  // Translatable fields state (English)
  const [titleEn, setTitleEn] = useState("");
  const [issuerTextEn, setIssuerTextEn] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [dateEn, setDateEn] = useState("");
  const [tagsEn, setTagsEn] = useState<string[]>([]);
  const [tagEnInput, setTagEnInput] = useState("");

  // Load existing achievement if in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchAchievement = async () => {
      setLoading(true);
      try {
        const response = await getAchievementById(id!);
        if (response.success && response.data) {
          const a = response.data;

          // Set non-translatable fields
          if (PRESET_TYPES.includes(a.type)) {
            setTypeSelect(a.type);
            setCustomType("");
          } else {
            setTypeSelect("Lainnya");
            setCustomType(a.type);
          }

          setCredentialCode(a.credentialCode || "");
          setSortOrder(a.sortOrder);
          setIsPublished(a.isPublished);
          setImagePreview(a.image);

          // Set Indonesian fields
          setTitleId(a.titleId);
          setIssuerTextId(a.issuerTextId);
          setDescriptionId(a.descriptionId || "");
          setDateId(a.dateId);
          setTagsId(a.tagsId || []);

          // Set English fields
          setTitleEn(a.titleEn);
          setIssuerTextEn(a.issuerTextEn);
          setDescriptionEn(a.descriptionEn || "");
          setDateEn(a.dateEn);
          setTagsEn(a.tagsEn || []);
        } else {
          toast.error("Achievement tidak ditemukan");
          navigate("/fw-admin/achievements");
        }
      } catch (error) {
        console.error("Fetch achievement details error:", error);
        toast.error("Gagal mengambil detail achievement");
        navigate("/fw-admin/achievements");
      } finally {
        setLoading(false);
      }
    };

    fetchAchievement();
  }, [id, isEditMode, navigate]);

  // Image Selection Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar. Maksimal 5MB.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Tag Handlers (Indonesia)
  const addTagId = () => {
    const trimmed = tagIdInput.trim();
    if (trimmed && !tagsId.includes(trimmed)) {
      setTagsId([...tagsId, trimmed]);
      setTagIdInput("");
    }
  };

  const removeTagId = (tagToRemove: string) => {
    setTagsId(tagsId.filter((t) => t !== tagToRemove));
  };

  // Tag Handlers (English)
  const addTagEn = () => {
    const trimmed = tagEnInput.trim();
    if (trimmed && !tagsEn.includes(trimmed)) {
      setTagsEn([...tagsEn, trimmed]);
      setTagEnInput("");
    }
  };

  const removeTagEn = (tagToRemove: string) => {
    setTagsEn(tagsEn.filter((t) => t !== tagToRemove));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi Form
    if (!titleId.trim() || !titleEn.trim()) {
      toast.error("Judul (Indonesia & Inggris) wajib diisi!");
      return;
    }
    if (!issuerTextId.trim() || !issuerTextEn.trim()) {
      toast.error("Penerbit (Indonesia & Inggris) wajib diisi!");
      return;
    }
    if (!dateId.trim() || !dateEn.trim()) {
      toast.error("Tanggal terbit (Indonesia & Inggris) wajib diisi! Contoh: DESEMBER 2023");
      return;
    }
    if (!isEditMode && !imageFile) {
      toast.error("File sertifikat / lencana wajib diunggah!");
      return;
    }

    const typeFinal = typeSelect === "Lainnya" ? customType.trim() : typeSelect;
    if (!typeFinal) {
      toast.error("Tipe achievement wajib dipilih atau diisi!");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("titleId", titleId.trim());
      formData.append("titleEn", titleEn.trim());
      formData.append("issuerTextId", issuerTextId.trim());
      formData.append("issuerTextEn", issuerTextEn.trim());
      formData.append("descriptionId", descriptionId.trim());
      formData.append("descriptionEn", descriptionEn.trim());
      formData.append("dateId", dateId.trim().toUpperCase());
      formData.append("dateEn", dateEn.trim().toUpperCase());
      formData.append("type", typeFinal);
      formData.append("credentialCode", credentialCode.trim() || "");
      formData.append("sortOrder", sortOrder.toString());
      formData.append("isPublished", isPublished.toString());
      formData.append("tagsId", JSON.stringify(tagsId));
      formData.append("tagsEn", JSON.stringify(tagsEn));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      let response;
      if (isEditMode) {
        response = await updateAchievement(id!, formData);
      } else {
        response = await createAchievement(formData);
      }

      if (response.success) {
        toast.success(isEditMode ? "Achievement berhasil diperbarui" : "Achievement berhasil ditambahkan");
        navigate("/fw-admin/achievements");
      } else {
        toast.error(response.message || "Gagal menyimpan achievement");
      }
    } catch (error) {
      console.error("Save achievement error:", error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Terjadi kesalahan saat menyimpan data";
      toast.error(errorMessage || "Terjadi kesalahan saat menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Memuat detail achievement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Navigation Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="icon" className="h-9 w-9 border-border bg-card">
          <Link to="/fw-admin/achievements">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isEditMode ? "Edit Achievement" : "Tambah Achievement Baru"}
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {isEditMode ? "Perbarui informasi detail pencapaian Anda." : "Masukkan pencapaian baru Anda untuk ditampilkan di portfolio."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Bilingual Content Form Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="indonesia" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted border border-border">
              <TabsTrigger value="indonesia" className="flex items-center gap-1.5 font-semibold">
                <Globe className="w-4 h-4 text-primary" />
                Bahasa Indonesia
              </TabsTrigger>
              <TabsTrigger value="english" className="flex items-center gap-1.5 font-semibold">
                <Globe className="w-4 h-4 text-primary" />
                English
              </TabsTrigger>
            </TabsList>

            {/* INDONESIAN TAB */}
            <TabsContent value="indonesia">
              <Card className="bg-card border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-md font-semibold">Konten Bilingual (ID)</CardTitle>
                  <CardDescription>Formulir dalam Bahasa Indonesia.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titleId">Nama / Judul Achievement <span className="text-destructive">*</span></Label>
                    <Input
                      id="titleId"
                      placeholder="Masukkan nama sertifikat atau pencapaian..."
                      value={titleId}
                      onChange={(e) => setTitleId(e.target.value)}
                      className="border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issuerTextId">Nama Penerbit <span className="text-destructive">*</span></Label>
                    <Input
                      id="issuerTextId"
                      placeholder="Contoh: PT. Revolusi Citra Edukasi"
                      value={issuerTextId}
                      onChange={(e) => setIssuerTextId(e.target.value)}
                      className="border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateId">Tanggal Terbit (Format bebas, direkomendasikan BULAN TAHUN) <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dateId"
                        placeholder="Contoh: DESEMBER 2023"
                        value={dateId}
                        onChange={(e) => setDateId(e.target.value)}
                        className="pl-10 border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descriptionId">Deskripsi / Penjelasan Singkat (Optional)</Label>
                    <Textarea
                      id="descriptionId"
                      placeholder="Jelaskan mengenai pencapaian Anda, apa yang dipelajari..."
                      value={descriptionId}
                      onChange={(e) => setDescriptionId(e.target.value)}
                      rows={4}
                      className="border-border resize-y"
                    />
                  </div>

                  {/* Indonesian Tags */}
                  <div className="space-y-2">
                    <Label>Tags / Kategori Lencana (ID)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ketik tag dan klik tambah (contoh: Frontend)"
                        value={tagIdInput}
                        onChange={(e) => setTagIdInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTagId())}
                        className="border-border"
                      />
                      <Button type="button" onClick={addTagId} size="sm">
                        Tambah
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {tagsId.length === 0 ? (
                        <span className="text-xs text-muted-foreground italic">Belum ada tag ditambahkan</span>
                      ) : (
                        tagsId.map((tag) => (
                          <Badge key={tag} className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1">
                            {tag}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => removeTagId(tag)} />
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ENGLISH TAB */}
            <TabsContent value="english">
              <Card className="bg-card border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-md font-semibold">Bilingual Content (EN)</CardTitle>
                  <CardDescription>Form in English language.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titleEn">Achievement Name / Title <span className="text-destructive">*</span></Label>
                    <Input
                      id="titleEn"
                      placeholder="Enter certificate or award title..."
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      className="border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issuerTextEn">Issuer Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="issuerTextEn"
                      placeholder="e.g. PT. Revolusi Citra Edukasi"
                      value={issuerTextEn}
                      onChange={(e) => setIssuerTextEn(e.target.value)}
                      className="border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateEn">Issued Date (e.g. MONTH YEAR) <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dateEn"
                        placeholder="e.g. DECEMBER 2023"
                        value={dateEn}
                        onChange={(e) => setDateEn(e.target.value)}
                        className="pl-10 border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descriptionEn">Short Description / Explanation (Optional)</Label>
                    <Textarea
                      id="descriptionEn"
                      placeholder="Explain about your achievement, what was learned..."
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      rows={4}
                      className="border-border resize-y"
                    />
                  </div>

                  {/* English Tags */}
                  <div className="space-y-2">
                    <Label>Tags / Badges Category (EN)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type tag and click add (e.g. Backend)"
                        value={tagEnInput}
                        onChange={(e) => setTagEnInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTagEn())}
                        className="border-border"
                      />
                      <Button type="button" onClick={addTagEn} size="sm">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {tagsEn.length === 0 ? (
                        <span className="text-xs text-muted-foreground italic">No tags added yet</span>
                      ) : (
                        tagsEn.map((tag) => (
                          <Badge key={tag} className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1">
                            {tag}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => removeTagEn(tag)} />
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Side: Non-Translatable & Settings */}
        <div className="space-y-6">
          {/* Certificate Image Upload Card */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-md font-semibold flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                Berkas Achievement
              </CardTitle>
              <CardDescription>Unggah gambar / foto sertifikat penghargaan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              {imagePreview ? (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                    <img
                      src={imagePreview}
                      alt="Certificate Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-border bg-card"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Ganti Gambar
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent/30 transition-colors"
                >
                  <div className="p-3 bg-primary/5 rounded-full border border-primary/10 text-primary">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold">Pilih Berkas Gambar</p>
                  <p className="text-xs text-muted-foreground">Maksimal file 5MB. format JPG/PNG/WebP.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievement Settings Card */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-md font-semibold flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                Pengaturan Tipe & Status
              </CardTitle>
              <CardDescription>Tipe pencapaian, sort order, publish.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type Preset Selector */}
              <div className="space-y-2">
                <Label htmlFor="typeSelect">Tipe Pencapaian</Label>
                <Select value={typeSelect} onValueChange={setTypeSelect}>
                  <SelectTrigger id="typeSelect" className="border-border">
                    <SelectValue placeholder="Pilih Tipe" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {PRESET_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Type Field (shows only when 'Lainnya' is selected) */}
              {typeSelect === "Lainnya" && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="customType">Ketik Tipe Baru <span className="text-destructive">*</span></Label>
                  <Input
                    id="customType"
                    placeholder="Contoh: Kompetisi / Beasiswa"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    className="border-border"
                  />
                </div>
              )}

              {/* Credential Code */}
              <div className="space-y-2">
                <Label htmlFor="credentialCode">ID Kredensial / No. Sertifikat (Optional)</Label>
                <Input
                  id="credentialCode"
                  placeholder="Contoh: CMP/12-23/HCLGA/6256556"
                  value={credentialCode}
                  onChange={(e) => setCredentialCode(e.target.value)}
                  className="border-border"
                />
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Urutan Tampilan</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  placeholder="0"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                  className="border-border"
                />
                <span className="text-muted-foreground text-[10px] sm:text-xs">
                  Semakin kecil angka, posisi pencapaian semakin awal.
                </span>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
                <div className="space-y-0.5">
                  <Label htmlFor="isPublished">Tampilkan di Publik</Label>
                  <p className="text-xs text-muted-foreground">Aktifkan untuk menampilkan di website utama.</p>
                </div>
                <Switch
                  id="isPublished"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex gap-3">
            <Button
              asChild
              type="button"
              variant="outline"
              className="flex-1 border-border bg-card"
              disabled={saving}
            >
              <Link to="/fw-admin/achievements">Batal</Link>
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AchievementFormPage;
