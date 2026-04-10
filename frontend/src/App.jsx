import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/Toast";

import Login                from          "./pages/auth/Login";
import Cadastro             from          "./pages/auth/Cadastro";
import RecuperarSenha       from          "./pages/auth/RecuperarSenha";

import CadastroUnidade      from          "./pages/sindico/CadastroUnidade";
import GerenciarReclamacoes from          "./pages/sindico/GerenciarReclamacoes";
import RedefinirSenha       from          "./pages/sindico/RedefinirSenha";
import PainelSindico        from          "./pages/sindico/PainelSindico";

import Home                 from          "./pages/morador/Home";
import AtualizarCadastro    from          "./pages/morador/AtualizarCadastro";
import MinhaUnidade         from          "./pages/morador/MinhaUnidade";
import AlterarSenha         from          "./pages/morador/AlterarSenha";
import BoletoMorador        from          "./pages/morador/BoletoMorador";
import Entregas             from          "./pages/morador/Entregas";
import ReclamacaoMorador    from          "./pages/morador/ReclamacaoMorador";
import ReservaMorador       from          "./pages/morador/ReservaMorador";

import RotaPrivada          from          "./components/RotaPrivada";

import "./App.css";
import "./styles/Toast.css";

function App() {
  return (
    <ToastProvider>
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
          path="/atualizar-cadastro"
          element={
            <RotaPrivada>
              <AtualizarCadastro />
            </RotaPrivada>
          }
        />

        <Route
          path="/minha-unidade"
          element={
            <RotaPrivada>
              <MinhaUnidade />
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
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              gap: "16px",
              padding: "20px",
            }}>
              <h1 style={{ fontSize: "4rem", margin: 0, color: "#2ecc71" }}>404</h1>
              <h2 style={{ margin: 0, color: "var(--text-primary, white)" }}>
                Página não encontrada
              </h2>
              <p style={{ color: "var(--text-muted, #888)", textAlign: "center" }}>
                A página que você procura não existe ou foi movida.
              </p>
              <a
                href="/login"
                style={{
                  marginTop: "10px",
                  padding: "10px 24px",
                  background: "#2ecc71",
                  color: "white",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Voltar ao Início
              </a>
            </div>
          }
        />
      </Routes>
    </Router>
    </ToastProvider>
  );
}

export default App;
