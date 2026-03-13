# 🚀 ShiftSync - Gestão Inteligente de Turnos

O **ShiftSync** é uma plataforma mobile de alta performance desenvolvida para facilitar a continuidade operacional entre turnos industriais e técnicos. Através de uma interface reativa e persistência de dados local, o app garante que nenhuma informação crítica seja perdida na transição de equipes.

---

## 👥 1. Governança do Projeto e Equipe

O desenvolvimento foi regido por uma divisão clara de responsabilidades, garantindo a modularidade do código:

| Colaborador | Papel | Entregáveis Principais |
| :--- | :--- | :--- |
| **Emmanuel Cordeiro** | Lead UI/UX & Core | `homeScreen.jsx`, `RegisterScreen.jsx`, Header, Footer e Sistema de Navegação Global. |
| **Keven** | Engenheiro de Acesso | `LoginScreen.jsx`, Validação de formulários e segurança de credenciais. |
| **Marcelo Matheus** | Data Engineer | `historicoScreen.jsx`, manipulação de Arrays JSON e consultas ao Storage. |
| **Erick Gabriel** | Frontend Engineer | `SettingsScreen.jsx`, Lógica de Alternância de Temas e Perfil de Usuário. |

---

## 🛠 2. Especificações Técnicas

### 2.1 Stack Tecnológica
* **Engine:** React Native (v0.7x) via Expo SDK.
* **Linguagem:** JavaScript (ES6+).
* **Navegação:** React Navigation v6 (Stack & Bottom Tabs).
* **Estado Global:** Context API para gerenciamento de tema e sessão.
* **Banco de Dados:** AsyncStorage (Persistência NoSQL local).

### 2.2 Padrões de Projeto (Design Patterns)
* **Componentização:** Interfaces divididas em componentes reutilizáveis.
* **Separation of Concerns:** Lógica de negócio (Hooks) separada da renderização (JSX).
* **Dynamic Styling:** Estilização condicional baseada no estado global de turno.

---

## 📂 3. Arquitetura de Pastas


ShiftSync/
 ├── .expo/               # Configurações do ecossistema Expo
 ├── assets/              # Mídias: icon.png, splash.png, adaptive-icon.png
 ├── src/                 # Source Code
 │    ├── context/        # AuthContext.js (Cérebro do app: temas e auth)
 │    ├── components/     # Componentes compartilhados (Buttons, Cards, Modais)
 │    └── screens/        # Camada de Visão (Telas)
 │         ├── historicoScreen.jsx    # Marcelo Matheus
 │         ├── homeScreen.jsx         # Emmanuel Cordeiro
 │         ├── LoginScreen.jsx        # Keven
 │         ├── RegisterScreen.jsx     # Emmanuel Cordeiro
 │         └── SettingsScreen.jsx     # Erick Gabriel
 ├── App.js               # Root Provider (Navigation Container)
 ├── app.json             # Manifest do Expo
 └── package.json         # Gestão de dependências e Scripts

🔄 4. Fluxo de Lógica e Dados
4.1 Ciclo de Vida da Autenticação

    Registro: O usuário registra-se em RegisterScreen, salvando dados no AsyncStorage.

    Validação: O LoginScreen valida as chaves @user_email e senha.

    Acesso: O AuthContext libera a navegação para a MainStack.

4.2 Lógica de Temas Dinâmicos

O app monitora a chave @user_shift. Ao detectar mudança, o themeColor é atualizado globalmente:

    Turno Manhã: #0284C7 (Azul Sky).

    Turno Tarde: #F59E0B (Laranja Âmbar).

    Turno Noite: #6366F1 (Indigo Night).

💾 5. Modelo de Dados (Persistence Layer)
Chave Storage	Tipo de Dado	Finalidade
@user_name	String	Nome para exibição personalizada.
@user_position	String	Cargo técnico para relatórios.
@user_shift	String	Filtro de tema e categorização de dados.
@reports_log	Array [JSON]	Lista de objetos com registros de máquinas e materiais.
🚀 6. Guia de Instalação e Execução
Pré-requisitos

    Node.js instalado.

    Dispositivo móvel com o app Expo Go ou emulador configurado.

Configuração
Bash

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npx expo start --tunnel

Build (Opcional)
Bash

# Gerar build para Android
eas build --platform android
