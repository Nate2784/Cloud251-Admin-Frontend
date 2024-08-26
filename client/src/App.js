import React,{useMemo} from 'react'
import { CssBaseline,ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import { themeSettings } from 'themes'
import { BrowserRouter as Router,Routes,Route,Navigate } from 'react-router-dom'

import Layout from 'scenes/layout'
import LoginPage from 'scenes/loginpage'
import Dashboard from 'scenes/dashboard'
import Customers from 'scenes/customers'
import CustomerDetail from 'scenes/customerdetail';
import Users from 'scenes/users'
import UserDetail from 'scenes/userdetail'
import Companies from 'scenes/companies'
import CompanyDetail from 'scenes/companydetail'
import Subscriptions from 'scenes/subscriptions'
import SubscriptionDetail from 'scenes/subscriptiondetail'
import Orders from 'scenes/orders'
import OrderDetail from 'scenes/orderdetail'
import Transactions from 'scenes/transactions'
import TransactionDetail from 'scenes/transactiondetail';
import ExchangeRate from 'scenes/exchangerate';
import Geography from 'scenes/geography'
import Overview from 'scenes/overview'
import Daily from 'scenes/daily'
import Monthly from 'scenes/monthly'
import Breakdown from 'scenes/breakdown'
import Admins from 'scenes/admins'
import Performance from 'scenes/performance'
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
              <Route path="/customers" element={<ProtectedRoute element={Customers} />} />
              <Route path="/customer/:id" element={<ProtectedRoute element={CustomerDetail} />} />
              <Route path="/orders" element={<ProtectedRoute element={Orders} />} />
              <Route path="/orders/:id" element={<ProtectedRoute element={OrderDetail} />} />
              <Route path="/users/:rootUserId" element={<ProtectedRoute element={Users} />} />
              <Route path="/user/:id" element={<ProtectedRoute element={UserDetail} />} />
              <Route path="/companies" element={<ProtectedRoute element={Companies} />} />
              <Route path="/companies/:id" element={<ProtectedRoute element={CompanyDetail} />} />
              <Route path="/subscriptions" element={<ProtectedRoute element={Subscriptions} />} />
              <Route path="/subscriptions/:id" element={<ProtectedRoute element={SubscriptionDetail} />} />
              <Route path="/transactions" element={<ProtectedRoute element={Transactions} />} />
              <Route path="/transactions/:id" element={<ProtectedRoute element={TransactionDetail} />} />
              <Route path="//exchange-rate" element={<ProtectedRoute element={ExchangeRate} />} />
              <Route path="/geography" element={<ProtectedRoute element={Geography} />} />
              <Route path="/overview" element={<ProtectedRoute element={Overview} />} />
              <Route path="/daily" element={<ProtectedRoute element={Daily} />} />
              <Route path="/monthly" element={<ProtectedRoute element={Monthly} />} />
              <Route path="/breakdown" element={<ProtectedRoute element={Breakdown} />} />
              <Route path="/admin" element={<ProtectedRoute element={Admins} />} />
              <Route path="/performance" element={<ProtectedRoute element={Performance} />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;