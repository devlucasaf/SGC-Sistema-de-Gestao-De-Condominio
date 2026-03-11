<img 
    width=100% 
    src="https://capsule-render.vercel.app/api?type=waving&color=A020F0&height=160&section=header&text=SGC&fontSize=50&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Sistema%20de%20Gestão%20de%20Condomínio&descAlignY=58&descSize=18"
/>

<p align="center">
    <img 
        src="https://img.shields.io/badge/status-em%20progresso-yellow?style=for-the-badge" 
    />
    <img 
        src="https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" 
    />
    <img 
        src="https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" 
    />
    <img 
        src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" 
    />
    <img 
        src="https://img.shields.io/badge/license-MIT-A020F0?style=for-the-badge" 
    />
</p>

<br/>

> **SGC** é um sistema web completo para gestão de condomínios, permitindo o controle de moradores, visitantes, encomendas, reservas e muito mais — tudo em uma única plataforma.

---

## 📋 Sobre o Projeto

O **SGC - Sistema de Gestão de Condomínio** foi desenvolvido para digitalizar e simplificar a administração condominial. A plataforma oferece controle centralizado de todas as operações do condomínio, facilitando a comunicação entre porteiros, moradores e administradores.

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura **cliente-servidor (Client-Server)**, com separação clara entre frontend e backend:

- **Frontend:** aplicação React responsável pela interface do usuário.
- **Backend:** API REST desenvolvida com Spring Boot, responsável pelas regras de negócio e acesso ao banco de dados.
- **Banco de Dados:** SQL Server para persistência dos dados.

> 📖 Para mais detalhes sobre a arquitetura utilizada, consulte a [documentação de introdução](https://cloudsupport.dev/manual/introducao/).

---

## 🗂️ Estrutura do Projeto

```
📂 SGC-Sistema-de-Gestao
├── 📂 backend
│   ├── 📂 src/main/java/com/condominio
│   │   ├── 📂 dto/auth                  # DTOs de autenticação
│   │   ├── 📂 entity                    # Entidades JPA
│   │   ├── 📂 infra/security            # Configurações de segurança (JWT)
│   │   └── 📂 modules
│   │       ├── 📂 autenticacao          # Login e controle de acesso
│   │       ├── 📂 encomenda             # Gestão de encomendas
│   │       ├── 📂 morador               # Cadastro de moradores
│   │       ├── 📂 porteiro              # Gestão de porteiros
│   │       ├── 📂 reserva               # Reservas de áreas comuns
│   │       ├── 📂 unidade               # Unidades do condomínio
│   │       ├── 📂 usuario               # Controle de usuários
│   │       ├── 📂 visitante             # Registro de visitantes
│   │       └── SgcApplication.java      # Classe principal
│   └── 📄 pom.xml
└── 📂 frontend
    ├── 📂 src
    │   ├── 📂 components                # Componentes reutilizáveis
    │   ├── 📂 pages                     # Páginas da aplicação
    │   ├── 📂 services                  # Chamadas à API
    │   └── 📂 styles                    # Estilos globais
    └── 📄 package.json
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

Certifique-se de ter instalado em sua máquina:

- [Java 17+](https://adoptium.net/)
- [Node.js 18+](https://nodejs.org/)
- SQL Server rodando na porta padrão `1433`

### 1. Clone o repositório

```bash
git clone https://github.com/devlucasaf/SGC-Sistema-de-Gestao-De-Condominio
cd SGC-Sistema-de-Gestao-De-Condominio
```

### 2. Configure o Backend

```bash
cd backend
```

Edite o arquivo `src/main/resources/application.properties` com as credenciais do seu banco de dados:

```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=sgc
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
```

Em seguida, inicie o servidor:

```bash
./mvnw spring-boot:run
```

> A API ficará disponível em `http://localhost:8080`

### 3. Configure o Frontend

```bash
cd ../frontend
npm install
npm run dev
```

> A aplicação ficará disponível em `http://localhost:5173`

---

## 📌 Funcionalidades

- [x] 🔐 Autenticação e controle de acesso (JWT)
- [x] 👥 Cadastro e gerenciamento de moradores
- [x] 🚪 Controle de visitantes
- [x] 📦 Gestão de encomendas
- [x] 🏊 Reserva de áreas comuns
- [x] 🏠 Gestão de unidades
- [x] 👮 Cadastro de porteiros
- [ ] 📊 Dashboard administrativo
- [ ] 📱 Layout responsivo
- [ ] 🔔 Notificações em tempo real

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
            <sub>BackEnd Developer</sub>
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