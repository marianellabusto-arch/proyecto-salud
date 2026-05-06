const inputs = document.querySelectorAll(".code");
if (inputs.length > 0) inputs[0].focus();

const codigoGuardado = localStorage.getItem("codigo");
const tempUser = JSON.parse(localStorage.getItem("tempUser"));

if (!codigoGuardado || !tempUser) {
  alert("Sesión de registro inválida. Volvé a registrarte.");
  window.location.href = "../registro/registro.html";
}

// Auto-avance entre inputs
inputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
    if (e.target.value && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !input.value && index > 0) {
      inputs[index - 1].focus();
    }
  });
  // Soporte para pegar el código completo
  input.addEventListener("paste", (e) => {
    e.preventDefault();
    const pegado = (e.clipboardData || window.clipboardData).getData("text").trim();
    if (/^\d{4}$/.test(pegado)) {
      inputs.forEach((inp, i) => { inp.value = pegado[i] || ""; });
      inputs[inputs.length - 1].focus();
    }
  });
});

document.getElementById("verifForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let codigoIngresado = "";
  inputs.forEach((input) => (codigoIngresado += input.value));

  if (codigoIngresado.length < 4) {
    mostrarGota("Ingresá los 4 dígitos del código ❌");
    return;
  }

  if (codigoIngresado === codigoGuardado) {
    const usuarioVerificado = { ...tempUser, verificado: true };
    const listaOficial = JSON.parse(localStorage.getItem("users")) || [];

    const yaExiste = listaOficial.find(
      (u) => u.usuario === usuarioVerificado.usuario || u.email === usuarioVerificado.email
    );

    if (yaExiste) {
      mostrarGota("El usuario o email ya fue registrado ❌");
      localStorage.removeItem("tempUser");
      localStorage.removeItem("codigo");
      return;
    }

    // Guardar usuario verificado permanentemente
    listaOficial.push(usuarioVerificado);
    localStorage.setItem("users", JSON.stringify(listaOficial));

    // Limpiar temporales
    localStorage.removeItem("tempUser");
    localStorage.removeItem("codigo");

    // Login automático: no necesita volver a registrarse nunca más
    localStorage.setItem("usuarioActivo", usuarioVerificado.usuario);

    mostrarGota("✅ Verificación correcta. Bienvenido, " + usuarioVerificado.nombre + "!");
  } else {
    inputs.forEach((inp) => (inp.value = ""));
    inputs[0].focus();
    mostrarGota("Código incorrecto, intentá de nuevo ❌");
  }
});

function reenviarCodigo() {
  mostrarGota("Tu código de activación es: " + codigoGuardado);
}

function mostrarGota(mensaje) {
  const alerta = document.getElementById("customAlert");
  const texto = document.getElementById("alertMessage");
  if (alerta && texto) {
    texto.innerText = mensaje;
    alerta.classList.remove("hidden");
  }
}

function cerrarAlerta() {
  const alerta = document.getElementById("customAlert");
  alerta.classList.add("hidden");
  const mensaje = document.getElementById("alertMessage").innerText;
  if (mensaje.includes("correcta") || mensaje.includes("Bienvenido")) {
    window.location.href = "../inicio/inicio.html";
  }
}

function cancelarRegistro() {
  localStorage.removeItem("tempUser");
  localStorage.removeItem("codigo");
  window.location.href = "../login/login.html";
}
