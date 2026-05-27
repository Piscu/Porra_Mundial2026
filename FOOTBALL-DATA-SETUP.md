# 🎮 Guía: Sincronizar Partidos desde football-data.org

Esta guía te explica cómo obtener automáticamente todos los partidos del Mundial 2026 desde **football-data.org** sin necesidad de introducirlos manualmente.

---

## ¿Por Qué Usar football-data.org?

✅ **Actualización Automática**: Los horarios, estadios y resultados se actualizan en tiempo real  
✅ **Sin Errores Manuales**: Evitas typos al introducir equipos, horarios, etc.  
✅ **Completamente Gratis**: El plan gratuito es suficiente para la porra  
✅ **Rápido de Configurar**: 2 minutos máximo  

---

## 📋 Pasos para Configurar

### 1️⃣ Registrarse en football-data.org

1. Ve a [https://www.football-data.org/client/register](https://www.football-data.org/client/register)
2. Completa el formulario:
   - **Email**: Tu correo electrónico
   - **Password**: Crea una contraseña
   - **First Name**: Tu nombre
   - **Last Name**: Tu apellido
3. Haz clic en **Register**
4. Confirma tu email (busca el correo de confirmación en tu bandeja de entrada)

### 2️⃣ Obtener tu API Key Gratuita

1. Después de registrarte, inicia sesión en [https://www.football-data.org/client/login](https://www.football-data.org/client/login)
2. Ve a tu **Dashboard** o **Account Settings** (generalmente en la esquina superior derecha)
3. Busca la sección **My API Token** o **API Key**
4. Copia la clave (será un string largo como: `1a2b3c4d5e6f7g8h9i0j`)

### 3️⃣ Usar la API Key en tu Porra

1. Abre tu **Porra Mundial 2026** en el navegador
2. Ve a la pestaña **Admin** (⚙️)
3. Introduce tu **contraseña de administrador** (por defecto es `admin123`)
4. En la sección **🔄 Sincronizar Partidos desde API**, pega tu **API Key de football-data.org**
5. Haz clic en **📊 Sincronizar Football-Data**
6. ¡Listo! Los partidos del Mundial 2026 se cargarán automáticamente en tu Google Sheets

---

## 🆓 Opción: Usar Sin API Key (Plan Gratuito Limitado)

Si **no quieres crear cuenta**, puedes sincronizar igual:

1. Ve a la sección **🔄 Sincronizar Partidos desde API** del Panel Admin
2. **Deja vacío** el campo de API Key
3. Haz clic en **📊 Sincronizar Football-Data**

⚠️ **Limitación**: 10 solicitudes por minuto (suficiente para la porra)

---

## 🔄 Sincronización Alternativa desde GitHub

Si prefieres no usar football-data.org:

1. Edita [matches-api.json](./matches-api.json) con los últimos partidos (actualiza equipos/horarios)
2. Sube los cambios a tu repositorio de GitHub
3. En el **Panel Admin**, haz clic en **📁 Sincronizar desde GitHub**
4. Los datos se cargarán desde tu GitHub

---

## ✅ Verificar que Funcionó

Después de sincronizar:

1. Vuelve a la pestaña **Partidos** (⚽)
2. Verifica que los partidos están listos con:
   - ✅ Equipos correctos
   - ✅ Horarios correctos
   - ✅ Estadios correctos
   - ✅ Iconos de bandera de países

---

## 🐛 Solucionar Problemas

### Error: "Rate limit alcanzado"
- **Causa**: Excediste 10 solicitudes por minuto
- **Solución**: Espera 1-2 minutos y vuelve a intentar

### Error: "Formato de respuesta inválido"
- **Causa**: Tu API Key es inválida o el token ha expirado
- **Solución**: 
  - Verifica tu API Key en football-data.org
  - Si expiró, genera una nueva desde el dashboard

### Los partidos no aparecen
- **Causa**: Los datos pueden no estar sincronizados en football-data.org aún
- **Solución**: Usa la opción **Sincronizar desde GitHub** manualmente

---

## 📝 Límites del Plan Gratuito de football-data.org

| Característica | Plan Gratuito |
|---|---|
| Solicitudes por minuto | 10 |
| Competiciones | Limitadas |
| Datos históricos | 365 días |
| Precio | **GRATIS** |

Para más información: [https://www.football-data.org/pricing](https://www.football-data.org/pricing)

---

## 💡 Consejos

- **Sincroniza una sola vez**: No necesitas hacer esto cada día, solo una vez al inicio
- **Actualiza resultados manualmente**: Después de sincronizar partidos, actualiza los resultados manualmente en el Panel Admin (puedes hacerlo partido por partido)
- **Mantén un respaldo**: Si tus datos están en Google Sheets, siempre tendrás un respaldo

---

## 🎉 ¡Listo!

¡Tu porra está configurada para obtener automáticamente todos los partidos del Mundial 2026! 

Comparte el enlace con tus amigos y que comience la competencia. 🏆
