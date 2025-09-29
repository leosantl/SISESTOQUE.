import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { AppLayout } from "@/components/layouts/AppLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Reports from "./pages/Reports";
import Movements from "./pages/Movements";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute>
                <AppLayout>
                  <Products />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/products/new" element={
              <ProtectedRoute>
                <AppLayout>
                  <ProductForm />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/products/edit/:id" element={
              <ProtectedRoute>
                <AppLayout>
                  <ProductForm />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <AppLayout>
                  <Reports />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/movements" element={
              <ProtectedRoute>
                <AppLayout>
                  <Movements />
                </AppLayout>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
