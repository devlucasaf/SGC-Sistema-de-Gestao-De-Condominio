import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login                from          "./pages/auth/Login";
import Cadastro             from          "./pages/auth/Cadastro";
import RecuperarSenha       from          "./pages/auth/RecuperarSenha";

import CadastroUnidade      from          "./pages/sindico/CadastroUnidade";
import GerenciarReclamacoes from          "./pages/sindico/GerenciarReclamacoes";
import RedefinirSenha       from          "./pages/sindico/RedefinirSenha";
import PainelSindico        from          "./pages/sindico/PainelSindico";

import Home                 from          "./pages/morador/Home";
import AlterarSenha         from          "./pages/morador/AlterarSenha";
import BoletoMorador        from          "./pages/morador/BoletoMorador";
import Entregas             from          "./pages/morador/Entregas";
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
          path="/recuperar-senha"
          element={<RecuperarSenha />}
        />

        <Route
          path="/cadastro-unidade"
          element={
            <RotaPrivada>
              <CadastroUnidade />
            </RotaPrivada>
          }
        />

        <Route
          path="/home"
          element={
            <RotaPrivada>
              <Home />
            </RotaPrivada>
          }
        />

        <Route
          path="/alterar-senha"
          element={
            <RotaPrivada>
              <AlterarSenha />
            </RotaPrivada>
          }
        />

        <Route
          path="/boletomorador"
          element={
            <RotaPrivada>
              <BoletoMorador />
            </RotaPrivada>
          }
        />

        <Route
          path="/entregas"
          element={
            <RotaPrivada>
              <Entregas />
            </RotaPrivada>
          }
        />

        <Route
          path="/reclamacaomorador"
          element={
            <RotaPrivada>
              <ReclamacaoMorador />
            </RotaPrivada>
          }
        />

        <Route
          path="/reservamorador"
          element={
            <RotaPrivada>
              <ReservaMorador />
            </RotaPrivada>
          }
        />

        <Route
          path="/painel-sindico"
          element={
            <RotaPrivada>
              <PainelSindico />
            </RotaPrivada>
          }
        />

        <Route
          path="/gerenciarreclamacoes"
          element={
            <RotaPrivada>
              <GerenciarReclamacoes />
            </RotaPrivada>
          }
        />

        <Route
          path="/redefinir-senha"
          element={
            <RotaPrivada>
              <RedefinirSenha />
            </RotaPrivada>
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
