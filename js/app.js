/* =====================================================================
   TIENDA ABC — lógica de la interfaz
   ---------------------------------------------------------------------
   Estructura del archivo:
   1. Datos del catálogo (fácil de editar / ampliar)
   2. Dibujo de las líneas del diagrama radial (hub)
   3. Gestor de ventanas ("app-window") — abrir, cerrar, arrastrar
   4. Gestor del modal de bienvenida (solo la primera vez por categoría)
   5. Enlaces de eventos (nodos del hub, sidebar, nav)
   ===================================================================== */

/* ---------- 1. DATOS DEL CATÁLOGO ---------- */
// Para agregar una categoría nueva basta con crear una entrada aquí.
// "welcomeKey" es el identificador que se guarda en localStorage para
// saber si el usuario ya vio la ventana de bienvenida de esa subcategoría.
const CATALOG = {
  tecnologia: {
    title: "Tecnología",
    subcategories: [
      {
        id: "pcs-laptops",
        label: "PCs y laptops",
        icon: "💻",
        welcomeTitle: "¡Bienvenido a PCs y laptops!",
        welcomeText: "Encuentra los mejores equipos al mejor precio.",
        products: [
          { id: "hp123", name: "HP 123", price: 500 },
          { id: "ibm395", name: "IBM 395", price: 450 },
          { id: "samsung", name: "Samsung", price: 350 },
        ],
      },
      {
        id: "moviles",
        label: "Móviles",
        icon: "📱",
        welcomeTitle: "¡Bienvenido a Móviles!",
        welcomeText: "Los últimos equipos móviles del mercado.",
        products: [
          { id: "movil-a", name: "Modelo A", price: 700 },
          { id: "movil-b", name: "Modelo B", price: 550 },
        ],
      },
      {
        id: "drones",
        label: "Drones",
        icon: "🚁",
        welcomeTitle: "¡Bienvenido a Drones!",
        welcomeText: "Equipos para uso profesional y recreativo.",
        products: [
          { id: "dron-x", name: "Dron X", price: 900 },
        ],
      },
    ],
  },
  servicios: {
    title: "Servicios",
    subcategories: [
      {
        id: "servicios-generales",
        label: "Servicios",
        icon: "🛠️",
        welcomeTitle: "¡Bienvenido a Servicios!",
        welcomeText: "Soluciones para tu empresa o negocio.",
        products: [
          { id: "soporte-ti", name: "Soporte TI", price: 200 },
          { id: "mantenimiento", name: "Mantenimiento", price: 120 },
        ],
      },
    ],
  },
  alimentos: {
    title: "Alimentos",
    subcategories: [
      {
        id: "alimentos-generales",
        label: "Alimentos",
        icon: "🍎",
        welcomeTitle: "¡Bienvenido a Alimentos!",
        welcomeText: "Productos frescos todos los días.",
        products: [
          { id: "canasta", name: "Canasta básica", price: 60 },
        ],
      },
    ],
  },
  educacion: {
    title: "Educación",
    subcategories: [
      {
        id: "educacion-general",
        label: "Educación",
        icon: "📚",
        welcomeTitle: "¡Bienvenido a Educación!",
        welcomeText: "Cursos y material educativo.",
        products: [
          { id: "curso-office", name: "Curso Office", price: 90 },
        ],
      },
    ],
  },
};

// Ventanas simples (informativas) que no llevan flujo de venta.
const SIMPLE_WINDOWS = {
  inicio: { title: "Inicio", body: "<p>Bienvenido a Corporación ABC S.A.C. Selecciona una categoría en el diagrama para comenzar.</p>" },
  "quienes-somos": { title: "Quiénes somos", body: "<p>Somos una corporación piurana dedicada a la venta de tecnología, servicios, alimentos y educación.</p>" },
  actividades: { title: "Actividades", body: "<p>Aquí se listarán las actividades y promociones vigentes de la corporación.</p>" },
  contactanos: { title: "Contáctanos", body: "<p>Av. Perú 123 — Piura.<br>Escríbenos y te responderemos a la brevedad.</p>" },
  "mas-vendidos": { title: "Los más vendidos", body: "<p>Listado de los productos con mayor número de ventas del mes.</p>" },
  "ofertas-semana": { title: "Ofertas de la semana", body: "<p>Promociones vigentes solo por esta semana.</p>" },
  liquidacion: { title: "Liquidación", body: "<p>Productos en liquidación con descuentos especiales.</p>" },
  "entidades-publicas": { title: "Entidades públicas", body: "<p>Convenios y precios especiales para entidades del Estado.</p>" },
};

/* ---------- 2. DIBUJO DE LÍNEAS DEL HUB ---------- */
function drawHubLines() {
  const svg = document.getElementById("hub-svg");
  const linesGroup = document.getElementById("hub-lines");
  const center = { x: 350, y: 280 };
  const nodes = svg.querySelectorAll(".hub-node:not(.hub-center)");

  linesGroup.innerHTML = "";
  nodes.forEach((node) => {
    const transform = node.getAttribute("transform"); // translate(x,y)
    const match = /translate\(([-\d.]+),([-\d.]+)\)/.exec(transform);
    if (!match) return;
    const x = parseFloat(match[1]);
    const y = parseFloat(match[2]);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", center.x);
    line.setAttribute("y1", center.y);
    line.setAttribute("x2", x);
    line.setAttribute("y2", y);
    linesGroup.appendChild(line);
  });
}

/* ---------- 3. GESTOR DE VENTANAS ---------- */
let windowCount = 0;
const OPEN_OFFSET = 32;

function openWindow({ title, bodyHTML, onMount }) {
  const layer = document.getElementById("window-layer");

  const win = document.createElement("div");
  win.className = "app-window";
  windowCount += 1;
  const baseTop = 90 + ((windowCount * OPEN_OFFSET) % 220);
  const baseLeft = 260 + ((windowCount * OPEN_OFFSET) % 320);
  win.style.top = baseTop + "px";
  win.style.left = baseLeft + "px";

  win.innerHTML = `
    <div class="win-titlebar">
      <strong>${title}</strong>
      <div class="win-controls">
        <button type="button" class="win-close" aria-label="Cerrar">✕</button>
      </div>
    </div>
    <div class="win-body">${bodyHTML}</div>
  `;

  layer.appendChild(win);

  // cerrar
  win.querySelector(".win-close").addEventListener("click", () => win.remove());

  // arrastrar por la barra de título
  makeDraggable(win, win.querySelector(".win-titlebar"));

  if (typeof onMount === "function") onMount(win);

  return win;
}

function makeDraggable(win, handle) {
  let dragging = false;
  let startX, startY, startLeft, startTop;

  handle.addEventListener("mousedown", (e) => {
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = win.offsetLeft;
    startTop = win.offsetTop;
    win.style.zIndex = 100 + windowCount++;
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    win.style.left = startLeft + (e.clientX - startX) + "px";
    win.style.top = startTop + (e.clientY - startY) + "px";
  });

  window.addEventListener("mouseup", () => { dragging = false; });
}

/* ---------- 4. MODAL DE BIENVENIDA (solo primera vez) ---------- */
function hasSeenWelcome(key) {
  return localStorage.getItem("abc_welcome_" + key) === "1";
}
function markWelcomeSeen(key) {
  localStorage.setItem("abc_welcome_" + key, "1");
}

function showWelcomeModal(subcat, onAccept) {
  const layer = document.getElementById("modal-layer");
  layer.innerHTML = `
    <div class="modal-card">
      <div class="win-titlebar">
        <div class="win-controls"><button type="button" class="modal-close" aria-label="Cerrar">✕</button></div>
      </div>
      <div class="modal-body">
        <div class="icon">${subcat.icon}</div>
        <h3>${subcat.welcomeTitle}</h3>
        <p>${subcat.welcomeText}</p>
        <button type="button" class="btn block modal-accept">Aceptar</button>
      </div>
    </div>
  `;
  layer.classList.add("open");

  const close = () => layer.classList.remove("open");
  layer.querySelector(".modal-close").addEventListener("click", close);
  layer.querySelector(".modal-accept").addEventListener("click", () => {
    markWelcomeSeen(subcat.id);
    close();
    onAccept();
  });
}

/* ---------- FLUJO DE CATEGORÍA → SUBCATEGORÍA → PRODUCTOS → VENTA ---------- */
function openCategoryWindow(categoryKey) {
  const category = CATALOG[categoryKey];
  if (!category) {
    // categoría sin catálogo definido (ej. futuras ampliaciones)
    openWindow({ title: categoryKey, bodyHTML: "<p>Contenido en construcción.</p>" });
    return;
  }

  const optionsHTML = category.subcategories
    .map((s) => `<div class="option-card" data-subcat="${s.id}"><span class="icon">${s.icon}</span>${s.label}</div>`)
    .join("");

  const win = openWindow({
    title: category.title,
    bodyHTML: `<p>Selecciona una subcategoría:</p><div class="grid-options">${optionsHTML}</div>`,
  });

  win.querySelectorAll(".option-card").forEach((card) => {
    card.addEventListener("click", () => {
      const subcat = category.subcategories.find((s) => s.id === card.dataset.subcat);
      handleSubcategoryClick(subcat);
    });
  });
}

function handleSubcategoryClick(subcat) {
  if (!hasSeenWelcome(subcat.id)) {
    showWelcomeModal(subcat, () => openSelectProductWindow(subcat));
  } else {
    openSelectProductWindow(subcat);
  }
}

function openSelectProductWindow(subcat) {
  const win = openWindow({
    title: "Seleccione un producto",
    bodyHTML: `<p>Elige uno de los productos disponibles en ${subcat.label}:</p><button type="button" class="btn block accept-select">Aceptar</button>`,
  });

  win.querySelector(".accept-select").addEventListener("click", () => {
    win.remove();
    openProductListWindow(subcat);
  });
}

function openProductListWindow(subcat) {
  const rowsHTML = subcat.products
    .map(
      (p) => `
      <div class="product-row" data-product="${p.id}">
        <div class="info">
          <strong>${p.name}</strong>
          <span>$${p.price.toFixed(2)}</span>
        </div>
        <button type="button" class="btn comprar-btn" data-product="${p.id}">Comprar</button>
      </div>`
    )
    .join("");

  const win = openWindow({
    title: subcat.label,
    bodyHTML: `<div style="display:flex;flex-direction:column;gap:8px;">${rowsHTML}</div>`,
  });

  win.querySelectorAll(".comprar-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = subcat.products.find((p) => p.id === btn.dataset.product);
      win.remove();
      openSoldWindow(product);
    });
  });
}

function openSoldWindow(product) {
  openWindow({
    title: "Venta confirmada",
    bodyHTML: `
      <div class="sold-banner">
        <div class="check">✓</div>
        <strong>Vendido</strong>
        <span>${product.name}</span>
        <div class="price">$${product.price.toFixed(2)}</div>
      </div>`,
  });
}

/* ---------- 5. ENLACE DE EVENTOS ---------- */
function openSimpleWindow(key) {
  const data = SIMPLE_WINDOWS[key];
  if (!data) return;
  openWindow({ title: data.title, bodyHTML: data.body });
}

function initEvents() {
  // nodos del diagrama radial
  document.querySelectorAll(".hub-node").forEach((node) => {
    node.addEventListener("click", () => {
      const category = node.dataset.category;
      if (CATALOG[category]) {
        openCategoryWindow(category);
      } else {
        openSimpleWindow(category);
      }
    });
  });

  // nav superior
  document.querySelectorAll(".mainnav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openSimpleWindow(link.dataset.window);
    });
  });

  // sidebar
  document.querySelectorAll(".side-link").forEach((btn) => {
    btn.addEventListener("click", () => openSimpleWindow(btn.dataset.window));
  });
}

/* ---------- INICIALIZACIÓN ---------- */
window.addEventListener("DOMContentLoaded", () => {
  drawHubLines();
  initEvents();
});
window.addEventListener("resize", drawHubLines);
