# 🌳 Family Health Tree

Aplicación web para crear y visualizar un **árbol genealógico familiar** con registro de **enfermedades y antecedentes médicos**.  
Construida con **React + TypeScript + Vite + TailwindCSS + React Flow** en el frontend y **Node.js + Express + Prisma** en el backend.

---

## 📌 Características

- Autenticación de usuarios (registro / login) con token (JWT).
- Gestión de familiares:
  - Crear, editar y eliminar personas.
  - Definir padre y madre.
  - Notas adicionales por persona.
- Árbol genealógico interactivo:
  - Visualización con **React Flow**.
  - Pan y zoom con ratón o gestos táctiles (mobile-friendly).
  - Indicadores visuales para:
    - Personas con enfermedades.
    - Enfermedades hereditarias.
- Gestión de condiciones médicas:
  - Nombre de la enfermedad.
  - Fecha de diagnóstico.
  - Severidad (leve, moderada, grave).
  - Indicador de si es hereditaria.
  - Estado (activa, controlada, curada).
  - Notas.
- Diseño **responsive / mobile friendly**:
  - Panel lateral en escritorio.
  - Panel inferior tipo “bottom sheet” en móvil.
  - Formularios adaptados para uso táctil.
- API REST organizada (personas, condiciones médicas, auth).

---

## 🧱 Tecnologías

### Frontend
- [Vite](https://vitejs.dev/) + React + TypeScript
- [TailwindCSS](https://tailwindcss.com/)
- [React Router DOM](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zustand](https://zustand-demo.pmnd.rs/) para estado global (auth y familia)
- [React Flow](https://reactflow.dev/) para el árbol
- Axios para llamadas HTTP

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL / SQLite (según cómo lo configures)
- JSON Web Tokens (JWT) para autenticación
- CORS

---

## 🚀 Puesta en marcha

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPO>
cd family-tree