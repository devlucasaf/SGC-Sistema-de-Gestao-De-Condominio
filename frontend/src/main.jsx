import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

// Importa os estilos
import "./index.css"

// Importa as Telas
import PaginaInicial from "./pages/PaginaInicial.jsx"
import Login from "./pages/Login"
import Cadastro from "./pages/Cadastro"
import CadastroUnidade from "./pages/CadastroUnidade"
import Boleto from "./pages/Boleto.jsx"
import Entregas from "./pages/Entregas.jsx"

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
          path="/paginainicial" 
          element={
            //<RotaPrivada>
              <PaginaInicial />
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
          path="/boleto" 
          element={
            <Boleto />
          } 
        />

        <Route 
          path="/entregas" 
          element={
            <Entregas />
          } 
        />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)