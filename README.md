<img 
    width=100% 
    src="https://capsule-render.vercel.app/api?type=waving&color=A020F0&height=120&section=header"
/>

<p align="center">
    <img 
        src="https://img.shields.io/badge/status-em%20progresso-yellow?style=for-the-badge" 
    />
    <img 
        src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" 
    />
    <img 
        src="https://img.shields.io/badge/Spring%20Boot-2.7.14-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" 
    />
    <img 
        src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" 
    />
    <img 
        src="https://img.shields.io/badge/SQL%20Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white" 
    />
    <img 
        src="https://img.shields.io/badge/license-MIT-A020F0?style=for-the-badge" 
    />
</p>

<br/>

> **SGC** é um sistema web completo para gestão de condomínios, permitindo o controle de moradores, porteiros, encomendas, reservas, boletos, reclamações, solicitações e muito mais — tudo em uma única plataforma.

---

## 📋 Sobre o Projeto

O **SGC - Sistema de Gestão de Condomínio** foi desenvolvido para digitalizar e simplificar a administração condominial. A plataforma oferece controle centralizado de todas as operações do condomínio, facilitando a comunicação entre **síndico**, **porteiros** e **moradores**.
---

## 🏗️ Arquitetura

O projeto segue uma arquitetura **cliente-servidor (Client-Server)**, com separação clara entre frontend e backend:

- **Frontend:** React 18 + Vite, responsável pela interface do usuário
- **Backend:** API REST com Spring Boot 2.7.14, Spring Security (JWT Stateless), Spring Data JPA
- **Banco de Dados:** SQL Server (produção) / H2 (testes)
- **Segurança:** JWT para autenticação, BCrypt para senhas, CORS configurado globalmente
- **Padrão DTO:** Separação completa entre entidades JPA e objetos de transferência

> 📖 Para mais detalhes sobre a arquitetura utilizada, consulte a [documentação de introdução](https://cloudsupport.dev/manual/introducao/).

---

## 🗂️ Estrutura do Projeto

```
📂 SGC-Sistema-de-Gestao-De-Condominio
├── 📂 backend
│   ├── 📂 src/main/java/com/condominio
│   │   ├── 📂 dto/auth                  # DTOs de autenticação
│   │   ├── 📂 entity                    # Entidades JPA
│   │   ├── 📂 exception                 # Tratamento global de erros
│   │   ├── 📂 infra                     # Camada de infraestrutura
│   │   │   ├── 📂 config                # Configurações gerais + DataSeeder
│   │   │   ├── 📂 pagination            # Classes utilitárias para paginação
│   │   │   └── 📂 security              # JWT, SecurityConfig, SecurityFilter
│   │   └── 📂 modules                   # Módulos de negócio
│   │       ├── 📂 autenticacao           # Login e controle de acesso
│   │       ├── 📂 aviso                  # Mural de avisos
│   │       ├── 📂 documento              # Gerenciamento de documentos
│   │       ├── 📂 encomenda              # Gestão de encomendas
│   │       ├── 📂 financeiro             # Boletos (geração automática)
│   │       ├── 📂 infracao               # Multas e advertências
│   │       ├── 📂 morador                # Cadastro de moradores
│   │       ├── 📂 porteiro               # Gestão de porteiros
│   │       ├── 📂 reclamacao             # Central de reclamações
│   │       ├── 📂 reserva                # Reservas de áreas comuns
│   │       ├── 📂 sindico                # Controle de síndico
│   │       ├── 📂 solicitacao            # Solicitações 
│   │       ├── 📂 unidade                # Unidades do condomínio
│   │       ├── 📂 usuario                # Controle de usuários 
│   │       └── 📂 visitante              # Registro de visitantes
│   └── 📄 pom.xml
├── 📂 frontend
│   ├── 📂 src
│   │   ├── 📂 components                # Componentes reutilizáveis (Toast, Loading, RotaPrivada)
│   │   ├── 📂 pages
│   │   │   ├── 📂 auth                  # Login, Cadastro, RecuperarSenha
│   │   │   ├── 📂 morador               # Home, Boleto, Entregas, Reserva, Reclamação, Solicitações...
│   │   │   ├── 📂 portaria              # PainelPorteiro + components/
│   │   │   └── 📂 sindico               # PainelSindico + components/
│   │   ├── 📂 services                  # api.js, authService.js, perfilService.js
│   │   └── 📂 styles                    # CSS de cada página
│   └── 📄 package.json
└── 📄 README.md
```

---

## 🛠️ Tecnologias

<div align="center">
    <img 
        alt="Java" 
        title="Java" 
        width="40px" 
        style="padding: 5px;" 
        src="https://skillicons.dev/icons?i=java" 
    />
    <img 
        alt="Spring" 
        title="Spring" 
        width="40px" 
        style="padding: 5px;" 
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg" 
    />
    <img 
        alt="JavaScript" 
        title="JavaScript" 
        width="40px" 
        style="padding: 5px;" 
        src="https://skillicons.dev/icons?i=javascript" 
    />
    <img 
        alt="React" 
        title="React" 
        width="40px" 
        style="padding: 5px;" 
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" 
    />
    <img 
        alt="Vite" 
        title="Vite" 
        width="40px" 
        style="padding: 5px;" 
        src="https://skillicons.dev/icons?i=vite" 
    />
    <img 
        alt="HTML" 
        title="HTML" 
        width="40px" 
        style="padding: 5px;" 
        src="https://skillicons.dev/icons?i=html" 
    />
    <img 
        alt="CSS" 
        title="CSS" 
        width="40px" 
        style="padding: 5px;" 
        src="https://skillicons.dev/icons?i=css" 
    />
    <img 
        alt="Git" 
        title="Git" 
        width="40px" 
        style="padding: 5px;" 
        src="https://skillicons.dev/icons?i=git" 
    />
    <img 
        alt="GitHub" 
        title="GitHub" 
        width="40px" 
        style="padding: 5px;" 
        src="https://skillicons.dev/icons?i=github" 
    />
    <img 
        alt="GitLab" 
        title="GitLab" 
        width="40px" 
        style="padding: 5px;" 
        src="https://skillicons.dev/icons?i=gitlab" 
    />
    <img 
        alt="IntelliJ" 
        title="IntelliJ IDEA" 
        width="40px" 
        style="padding: 5px;" 
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/intellij/intellij-original.svg" 
    />
    <img 
        alt="VS Code" 
        title="VS Code" 
        width="40px" 
        style="padding: 5px;" 
        src="https://skillicons.dev/icons?i=vscode" 
    />
</div>

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- [Java 17+](https://adoptium.net/)
- [Node.js 18+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/sql-server) rodando na porta `1433`
- [Maven](https://maven.apache.org/) (ou use o wrapper `mvnw` incluso)

### 1. Clone o repositório

```bash
git clone https://github.com/devlucasaf/SGC-Sistema-de-Gestao-De-Condominio.git
cd SGC-Sistema-de-Gestao-De-Condominio
```

### 2. Configure o Backend

```bash
cd backend
```

Crie o arquivo `src/main/resources/application-local.properties` baseado no exemplo:

```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=sgc;encrypt=true;trustServerCertificate=true
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

api.security.token.secret=sua-chave-secreta-jwt
```

Inicie o servidor:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

> ✅ API disponível em `http://localhost:8080`  
> 📚 Swagger disponível em `http://localhost:8080/swagger-ui/index.html`

### 3. Configure o Frontend

```bash
cd ../frontend
npm install
npm run dev
```

> ✅ Aplicação disponível em `http://localhost:5173`

---

## 👤 Desenvolvedor

<table>
    <tr>
        <td align="center">
            <a href="https://github.com/devlucasaf">
                <img 
                    src="https://github.com/devlucasaf.png" 
                    width="80px;" 
                    style="border-radius: 50%;" 
                    alt="Lucas Freitas"
                />
                <br/>
                <sub><b>Lucas Freitas</b></sub>
            </a><br/>
            <sub>Fullstack Developer</sub>
        </td>
    </tr>
</table>

---

## 🏆 Licença

Este projeto está sob a licença **MIT**. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.

<img 
    width=100% 
    src="https://capsule-render.vercel.app/api?type=waving&color=A020F0&height=120&section=footer"
/>