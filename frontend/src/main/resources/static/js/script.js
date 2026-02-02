document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#loginForm");
    const emailInput = document.querySelector("#email");
    const senhaInput = document.querySelector("#senha");
    const userTypeSelect = document.querySelector("#userType");
    const btnSubmit = document.querySelector("#btnLogin");
    const msgBox = document.querySelector("#msg");
    const toggleSenhaBtn = document.querySelector("#toggleSenha");

    function showMessage(text, type = "error") {
        if (!msgBox) {
            return;
        }
        msgBox.textContent = text;
        msgBox.className = `msg ${type}`;
        msgBox.style.display = "block";
    }

    function clearMessage() {
        if (!msgBox) {
            return;
        }
        msgBox.textContent = "";
        msgBox.className = "msg";
        msgBox.style.display = "none";
    }

    // Mostrar/ocultar senha
    if (toggleSenhaBtn && senhaInput) {
        toggleSenhaBtn.addEventListener("click", () => {
            const isPassword = senhaInput.getAttribute("type") === "password";
            senhaInput.setAttribute("type", isPassword ? "text" : "password");
            toggleSenhaBtn.textContent = isPassword ? "Ocultar" : "Mostrar";
        });
    }

    // Submit + fetch
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            clearMessage();

            const username = emailInput?.value?.trim();
            const password = senhaInput?.value?.trim();
            const userType = userTypeSelect?.value;

            if (!username || !password) {
                showMessage("Preencha email e senha.");
                return;
            }

            // loading
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.textContent = "Entrando...";
            }

            try {
                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userType, username, password }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    showMessage(errorText || "Erro ao fazer login.");
                    return;
                }

                const data = await response.json();

                localStorage.setItem("token", data.token);
                localStorage.setItem("userType", data.userType);
                localStorage.setItem("username", data.username);

                showMessage("✅ Login realizado com sucesso!", "success");

            } catch (err) {
                showMessage("Erro inesperado. Verifique se o backend está rodando.");
            } finally {
                if (btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = "Entrar";
                }
            }
        });
    }
});
