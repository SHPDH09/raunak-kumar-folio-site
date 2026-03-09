import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ImageGallery from "./pages/ImageGallery";
import SocialFeed from "./pages/SocialFeed";
import Tools from "./pages/Tools";
import LeetCode from "./pages/LeetCode";
import Auth from "./pages/Auth";
import AdminPanel from "./pages/AdminPanel";
import UserDashboard from "./pages/UserDashboard";
import Greetings from "./pages/Greetings";
import GreetingView from "./pages/GreetingView";
import AdminGreetings from "./pages/AdminGreetings";

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.97 },
};

const pageTransition = { duration: 0.32, ease: "easeInOut" as const };

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        style={{ minHeight: "100vh" }}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/image-gallery" element={<ImageGallery />} />
          <Route path="/gallery" element={<SocialFeed />} />
          <Route path="/feed" element={<SocialFeed />} />
          <Route path="/leetcode" element={<LeetCode />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/greetings" element={<Greetings />} />
          <Route path="/greeting/:code" element={<GreetingView />} />
          <Route path="/admin/greetings" element={<AdminGreetings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
