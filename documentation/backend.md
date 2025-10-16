# Guia rapida del backend

## Dependencias
- PHP 8.2 o superior.
- Composer 2.x.
- MySQL 8.x (o MariaDB compatible) con una base de datos creada para el proyecto.
- Extensiones PHP: `openssl`, `mbstring`, `pdo_mysql`, `tokenizer`, `ctype`, `json`.

## Instalacion
1. Ir a la carpeta `backend`.
2. Instalar dependencias con `composer install`.
3. Copiar el archivo de entorno: `cp .env.example .env` (Linux/Mac) o `copy .env.example .env` (Windows).
4. Generar la clave de la aplicacion: `php artisan key:generate`.
5. Configurar en `.env` las variables de base de datos (`DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`) y el `JWT_SECRET` (usar `php artisan jwt:secret`).

## Migraciones y seeders
- Ejecutar migraciones: `php artisan migrate`.
- Sembrar datos (usuarios admin/operator/viewer y ordenes de ejemplo): `php artisan db:seed`.
- Para recrear todo desde cero: `php artisan migrate:fresh --seed`.

## Arranque del servidor
- Iniciar el servidor de desarrollo: `php artisan serve` (por defecto en http://127.0.0.1:8000).
- Si se requiere correr cola de trabajos u otros servicios, utilizar `php artisan queue:work` en terminal separada.

## Pruebas rapidas
- Ejecutar pruebas automatizadas: `php artisan test`.
- Verificar autenticacion: usar el endpoint `POST /api/auth/login` con los usuarios sembrados (por ejemplo `admin@docuu.test` / `admin123`).

## Notas
- El middleware `auth:api` protege todos los endpoints de ordenes.
- JWT se refresca mediante `POST /api/auth/refresh`; el frontend maneja refresco y cierre de sesion automaticamente.
