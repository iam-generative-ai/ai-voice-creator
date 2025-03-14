
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AppPage from "./pages/App";
import AdminPage from "./pages/Admin";
import NotFound from "./pages/NotFound";
import AIVoiceCreator from "./pages/AIVoiceCreator";
import TabMenu from "./components/layout/TabMenu";
import Header from "./components/layout/Header";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/app" element={<AppPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/ai-voice-creator" element={<AIVoiceCreator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <TabMenu />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
