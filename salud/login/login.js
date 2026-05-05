document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const usuario = document.getElementById("loginUser").value;
  const pass = document.getElementById("loginPass").value;

  const tempUser = JSON.parse(localStorage.getItem("tempUser"));
  if (tempUser && tempUser.usuario === usuario) {
    mostrarGota("Debés verificar tu email antes de iniciar sesión ❌");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("users")) || [];
  const encontrado = usuarios.find(
    u => u.usuario === usuario && u.pass === pass
  );

  if (!encontrado) {
    mostrarGota("Usuario o contraseña incorrectos ❌");
    return;
  }

  if (!encontrado.verificado) {
    mostrarGota("Tu cuenta no está verificada ❌");
    return;
  }

  localStorage.setItem("usuarioActivo", usuario);
  window.location.href = "../inicio/inicio.html";
});

function mostrarGota(mensaje) {
  const alerta = document.getElementById("customAlert");
  document.getElementById("alertMessage").innerText = mensaje;
  alerta.classList.remove("hidden");
}

function cerrarAlerta() {
  document.getElementById("customAlert").classList.add("hidden");
}
