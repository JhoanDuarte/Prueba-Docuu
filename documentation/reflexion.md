# Reflexion tecnica

## Escenario de alto volumen (100k ordenes diarias)
- Desacoplar el API de escritura mediante colas (RabbitMQ/Kafka) para procesar ordenes en background y absorber picos, manteniendo el API responsive.
- Escalar la capa de base de datos con particionamiento por rango de fecha o sharding por cliente y habilitar replicas de solo lectura para reportes.
- Introducir un bus de eventos (por ejemplo, Kafka) y microservicios especializados (ordenes, facturacion, notificaciones) coordinados via contratos claros.
- Incorporar cache distribuida (Redis) para queries frecuentes y datos de catalogo, reduciendo carga a MySQL.
- Fortalecer observabilidad con OpenTelemetry + Prometheus/Grafana, alertas basadas en SLIs y trazas distribuidas para diagnosticar cuellos de botella.
- Automatizar despliegues con CI/CD y usar contenedores orquestados (Kubernetes) para ajustar replicas segun demanda.

## Autenticacion y autorizacion
- Mantener JWT de acceso corto (5-10 min) y refresh tokens rotativos almacenados de forma segura (http-only cookie o storage encriptado) con lista de revocacion.
- Implementar un Identity Provider central que emita tokens con claims de rol/permisos, soportando MFA y politicas de complejidad.
- En backend, validar firmas y expiracion de JWT, aplicar middleware de scopes/roles, y limitar refresh por dispositivo.
- En frontend Angular, guardar el access token en memoria + respaldo cifrado minimal (Storage API), renovar mediante interceptor con un solo reintento controlado.
- Proteger rutas con `AuthGuard` y `RoleGuard`, y revocar sesion completa ante signos de robo (refresh invalido o token caducado recurrente).
- Registrar auditoria de sesiones y cambios sensibles, monitoreando uso anomalo para accionar cierres de sesion proactivos.
