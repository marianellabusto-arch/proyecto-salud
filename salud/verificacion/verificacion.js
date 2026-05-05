const inputs = document.querySelectorAll(".code");
if (inputs.length > 0) inputs[0].focus();

const codigoGuardado = localStorage.getItem("codigo");
const tempUser = JSON.parse(localStorage.getItem("tempUser"));

if (!codigoGuardado || !tempUser) {
  alert("Sesión de registro inválida. Volvé a registrarte.");
  window.location.href = "../registro/registro.html";
}

inputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    if (e.target.value && index < inputs.length - 1) inputs[index + 1].focus();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !input.value && index > 0) inputs[index - 1].focus();
  });
});

document.getElementById("verifForm").addEventListener("submit", function(e) {
  e.preventDefault();
  let codigoIngresado = "";
  inputs.forEach(input => codigoIngresado += input.value);

  if (codigoIngresado === codigoGuardado) {
    const usuarioVerificado = { ...tempUser, verificado: true };
    const listaOficial = JSON.parse(localStorage.getItem("users")) || [];
    const yaExiste = listaOficial.find(
      u => u.usuario === usuarioVerificado.usuario || u.email === usuarioVerificado.email
    );

    if (yaExiste) {
      mostrarGota("El usuario o email ya fue registrado ❌");
      localStorage.removeItem("tempUser");
      localStorage.removeItem("codigo");
      return;
    }

    listaOficial.push(usuarioVerificado);
    localStorage.setItem("users", JSON.stringify(listaOficial));
    localStorage.removeItem("tempUser");
    localStorage.removeItem("codigo");
    mostrarGota("Verificación correcta ✅");
  } else {
    mostrarGota("Código incorrecto ❌");
  }
});

function reenviarCodigo() {
  mostrarGota("Tu código de acceso es: " + codigoGuardado);
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
  if (mensaje.includes("correcta")) {
    window.location.href = "../login/login.html";
  }
}

function cancelarRegistro() {
  localStorage.removeItem("tempUser");
  localStorage.removeItem("codigo");
  window.location.href = "../login/login.html";
}
