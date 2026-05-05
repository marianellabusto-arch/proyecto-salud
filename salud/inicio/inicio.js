const body = document.body;
const usuarioActivo = localStorage.getItem("usuarioActivo");
if (!usuarioActivo) {
  window.location.href = "../login/login.html";
}

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const userBadge = document.getElementById("userBadge");
const logoutButton = document.getElementById("logoutButton");
const consultaForm = document.getElementById("consultaForm");
const consultaInput = document.getElementById("consultaInput");
const consultaList = document.getElementById("consultaList");
const dietForm = document.getElementById("dietForm");
const planTitle = document.getElementById("planTitle");
const planText = document.getElementById("planText");
const planPdf = document.getElementById("planPdf");
const dietList = document.getElementById("dietList");
const dietMessage = document.getElementById("dietMessage");
const pesoForm = document.getElementById("pesoForm");
const pesoInput = document.getElementById("pesoInput");
const pesoList = document.getElementById("pesoList");
const pesoChart = document.getElementById("pesoChart");
const contactForm = document.getElementById("contactForm");
const contactMessage = document.getElementById("contactMessage");

const STORAGE_KEYS = {
  theme: "controlVitalTheme",
  consultas: "controlVitalConsultas",
  dietas: "controlVitalDietas",
  pesos: "controlVitalPesos"
};

const defaultConsultas = [
  "Evaluación clínica inicial",
  "Seguimiento nutricional mensual",
  "Control de laboratorio y hábitos"
];

const defaultPesos = [92.4, 91.8, 90.9, 89.7];
const defaultDietas = [];
let lastScrollY = window.scrollY;

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getData(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

function updateThemeButton(isLightMode) {
  themeIcon.textContent = isLightMode ? "🌙" : "☀️";
  themeToggle.setAttribute("aria-label", isLightMode ? "Activar modo oscuro" : "Activar modo claro");
}

function applyTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  const isLightMode = savedTheme === "light";
  body.classList.toggle("dark-mode", isLightMode);
  updateThemeButton(isLightMode);
}

function renderUsuarioActivo() {
  if (userBadge && usuarioActivo) {
    userBadge.textContent = `Usuario: ${usuarioActivo}`;
  }
}

function handleFloatingActionsOnScroll() {
  const currentScrollY = window.scrollY;

  if (currentScrollY <= 40) {
    body.classList.remove("actions-hidden");
    lastScrollY = currentScrollY;
    return;
  }

  if (currentScrollY > lastScrollY) {
    body.classList.add("actions-hidden");
  } else {
    body.classList.remove("actions-hidden");
  }

  lastScrollY = currentScrollY;
}

function renderConsultas() {
  const consultas = getData(STORAGE_KEYS.consultas, defaultConsultas);
  consultaList.innerHTML = "";

  consultas.forEach((consulta) => {
    const li = document.createElement("li");
    li.textContent = consulta;
    consultaList.appendChild(li);
  });
}

function renderPesos() {
  const pesos = getData(STORAGE_KEYS.pesos, defaultPesos);
  pesoList.innerHTML = "";

  pesos.slice().reverse().forEach((peso, index) => {
    const li = document.createElement("li");
    const posicion = pesos.length - index;
    li.textContent = `Registro ${posicion}: ${peso.toFixed(1)} kg`;
    pesoList.appendChild(li);
  });

  drawChart(pesos);
}

function renderDietas() {
  const dietas = getData(STORAGE_KEYS.dietas, defaultDietas);
  dietList.innerHTML = "";

  if (!dietas.length) {
    dietList.innerHTML = '<p class="empty-state">Todavía no guardaste planes de alimentación.</p>';
    return;
  }

  dietas
    .slice()
    .reverse()
    .forEach((plan) => {
      const card = document.createElement("article");
      card.className = "diet-card";

      const textoSeguro = plan.texto ? plan.texto : "Sin texto cargado. Revisá el PDF adjunto.";
      const enlacePdf = plan.pdfData
        ? `<a class="button secondary small" href="${plan.pdfData}" download="${plan.pdfNombre}">Descargar PDF</a>`
        : "";

      card.innerHTML = `
        <div class="diet-card-header">
          <div>
            <h4>${plan.titulo}</h4>
            <time>${plan.fecha}</time>
          </div>
          <button type="button" class="button ghost small" data-delete-diet="${plan.id}">Eliminar</button>
        </div>
        <p>${textoSeguro}</p>
        <div class="diet-actions">
          ${plan.pdfNombre ? `<span class="badge">${plan.pdfNombre}</span>` : ""}
          ${enlacePdf}
        </div>
      `;

      dietList.appendChild(card);
    });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("No se pudo leer el archivo PDF."));
    reader.readAsDataURL(file);
  });
}

function drawChart(pesos) {
  const ctx = pesoChart.getContext("2d");
  const width = pesoChart.width;
  const height = pesoChart.height;

  ctx.clearRect(0, 0, width, height);

  if (!pesos.length) {
    return;
  }

  const padding = 36;
  const minPeso = Math.min(...pesos) - 1;
  const maxPeso = Math.max(...pesos) + 1;
  const range = maxPeso - minPeso || 1;
  const stepX = pesos.length > 1 ? (width - padding * 2) / (pesos.length - 1) : 0;

  ctx.strokeStyle = body.classList.contains("dark-mode") ? "#334155" : "#cbd5e1";
  ctx.lineWidth = 1;

  for (let i = 0; i < 5; i += 1) {
    const y = padding + ((height - padding * 2) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "#00e5ff";
  ctx.lineWidth = 3;
  ctx.beginPath();

  pesos.forEach((peso, index) => {
    const x = padding + stepX * index;
    const y = height - padding - ((peso - minPeso) / range) * (height - padding * 2);

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  pesos.forEach((peso, index) => {
    const x = padding + stepX * index;
    const y = height - padding - ((peso - minPeso) / range) * (height - padding * 2);

    ctx.fillStyle = "#00e5ff";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = body.classList.contains("dark-mode") ? "#1f2937" : "#f8fafc";
    ctx.font = "12px Inter";
    ctx.fillText(`${peso.toFixed(1)} kg`, x - 20, y - 12);
  });
}

themeToggle.addEventListener("click", () => {
  const isLightMode = body.classList.toggle("dark-mode");
  localStorage.setItem(STORAGE_KEYS.theme, isLightMode ? "light" : "dark");
  updateThemeButton(isLightMode);
  renderPesos();
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("usuarioActivo");
  window.location.href = "../login/login.html";
});

window.addEventListener("scroll", handleFloatingActionsOnScroll, { passive: true });

consultaForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nuevaConsulta = consultaInput.value.trim();
  if (!nuevaConsulta) {
    return;
  }

  const consultas = getData(STORAGE_KEYS.consultas, defaultConsultas);
  consultas.push(nuevaConsulta);
  saveData(STORAGE_KEYS.consultas, consultas);
  consultaInput.value = "";
  renderConsultas();
});

pesoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nuevoPeso = Number(pesoInput.value);
  if (!nuevoPeso || nuevoPeso < 20 || nuevoPeso > 400) {
    return;
  }

  const pesos = getData(STORAGE_KEYS.pesos, defaultPesos);
  pesos.push(nuevoPeso);
  saveData(STORAGE_KEYS.pesos, pesos);
  pesoInput.value = "";
  renderPesos();
});

dietForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const titulo = planTitle.value.trim();
  const texto = planText.value.trim();
  const archivo = planPdf.files[0];

  if (!titulo) {
    dietMessage.textContent = "Ingresá un título para identificar el plan.";
    return;
  }

  if (!texto && !archivo) {
    dietMessage.textContent = "Escribí un plan o adjuntá un PDF antes de guardar.";
    return;
  }

  if (archivo && archivo.type !== "application/pdf") {
    dietMessage.textContent = "Solo se permiten archivos en formato PDF.";
    return;
  }

  try {
    let pdfData = "";
    let pdfNombre = "";

    if (archivo) {
      pdfData = await readFileAsDataUrl(archivo);
      pdfNombre = archivo.name;
    }

    const dietas = getData(STORAGE_KEYS.dietas, defaultDietas);
    dietas.push({
      id: crypto.randomUUID(),
      titulo,
      texto,
      pdfNombre,
      pdfData,
      fecha: new Date().toLocaleDateString("es-AR")
    });

    saveData(STORAGE_KEYS.dietas, dietas);
    dietForm.reset();
    dietMessage.textContent = "El plan de alimentación se guardó correctamente.";
    renderDietas();
  } catch (error) {
    dietMessage.textContent = "No se pudo guardar el PDF. Probá con un archivo más liviano.";
  }
});

dietList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-diet]");

  if (!button) {
    return;
  }

  const id = button.getAttribute("data-delete-diet");
  const dietas = getData(STORAGE_KEYS.dietas, defaultDietas).filter((plan) => plan.id !== id);
  saveData(STORAGE_KEYS.dietas, dietas);
  renderDietas();
  dietMessage.textContent = "El plan seleccionado fue eliminado.";
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nombre = document.getElementById("nombreContacto").value.trim();
  const email = document.getElementById("emailContacto").value.trim();
  const mensaje = document.getElementById("mensajeContacto").value.trim();
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!nombre || !email || !mensaje) {
    contactMessage.textContent = "Completá todos los campos antes de enviar la consulta.";
    return;
  }

  if (!emailValido) {
    contactMessage.textContent = "Ingresá un correo electrónico válido.";
    return;
  }

  contactMessage.textContent = "Tu consulta fue enviada correctamente. Pronto recibirás una respuesta.";
  contactForm.reset();
});

applyTheme();
renderUsuarioActivo();
handleFloatingActionsOnScroll();
renderConsultas();
renderDietas();
renderPesos();
