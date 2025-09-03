import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import SuperAdmin from "./pages/SuperAdmin";
import Application from "./pages/Application";
import LayoutPage from "./pages/LayoutPage";
import Checkout from "./pages/Checkout";
import Sales from "./pages/Sales";
import SalesReturn from "./pages/SalesReturn";
import Quotation from "./pages/Quotation";
import Purchases from "./pages/Purchases";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Brands from "./pages/Brands";
import Customers from "./pages/Customers";
import Employees from "./pages/Employees";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="superadmin" element={<SuperAdmin />} />
            <Route path="application" element={<Application />} />
            <Route path="layout" element={<LayoutPage />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="sales" element={<Sales />} />
            <Route path="sales-return" element={<SalesReturn />} />
            <Route path="quotation" element={<Quotation />} />
            <Route path="purchases" element={<Purchases />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="brands" element={<Brands />} />
            <Route path="customers" element={<Customers />} />
            <Route path="employees" element={<Employees />} />
            <Route path="general-settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
