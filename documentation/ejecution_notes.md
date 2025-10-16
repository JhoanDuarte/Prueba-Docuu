# Notas de ejecución local

## Variables de entorno clave

### Backend (`backend/.env`)
- `APP_URL=http://127.0.0.1:8000` — URL base usada por el frontend y para generar enlaces.
- `FRONTEND_URL=http://localhost:4200` — origen permitido en CORS para desarrollo.
- `FRONTEND_URL_ALT=http://127.0.0.1:4200` — alternativa para cuando Angular se sirve usando esta IP.
- `DB_*` (host, puerto, nombre, usuario, contraseña) — credenciales de MySQL.
- `JWT_SECRET` — clave usada por JWT para firmar tokens (`php artisan jwt:secret`).
- `JWT_TTL` (opcional) — minutos de vigencia del access token (por defecto 60).

### Frontend (`frontend/src/environments.ts`)
- `apiBase: 'http://127.0.0.1:8000'` — URL base de la API consumida desde Angular.

## Pasos para levantar el proyecto

1. **Backend**
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan jwt:secret
   php artisan migrate --seed
   php artisan serve --host=127.0.0.1 --port=8000
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   La aplicación se sirve en `http://localhost:4200` (usa el valor de `FRONTEND_URL`).

3. **Credenciales de prueba (seeders)**
   - `admin@docuu.test / admin123`
   - `operator@docuu.test / operator123`
   - `viewer@docuu.test / viewer123`

4. **Endpoints relevantes**
   - `POST /api/auth/login` — recibe `{ email, password }`, devuelve `{ access_token, user, expires_in }`.
   - `POST /api/auth/logout`
   - `GET /api/auth/me`
   - `POST /api/auth/refresh`
   - CRUD de órdenes bajo `/api/orders` (protegido con `auth:api`).

## Comportamiento esperado
- Frontend almacena el token en memoria y lo sincroniza con `localStorage` mínima, agregando `Authorization: Bearer` en cada llamada `/api/**`.
- Ante 401 por expiración, intenta **un** refresh; si falla, limpia sesión y redirige a `/login`.
- Operador puede crear/editar pero **no** eliminar; sólo admin ve el botón “Eliminar”.

