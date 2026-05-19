import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./guards/ProtectedRoute";
import LoginPage from "./features/admin/pages/LoginPage";
import AdminLayout from "./features/admin/layouts/AdminLayout";
import DashboardPage from "./features/admin/pages/DashboardPage";
import ProfilePage from "./features/admin/pages/ProfilePage";
import ProjectsPage from "./features/admin/pages/ProjectsPage";
import ProjectFormPage from "./features/admin/pages/ProjectFormPage";
import AchievementsPage from "./features/admin/pages/AchievementsPage";
import AchievementFormPage from "./features/admin/pages/AchievementFormPage";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <LanguageProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/tentang" element={<Index />} />
                <Route path="/statistik" element={<Index />} />
                <Route path="/pencapaian" element={<Index />} />
                <Route path="/proyek" element={<Index />} />
                <Route path="/kontak" element={<Index />} />

                {/* Admin Routes */}
                <Route path="/fw-admin/login" element={<LoginPage />} />
                <Route
                  path="/fw-admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route path="projects/new" element={<ProjectFormPage />} />
                  <Route path="projects/:id/edit" element={<ProjectFormPage />} />
                  <Route path="achievements" element={<AchievementsPage />} />
                  <Route path="achievements/new" element={<AchievementFormPage />} />
                  <Route path="achievements/:id/edit" element={<AchievementFormPage />} />
                </Route>

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </LanguageProvider>
    <Analytics />
    <SpeedInsights />
  </ThemeProvider>
);

export default App;
