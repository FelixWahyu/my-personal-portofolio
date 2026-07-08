import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getResumeById, createResume, updateResume, Resume } from "../../../services/resumeService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Save, Plus, Loader2, FileText, AlertCircle, Upload, Check } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const ResumeFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [fileName, setFileName] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [existingResume, setExistingResume] = useState<Resume | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchResume = async () => {
      setLoading(true);
      try {
        const response = await getResumeById(id!);
        if (response.success && response.data) {
          const res = response.data;
          setFileName(res.fileName);
          setExistingResume(res);
        } else {
          toast.error("Resume tidak ditemukan");
          navigate("/fw-admin/resumes");
        }
      } catch (error) {
        console.error("Fetch resume details error:", error);
        toast.error("Gagal mengambil detail resume");
        navigate("/fw-admin/resumes");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id, isEditMode, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        toast.error("Hanya file PDF yang diperbolehkan!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal adalah 5MB!");
        return;
      }
      setPdfFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type !== "application/pdf") {
        toast.error("Hanya file PDF yang diperbolehkan!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal adalah 5MB!");
        return;
      }
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fileName.trim()) {
      toast.error("Nama Resume wajib diisi!");
      return;
    }

    if (!isEditMode && !pdfFile) {
      toast.error("File PDF resume wajib diunggah!");
      return;
    }

    setSaving(true);

    const formData = new FormData();
    formData.append("fileName", fileName.trim());
    if (pdfFile) {
      formData.append("file", pdfFile);
    }

    try {
      let response;
      if (isEditMode) {
        response = await updateResume(id!, formData);
      } else {
        response = await createResume(formData);
      }

      if (response.success) {
        toast.success(isEditMode ? "Resume berhasil diperbarui" : "Resume berhasil diunggah");
        navigate("/fw-admin/resumes");
      } else {
        toast.error(response.message || "Gagal menyimpan data resume");
      }
    } catch (error) {
      console.error("Save resume error:", error);
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : "Terjadi kesalahan saat menyimpan data";
      toast.error(errorMessage || "Terjadi kesalahan saat menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <span className="text-muted-foreground text-sm font-medium animate-pulse">Memuat detail resume...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 animate-fade-in">
      {/* Navigation Top */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="h-9 w-9 border-border hover:bg-accent">
            <Link to="/fw-admin/resumes">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{isEditMode ? "Edit Resume" : "Upload Resume"}</h1>
            <p className="text-xs text-muted-foreground">Kelola file PDF resume/CV profesional Anda.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="border-b border-border py-4">
            <CardTitle className="text-md font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Informasi Resume
            </CardTitle>
            <CardDescription>Masukkan nama penanda resume dan unggah file PDF.</CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-5">
            {/* File Label / Name */}
            <div className="space-y-2">
              <Label htmlFor="fileName">
                Nama Resume / CV <span className="text-destructive">*</span>
              </Label>
              <Input id="fileName" placeholder="cth: Resume Felix - Juli 2026" value={fileName} onChange={(e) => setFileName(e.target.value)} required className="focus-visible:ring-primary/40 border-border" />
              <p className="text-[11px] text-muted-foreground">Nama ini akan digunakan sebagai label pengelolaan di admin.</p>
            </div>

            {/* PDF File Upload Zone */}
            <div className="space-y-2">
              <Label>
                File PDF Resume <span className="text-destructive">{!isEditMode && "*"}</span>
              </Label>

              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" className="hidden" />

              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"}`}
              >
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <Upload className="w-6 h-6" />
                </div>
                {pdfFile ? (
                  <div className="text-center space-y-1">
                    <p className="text-sm font-semibold text-foreground flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-500" />
                      {pdfFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(pdfFile.size)}</p>
                  </div>
                ) : (
                  <div className="text-center space-y-1">
                    <p className="text-sm font-semibold text-foreground">Klik untuk mengunggah atau seret file ke sini</p>
                    <p className="text-xs text-muted-foreground">Format PDF, maksimal ukuran 5MB</p>
                  </div>
                )}
              </div>

              {isEditMode && existingResume && !pdfFile && (
                <div className="bg-muted/40 border border-border/60 rounded-lg p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground truncate max-w-[250px]">{existingResume.fileName}</p>
                      <p className="text-[10px] text-muted-foreground">{formatFileSize(existingResume.fileSize)}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                    File Tersimpan
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Box and Actions Container */}
        <div className="flex flex-row md:items-start justify-end gap-6 pt-2">
          {/* Submit Action (Right) */}
          <div className="flex items-center gap-3 w-full md:w-auto md:min-w-[280px] shrink-0">
            <Button asChild variant="outline" type="button" className="w-full bg-card border-border text-foreground hover:bg-muted font-semibold text-sm h-10" disabled={saving}>
              <Link to="/fw-admin/resumes">Batal</Link>
            </Button>
            <Button type="submit" disabled={saving} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm gap-2 text-sm h-10">
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
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResumeFormPage;
