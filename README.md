# Huerta Viva · Web

Web pública de **Huerta Viva**, una tienda online de productos de la huerta (empresa ficticia). Los clientes ven el catálogo y hacen pedidos.

Es una web **estática**: HTML, CSS y JavaScript. No tiene código de servidor ni se conecta a la base de datos. Todos los datos los pide a la API (`huertaviva-api`).

## Cómo se comunica con el resto

```
Navegador del cliente ──HTTP/HTTPS──► Servidor web (ficheros estáticos)
Navegador del cliente ──HTTP/HTTPS──► API_BASE/productos, API_BASE/pedidos
```

| Paso | Quién conecta | Con quién | Para qué |
|---|---|---|---|
| 1 | Navegador del cliente | **Servidor web** donde está desplegada esta web (80/443) | Descargar `index.html`, CSS y JS |
| 2 | Navegador del cliente (el JavaScript de la página) | **La dirección configurada en `API_BASE`** | `GET {API_BASE}/productos` y `POST {API_BASE}/pedidos` |

Ojo: las peticiones a la API **no las hace el servidor web**. Las hace el **navegador del usuario**, desde su equipo.

La dirección de la API se configura en `js/config.js` (`API_BASE`).

## Requisitos

- Ubuntu Server 22.04/24.04 o Debian 12.
- Un servidor web para ficheros estáticos. En estas instrucciones, **Apache 2.4** (`sudo apt install apache2`).
- La API de Huerta Viva funcionando.

## Cómo levantarla

1. Copia los ficheros al servidor:

   ```bash
   sudo mkdir -p /var/www/huertaviva-web
   sudo cp -r index.html css js /var/www/huertaviva-web/
   sudo chown -R root:www-data /var/www/huertaviva-web
   sudo find /var/www/huertaviva-web -type d -exec chmod 750 {} \;
   sudo find /var/www/huertaviva-web -type f -exec chmod 640 {} \;
   ```

2. Ajusta `API_BASE` en `/var/www/huertaviva-web/js/config.js` si hace falta.

3. Configura el servidor web para servir `/var/www/huertaviva-web`.

Para probar con el nombre `www.huertaviva.local`, añádelo al fichero `hosts` de la máquina cliente apuntando a la IP correspondiente.

## Comprobaciones

- Abre la web en el navegador de la máquina cliente.
  - Si ves los productos, la web llega a la API.
  - Si sale *"No se ha podido conectar con la API"*, la página carga pero las peticiones a `API_BASE` fallan. Abre las herramientas de desarrollador (F12) → pestaña **Red** y mira a qué dirección intenta conectar y qué error da.
- Haz un pedido de prueba y comprueba en el panel de administración que aparece.

## Estructura

```
huertaviva-web/
├── index.html      # Página única: catálogo y formulario de pedido
├── css/
│   └── estilos.css
└── js/
    ├── config.js   # Dirección de la API (API_BASE)
    └── app.js      # Carga de productos y envío de pedidos
```
