/* ============================================================
   SOLENA — script del sitio
   ============================================================ */

/* ------------------------------------------------------------
   PARQUES / CASOS
   ------------------------------------------------------------
   Para agregar fotos a un proyecto:
   1. Poné los archivos en   assets/parques/
   2. Escribí sus nombres en el array "fotos" del proyecto.
      Podés poner una, varias o ninguna:
         fotos: []                              -> muestra el placeholder
         fotos: ["plastimi-1.jpg"]              -> 1 foto
         fotos: ["plastimi-1.jpg","plastimi-2.jpg","plastimi-3.jpg"]  -> galería
   La primera foto de la lista es la portada de la tarjeta.
   Si hay más de una, al hacer clic se abre el visor con flechas.
   ------------------------------------------------------------ */

const FOTOS_DIR = "assets/parques/";

const PARQUES = [
  {
    cliente: "Plastimi SRL", ubicacion: "Posadas",
    kwp: "135 kWp", tipo: "On Grid", estado: "operativo",
    desc: "Parque industrial: 100 kWp sobre suelo + 35 kWp sobre techo.",
    fotos: ["plastimi-1.png"]   // ej: ["plastimi-1.jpg", "plastimi-2.jpg"]
  },
  {
    cliente: "Forestal Don Almiro", ubicacion: "Cerro Azul",
    kwp: "150 kWp", tipo: "On Grid", estado: "operativo",
    desc: "Parque sobre los techos de las naves del aserradero.",
    fotos: ["don-almiro-1.png"]
  },
  {
    cliente: "Aguer Maderas", ubicacion: "Leandro N. Alem",
    kwp: "1,14 MWp", tipo: "On Grid", estado: "operativo",
    desc: "180 kWp en el techo del aserradero, 300 kWp en el techo de Compensado y 660 kWp en suelo en la planta de Compensado.",
    fotos: ["aguer-1.png"]
  },
  {
    cliente: "Forestal Eldorado", ubicacion: "Eldorado",
    kwp: "900 kWp", tipo: "On Grid", estado: "operativo",
    desc: "Parque solar de 900 kWp para el aserradero.",
    fotos: ["forestal-eldorado-1.png"]
  },
  {
    cliente: "Laharrague Chodorge", ubicacion: "Montecarlo",
    kwp: "2,3 MWp", tipo: "On Grid", estado: "operativo",
    desc: "El parque solar de mayor escala de Solena.",
    fotos: ["chodorge-1.png"]
  },
  {
    cliente: "Fiat Seewald Auto", ubicacion: "Posadas",
    kwp: "5 kWp", tipo: "On Grid", estado: "operativo",
    desc: "Módulo en comercio: la energía solar también es para PyMEs.",
    fotos: ["seewald-1.png"]
  },
  {
    cliente: "Estancia Santa Cecilia", ubicacion: "Zona rural",
    kwp: "Autónomo", tipo: "Off Grid", estado: "operativo",
    desc: "Instalación autónoma para un puesto alejado, sin conexión a la red.",
    fotos: ["sta-cecilia-1.png"]
  },
  {
    cliente: "Aserradero del Centro", ubicacion: "Oberá",
    kwp: "125 kWp", tipo: "On Grid", estado: "proximo",
    desc: "Equipos comprados, próximos a instalar.",
    fotos: []
  },
  {
    cliente: "Imprenta Universal", ubicacion: "Leandro N. Alem",
    kwp: "200 kWp", tipo: "On Grid", estado: "proximo",
    desc: "Equipos comprados, próximos a instalar.",
    fotos: []
  }
];

const ESTADOS = {
  operativo: { txt: "Operativo",     cls: "badge-op" },
  diseno:    { txt: "En diseño",     cls: "badge-design" },
  proximo:   { txt: "Próximamente",  cls: "badge-soon" }
};

function esc(s){ return String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;" }[c])); }

function renderParques(){
  const grid = document.getElementById("parques-grid");
  if(!grid) return;
  grid.innerHTML = PARQUES.map((p, i) => {
    const est = ESTADOS[p.estado] || ESTADOS.operativo;
    const tiene = p.fotos && p.fotos.length > 0;
    const portada = tiene
      ? `<img class="cover" src="${FOTOS_DIR}${esc(p.fotos[0])}" alt="${esc(p.cliente)} — instalación">`
      : `<img class="sun" src="assets/isotipo.svg" alt="">`;
    const contador = (tiene && p.fotos.length > 1)
      ? `<span class="count" aria-hidden="true">
           <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
           ${p.fotos.length}</span>`
      : "";
    return `
      <article class="case${tiene ? " has-photos" : ""}" data-idx="${i}"${tiene ? ' tabindex="0" role="button" aria-label="Ver fotos de '+esc(p.cliente)+'"' : ""}>
        <div class="photo">
          ${portada}${contador}
          <div class="kw">${esc(p.kwp)}<small>${esc(p.tipo)}</small></div>
        </div>
        <div class="info">
          <div class="loc">${esc(p.ubicacion)}</div>
          <h3>${esc(p.cliente)}</h3>
          <p>${esc(p.desc)}</p>
          <span class="badge-state ${est.cls}">${est.txt}</span>
        </div>
      </article>`;
  }).join("");

  grid.querySelectorAll(".case.has-photos").forEach(el => {
    const p = PARQUES[+el.dataset.idx];
    const open = () => Lightbox.open(p.fotos, 0, p.cliente);
    el.addEventListener("click", open);
    el.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); open(); } });
  });
}

/* ------------------------------------------------------------
   LIGHTBOX (visor de galería)
   ------------------------------------------------------------ */
const Lightbox = {
  fotos: [], idx: 0, title: "",
  el: null, img: null, cap: null,
  build(){
    if(this.el) return;
    const d = document.createElement("div");
    d.className = "lb"; d.id = "lightbox";
    d.innerHTML = `
      <button class="lb-close" aria-label="Cerrar">&times;</button>
      <button class="lb-nav lb-prev" aria-label="Anterior">&#8249;</button>
      <figure class="lb-stage">
        <img alt="">
        <figcaption></figcaption>
      </figure>
      <button class="lb-nav lb-next" aria-label="Siguiente">&#8250;</button>`;
    document.body.appendChild(d);
    this.el = d;
    this.img = d.querySelector("img");
    this.cap = d.querySelector("figcaption");
    d.querySelector(".lb-close").addEventListener("click", () => this.close());
    d.querySelector(".lb-prev").addEventListener("click", e => { e.stopPropagation(); this.go(-1); });
    d.querySelector(".lb-next").addEventListener("click", e => { e.stopPropagation(); this.go(1); });
    d.addEventListener("click", e => { if(e.target === d) this.close(); });
    document.addEventListener("keydown", e => {
      if(!this.el.classList.contains("open")) return;
      if(e.key === "Escape") this.close();
      if(e.key === "ArrowLeft") this.go(-1);
      if(e.key === "ArrowRight") this.go(1);
    });
  },
  open(fotos, idx, title){
    this.build();
    this.fotos = fotos; this.idx = idx || 0; this.title = title || "";
    this.render();
    this.el.classList.add("open");
    document.body.style.overflow = "hidden";
  },
  render(){
    const solo = this.fotos.length <= 1;
    this.img.src = FOTOS_DIR + this.fotos[this.idx];
    this.img.alt = this.title + " — foto " + (this.idx + 1);
    this.cap.textContent = solo ? this.title : `${this.title} · ${this.idx + 1}/${this.fotos.length}`;
    this.el.querySelector(".lb-prev").style.display = solo ? "none" : "";
    this.el.querySelector(".lb-next").style.display = solo ? "none" : "";
  },
  go(dir){
    this.idx = (this.idx + dir + this.fotos.length) % this.fotos.length;
    this.render();
  },
  close(){
    this.el.classList.remove("open");
    document.body.style.overflow = "";
  }
};

/* ------------------------------------------------------------
   NAV móvil
   ------------------------------------------------------------ */
function initNav(){
  const nav = document.getElementById("nav");
  const t = document.getElementById("navToggle");
  if(!t) return;
  t.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    t.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.querySelectorAll(".nav-links a").forEach(a => {
    a.addEventListener("click", () => { nav.classList.remove("open"); t.setAttribute("aria-expanded","false"); });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderParques();
  initNav();
});
