import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getExperienceById, createExperience, updateExperience, Experience } from "../../../services/experienceService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Plus, X, Loader2, Globe, Briefcase, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const ExperienceFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Non-translatable fields state
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isPublished, setIsPublished] = useState<boolean>(true);

  // Translatable fields state (Indonesia)
  const [roleId, setRoleId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [periodId, setPeriodId] = useState("");
  const [durationId, setDurationId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [modeId, setModeId] = useState("");
  const [responsibilitiesId, setResponsibilitiesId] = useState<string[]>([]);
  const [insightId, setInsightId] = useState<string[]>([]);
  const [impactId, setImpactId] = useState<string[]>([]);

  // Translatable fields state (English)
  const [roleEn, setRoleEn] = useState("");
  const [companyEn, setCompanyEn] = useState("");
  const [locationEn, setLocationEn] = useState("");
  const [periodEn, setPeriodEn] = useState("");
  const [durationEn, setDurationEn] = useState("");
  const [typeEn, setTypeEn] = useState("");
  const [modeEn, setModeEn] = useState("");
  const [responsibilitiesEn, setResponsibilitiesEn] = useState<string[]>([]);
  const [insightEn, setInsightEn] = useState<string[]>([]);
  const [impactEn, setImpactEn] = useState<string[]>([]);

  // Array item inputs
  const [respIdInput, setRespIdInput] = useState("");
  const [respEnInput, setRespEnInput] = useState("");
  const [insightIdInput, setInsightIdInput] = useState("");
  const [insightEnInput, setInsightEnInput] = useState("");
  const [impactIdInput, setImpactIdInput] = useState("");
  const [impactEnInput, setImpactEnInput] = useState("");

  // Load existing experience if in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchExperience = async () => {
      setLoading(true);
      try {
        const response = await getExperienceById(id!);
        if (response.success && response.data) {
          const exp = response.data;

          // Set non-translatable fields
          setSortOrder(exp.sortOrder);
          setIsPublished(exp.isPublished);

          // Set Indonesian fields
          setRoleId(exp.roleId);
          setCompanyId(exp.companyId);
          setLocationId(exp.locationId);
          setPeriodId(exp.periodId);
          setDurationId(exp.durationId);
          setTypeId(exp.typeId);
          setModeId(exp.modeId);
          setResponsibilitiesId(exp.responsibilitiesId || []);
          setInsightId(exp.insightId || []);
          setImpactId(exp.impactId || []);

          // Set English fields
          setRoleEn(exp.roleEn);
          setCompanyEn(exp.companyEn);
          setLocationEn(exp.locationEn);
          setPeriodEn(exp.periodEn);
          setDurationEn(exp.durationEn);
          setTypeEn(exp.typeEn);
          setModeEn(exp.modeEn);
          setResponsibilitiesEn(exp.responsibilitiesEn || []);
          setInsightEn(exp.insightEn || []);
          setImpactEn(exp.impactEn || []);
        } else {
          toast.error("Experience tidak ditemukan");
          navigate("/fw-admin/experiences");
        }
      } catch (error) {
        console.error("Fetch experience details error:", error);
        toast.error("Gagal mengambil detail experience");
        navigate("/fw-admin/experiences");
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id, isEditMode, navigate]);

  // Array item helper handlers
  const handleAddItem = (
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const trimmed = input.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      setInput("");
    }
  };

  const handleRemoveItem = (indexToRemove: number, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(list.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!roleId.trim() || !roleEn.trim() || !companyId.trim() || !companyEn.trim()) {
      toast.error("Peran & Perusahaan (Indonesia & Inggris) wajib diisi!");
      return;
    }

    setSaving(true);

    const payload: Partial<Experience> = {
      roleId: roleId.trim(),
      roleEn: roleEn.trim(),
      companyId: companyId.trim(),
      companyEn: companyEn.trim(),
      locationId: locationId.trim(),
      locationEn: locationEn.trim(),
      periodId: periodId.trim(),
      periodEn: periodEn.trim(),
      durationId: durationId.trim(),
      durationEn: durationEn.trim(),
      typeId: typeId.trim(),
      typeEn: typeEn.trim(),
      modeId: modeId.trim(),
      modeEn: modeEn.trim(),
      responsibilitiesId,
      responsibilitiesEn,
      insightId,
      insightEn,
      impactId,
      impactEn,
      sortOrder,
      isPublished,
    };

    try {
      let response;
      if (isEditMode) {
        response = await updateExperience(id!, payload);
      } else {
        response = await createExperience(payload);
      }

      if (response.success) {
        toast.success(isEditMode ? "Experience berhasil diperbarui" : "Experience berhasil ditambahkan");
        navigate("/fw-admin/experiences");
      } else {
        toast.error(response.message || "Gagal menyimpan data experience");
      }
    } catch (error) {
      console.error("Save experience error:", error);
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : "Terjadi kesalahan saat menyimpan data";
      toast.error(errorMessage || "Terjadi kesalahan saat menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <span className="text-muted-foreground text-sm font-medium animate-pulse">Memuat detail experience...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 animate-fade-in">
      {/* Navigation Top */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="h-9 w-9 border-border hover:bg-accent">
            <Link to="/fw-admin/experiences">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{isEditMode ? "Edit Experience" : "Tambah Experience"}</h1>
            <p className="text-xs text-muted-foreground">Isi detail data pengalaman profesional Anda di bawah ini.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Left Side: Bilingual Tabs Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="border-b border-border py-4">
                <CardTitle className="text-md font-semibold flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Informasi Konten Bilingual
                </CardTitle>
                <CardDescription>Masukkan konten dalam Bahasa Indonesia dan English menggunakan tab di bawah.</CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <Tabs defaultValue="indonesia" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-muted/60 mb-6 p-1 rounded-lg">
                    <TabsTrigger value="indonesia" className="rounded-md font-medium text-xs py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                      Bahasa Indonesia
                    </TabsTrigger>
                    <TabsTrigger value="english" className="rounded-md font-medium text-xs py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                      English (UK/US)
                    </TabsTrigger>
                  </TabsList>

                  {/* ID Tab Content */}
                  <TabsContent value="indonesia" className="space-y-5 focus-visible:outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="roleId">Peran / Posisi (ID) <span className="text-destructive">*</span></Label>
                        <Input id="roleId" placeholder="cth: IT Project, Software Engineer" value={roleId} onChange={(e) => setRoleId(e.target.value)} required className="focus-visible:ring-primary/40 border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyId">Perusahaan (ID) <span className="text-destructive">*</span></Label>
                        <Input id="companyId" placeholder="cth: PT. Alkes Fulki Hasya" value={companyId} onChange={(e) => setCompanyId(e.target.value)} required className="focus-visible:ring-primary/40 border-border" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="locationId">Lokasi (ID)</Label>
                        <Input id="locationId" placeholder="cth: Purwokerto, Jawa Tengah" value={locationId} onChange={(e) => setLocationId(e.target.value)} className="focus-visible:ring-primary/40 border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="periodId">Periode (ID)</Label>
                        <Input id="periodId" placeholder="cth: Des 2025 - Jan 2026" value={periodId} onChange={(e) => setPeriodId(e.target.value)} className="focus-visible:ring-primary/40 border-border" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="durationId">Durasi Kerja (ID)</Label>
                        <Input id="durationId" placeholder="cth: 2 Bulan, 1 Tahun" value={durationId} onChange={(e) => setDurationId(e.target.value)} className="focus-visible:ring-primary/40 border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="typeId">Tipe Pekerjaan (ID)</Label>
                        <Input id="typeId" placeholder="cth: Kontrak, Full-time, Magang" value={typeId} onChange={(e) => setTypeId(e.target.value)} className="focus-visible:ring-primary/40 border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="modeId">Mode Kerja (ID)</Label>
                        <Input id="modeId" placeholder="cth: Hybrid, Remote, Onsite" value={modeId} onChange={(e) => setModeId(e.target.value)} className="focus-visible:ring-primary/40 border-border" />
                      </div>
                    </div>

                    <hr className="border-border my-4" />

                    {/* Array Fields: ID */}
                    <div className="space-y-6">
                      {/* Responsibilities ID */}
                      <div className="space-y-3">
                        <Label>Tugas & Tanggung Jawab (ID)</Label>
                        <div className="flex gap-2">
                          <Input placeholder="Tambahkan tugas..." value={respIdInput} onChange={(e) => setRespIdInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddItem(respIdInput, setRespIdInput, responsibilitiesId, setResponsibilitiesId))} className="focus-visible:ring-primary/40 border-border" />
                          <Button type="button" onClick={() => handleAddItem(respIdInput, setRespIdInput, responsibilitiesId, setResponsibilitiesId)} size="sm">
                            <Plus className="w-4 h-4 mr-1" /> Tambah
                          </Button>
                        </div>
                        <ul className="space-y-2">
                          {responsibilitiesId.map((item, index) => (
                            <li key={index} className="flex items-start justify-between bg-muted/40 p-2.5 rounded text-sm text-muted-foreground gap-2">
                              <span className="flex-1">{item}</span>
                              <button type="button" onClick={() => handleRemoveItem(index, responsibilitiesId, setResponsibilitiesId)} className="text-destructive hover:text-destructive/80 transition-colors">
                                <X className="w-4 h-4 mt-0.5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Insight ID */}
                      <div className="space-y-3">
                        <Label>Apa Yang Dipelajari (ID)</Label>
                        <div className="flex gap-2">
                          <Input placeholder="Tambahkan insight..." value={insightIdInput} onChange={(e) => setInsightIdInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddItem(insightIdInput, setInsightIdInput, insightId, setInsightId))} className="focus-visible:ring-primary/40 border-border" />
                          <Button type="button" onClick={() => handleAddItem(insightIdInput, setInsightIdInput, insightId, setInsightId)} size="sm">
                            <Plus className="w-4 h-4 mr-1" /> Tambah
                          </Button>
                        </div>
                        <ul className="space-y-2">
                          {insightId.map((item, index) => (
                            <li key={index} className="flex items-start justify-between bg-muted/40 p-2.5 rounded text-sm text-muted-foreground gap-2">
                              <span className="flex-1">{item}</span>
                              <button type="button" onClick={() => handleRemoveItem(index, insightId, setInsightId)} className="text-destructive hover:text-destructive/80 transition-colors">
                                <X className="w-4 h-4 mt-0.5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Impact ID */}
                      <div className="space-y-3">
                        <Label>Dampak (ID)</Label>
                        <div className="flex gap-2">
                          <Input placeholder="Tambahkan dampak..." value={impactIdInput} onChange={(e) => setImpactIdInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddItem(impactIdInput, setImpactIdInput, impactId, setImpactId))} className="focus-visible:ring-primary/40 border-border" />
                          <Button type="button" onClick={() => handleAddItem(impactIdInput, setImpactIdInput, impactId, setImpactId)} size="sm">
                            <Plus className="w-4 h-4 mr-1" /> Tambah
                          </Button>
                        </div>
                        <ul className="space-y-2">
                          {impactId.map((item, index) => (
                            <li key={index} className="flex items-start justify-between bg-muted/40 p-2.5 rounded text-sm text-muted-foreground gap-2">
                              <span className="flex-1">{item}</span>
                              <button type="button" onClick={() => handleRemoveItem(index, impactId, setImpactId)} className="text-destructive hover:text-destructive/80 transition-colors">
                                <X className="w-4 h-4 mt-0.5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  {/* EN Tab Content */}
                  <TabsContent value="english" className="space-y-5 focus-visible:outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="roleEn">Role / Position (EN) <span className="text-destructive">*</span></Label>
                        <Input id="roleEn" placeholder="e.g. IT Project, Software Engineer" value={roleEn} onChange={(e) => setRoleEn(e.target.value)} required className="focus-visible:ring-primary/40 border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyEn">Company (EN) <span className="text-destructive">*</span></Label>
                        <Input id="companyEn" placeholder="e.g. PT. Alkes Fulki Hasya" value={companyEn} onChange={(e) => setCompanyEn(e.target.value)} required className="focus-visible:ring-primary/40 border-border" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="locationEn">Location (EN)</Label>
                        <Input id="locationEn" placeholder="e.g. Purwokerto, Central Java" value={locationEn} onChange={(e) => setLocationEn(e.target.value)} className="focus-visible:ring-primary/40 border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="periodEn">Period (EN)</Label>
                        <Input id="periodEn" placeholder="e.g. Dec 2025 - Jan 2026" value={periodEn} onChange={(e) => setPeriodEn(e.target.value)} className="focus-visible:ring-primary/40 border-border" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="durationEn">Work Duration (EN)</Label>
                        <Input id="durationEn" placeholder="e.g. 2 Months, 1 Year" value={durationEn} onChange={(e) => setDurationEn(e.target.value)} className="focus-visible:ring-primary/40 border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="typeEn">Employment Type (EN)</Label>
                        <Input id="typeEn" placeholder="e.g. Contract, Full-time, Internship" value={typeEn} onChange={(e) => setTypeEn(e.target.value)} className="focus-visible:ring-primary/40 border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="modeEn">Work Mode (EN)</Label>
                        <Input id="modeEn" placeholder="e.g. Hybrid, Remote, Onsite" value={modeEn} onChange={(e) => setModeEn(e.target.value)} className="focus-visible:ring-primary/40 border-border" />
                      </div>
                    </div>

                    <hr className="border-border my-4" />

                    {/* Array Fields: EN */}
                    <div className="space-y-6">
                      {/* Responsibilities EN */}
                      <div className="space-y-3">
                        <Label>Responsibilities & Tasks (EN)</Label>
                        <div className="flex gap-2">
                          <Input placeholder="Add responsibility..." value={respEnInput} onChange={(e) => setRespEnInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddItem(respEnInput, setRespEnInput, responsibilitiesEn, setResponsibilitiesEn))} className="focus-visible:ring-primary/40 border-border" />
                          <Button type="button" onClick={() => handleAddItem(respEnInput, setRespEnInput, responsibilitiesEn, setResponsibilitiesEn)} size="sm">
                            <Plus className="w-4 h-4 mr-1" /> Add
                          </Button>
                        </div>
                        <ul className="space-y-2">
                          {responsibilitiesEn.map((item, index) => (
                            <li key={index} className="flex items-start justify-between bg-muted/40 p-2.5 rounded text-sm text-muted-foreground gap-2">
                              <span className="flex-1">{item}</span>
                              <button type="button" onClick={() => handleRemoveItem(index, responsibilitiesEn, setResponsibilitiesEn)} className="text-destructive hover:text-destructive/80 transition-colors">
                                <X className="w-4 h-4 mt-0.5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Insight EN */}
                      <div className="space-y-3">
                        <Label>What I Learned (EN)</Label>
                        <div className="flex gap-2">
                          <Input placeholder="Add insight..." value={insightEnInput} onChange={(e) => setInsightEnInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddItem(insightEnInput, setInsightEnInput, insightEn, setInsightEn))} className="focus-visible:ring-primary/40 border-border" />
                          <Button type="button" onClick={() => handleAddItem(insightEnInput, setInsightEnInput, insightEn, setInsightEn)} size="sm">
                            <Plus className="w-4 h-4 mr-1" /> Add
                          </Button>
                        </div>
                        <ul className="space-y-2">
                          {insightEn.map((item, index) => (
                            <li key={index} className="flex items-start justify-between bg-muted/40 p-2.5 rounded text-sm text-muted-foreground gap-2">
                              <span className="flex-1">{item}</span>
                              <button type="button" onClick={() => handleRemoveItem(index, insightEn, setInsightEn)} className="text-destructive hover:text-destructive/80 transition-colors">
                                <X className="w-4 h-4 mt-0.5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Impact EN */}
                      <div className="space-y-3">
                        <Label>Impact (EN)</Label>
                        <div className="flex gap-2">
                          <Input placeholder="Add impact..." value={impactEnInput} onChange={(e) => setImpactEnInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddItem(impactEnInput, setImpactEnInput, impactEn, setImpactEn))} className="focus-visible:ring-primary/40 border-border" />
                          <Button type="button" onClick={() => handleAddItem(impactEnInput, setImpactEnInput, impactEn, setImpactEn)} size="sm">
                            <Plus className="w-4 h-4 mr-1" /> Add
                          </Button>
                        </div>
                        <ul className="space-y-2">
                          {impactEn.map((item, index) => (
                            <li key={index} className="flex items-start justify-between bg-muted/40 p-2.5 rounded text-sm text-muted-foreground gap-2">
                              <span className="flex-1">{item}</span>
                              <button type="button" onClick={() => handleRemoveItem(index, impactEn, setImpactEn)} className="text-destructive hover:text-destructive/80 transition-colors">
                                <X className="w-4 h-4 mt-0.5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Form Right Side: Settings & Options */}
          <div className="space-y-6">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="border-b border-border py-4">
                <CardTitle className="text-md font-semibold flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  Pengaturan Halaman
                </CardTitle>
                <CardDescription>Sesuaikan tampilan dan status publikasi di sini.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Sort Order */}
                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Urutan Tampilan (Sort Order)</Label>
                  <Input id="sortOrder" type="number" min="0" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)} className="focus-visible:ring-primary/40 border-border" />
                  <p className="text-[11px] text-muted-foreground">Urutan lebih kecil (misal: 1) akan ditampilkan paling atas.</p>
                </div>

                <hr className="border-border" />

                {/* Published Toggle */}
                <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border border-border/60">
                  <div className="flex flex-col gap-0.5">
                    <Label htmlFor="isPublished">Publikasikan Data</Label>
                    <span className="text-[10px] text-muted-foreground">Tampilkan data ini di halaman utama.</span>
                  </div>
                  <Switch id="isPublished" checked={isPublished} onCheckedChange={setIsPublished} />
                </div>
              </CardContent>
            </Card>

            {/* Submit Action Card */}
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                  <Button type="submit" disabled={saving} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm gap-2">
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Simpan Data
                      </>
                    )}
                  </Button>
                  <Button asChild variant="outline" className="w-full border-border">
                    <Link to="/fw-admin/experiences">Batal</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Validation Info Alert */}
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500/90 rounded-lg p-3 text-xs flex gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Catatan Penting</p>
                <p className="leading-normal">Untuk data multi-bahasa, pastikan teks di tab Indonesia dan English terisi dengan padanan kata yang tepat.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExperienceFormPage;
