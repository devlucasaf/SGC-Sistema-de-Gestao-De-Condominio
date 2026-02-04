document.addEventListener("DOMContentLoaded", () => {
    // Elementos do formulário de login
    const form = document.querySelector("#loginForm");
    const emailInput = document.querySelector("#email");
    const senhaInput = document.querySelector("#senha");
    const userTypeSelect = document.querySelector("#userType");
    const btnSubmit = document.querySelector("#btnLogin");
    const msgBox = document.querySelector("#msg");
    const toggleSenhaBtn = document.querySelector("#toggleSenha");

    // Elementos para alternar tema 

    const botaoTema = document.querySelector(".tema-toggle");
    const html = document.documentElement;

    // FUNÇÕES DE MENSAGEM 

    function showMessage(text, type = "error") {
        if (!msgBox) {
            return;
        }

        msgBox.textContent = text;
        msgBox.className = `msg ${type}`;
        msgBox.style.display = "block";
        
        // Adicionar atributo data-tipo para compatibilidade com o CSS
        msgBox.setAttribute("data-tipo", type);
    }

    function clearMessage() {
        if (!msgBox) {
            return;
        }

        msgBox.textContent = "";
        msgBox.className = "msg";
        msgBox.style.display = "none";
        msgBox.removeAttribute("data-tipo");
    }

    // FUNÇÕES PARA ALTERNAR TEMA 
    function inicializarTema() {
        // Verificar preferência do sistema ou tema salvo
        const temaSalvo = localStorage.getItem('tema') || 
                        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro');
        
        // Aplicar tema salvo
        html.setAttribute('data-tema', temaSalvo);
        atualizarIconeTema(temaSalvo);
        
        // Adicionar evento ao botão de alternar tema
        if (botaoTema) {
            botaoTema.addEventListener('click', alternarTema);
        }
    }

    function alternarTema() {
        const temaAtual = html.getAttribute('data-tema');
        const novoTema = temaAtual === 'claro' ? 'escuro' : 'claro';
        
        html.setAttribute('data-tema', novoTema);
        localStorage.setItem('tema', novoTema);
        atualizarIconeTema(novoTema);
    }

    function atualizarIconeTema(tema) {
        if (!botaoTema) {
            return;
        }

        botaoTema.textContent = tema === 'claro' ? '🌙' : '☀️';
        botaoTema.setAttribute('aria-label', `Alternar para tema ${tema === 'claro' ? 'escuro' : 'claro'}`);
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
                console.error("Erro no login:", err);
            } finally {
                if (btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = "Entrar";
                }
            }
        });
    }

    // INICIALIZAR TEMA 
    inicializarTema();

    // Observar mudanças no tema do sistema 
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        // Só atualizar se o usuário não tiver escolhido um tema manualmente
        if (!localStorage.getItem('tema')) {
            const novoTema = e.matches ? 'escuro' : 'claro';
            html.setAttribute('data-tema', novoTema);
            atualizarIconeTema(novoTema);
        }
    });
});
