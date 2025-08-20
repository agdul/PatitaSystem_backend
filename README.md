# CellShop - Backend

Proyecto backend del e-commerce **CellShop**, desarrollado con **Node.js**, **Express**, **Sequelize** y **PostgreSQL**. Este repositorio expone una API RESTful que administra usuarios, productos, carritos, ventas, métodos de pago, autenticación mediante JWT, y más.

## 📦 Tecnologías principales

* Node.js
* Express
* Sequelize ORM
* PostgreSQL
* JWT (Autenticación)
* Bcrypt
* dotenv
* nodemailer

---

## 🚀 Cómo clonar y levantar el proyecto

### 1. Clonar el repositorio

```
git clone https://github.com/agdul/CellShop_backend.git
cd CellShop_backend
```

### 2. Instalar las dependencias

```
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido (ajustar según tu entorno local):

```
PORT=3001

# DB
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cellshop
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña

# JWT
JWT_SECRET=mi_clave_supersecreta
JWT_EXPIRES=24h

```

> Asegurate de tener una base de datos PostgreSQL llamada `cellshop` creada previamente.

### 4. Crear y ejecutar migraciones

```
npx sequelize-cli db:migrate
```

Opcional: si tenés seeds configurados, podés correrlos con:

```
npx sequelize-cli db:seed:all
```

### 5. Levantar el servidor

```
npm start
```

El servidor estará corriendo en `http://localhost:3000`

---

## 📁 Estructura del proyecto

```
CellShop_backend/
│
├── controllers/          # Lógica de manejo de rutas
├── services/             # Acceso a DB y lógica de negocio
├── handlers/             # Validaciones y errores
├── models/               # Definiciones Sequelize
├── migrations/           # Migraciones de DB
├── routes/               # Endpoints agrupados
├── middlewares/          # JWT, roles, etc.
├── utils/                # Funciones auxiliares
├── config/               # Configuración de Sequelize
├── .env                  # Variables de entorno
├── app.js                # App principal Express
└── README.md
```

---

## 🔐 Autenticación y roles

El sistema utiliza **JWT** para proteger rutas y verificar roles (`admin` o `cliente`). El token debe enviarse en cada request en el header:

```
Authorization: Bearer tu_token_aqui
```

---

## 🧪 Testing de endpoints

Podés probar los endpoints con herramientas como:

* Postman
* Insomnia

También se incluye un archivo `documentación.http` con pruebas prediseñadas (si corresponde).

---

## 🛠 Funcionalidades implementadas

* Registro y login de usuarios (con JWT)
* Gestión de productos y stock
* Sistema de carritos y carrito detalle
* Registro de ventas y detalle de venta
* Métodos de pago (relación N:M)
* Consultas de contacto y respuestas del admin
* Gestión por roles y seguridad de endpoints

---

## 🔗 Frontend

Este backend trabaja en conjunto con el siguiente repositorio frontend:

👉 https://github.com/TongaCasla/CellShop_front

---

## 🧑‍💻 Autor

Desarrollado por [Hamm Abdul](https://github.com/agdul)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-blue?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/abdul-hamm/)
[![GitHub](https://img.shields.io/badge/GitHub-black?logo=github&logoColor=white)](https://github.com/agdul)

---

## 📄 Licencia

Este proyecto está licenciado bajo la MIT License.
