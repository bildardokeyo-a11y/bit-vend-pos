import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import SettingsLayout from "./components/layout/SettingsLayout";
import Index from "./pages/Index";
import SuperAdmin from "./pages/SuperAdmin";
import Application from "./pages/Application";
import LayoutPage from "./pages/LayoutPage";
import Checkout from "./pages/Checkout";
import Receipt from "./pages/Receipt";
import Sales from "./pages/Sales";
import SalesReturn from "./pages/SalesReturn";
import Quotation from "./pages/Quotation";
import Purchases from "./pages/Purchases";
import Products from "./pages/Products";
import ProductAdd from "./pages/ProductAdd";
import ProductView from "./pages/ProductView";
import ProductEdit from "./pages/ProductEdit";
import Categories from "./pages/Categories";
import Brands from "./pages/Brands";
import Customers from "./pages/Customers";
import Employees from "./pages/Employees";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Settings Pages
import GeneralSettings from "./pages/settings/GeneralSettings";
import WebSettings from "./pages/settings/WebSettings";
import AppSettings from "./pages/settings/AppSettings";
import SystemSettings from "./pages/settings/SystemSettings";
import FinancialSettings from "./pages/settings/FinancialSettings";
import OtherSettings from "./pages/settings/OtherSettings";
import InvoiceSettings from "./pages/settings/InvoiceSettings";
import InvoiceTemplates from "./pages/settings/InvoiceTemplates";
import SignatureTemplates from "./pages/settings/SignatureTemplates";
import EmailTemplates from "./pages/settings/EmailTemplates";
import Users from "./pages/settings/Users";
import RolesPermissions from "./pages/settings/RolesPermissions";

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
            <Route path="receipt" element={<Receipt />} />
            <Route path="sales" element={<Sales />} />
            <Route path="sales-return" element={<SalesReturn />} />
            <Route path="quotation" element={<Quotation />} />
            <Route path="purchases" element={<Purchases />} />
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<ProductAdd />} />
            <Route path="products/view/:id" element={<ProductView />} />
            <Route path="products/edit/:id" element={<ProductEdit />} />
            <Route path="categories" element={<Categories />} />
            <Route path="brands" element={<Brands />} />
            <Route path="customers" element={<Customers />} />
            <Route path="employees" element={<Employees />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          
          {/* Settings Routes */}
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<Settings />} />
            <Route path="general" element={<GeneralSettings />} />
            <Route path="profile" element={<Settings />} />
            <Route path="security" element={<Settings />} />
            <Route path="notifications" element={<Settings />} />
            <Route path="web" element={<WebSettings />} />
            <Route path="system" element={<SystemSettings />} />
            <Route path="app" element={<AppSettings />} />
            <Route path="invoice" element={<InvoiceSettings />} />
            <Route path="invoice-templates" element={<InvoiceTemplates />} />
            <Route path="email-templates" element={<EmailTemplates />} />
            <Route path="signature-templates" element={<SignatureTemplates />} />
            <Route path="financial" element={<FinancialSettings />} />
            <Route path="users" element={<Users />} />
            <Route path="roles" element={<RolesPermissions />} />
            <Route path="user-profile" element={<Settings />} />
            <Route path="permissions-matrix" element={<Settings />} />
            <Route path="other" element={<OtherSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
