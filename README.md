# Adolfo Jurado — Sitio de catálogo y ventas

Versión profesional y responsive del sitio, con secciones reales
(Inicio, Quiénes somos, Catálogo, Actividades, Contáctanos), catálogo
en tarjetas, ventanas modales de una a la vez, y un panel de
"Los más vendidos" que se actualiza solo con cada venta registrada.

## Cómo abrirlo en Visual Studio Code

1. Abre la carpeta del proyecto en VS Code.
2. Instala la extensión **Live Server** (autor: Ritwick Dey).
3. Clic derecho sobre `index.html` → **Open with Live Server**.

## Sobre el logo

El logo que enviaste ya está integrado en `assets/logo.png` y se usa
tanto en el encabezado como en el pie de página.

**Para reemplazarlo más adelante:** solo sustituye ese archivo por otra
imagen (PNG, JPG o SVG con fondo transparente de preferencia) y
consérvale el mismo nombre `logo.png` — así no hay que tocar el código.
Si prefieres usar otro nombre de archivo, cámbialo también en dos
lugares dentro de `index.html`:

```html
<img src="assets/logo.png" alt="Adolfo Jurado" class="brand-logo">
```

Recomendación: usa una imagen de al menos 200px de alto para que se
vea nítida en pantallas grandes.

## Estructura

```
├── index.html          → secciones (hero, catálogo, contacto, etc.)
├── css/style.css        → estilos de marca (rojo/negro, tipografía)
├── js/app.js             → catálogo, ventanas, registro de ventas
└── assets/logo.png       → logo de Adolfo Jurado
```

## Cómo funciona ahora

- **Inicio, Quiénes somos, Actividades, Contáctanos** ya no son
  ventanas emergentes: son secciones reales de la página, a las que
  el menú te lleva con scroll suave. Esto es lo estándar en un sitio
  profesional (mejor para SEO y para compartir enlaces directos).
- **Catálogo**: recrea la estructura del boceto original de tu
  profesor — un rectángulo cruzado por dos diagonales, con el logo al
  centro y una categoría en cada cuadrante (Tecnología, Servicios,
  Alimentos, Educación). Al tocar un cuadrante se abre esa categoría.
  En pantallas pequeñas (celular) este diagrama se reemplaza por una
  lista simple de tarjetas, porque las diagonales son difíciles de
  tocar con precisión en una pantalla táctil chica.
  Dentro de cada categoría: subcategorías → productos con foto real,
  nombre, detalle técnico, precio y botón Comprar.
- **Una sola ventana a la vez**: si ya hay una ventana abierta y haces
  clic en otra categoría o botón, la anterior se cierra automáticamente.
  También puedes cerrar con `Esc` o haciendo clic fuera de la ventana.
- **"Los más vendidos" es 100% dinámico**: cada vez que alguien hace
  clic en "Comprar", esa venta queda registrada en el navegador
  (`localStorage`, clave `aj_ventas`). El panel de "Los más vendidos"
  lee ese registro y arma el ranking en el momento en que lo abres —
  nunca está vacío por defecto, y si aún no hay ventas, muestra un
  mensaje explicando que se irá llenando solo.
- El resto de accesos rápidos (Ofertas de la semana, Liquidación,
  Entidades públicas) están listos para reemplazar su texto por
  contenido real editando `SIMPLE_WINDOWS` en `js/app.js`.

## Importante: esto es un sitio estático (sin backend)

`localStorage` guarda la información **solo en el navegador de cada
visitante** — no es una base de datos compartida entre todos los que
visiten el sitio. Es decir, "Los más vendidos" que ve una persona en
su celular es distinto al que ve otra en su computadora, porque cada
una registra sus propias compras.

Si más adelante quieres que las ventas se compartan entre todos los
visitantes (un ranking real de ventas del negocio, no por persona),
hace falta agregar un backend con una base de datos (por ejemplo,
Firebase, Supabase, o un servidor propio con Node.js). Puedo ayudarte
a montar esa parte cuando quieras dar ese paso — es un cambio de
arquitectura, no solo de diseño.

## Cómo agregar productos nuevos

Todo el catálogo vive en el objeto `CATALOG` al inicio de `js/app.js`.
Para agregar un producto a una subcategoría existente:

```js
{ id: "lenovo-x1", name: "Lenovo X1", price: 620, meta: "Core i7 · 16GB", img: unsplash("FOTO-ID-AQUI") },
```

`meta` es el detalle corto que aparece debajo del nombre (procesador,
capacidad, etc.). `img` es la foto del producto — ver la siguiente
sección para cómo conseguirla.

## Sobre las fotos de producto

Cada producto ya tiene una foto real (no ícono ni emoji), tomada de
Unsplash — banco de fotos de uso libre y gratuito, incluso comercial,
sin necesidad de atribución. Son fotos genéricas del tipo de producto
(una laptop, un dron, una canasta de verduras), no fotos oficiales de
marca, así que sirven como referencia visual pero no son el producto
exacto que vendas.

**Para poner la foto real de un producto tuyo:**

1. Toma o consigue la foto (idealmente cuadrada o 4:3, buena luz).
2. Guárdala en una carpeta nueva `assets/productos/` con un nombre
   simple, ej: `assets/productos/hp-elitebook.jpg`.
3. En `js/app.js`, cambia esa línea de:
   ```js
   img: unsplash("1496181133206-80ce9b88a853")
   ```
   a:
   ```js
   img: "assets/productos/hp-elitebook.jpg"
   ```

No hace falta tocar nada más — el mismo `<img>` en la tarjeta de
producto se adapta automáticamente.

## Cómo reiniciar los datos guardados (para pruebas)

En la consola del navegador (`F12`):

```js
localStorage.clear();
```

Esto borra las ventas registradas y hace que los mensajes de
bienvenida vuelvan a aparecer como primera visita.
