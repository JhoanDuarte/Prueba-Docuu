<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Paths
    |--------------------------------------------------------------------------
    |
    | Rutas que deben permitir CORS. 
    | "api/*" abre todas las rutas de tu API.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Methods
    |--------------------------------------------------------------------------
    |
    | Puedes usar ['*'] para permitir todos los métodos HTTP.
    |
    */

    'allowed_methods' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Origins
    |--------------------------------------------------------------------------
    |
    | Para desarrollo: permite Angular (localhost:4200).
    | Luego en producción cambia esto a tu dominio real.
    |
    */

    'allowed_origins' => ['http://localhost:4200'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Headers
    |--------------------------------------------------------------------------
    |
    | ['*'] permite todos los encabezados personalizados.
    |
    */

    'allowed_headers' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | Exposed Headers
    |--------------------------------------------------------------------------
    */

    'exposed_headers' => [],

    /*
    |--------------------------------------------------------------------------
    | Max Age
    |--------------------------------------------------------------------------
    |
    | Tiempo máximo (en segundos) que un navegador puede cachear la respuesta.
    |
    */

    'max_age' => 0,

    /*
    |--------------------------------------------------------------------------
    | Supports Credentials
    |--------------------------------------------------------------------------
    |
    | Si usarás cookies o credenciales cruzadas, cambia a true.
    | Para esta prueba no es necesario.
    |
    */

    'supports_credentials' => false,

];
