import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Importa os estilos
import './index.css'

// Importa as Telas
import Home from './pages/Home'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'

// Imparta o 'Guarda-costas'
import RotaPrivada from './components/RotaPrivada.jsx'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas (Qualquer um entra) */}
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rota Privada (Só entra com Token) */}
        <Route 
          path="/home" 
          element={
            <RotaPrivada>
              <Home />
            </RotaPrivada>
          } 
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)