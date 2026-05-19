import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getProjectById, createProject, updateProject } from "../../../services/projectService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload, Plus, X, Loader2, Sparkles, Check, Globe, HelpCircle, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";


const ProjectFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Non-translatable fields state
  const [category, setCategory] = useState<string>("Web");
  const [tech, setTech] = useState<string[]>([]);
  const [techInput, setTechInput] = useState<string>("");
  const [demolink, setDemolink] = useState<string>("");
  const [sourcelink, setSourcelink] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isPublished, setIsPublished] = useState<boolean>(true);

  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Translatable fields state (Indonesia)
  const [titleId, setTitleId] = useState("");
  const [descriptionId, setDescriptionId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [problemId, setProblemId] = useState("");
  const [impactId, setImpactId] = useState("");
  const [featuresId, setFeaturesId] = useState<string[]>([]);
  const [featureIdInput, setFeatureIdInput] = useState("");

  // Translatable fields state (English)
  const [titleEn, setTitleEn] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [roleEn, setRoleEn] = useState("");
  const [problemEn, setProblemEn] = useState("");
  const [impactEn, setImpactEn] = useState("");
  const [featuresEn, setFeaturesEn] = useState<string[]>([]);
  const [featureEnInput, setFeatureEnInput] = useState("");

  // Load existing project if in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchProject = async () => {
      setLoading(true);
      try {
        const response = await getProjectById(id!);
        if (response.success && response.data) {
          const p = response.data;
          // Set non-translatable fields
          setCategory(p.category);
          setTech(p.tech);
          setDemolink(p.demolink || "");
          setSourcelink(p.sourcelink || "");
          setSortOrder(p.sortOrder);
          setIsPublished(p.isPublished);
          setImagePreview(p.image);

          // Set Indonesian fields
          setTitleId(p.titleId);
          setDescriptionId(p.descriptionId);
          setRoleId(p.roleId);
          setProblemId(p.problemId);
          setImpactId(p.impactId);
          setFeaturesId(p.featuresId || []);

          // Set English fields
          setTitleEn(p.titleEn);
          setDescriptionEn(p.descriptionEn);
          setRoleEn(p.roleEn);
          setProblemEn(p.problemEn);
          setImpactEn(p.impactEn);
          setFeaturesEn(p.featuresEn || []);
        } else {
          toast.error("Project tidak ditemukan");
          navigate("/fw-admin/projects");
        }
      } catch (error) {
        console.error("Fetch project details error:", error);
        toast.error("Gagal mengambil detail project");
        navigate("/fw-admin/projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
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

  // Tech Stack Handlers
  const addTechTag = () => {
    const trimmed = techInput.trim();
    if (trimmed && !tech.includes(trimmed)) {
      setTech([...tech, trimmed]);
      setTechInput("");
    }
  };

  const removeTechTag = (tagToRemove: string) => {
    setTech(tech.filter((t) => t !== tagToRemove));
  };

  // Indonesian Features Handlers
  const addFeatureId = () => {
    const trimmed = featureIdInput.trim();
    if (trimmed && !featuresId.includes(trimmed)) {
      setFeaturesId([...featuresId, trimmed]);
      setFeatureIdInput("");
    }
  };

  const removeFeatureId = (indexToRemove: number) => {
    setFeaturesId(featuresId.filter((_, idx) => idx !== indexToRemove));
  };

  // English Features Handlers
  const addFeatureEn = () => {
    const trimmed = featureEnInput.trim();
    if (trimmed && !featuresEn.includes(trimmed)) {
      setFeaturesEn([...featuresEn, trimmed]);
      setFeatureEnInput("");
    }
  };

  const removeFeatureEn = (indexToRemove: number) => {
    setFeaturesEn(featuresEn.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi Form
    if (!titleId.trim() || !titleEn.trim()) {
      toast.error("Judul (Indonesia & Inggris) wajib diisi!");
      return;
    }
    if (!descriptionId.trim() || !descriptionEn.trim()) {
      toast.error("Deskripsi (Indonesia & Inggris) wajib diisi!");
      return;
    }
    if (!isEditMode && !imageFile) {
      toast.error("File gambar project wajib diunggah!");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      // Append non-translatable fields
      formData.append("category", category);
      formData.append("tech", JSON.stringify(tech));
      formData.append("demolink", demolink);
      formData.append("sourcelink", sourcelink);
      formData.append("sortOrder", sortOrder.toString());
      formData.append("isPublished", isPublished.toString());

      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Append Indonesian fields
      formData.append("titleId", titleId.trim());
      formData.append("descriptionId", descriptionId.trim());
      formData.append("roleId", roleId.trim());
      formData.append("problemId", problemId.trim());
      formData.append("impactId", impactId.trim());
      formData.append("featuresId", JSON.stringify(featuresId));

      // Append English fields
      formData.append("titleEn", titleEn.trim());
      formData.append("descriptionEn", descriptionEn.trim());
      formData.append("roleEn", roleEn.trim());
      formData.append("problemEn", problemEn.trim());
      formData.append("impactEn", impactEn.trim());
      formData.append("featuresEn", JSON.stringify(featuresEn));

      let response;
      if (isEditMode) {
        response = await updateProject(id!, formData);
      } else {
        response = await createProject(formData);
      }

      if (response.success) {
        toast.success(isEditMode ? "Project berhasil diperbarui" : "Project berhasil ditambahkan");
        navigate("/fw-admin/projects");
      } else {
        toast.error(response.message || "Gagal menyimpan project");
      }
    } catch (error) {
      console.error("Save project error:", error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Terjadi kesalahan saat menyimpan project";
      toast.error(errorMessage || "Terjadi kesalahan saat menyimpan project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Memuat data detail project...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:bg-muted border border-border">
          <Link to="/fw-admin/projects">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditMode ? "Edit Project" : "Tambah Project Baru"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {isEditMode ? "Modifikasi detail informasi project." : "Buat entri proyek baru di database."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Side: Rich Text/Bilingual Forms (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="id" className="w-full">
            <TabsList className="grid grid-cols-2 w-full bg-muted border border-border">
              <TabsTrigger value="id" className="flex items-center gap-1.5 data-[state=active]:bg-background font-semibold">
                <Globe className="w-4 h-4 text-primary" />
                Indonesia
              </TabsTrigger>
              <TabsTrigger value="en" className="flex items-center gap-1.5 data-[state=active]:bg-background font-semibold">
                <Globe className="w-4 h-4 text-primary" />
                English
              </TabsTrigger>
            </TabsList>

            {/* Indonesian Translation Fields */}
            <TabsContent value="id" className="space-y-5 animate-fade-in focus-visible:outline-none">
              <Card className="bg-card border-border shadow-sm">
                <CardHeader className="border-b border-border pb-4">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    Konten Bilingual (ID)
                  </CardTitle>
                  <CardDescription>
                    Isi detail informasi proyek dalam Bahasa Indonesia menggunakan tab di bawah ini.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titleId" className="text-sm font-semibold text-foreground">Judul Proyek (ID)</Label>
                    <Input
                      id="titleId"
                      placeholder="Contoh: Roti Mruyung Sales System"
                      value={titleId}
                      onChange={(e) => setTitleId(e.target.value)}
                      className="border-border focus-visible:ring-primary/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descriptionId" className="text-sm font-semibold text-foreground">Deskripsi Singkat (ID)</Label>
                    <Textarea
                      id="descriptionId"
                      placeholder="Tuliskan deskripsi ringkas tentang apa proyek ini..."
                      rows={3}
                      value={descriptionId}
                      onChange={(e) => setDescriptionId(e.target.value)}
                      className="border-border focus-visible:ring-primary/40 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roleId" className="text-sm font-semibold text-foreground">Peran Anda (ID)</Label>
                    <Textarea
                      id="roleId"
                      placeholder="Contoh: Fullstack Developer — melakukan analisis kebutuhan, merancang database..."
                      rows={3}
                      value={roleId}
                      onChange={(e) => setRoleId(e.target.value)}
                      className="border-border focus-visible:ring-primary/40 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="problemId" className="text-sm font-semibold text-foreground">Permasalahan / Background (ID)</Label>
                    <Textarea
                      id="problemId"
                      placeholder="Masalah apa yang ingin dipecahkan dengan proyek ini..."
                      rows={3}
                      value={problemId}
                      onChange={(e) => setProblemId(e.target.value)}
                      className="border-border focus-visible:ring-primary/40 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="impactId" className="text-sm font-semibold text-foreground">Dampak / Hasil Proyek (ID)</Label>
                    <Textarea
                      id="impactId"
                      placeholder="Dampak nyata yang dihasilkan proyek ini terhadap operasional atau bisnis..."
                      rows={3}
                      value={impactId}
                      onChange={(e) => setImpactId(e.target.value)}
                      className="border-border focus-visible:ring-primary/40 resize-none"
                    />
                  </div>

                  {/* Indonesian Features Tag List */}
                  <div className="space-y-3 pt-3 border-t border-border">
                    <Label className="text-sm font-semibold text-foreground">Daftar Fitur Unggulan (ID)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Contoh: Integrasi WhatsApp API"
                        value={featureIdInput}
                        onChange={(e) => setFeatureIdInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addFeatureId();
                          }
                        }}
                        className="border-border focus-visible:ring-primary/40"
                      />
                      <Button type="button" onClick={addFeatureId} size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* List Items */}
                    <div className="space-y-1.5 mt-2 max-h-[200px] overflow-y-auto pr-1">
                      {featuresId.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">Belum ada fitur ditambahkan.</p>
                      ) : (
                        featuresId.map((feature, index) => (
                          <div key={index} className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-muted rounded border border-border text-foreground">
                            <span className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              {feature}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFeatureId(index)}
                              className="text-muted-foreground hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* English Translation Fields */}
            <TabsContent value="en" className="space-y-5 animate-fade-in focus-visible:outline-none">
              <Card className="bg-card border-border shadow-sm">
                <CardHeader className="border-b border-border pb-4">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    Bilingual Content (EN)
                  </CardTitle>
                  <CardDescription>
                    Fill details project information in English language using the tab below.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titleEn" className="text-sm font-semibold text-foreground">Project Title (EN)</Label>
                    <Input
                      id="titleEn"
                      placeholder="Example: Roti Mruyung Sales System"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      className="border-border focus-visible:ring-primary/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descriptionEn" className="text-sm font-semibold text-foreground">Short Description (EN)</Label>
                    <Textarea
                      id="descriptionEn"
                      placeholder="Write a concise overview of what this project does..."
                      rows={3}
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      className="border-border focus-visible:ring-primary/40 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roleEn" className="text-sm font-semibold text-foreground">Your Role (EN)</Label>
                    <Textarea
                      id="roleEn"
                      placeholder="Example: Fullstack Developer — conducts direct observation, designs company profile..."
                      rows={3}
                      value={roleEn}
                      onChange={(e) => setRoleEn(e.target.value)}
                      className="border-border focus-visible:ring-primary/40 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="problemEn" className="text-sm font-semibold text-foreground">Problem / Background (EN)</Label>
                    <Textarea
                      id="problemEn"
                      placeholder="What issues does this project resolve..."
                      rows={3}
                      value={problemEn}
                      onChange={(e) => setProblemEn(e.target.value)}
                      className="border-border focus-visible:ring-primary/40 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="impactEn" className="text-sm font-semibold text-foreground">Impact / Outcomes (EN)</Label>
                    <Textarea
                      id="impactEn"
                      placeholder="The business or operational results achieved through this project..."
                      rows={3}
                      value={impactEn}
                      onChange={(e) => setImpactEn(e.target.value)}
                      className="border-border focus-visible:ring-primary/40 resize-none"
                    />
                  </div>

                  {/* English Features Tag List */}
                  <div className="space-y-3 pt-3 border-t border-border">
                    <Label className="text-sm font-semibold text-foreground">Key Features List (EN)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Example: WhatsApp API integration"
                        value={featureEnInput}
                        onChange={(e) => setFeatureEnInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addFeatureEn();
                          }
                        }}
                        className="border-border focus-visible:ring-primary/40"
                      />
                      <Button type="button" onClick={addFeatureEn} size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* List Items */}
                    <div className="space-y-1.5 mt-2 max-h-[200px] overflow-y-auto pr-1">
                      {featuresEn.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">No features added yet.</p>
                      ) : (
                        featuresEn.map((feature, index) => (
                          <div key={index} className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-muted rounded border border-border text-foreground">
                            <span className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              {feature}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFeatureEn(index)}
                              className="text-muted-foreground hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Side: Media, Categorization, Settings (Span 1) */}
        <div className="space-y-6">
          {/* Card: Thumbnail Upload */}
          <Card className="bg-card border-border shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                Thumbnail Proyek
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preview Box */}
              <div className="relative border-2 border-dashed border-border rounded-xl aspect-[16/10] overflow-hidden flex flex-col items-center justify-center bg-muted transition hover:border-primary/50 group">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="text-xs font-semibold"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Ganti Gambar
                      </Button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-4 text-center cursor-pointer focus:outline-none w-full h-full"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition duration-300 mb-2" />
                    <span className="text-xs font-semibold text-foreground">Upload Image</span>
                    <span className="text-[10px] text-muted-foreground mt-1">JPEG, PNG, WebP (Maks 5MB)</span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />

              {!imagePreview && (
                <div className="text-[11px] text-amber-500 flex items-start gap-1 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Gambar proyek diperlukan agar proyek dapat ditampilkan dengan benar di public page.</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card: Categorization and Tech Stack */}
          <Card className="bg-card border-border shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Kategori & Tech
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs font-semibold text-foreground">Kategori</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="border-border bg-card">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Web">Web Application</SelectItem>
                    <SelectItem value="Mobile">Mobile Application</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tech Tag Input */}
              <div className="space-y-3 border-t border-border pt-3">
                <Label className="text-xs font-semibold text-foreground">Tumpukan Teknologi (Tech Stack)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Contoh: Laravel, React, Tailwind"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTechTag();
                      }
                    }}
                    className="border-border focus-visible:ring-primary/40 h-9"
                  />
                  <Button type="button" onClick={addTechTag} size="sm" className="h-9">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Tech Badges Container */}
                <div className="flex flex-wrap gap-1.5 mt-2 bg-muted p-2 rounded-lg border border-border min-h-[60px]">
                  {tech.length === 0 ? (
                    <span className="text-[10px] text-muted-foreground italic my-auto">Belum ada tech tag ditambahkan.</span>
                  ) : (
                    tech.map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {t}
                        <button type="button" onClick={() => removeTechTag(t)} className="hover:text-red-500 transition">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Card: External Links & Ordering */}
          <Card className="bg-card border-border shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-primary" />
                Tautan & Urutan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="demolink" className="text-xs font-semibold text-foreground">Link Demo Live (Opsional)</Label>
                <Input
                  id="demolink"
                  placeholder="https://..."
                  value={demolink}
                  onChange={(e) => setDemolink(e.target.value)}
                  className="border-border focus-visible:ring-primary/40 h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sourcelink" className="text-xs font-semibold text-foreground">Link Source Code (Opsional)</Label>
                <Input
                  id="sourcelink"
                  placeholder="https://github.com/..."
                  value={sourcelink}
                  onChange={(e) => setSourcelink(e.target.value)}
                  className="border-border focus-visible:ring-primary/40 h-9"
                />
              </div>

              <div className="space-y-2 border-t border-border pt-3">
                <Label htmlFor="sortOrder" className="text-xs font-semibold text-foreground">Urutan Tampilan (Sort Order)</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  placeholder="0"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                  className="border-border focus-visible:ring-primary/40 h-9"
                />
                <span className="text-[10px] text-muted-foreground block">
                  Nilai lebih kecil akan ditampilkan paling awal pada grid publik.
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="space-y-0.5">
                  <Label htmlFor="isPublished" className="text-xs font-semibold text-foreground cursor-pointer">Status Published</Label>
                  <span className="text-[10px] text-muted-foreground block">
                    Tampilkan project ini di halaman utama.
                  </span>
                </div>
                <Switch
                  id="isPublished"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

            </CardContent>
          </Card>

          {/* Action buttons (Save/Cancel) */}
          <div className="flex flex-row items-center gap-3 pt-2">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 shadow-md h-10 font-semibold"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan
                </>
              )}
            </Button>

            <Button variant="outline" asChild className="w-full border-border text-foreground hover:bg-muted h-10 font-semibold" disabled={saving}>
              <Link to="/fw-admin/projects">Batal</Link>
            </Button>
          </div>

        </div>

      </form>
    </div>
  );
};

export default ProjectFormPage;
