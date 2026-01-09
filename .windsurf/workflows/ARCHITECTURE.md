# Workflow POS – Gestione Piatti e Categorie

## Obiettivo
Centralizzare **piatti** e **categorie** nel database, eliminando completamente dati statici nel frontend.  
Tutte le viste devono riflettere **esclusivamente** lo stato reale del backend.

---

## Architettura

### Backend
**Stack:** Express.js + MongoDB

---

## Backend

### 1. Modelli

#### Dish
- `name`: String (required)
- `description`: String
- `price`: Number (required)
- `category`: ObjectId (ref: `Category`)
- `image`: Object  
  - `data`: Buffer  
  - `contentType`: String
- `isAvailable`: Boolean (default: true)
- `numberOfOrders`: Number (default: 0)

#### Category
- `name`: String (required, unique)
- `description`: String
- `isActive`: Boolean (default: true)

---

### 2. API Endpoints

#### Piatti
- `GET /api/dishes`  
  Lista di tutti i piatti
- `GET /api/dishes/popular`  
  Piatti popolari (ordinati per numero di ordini)
- `GET /api/dishes/:id`  
  Dettaglio piatto
- `POST /api/dishes`  
  Crea nuovo piatto (con upload immagine)
- `PUT /api/dishes/:id`  
  Aggiorna piatto
- `DELETE /api/dishes/:id`  
  Disattiva piatto
- `GET /api/dishes/:id/image`  
  Recupera immagine piatto

#### Categorie
- `GET /api/categories`  
  Lista categorie attive
- `GET /api/categories/all`  
  Tutte le categorie (incluse quelle disattivate)
- `POST /api/categories`  
  Crea nuova categoria
- `PUT /api/categories/:id`  
  Aggiorna categoria
- `DELETE /api/categories/:id`  
  Disattiva categoria

---

### 3. Middleware
- Autenticazione JWT
- Validazione input
- Gestione upload immagini (Multer)
- Gestione errori centralizzata

---

## Frontend

### Stack
**React.js**

---

### 1. Struttura Componenti

```text
src/
  components/
    dishes/
      DishList.jsx
      DishForm.jsx
      DishCard.jsx
    categories/
      CategoryList.jsx
      CategoryForm.jsx
    common/
      ImageUploader.jsx
      LoadingSpinner.jsx
      ErrorMessage.jsx
