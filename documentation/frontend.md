# Guia rapida del frontend

## Requisitos previos
- Node.js 18 o superior.
- Angular CLI opcional (`npm install -g @angular/cli`).

## Instalacion
1. Entrar a la carpeta `frontend`.
2. Ejecutar `npm install` para descargar dependencias.

## Configuracion de entorno
- La API base se controla desde `src/environments.ts` (`apiBase`).
- Por defecto apunta a `http://127.0.0.1:8000`; ajusta la URL si backend corre en otro host o puerto.

## Comandos utiles
- `npm start` o `npm run start`: levanta la aplicacion en modo desarrollo en `http://localhost:4200`.
- `npm run build`: genera artefactos listos para produccion en `dist/`.

## Flujo sugerido
1. Inicia sesion con alguno de los usuarios sembrados (`admin@docuu.test`, etc.).
2. Accede al modulo de ordenes desde `/orders` para ejecutar el CRUD completo.
3. Usa el formulario para validar duplicados de cliente + fecha antes de enviar.

El interceptor de autenticacion anexa el token JWT y gestiona respuestas 401/403 de forma centralizada.
