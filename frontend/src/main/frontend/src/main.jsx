import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'

import "./App.css"
import Account from './pages/Account.jsx'
import AddQuote from './pages/AddQuote.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SavedQuotes from './pages/SavedQuotes.jsx'

import "./scss/styles.scss"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />}></Route>

        <Route path="login" element={<LoginPage />}></Route>
        <Route path="account" element={<Account />}></Route>

        <Route path="quotes">
          <Route path="add" element={<AddQuote />}></Route>
          <Route path="SavedQuotes" element={<SavedQuotes />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
