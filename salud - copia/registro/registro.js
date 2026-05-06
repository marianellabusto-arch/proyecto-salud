function irALogin() {
  window.location.href = "../login/login.html";
}

document.getElementById("registroForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const email = document.getElementById("regEmail").value;

  const usuariosExistentes = JSON.parse(localStorage.getItem("users")) || [];
  const yaExiste = usuariosExistentes.find(
    u => u.usuario === usuario || u.email === email
  );
  if (yaExiste) {
    mostrarGota("El usuario o email ya está registrado ❌");
    return;
  }

  localStorage.removeItem("tempUser");
  localStorage.removeItem("codigo");

  const tempUser = {
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    telefono: document.getElementById("telefono").value,
    usuario: usuario,
    email: email,
    pass: document.getElementById("regPass").value,
    verificado: false
  };

  localStorage.setItem("tempUser", JSON.stringify(tempUser));

  const codigoGenerado = String(Math.floor(1000 + Math.random() * 9000));
  localStorage.setItem("codigo", codigoGenerado);

  mostrarGota("Código de activación ✅: " + codigoGenerado);
});

function mostrarGota(mensaje) {
  const alerta = document.getElementById("customAlert");
  const texto = document.getElementById("alertMessage");
  if (alerta && texto) {
    texto.innerText = mensaje;
    alerta.classList.remove("hidden");
  }
}

function cerrarAlerta() {
  window.location.href = "../verificacion/verificacion.html";
}
