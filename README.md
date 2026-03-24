# 🛒 ListaCompra - Shopping List App

ListaCompra is a modern, premium web application built to manage your shopping lists efficiently. Designed with a stunning UI and a robust **Feature-Based Clean Architecture**, it provides a seamless user experience across devices with full support for internationalization and detailed purchase statistics.

## ✨ Features

- **🛍️ Smart Shopping Lists**: Create, manage, and track your shopping lists. Add products, update quantities, set units, and mark items as collected or completed.
- **📊 Advanced Statistics Dashboards**: Visualize your purchasing habits with detailed charts. Track average spending per supermarket, identify the cheapest options, and analyze product distribution by category with color-coded data blocks.
- **🔒 Secure Authentication**: Built-in user registration and login powered by JWT and bcrypt for secure access to your personal lists.
- **🌍 Multi-language Support (i18n)**: Fully translated interfaces available in **English, Spanish, and Catalan**, complete with standardized high-quality flag icons for seamless switching.
- **🧾 Receipt Scanner Integration**: Modern interface designed for scanning, uploading, and processing shopping receipts automatically.
- **🎨 Premium UI/UX**: Designed with modern web aesthetics—featuring smooth animations, glassmorphism, responsive bento grids, custom typographic hierarchy, and authentic supermarket logos.

## 🏗️ Architecture

The frontend follows a strict **Feature-Based Clean Architecture** implemented in Next.js, ensuring high scalability, maintainability, and clear separation of concerns down the domain line.

```text
Component (UI)
   ↓
Hook (UI Logic)
   ↓
Context (Global State)
   ↓
Repository (Data Access Layer)
   ↓
Datasource (API Handling & HTTP)
   ↓
Django REST API (Backend)
```

Each feature module structurally implements:
- `components/` → Pure React UI components.
- `hooks/` → UI specific logic & domain isolation.
- `contexts/` → Global state management for feature domains.
- `data/sources/` → Direct HTTP calls via standard Fetch/Axios interacting with APIs.
- `data/repository/` → The abstraction layer parsing data to core entities.
- `entity/` → Core data models, interfaces, and TypeScript types.

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Library**: React 18+
- **Language**: TypeScript
- **Styling**: Custom CSS and TailwindCSS 

### Backend
- **Framework**: Python / Django
- **API**: Django REST Framework
- **Database**: SQLite (Development)
- **Auth**: JWT & bcrypt

## 🚀 Getting Started

### Prerequisites

You will need Node.js installed to run the frontend locally. Ensure your backend Django server is active and exposed on `http://localhost:8000` before running the client.

### Installation

1. Clone the repository and navigate to the root directory:
   ```bash
   git clone <repository-url>
   cd shopping-list-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   *or using yarn/pnpm equivalent.*

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to experience the application.

## 📡 Core Application Endpoints (Reference)

The frontend communicates exclusively via structured DTOs with the Django REST API standard endpoints:

- **Shopping Lists**: `GET /lists`, `POST /lists/create`, `PATCH /lists/{id}/complete`, `GET /lists/{id}/items`
- **Products**: `GET /products`, `POST /products/create`
- **List Items**: `POST /items/add`, `PATCH /items/{id}/update`, `DELETE /items/{id}/delete`

## 👨‍💻 Development Guidelines

- **Architecture Compliance**: Do not bypass layers. UI components must remain unaware of the API logic; components rely on Contexts and Hooks.
- **Language Translations**: Spanish and Catalan must be supported for all new UI text elements. English is the default layer.
- **Typing Integrity**: Use purely strict typing for props, entities, and data models.

---

*A robust implementation showcasing frontend design architecture excellence.*
