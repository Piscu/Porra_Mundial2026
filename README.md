# 🏆 Porra Mundial de Fútbol 2026 - Quiniela Deportiva

Bienvenido a la **Porra del Mundial 2026**, una aplicación web premium, moderna y responsiva diseñada para organizar una porra (quiniela, polla o penca) del Mundial de Fútbol 2026 con tus amigos, familiares y compañeros de trabajo de manera **100% gratuita** y sin complicaciones de servidores.

Esta aplicación utiliza una arquitectura **Serverless**:
* **Frontend**: Una SPA estática (Página única) hecha con Vanilla HTML, CSS (con Glassmorphism y temas deportivos oscuros) y JavaScript. Se despliega gratis en **GitHub Pages**.
* **Base de Datos y Backend**: Un documento privado de **Google Sheets** que gestiona los datos de los usuarios mediante un **Google Apps Script** publicado como Web App (API REST). ¡Cero costos de mantenimiento!

---

## ✨ Características de la Porra

1. **Diseño de Alta Calidad**: Interfaz visual ultra-premium, con estética deportiva oscura, acentos verde césped/dorado y diseño completamente adaptado a móviles.
2. **Modo Demo Local**: Si abres la página por primera vez, el sistema funcionará en modo local usando el almacenamiento del navegador. ¡Generará 3 amigos simulados con pronósticos e historial para que puedas probar cómo funciona la tabla de clasificación antes de conectar nada!
3. **Inicio de Sesión PIN Seguro**: Los usuarios se registran con su apodo y un código PIN de 4 dígitos. Así, tus amigos no podrán editar ni sabotear los marcadores de otros.
4. **Cálculo Automático de Puntos**: 
   * **3 Puntos** por acertar el resultado exacto (Pleno).
   * **1 Punto** por acertar la tendencia (ganador o empate), pero no los goles exactos.
   * **0 Puntos** si no aciertas el resultado.
5. **Panel del Administrador**: Sección protegida con contraseña desde donde puedes registrar los marcadores reales de los partidos a medida que se jueguen, recalculando al instante la clasificación de todo el grupo.
6. **Control de Tiempo Limpio**: El sistema bloquea automáticamente la entrada de pronósticos para cualquier partido una vez que llega su hora de juego oficial para evitar trampas.

---

## 🛠️ Instrucciones de Configuración Paso a Paso

Configurar la porra para tu grupo te tomará menos de 10 minutos si sigues estos sencillos pasos:

### Paso 1: Configurar la Base de Datos en Google Sheets

1. Crea una nueva hoja de cálculo en Google Sheets (puedes usar el atajo rápido [sheets.new](https://sheets.new)).
2. En el menú superior de la hoja, haz clic en **Extensiones** ➡️ **Apps Script**.
3. Borra cualquier código que aparezca por defecto en el editor.
4. Abre el archivo [db-script.js](file:///C:/Users/Piscu/.gemini/antigravity/scratch/porra-mundial-2026/db-script.js) de este repositorio, **copia todo su contenido** y pégalo en el editor de Apps Script.
   * *Opcional:* Al inicio del código, puedes cambiar la contraseña de administrador predeterminada (`"admin123"`) por la que tú desees.
5. En la barra de herramientas superior del editor, asegúrate de que esté seleccionada la función **`setupDatabase`** en el menú desplegable y haz clic en **Ejecutar** (Ejecutar ▶).
   * Google te pedirá autorizar los permisos del script. Concede todos los accesos (haz clic en *Configuración Avanzada* ➡️ *Ir a Proyecto (no seguro)* y permite el acceso).
   * Esto creará automáticamente las pestañas necesarias (`Partidos`, `Pronosticos` y `Usuarios`) con sus encabezados oficiales en tu hoja de cálculo.
6. Haz clic en el botón superior derecho **Implementar** ➡️ **Nueva implementación**.
7. Selecciona el tipo de implementación haciendo clic en el engranaje ⚙️ y elige **Aplicación web**.
8. Configura los parámetros:
   * **Descripción**: Porra Mundial 2026 API.
   * **Ejecutar como**: "Tú" (tu correo de Google).
   * **Quién tiene acceso**: **"Cualquiera"** *(Esta parte es crucial para que la página web pueda enviar los datos de tus amigos)*.
9. Haz clic en **Implementar**.
10. Copia la **URL de la aplicación web** generada (es una dirección larga que termina en `/exec`).

### Paso 2: Vincular el Frontend con Google Sheets

1. Abre el archivo [index.html](file:///C:/Users/Piscu/.gemini/antigravity/scratch/porra-mundial-2026/index.html) en tu navegador.
2. Verás un banner azul superior indicando que estás en **Modo Demo Local**.
3. Haz clic en el botón **🔗 Conectar Google Sheet**.
4. Pega la **URL de la aplicación web (Web App URL)** que copiaste en el paso anterior y haz clic en **Vincular URL**.
5. ¡Listo! El banner cambiará a color verde confirmando que estás **Conectado a Google Sheets**. A partir de ahora, todo lo que hagan tus amigos se guardará directamente en tu hoja de cálculo privada.

---

## 🚀 Despliegue Gratis en GitHub Pages

Para compartir la porra con todos tus amigos de forma pública y gratuita:

1. Crea una cuenta en [GitHub](https://github.com) si no tienes una.
2. Crea un nuevo repositorio público (ej. `porra-mundial-2026`).
3. Sube todos los archivos de esta carpeta a tu repositorio (`index.html`, `styles.css`, `app.js`, `matches-data.js`, `db-script.js`, `README.md`).
4. Ve a la pestaña **Settings** (Configuración) de tu repositorio.
5. En el menú de la izquierda, haz clic en **Pages**.
6. En la sección **Build and deployment**:
   * Source: *Deploy from a branch*.
   * Branch: Selecciona **`main`** (o `master`) y la carpeta **`/(root)`**.
   * Haz clic en **Save** (Guardar).
7. Espera aproximadamente 1 minuto. GitHub generará un enlace público (ej. `https://tu-usuario.github.io/porra-mundial-2026/`) desde donde todos tus amigos podrán ingresar en cualquier momento, registrarse y jugar.

---

## ⚙️ Personalización Adicional

* **Editar Partidos**: Si deseas añadir más partidos o modificar los existentes, edita la lista dentro de [matches-data.js](file:///C:/Users/Piscu/.gemini/antigravity/scratch/porra-mundial-2026/matches-data.js) antes de subir el proyecto a GitHub, o actualízalos directamente en la pestaña `Partidos` de tu Google Sheet.
* **Cambiar Puntuación**: Si quieres que acertar la tendencia otorgue 2 puntos en lugar de 1, puedes modificarlo fácilmente tanto en la línea ~370 del archivo [app.js](file:///C:/Users/Piscu/.gemini/antigravity/scratch/porra-mundial-2026/app.js) como en la línea ~470 del archivo [db-script.js](file:///C:/Users/Piscu/.gemini/antigravity/scratch/porra-mundial-2026/db-script.js).
