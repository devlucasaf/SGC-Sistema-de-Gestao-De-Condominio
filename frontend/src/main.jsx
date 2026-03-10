import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

// Importa os estilos
import "./index.css"

// Importa as Telas

// --- TELA DO MORADOR ---
import PaginaInicialMorador from "./pages/morador/PaginaInicialMorador.jsx"
import BoletoMorador from "./pages/morador/BoletoMorador.jsx"
import EntregasMorador from "./pages/morador/EntregasMorador.jsx"
import ReclamacaoMorador from "./pages/morador/ReclamacaoMorador.jsx"
import ReservaMorador from "./pages/morador/ReservaMorador.jsx"

// --- TELA DE LOGIN ---  
import Login from "./pages/auth/Login"
import Cadastro from "./pages/auth/Cadastro"

// --- TELA DO SÍNDICO ---
import CadastroUnidade from "./pages/sindico/CadastroUnidade.jsx"

// --- ROTA PRIVADA ---
import RotaPrivada from "./components/RotaPrivada.jsx"

import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
<React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <Login />
          } 
        />

        <Route 
          path="/cadastro" 
          element={
            <Cadastro />
          } 
        />

        <Route 
          path="/paginainicialmorador" 
          element={
            //<RotaPrivada>
              <PaginaInicialMorador />
            //</RotaPrivada>
          } 
        />

        <Route 
          path="/cadastrounidade" 
          element={
            <CadastroUnidade />
          } 
        />

        <Route 
          path="/boletomorador" 
          element={
            <BoletoMorador />
          } 
        />

        <Route 
          path="/reclamacaomorador" 
          element={
            <ReclamacaoMorador />
          } 
        />

        <Route 
          path="/entregasmorador" 
          element={
            <EntregasMorador />
          } 
        />

        <Route 
          path="/reservamorador" 
          element={
            <ReservaMorador />
          } 
        />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)