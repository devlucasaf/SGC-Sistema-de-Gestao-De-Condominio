import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login                from          "./pages/auth/Login";
import Cadastro             from          "./pages/auth/Cadastro";

import CadastroUnidade      from          "./pages/sindico/CadastroUnidade";
import GerenciarReclamacoes from          "./pages/sindico/GerenciarReclamacoes";

import Home                 from          "./pages/morador/Home";
import BoletoMorador        from          "./pages/morador/BoletoMorador";
import EntregasMorador      from          "./pages/morador/EntregasMorador";
import ReclamacaoMorador    from          "./pages/morador/ReclamacaoMorador";
import ReservaMorador       from          "./pages/morador/ReservaMorador";

import RotaPrivada          from          "./components/RotaPrivada";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route
            path="/"
            element={
                <Navigate
                    to="/login"
                />
            }
        />
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/cadastro"
          element={<Cadastro />}
        />

        <Route
          path="/cadastro-unidade"
          element={<CadastroUnidade />}
        />

        <Route
          path="/home"
          element={
            //<RotaPrivada>
              <Home />
            //</RotaPrivada>
          }
        />

        <Route
          path="/boletomorador"
          element={
            //<RotaPrivada>
              <BoletoMorador />
            //</RotaPrivada>
          }
        />

        <Route
          path="/entregasmorador"
          element={
            //<RotaPrivada>
              <EntregasMorador />
            //</RotaPrivada>
          }
        />

        <Route
          path="/reclamacaomorador"
          element={
            //<RotaPrivada>
              <ReclamacaoMorador />
            //</RotaPrivada>
          }
        />

        <Route
          path="/reservamorador"
          element={
            //<RotaPrivada>
              <ReservaMorador />
            //</RotaPrivada>
          }
        />

        <Route
          path="/gerenciarreclamacoes"
          element={
            //<RotaPrivada>
              <GerenciarReclamacoes />
            //</RotaPrivada>
          }
        />

        <Route
          path="*"
          element={
            <h2
              style={{
                textAlign: "center",
                marginTop: "50px",
                color: "white"
              }}
            >
              404 - Página não encontrada!
            </h2>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
