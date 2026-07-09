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
// El campo "icon" es un emoji usado como miniatura mientras no haya foto real;
// si luego quieres usar una foto, agrega una carpeta assets/productos/ y
// cambia el render de .product-thumb en este archivo por una <img>.
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
          { id: "hp123", name: "HP 123", price: 500, meta: "Core i5 · 8GB RAM" },
          { id: "ibm395", name: "IBM 395", price: 450, meta: "Core i3 · 8GB RAM" },
          { id: "samsung", name: "Samsung", price: 350, meta: "Celeron · 4GB RAM" },
        ],
      },
      {
        id: "moviles",
        label: "Móviles",
        icon: "📱",
        welcomeTitle: "Bienvenido a Móviles",
        welcomeText: "Los últimos equipos móviles del mercado.",
        products: [
          { id: "movil-a", name: "Modelo A", price: 700, meta: "128GB · 5G" },
          { id: "movil-b", name: "Modelo B", price: 550, meta: "64GB · 4G" },
        ],
      },
      {
        id: "drones",
        label: "Drones",
        icon: "🚁",
        welcomeTitle: "Bienvenido a Drones",
        welcomeText: "Equipos para uso profesional y recreativo.",
        products: [
          { id: "dron-x", name: "Dron X", price: 900, meta: "Cámara 4K" },
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
          { id: "soporte-ti", name: "Soporte TI", price: 200, meta: "Visita técnica" },
          { id: "mantenimiento", name: "Mantenimiento", price: 120, meta: "Preventivo" },
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
          { id: "canasta", name: "Canasta básica", price: 60, meta: "12 productos" },
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
          { id: "curso-office", name: "Curso Office", price: 90, meta: "20 horas" },
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
        <div class="product-thumb">${CATALOG[categoryKey].icon}</div>
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
  renderCategoryGrid();
  initNav();
  initQuickLinks();
  initContactForm();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeActiveWindow();
});
