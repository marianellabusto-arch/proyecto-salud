# Control Vital

Proyecto unificado de seguimiento de descenso de peso con flujo completo de autenticación. Incluye login, registro, verificación por código y una landing principal protegida por sesión con herramientas para consultas médicas, alimentación, registro de peso y contacto.

## Tecnologías usadas

- HTML5
- CSS3
- JavaScript
- Canvas API para el gráfico dinámico
- LocalStorage para persistencia básica en el navegador
-TRAE SOLO
-claudcode

## Funcionalidades principales

- Login, registro y verificación de usuario con `localStorage`
- Protección de sesión antes de ingresar a la landing principal
- Header con navegación por secciones
- Presentación principal del objetivo del proyecto
- Sección editable de consultas médicas
- Sección de dietas con tabla informativa y registro de planes en texto o PDF
- Registro de peso con lista dinámica y gráfico
- Cambio entre modo claro y oscuro
- Formulario de contacto con validación básica
- Cierre de sesión desde la landing principal

## Estructura del proyecto

```text
index.html
README.md
login/
  login.html
  login.js
  style.css
registro/
  registro.html
  registro.css
  registro.js
verificacion/
  verificacion.html
  verificacion.css
  verificacion.js
inicio/
  inicio.html
  inicio.css
  inicio.js
```

## Instrucciones de ejecución

1. Descargá o cloná el proyecto.
2. Abrí `login/login.html` para comenzar el flujo desde el acceso de usuario.
3. También podés abrir `index.html`, pero si no hay sesión iniciada te redirigirá automáticamente al login.
4. Para una experiencia más cómoda, podés usar una extensión de servidor local como Live Server en Visual Studio Code.


## Repositorio

Agregá aquí el enlace de tu repositorio cuando lo publiques:

`https://github.com/tu-usuario/tu-repositorio`
