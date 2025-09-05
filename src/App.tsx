import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BusinessProvider } from "@/contexts/BusinessContext";
import Layout from "./components/layout/Layout";
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
import StockIn from "./pages/StockIn";
import Expenses from "./pages/Expenses";
import SalesReport from "./pages/SalesReport";
import Inventory from "./pages/Inventory";
import Units from "./pages/Units";
import Variants from "./pages/Variants";
import Barcode from "./pages/Barcode";
import Suppliers from "./pages/Suppliers";
import NotFound from "./pages/NotFound";
import StockOut from "./pages/StockOut";
import StockTransfer from "./pages/StockTransfer";
import StockReturn from "./pages/StockReturn";
import StockAdjustment from "./pages/StockAdjustment";
import ExpenseCategory from "./pages/ExpenseCategory";
import Income from "./pages/Income";
import IncomeCategory from "./pages/IncomeCategory";
import BankAccounts from "./pages/BankAccounts";
import MoneyTransfer from "./pages/MoneyTransfer";
import BalanceSheet from "./pages/BalanceSheet";
import PurchaseReport from "./pages/PurchaseReport";
import Attendance from "./pages/Attendance";
import Users from "./pages/Users";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BusinessProvider>
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
              <Route path="inventory" element={<Inventory />} />
              <Route path="units" element={<Units />} />
              <Route path="variants" element={<Variants />} />
              <Route path="barcode" element={<Barcode />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="customers" element={<Customers />} />
              <Route path="employees" element={<Employees />} />
              <Route path="settings" element={<Settings />} />
              <Route path="stock-in" element={<StockIn />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="sales-report" element={<SalesReport />} />
              <Route path="stock-out" element={<StockOut />} />
              <Route path="stock-transfer" element={<StockTransfer />} />
              <Route path="stock-return" element={<StockReturn />} />
              <Route path="stock-adjustment" element={<StockAdjustment />} />
              <Route path="expense-category" element={<ExpenseCategory />} />
              <Route path="income" element={<Income />} />
              <Route path="income-category" element={<IncomeCategory />} />
              <Route path="bank-accounts" element={<BankAccounts />} />
              <Route path="money-transfer" element={<MoneyTransfer />} />
              <Route path="balance-sheet" element={<BalanceSheet />} />
              <Route path="purchase-report" element={<PurchaseReport />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="users" element={<Users />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </BusinessProvider>
  </QueryClientProvider>
);

export default App;
