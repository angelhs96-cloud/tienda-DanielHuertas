# Tienda ABC — Sistema de ventana(s) tipo escritorio

Réplica funcional del wireframe de pizarra: diagrama radial de categorías,
ventanas de selección de producto, mensaje de bienvenida que solo aparece
la primera vez por subcategoría, y ventana de confirmación de venta.

## Cómo abrirlo en Visual Studio Code

1. Descomprime el `.zip` y abre la carpeta `tienda-abc` en VS Code
   (`Archivo → Abrir carpeta...`).
2. Instala la extensión **Live Server** (autor: Ritwick Dey) desde el
   panel de extensiones (`Ctrl+Shift+X`, busca "Live Server").
3. Clic derecho sobre `index.html` → **Open with Live Server**.
   El navegador se abrirá en `http://127.0.0.1:5500/` (o similar).

No requiere Node.js, npm ni ningún framework: es HTML/CSS/JS puro,
así que también funciona si simplemente abres `index.html` con doble
clic (algunos navegadores restringen `localStorage` en `file://`,
por eso se recomienda Live Server).

## Estructura de archivos

```
tienda-abc/
├── index.html          → estructura de la página (header, sidebar, diagrama)
├── css/
│   └── style.css        → estilos (paleta, ventanas, modal, diagrama)
└── js/
    └── app.js            → toda la lógica (catálogo, ventanas, flujo de venta)
```

## Cómo funciona el flujo (igual al de la pizarra)

1. El usuario hace clic en un nodo del diagrama central (ej. **Tecnología**).
2. Se abre una ventana con las subcategorías (**PCs y laptops**, **Móviles**,
   **Drones**).
3. Al elegir una subcategoría:
   - **Primera vez**: aparece un modal de bienvenida ("¡Bienvenido a PCs
     y laptops!") con botón **Aceptar**.
   - **Siguientes veces**: el modal ya no aparece (se recuerda con
     `localStorage`).
4. Se abre la ventana **"Seleccione un producto"** → botón **Aceptar**.
5. Se abre el listado de productos con precio y botón **Comprar**
   (ej. HP 123 — $500.00, IBM 395 — $450.00, Samsung — $350.00).
6. Al comprar, se abre la ventana **"Venta confirmada"** con el mensaje
   *Vendido [producto] $[precio]*, igual que en el boceto.

Las ventanas se pueden arrastrar desde su barra superior y cerrar con
el botón ✕, simulando un mini sistema de ventanas de escritorio.

## Cómo agregar productos o categorías nuevas

Todo el catálogo vive en un solo objeto al inicio de `js/app.js`,
llamado `CATALOG`. Para agregar un producto nuevo a "PCs y laptops":

```js
{ id: "lenovo-x1", name: "Lenovo X1", price: 620 },
```

Para agregar una subcategoría nueva dentro de una categoría, copia el
patrón de `pcs-laptops` (necesita `id`, `label`, `icon`, `welcomeTitle`,
`welcomeText` y `products`).

Para agregar una categoría completamente nueva al diagrama:

1. Agrega un nodo `<g class="hub-node" data-category="mi-categoria">`
   en `index.html`, dentro del `<svg>`.
2. Agrega la entrada correspondiente en `CATALOG` dentro de `js/app.js`.

## Cómo reiniciar el estado de "bienvenida" (para pruebas)

Abre la consola del navegador (`F12`) y ejecuta:

```js
localStorage.clear();
```

Esto hace que todos los mensajes de bienvenida vuelvan a aparecer como
si fuera la primera visita.

## Próximos pasos sugeridos

- Conectar el listado de productos a una base de datos real o a un
  backend (por ahora los datos están fijos en `CATALOG`).
- Agregar un carrito de compras si se necesitan múltiples productos por
  venta, en vez de una venta directa por clic.
- Completar el contenido real de "Quiénes somos", "Actividades" y
  "Contáctanos" (actualmente son textos de ejemplo).
