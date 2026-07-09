/* =====================================================================
   ADOLFO JURADO — lógica del sitio
   ---------------------------------------------------------------------
   1. Catálogo (categorías, subcategorías, productos)
   2. Registro persistente de ventas (localStorage) — "Los más vendidos"
      se calcula en tiempo real a partir de esto.
   3. Gestor de ventanas: SOLO UNA abierta a la vez.
   4. Modal de bienvenida (una vez por subcategoría).
   5. Render del grid de categorías + flujo de compra.
   6. Navegación, menú móvil, formulario de contacto.
   ===================================================================== */

/* ---------- 1. CATÁLOGO ---------- */
// Para agregar un producto, súmalo al arreglo "products" de su subcategoría.
// El campo "img" es una foto real (Unsplash, uso libre/comercial). Para
// usar tu propia foto: sube el archivo a assets/productos/ y cambia el
// valor de "img" por esa ruta local, ej: "assets/productos/hp-123.jpg".
// Los precios son referenciales — reemplázalos por tus precios reales.
function unsplash(id) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=500&q=70`;
}

const CATALOG = {
  tecnologia: {
    title: "Tecnología",
    icon: "💻",
    subtitle: "Equipos y accesorios",
    subcategories: [
      {
        id: "pcs-laptops",
        label: "PCs y laptops",
        icon: "💻",
        welcomeTitle: "Bienvenido a PCs y laptops",
        welcomeText: "Encuentra los mejores equipos al mejor precio.",
        products: [
          { id: "hp-elitebook", name: "HP EliteBook", price: 1450, meta: "Core i7 · 16GB · 512GB SSD", img: unsplash("1496181133206-80ce9b88a853") },
          { id: "lenovo-thinkpad", name: "Lenovo ThinkPad", price: 1180, meta: "Core i5 · 16GB · 256GB SSD", img: unsplash("1525547719571-a2d4ac8945e2") },
          { id: "dell-inspiron", name: "Dell Inspiron", price: 890, meta: "Core i5 · 8GB · 256GB SSD", img: unsplash("1531297484001-80022131f5a1") },
          { id: "asus-vivobook", name: "Asus VivoBook", price: 720, meta: "Ryzen 5 · 8GB · 256GB SSD", img: unsplash("1611186871348-b1ce696e52c9") },
          { id: "macbook-air", name: "MacBook Air", price: 1690, meta: "M2 · 8GB · 256GB SSD", img: unsplash("1541807084-5c52b6b3adef") },
        ],
      },
      {
        id: "moviles",
        label: "Móviles",
        icon: "📱",
        welcomeTitle: "Bienvenido a Móviles",
        welcomeText: "Los últimos equipos móviles del mercado.",
        products: [
          { id: "galaxy-s", name: "Galaxy Serie S", price: 1099, meta: "256GB · 5G", img: unsplash("1603184017968-953f59cd2e37") },
          { id: "moto-edge", name: "Moto Edge", price: 649, meta: "128GB · 5G", img: unsplash("1592890288564-76628a30a657") },
          { id: "iphone-se", name: "iPhone SE", price: 899, meta: "128GB · 4G", img: unsplash("1598327105666-5b89351aff97") },
          { id: "xiaomi-redmi", name: "Xiaomi Redmi Note", price: 449, meta: "128GB · 4G", img: unsplash("1480694313141-fce5e697ee25") },
        ],
      },
      {
        id: "drones",
        label: "Drones",
        icon: "🚁",
        welcomeTitle: "Bienvenido a Drones",
        welcomeText: "Equipos para uso profesional y recreativo.",
        products: [
          { id: "dron-mavic", name: "Dron profesional 4K", price: 2450, meta: "Cámara 4K · GPS", img: unsplash("1532989029401-439615f3d4b4") },
          { id: "dron-recreativo", name: "Dron recreativo", price: 680, meta: "Cámara HD", img: unsplash("1506947411487-a56738267384") },
          { id: "dron-fpv", name: "Dron FPV", price: 1290, meta: "Video en vivo", img: unsplash("1521405924368-64c5b84bec60") },
        ],
      },
    ],
  },
  servicios: {
    title: "Servicios",
    icon: "🛠️",
    subtitle: "Soporte y mantenimiento",
    subcategories: [
      {
        id: "servicios-generales",
        label: "Servicios",
        icon: "🛠️",
        welcomeTitle: "Bienvenido a Servicios",
        welcomeText: "Soluciones para tu empresa o negocio.",
        products: [
          { id: "soporte-ti", name: "Soporte TI mensual", price: 350, meta: "Visitas ilimitadas", img: unsplash("1454165804606-c3d57bc86b40") },
          { id: "mantenimiento", name: "Mantenimiento preventivo", price: 180, meta: "Por equipo", img: unsplash("1610433572201-110753c6cff9") },
          { id: "auditoria-sistemas", name: "Auditoría de sistemas", price: 650, meta: "Informe completo", img: unsplash("1618171889969-0feeb769fe78") },
          { id: "instalacion-redes", name: "Instalación de redes", price: 420, meta: "Cableado + configuración", img: unsplash("1516910817563-4df1c1b69058") },
        ],
      },
    ],
  },
  alimentos: {
    title: "Alimentos",
    icon: "🍎",
    subtitle: "Productos frescos",
    subcategories: [
      {
        id: "alimentos-generales",
        label: "Alimentos",
        icon: "🍎",
        welcomeTitle: "Bienvenido a Alimentos",
        welcomeText: "Productos frescos todos los días.",
        products: [
          { id: "canasta-basica", name: "Canasta básica", price: 85, meta: "12 productos", img: unsplash("1631021967261-c57ee4dfa9bb") },
          { id: "canasta-premium", name: "Canasta premium", price: 145, meta: "20 productos selectos", img: unsplash("1629905707362-03cf1a9f6e2d") },
          { id: "combo-oficina", name: "Combo oficina", price: 95, meta: "Snacks + bebidas, 10 personas", img: unsplash("1609842947419-ba4f04d5d60f") },
          { id: "canasta-organica", name: "Canasta orgánica", price: 120, meta: "Productos certificados", img: unsplash("1635774855717-0aec182f92cc") },
        ],
      },
    ],
  },
  educacion: {
    title: "Educación",
    icon: "📚",
    subtitle: "Cursos y capacitación",
    subcategories: [
      {
        id: "educacion-general",
        label: "Educación",
        icon: "📚",
        welcomeTitle: "Bienvenido a Educación",
        welcomeText: "Cursos y material educativo.",
        products: [
          { id: "curso-office", name: "Curso Office avanzado", price: 180, meta: "20 horas · Certificado", img: unsplash("1501504905252-473c47e087f8") },
          { id: "curso-excel", name: "Excel para gestión", price: 220, meta: "24 horas · Certificado", img: unsplash("1516397281156-ca07cf9746fc") },
          { id: "diplomado-digital", name: "Diplomado transformación digital", price: 650, meta: "60 horas · Certificado", img: unsplash("1513258496099-48168024aec0") },
          { id: "taller-equipos", name: "Taller de trabajo en equipo", price: 140, meta: "Presencial · grupos", img: unsplash("1522202176988-66273c2fd55f") },
        ],
      },
    ],
  },
};

const SIMPLE_WINDOWS = {
  "ofertas-semana": {
    title: "Ofertas de la semana",
    bodyHTML: "<p>Promociones vigentes solo por esta semana. Escríbenos para conocer los descuentos activos en tecnología y servicios.</p>",
  },
  liquidacion: {
    title: "Liquidación",
    bodyHTML: "<p>Productos en liquidación con descuentos especiales por renovación de stock.</p>",
  },
  "entidades-publicas": {
    title: "Entidades públicas",
    bodyHTML: "<p>Convenios y precios especiales para entidades del Estado. Contáctanos con tu orden de compra.</p>",
  },
};

/* ---------- 2. REGISTRO PERSISTENTE DE VENTAS ---------- */
// Cada compra queda guardada en localStorage bajo la clave "aj_ventas",
// como un arreglo de objetos { productId, name, price, categoryId, ts }.
// "Los más vendidos" se recalcula cada vez que se abre esa ventana,
// así siempre refleja la información real y actualizada.
const SALES_KEY = "aj_ventas";

function getSales() {
  try {
    return JSON.parse(localStorage.getItem(SALES_KEY)) || [];
  } catch {
    return [];
  }
}

function recordSale(product, categoryId) {
  const sales = getSales();
  sales.push({
    productId: product.id,
    name: product.name,
    price: product.price,
    categoryId,
    ts: Date.now(),
  });
  localStorage.setItem(SALES_KEY, JSON.stringify(sales));
}

function getTopSelling(limit = 5) {
  const sales = getSales();
  const counts = {};
  sales.forEach((s) => {
    if (!counts[s.productId]) {
      counts[s.productId] = { name: s.name, price: s.price, count: 0, total: 0 };
    }
    counts[s.productId].count += 1;
    counts[s.productId].total += s.price;
  });
  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/* ---------- 3. GESTOR DE VENTANAS (UNA A LA VEZ) ---------- */
function closeActiveWindow() {
  const layer = document.getElementById("window-layer");
  layer.innerHTML = "";
  layer.classList.remove("open");
}

function openWindow({ title, bodyHTML, onMount }) {
  closeActiveWindow(); // <- garantiza que nunca haya dos ventanas abiertas a la vez

  const layer = document.getElementById("window-layer");
  layer.classList.add("open");

  const win = document.createElement("div");
  win.className = "app-window";
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

  win.querySelector(".win-close").addEventListener("click", closeActiveWindow);
  layer.addEventListener("click", (e) => { if (e.target === layer) closeActiveWindow(); }, { once: true });

  if (typeof onMount === "function") onMount(win);
  return win;
}

/* ---------- 4. MODAL DE BIENVENIDA (una vez por subcategoría) ---------- */
function hasSeenWelcome(key) { return localStorage.getItem("aj_welcome_" + key) === "1"; }
function markWelcomeSeen(key) { localStorage.setItem("aj_welcome_" + key, "1"); }

function showWelcomeModal(subcat, onAccept) {
  const layer = document.getElementById("modal-layer");
  layer.innerHTML = `
    <div class="modal-card">
      <div class="win-titlebar"><div class="win-controls"><button type="button" class="modal-close" aria-label="Cerrar">✕</button></div></div>
      <div class="modal-body">
        <div class="icon">${subcat.icon}</div>
        <h3>${subcat.welcomeTitle}</h3>
        <p>${subcat.welcomeText}</p>
        <button type="button" class="btn btn-primary block modal-accept">Aceptar</button>
      </div>
    </div>`;
  layer.classList.add("open");

  const close = () => layer.classList.remove("open");
  layer.querySelector(".modal-close").addEventListener("click", close);
  layer.querySelector(".modal-accept").addEventListener("click", () => {
    markWelcomeSeen(subcat.id);
    close();
    onAccept();
  });
}

/* ---------- 5. RENDER DE CATEGORÍAS + FLUJO DE COMPRA ---------- */

// Diagrama principal: recrea el boceto original — un rectángulo cruzado
// por dos diagonales, con un ícono central y una categoría por cuadrante.
// Al tocar un cuadrante se abre esa categoría (mismo flujo que las tarjetas).
function renderCategoryDiagram() {
  const svg = document.getElementById("category-diagram");
  const W = 600, H = 400;
  const corners = { tl: [10, 10], tr: [W - 10, 10], br: [W - 10, H - 10], bl: [10, H - 10] };
  const center = [W / 2, H / 2];

  const quads = [
    { key: "tecnologia", pts: [corners.tl, corners.tr, center], labelPos: [W / 2, 55] },
    { key: "servicios", pts: [corners.tr, corners.br, center], labelPos: [W - 95, H / 2] },
    { key: "alimentos", pts: [corners.br, corners.bl, center], labelPos: [W / 2, H - 40] },
    { key: "educacion", pts: [corners.bl, corners.tl, center], labelPos: [95, H / 2] },
  ];

  const polygons = quads
    .map((q) => {
      const cat = CATALOG[q.key];
      const pointsAttr = q.pts.map((p) => p.join(",")).join(" ");
      return `
        <polygon class="quad" data-category="${q.key}" points="${pointsAttr}"></polygon>
        <text x="${q.labelPos[0]}" y="${q.labelPos[1] - 8}" text-anchor="middle" class="quad-icon" style="pointer-events:none;">${cat.icon}</text>
        <text x="${q.labelPos[0]}" y="${q.labelPos[1] + 16}" class="quad-label">${cat.title}</text>
      `;
    })
    .join("");

  svg.innerHTML = `
    <rect class="frame" x="10" y="10" width="${W - 20}" height="${H - 20}" rx="20"></rect>
    <line class="diagonal" x1="${corners.tl[0]}" y1="${corners.tl[1]}" x2="${corners.br[0]}" y2="${corners.br[1]}"></line>
    <line class="diagonal" x1="${corners.tr[0]}" y1="${corners.tr[1]}" x2="${corners.bl[0]}" y2="${corners.bl[1]}"></line>
    ${polygons}
    <circle class="center-ring" cx="${center[0]}" cy="${center[1]}" r="46"></circle>
    <clipPath id="logo-clip"><circle cx="${center[0]}" cy="${center[1]}" r="42"></circle></clipPath>
    <image href="assets/logo.png" x="${center[0] - 42}" y="${center[1] - 42}" width="84" height="84" clip-path="url(#logo-clip)" preserveAspectRatio="xMidYMid slice"></image>
    <text x="${center[0]}" y="${center[1] + 66}" class="center-hint">Toca una categoría</text>
  `;

  svg.querySelectorAll(".quad").forEach((poly) => {
    poly.addEventListener("click", () => openCategoryWindow(poly.dataset.category));
  });
}

function renderCategoryGrid() {
  const grid = document.getElementById("category-grid");
  grid.innerHTML = Object.entries(CATALOG)
    .map(
      ([key, cat]) => `
      <button class="category-card" data-category="${key}">
        <span class="cat-icon">${cat.icon}</span>
        <span class="cat-title">${cat.title}</span>
        <span class="cat-sub">${cat.subtitle}</span>
      </button>`
    )
    .join("");

  grid.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => openCategoryWindow(card.dataset.category));
  });
}

function openCategoryWindow(categoryKey) {
  const category = CATALOG[categoryKey];
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
      handleSubcategoryClick(subcat, categoryKey);
    });
  });
}

function handleSubcategoryClick(subcat, categoryKey) {
  if (!hasSeenWelcome(subcat.id)) {
    showWelcomeModal(subcat, () => openProductListWindow(subcat, categoryKey));
  } else {
    openProductListWindow(subcat, categoryKey);
  }
}

function openProductListWindow(subcat, categoryKey) {
  const rowsHTML = subcat.products
    .map(
      (p) => `
      <div class="product-card">
        <div class="product-thumb"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
        <div class="product-card-row">
          <div class="product-info">
            <strong>${p.name}</strong>
            <span class="product-meta">${p.meta || ""}</span>
          </div>
          <div style="text-align:right; display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
            <span class="product-price">$${p.price.toFixed(2)}</span>
            <button type="button" class="btn btn-primary comprar-btn" data-product="${p.id}">Comprar</button>
          </div>
        </div>
      </div>`
    )
    .join("");

  const win = openWindow({
    title: subcat.label,
    bodyHTML: `<div class="product-grid">${rowsHTML}</div>`,
  });

  win.querySelectorAll(".comprar-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = subcat.products.find((p) => p.id === btn.dataset.product);
      recordSale(product, categoryKey);
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
        <span class="price">$${product.price.toFixed(2)}</span>
      </div>`,
  });
}

/* ---------- "Los más vendidos" — 100% dinámico ---------- */
function openTopSellingWindow() {
  const top = getTopSelling(5);
  let bodyHTML;
  if (top.length === 0) {
    bodyHTML = `<div class="empty-state">Aún no se han registrado ventas.<br>Este listado se actualiza automáticamente conforme se realicen compras en el catálogo.</div>`;
  } else {
    bodyHTML = top
      .map(
        (p, i) => `
        <div class="rank-row">
          <span class="rank-num">${i + 1}</span>
          <div class="rank-info">
            <strong>${p.name}</strong>
            <span>${p.count} venta${p.count > 1 ? "s" : ""} · $${p.total.toFixed(2)} en total</span>
          </div>
        </div>`
      )
      .join("");
  }
  openWindow({ title: "Los más vendidos", bodyHTML });
}

/* ---------- 6. NAVEGACIÓN / MENÚ MÓVIL / CONTACTO ---------- */
function initNav() {
  const toggle = document.getElementById("navtoggle");
  const nav = document.getElementById("mainnav");
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));

  document.querySelectorAll("[data-scroll]").forEach((el) => {
    el.addEventListener("click", () => {
      document.querySelector(el.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

function initQuickLinks() {
  document.querySelectorAll("[data-window]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.window;
      if (key === "mas-vendidos") {
        openTopSellingWindow();
      } else if (SIMPLE_WINDOWS[key]) {
        openWindow(SIMPLE_WINDOWS[key]);
      }
    });
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // Este formulario aún no está conectado a un backend/email real.
    // Por ahora solo confirma visualmente el envío en el navegador.
    note.textContent = "Mensaje registrado. Te contactaremos pronto.";
    form.reset();
  });
}

/* ---------- INICIALIZACIÓN ---------- */
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  renderCategoryDiagram();
  renderCategoryGrid();
  initNav();
  initQuickLinks();
  initContactForm();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeActiveWindow();
});
