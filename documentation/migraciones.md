# Guia de migraciones del backend

## Requisitos previos
- PHP 8.2 o superior con Composer disponible en la linea de comandos.
- Servidor MySQL 8+ accesible y con una base de datos creada para el proyecto.
- Variables de entorno para la base de datos definidas en el archivo `.env` del backend.

## Preparacion del entorno
1. Desde la carpeta `backend`, instalar dependencias con `composer install`.
2. Crear una copia del archivo de ejemplo de entorno: `copy .env.example .env` (Windows) o `cp .env.example .env` (Linux/Mac).
3. Generar la clave de aplicacion con `php artisan key:generate`.
4. Editar el archivo `.env` y ajustar los valores `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME` y `DB_PASSWORD` para apuntar a tu servidor MySQL.

## Ejecucion de migraciones
- Migrar la base de datos: `php artisan migrate`.
- Sembrar datos base (usuarios y ordenes de ejemplo): `php artisan db:seed` o `php artisan migrate --seed` para ejecutar ambos pasos en una sola instruccion.

## Reversion de cambios
- Revertir la ultima ejecucion: `php artisan migrate:rollback`.
- Vaciar toda la base de datos del proyecto: `php artisan migrate:fresh --seed` (recrea toda la estructura y vuelve a sembrar).

## Verificaciones recomendadas
- Confirmar que la tabla `orders` exista con sus columnas y la restriccion unica (`client_name`, `delivery_date`).
- Validar que los usuarios sembrados tengan contrasenas cifradas y roles `admin`, `operator` y `viewer`.
- Ejecutar `php artisan config:clear` si realizas cambios en el `.env` y la aplicacion no los detecta.

Con estos pasos cualquier integrante del equipo puede preparar y actualizar la base de datos local de forma segura.
