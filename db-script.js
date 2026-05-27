// db-script.js
// ==========================================================================================
// CÓDIGO DE GOOGLE APPS SCRIPT PARA LA BASE DE DATOS DE LA PORRA
// ==========================================================================================
//
// INSTRUCCIONES DE INSTALACIÓN:
//
// 1. Crea una nueva Hoja de Cálculo en Google Sheets (https://sheets.new).
// 2. En el menú superior, ve a: Extensiones -> Apps Script.
// 3. Borra cualquier código existente y pega TODO el contenido de este archivo en el editor.
// 4. En la barra de herramientas del editor de Apps Script, selecciona la función "setupDatabase"
//    en el menú desplegable y haz clic en el botón "Ejecutar" (Ejecutar ▶). Esto creará todas
//    las pestañas necesarias en tu Google Sheet automáticamente con sus cabeceras correspondientes.
// 5. Haz clic en el botón superior derecho: "Implementar" -> "Nueva implementación".
// 6. Configura la implementación:
//    - Tipo de implementación (icono de engranaje): Selecciona "Aplicación web".
//    - Descripción: Porra Mundial 2026 API
//    - Ejecutar como: "Tú" (tu cuenta de correo).
//    - Quién tiene acceso: "Cualquiera" (esto es MUY IMPORTANTE para permitir que la web se conecte).
// 7. Haz clic en "Implementar". Otorga los permisos que Google te solicite.
// 8. Copia la "URL de la aplicación web" generada (debe terminar en "/exec") y pégala en la
//    aplicación web haciendo clic en "Conectar Google Sheet".
//
// ==========================================================================================

// Configuración global
const ADMIN_PASSCODE = "admin123"; // CAMBIA ESTA CLAVE por la contraseña de administrador que desees.

/**
 * Inicializa la base de datos creando las hojas correspondientes en el Google Sheet
 */
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Hoja: Partidos
  let sheetMatches = ss.getSheetByName("Partidos");
  if (!sheetMatches) {
    sheetMatches = ss.insertSheet("Partidos");
    sheetMatches.appendRow([
      "id", "group", "teamA", "teamB", "date", "stadium", "logoA", "logoB", "realScoreA", "realScoreB"
    ]);
    
    // Cargar partidos iniciales de prueba (Grupo A y C)
    const mockMatches = [
      [1, "Grupo A", "México", "Sudáfrica", "2026-06-11T18:00:00", "Estadio Azteca, CDMX", "🇲🇽", "🇿🇦", "", ""],
      [2, "Grupo B", "Canadá", "Túnez", "2026-06-12T16:00:00", "BMO Field, Toronto", "🇨🇦", "🇹🇳", "", ""],
      [3, "Grupo C", "Estados Unidos", "Bolivia", "2026-06-12T20:00:00", "SoFi Stadium, Los Angeles", "🇺🇸", "🇧🇴", "", ""],
      [4, "Grupo D", "Argentina", "Suecia", "2026-06-13T15:00:00", "MetLife Stadium, NY/NJ", "🇦🇷", "🇸🇪", "", ""],
      [5, "Grupo E", "España", "Japón", "2026-06-13T19:00:00", "Hard Rock Stadium, Miami", "🇪🇸", "🇯🇵", "", ""],
      [6, "Grupo F", "Francia", "Camerún", "2026-06-14T14:00:00", "Mercedes-Benz Stadium, Atlanta", "🇫🇷", "🇨🇲", "", ""],
      [7, "Grupo G", "Brasil", "Australia", "2026-06-14T18:00:00", "NRG Stadium, Houston", "🇧🇷", "🇦🇺", "", ""],
      [8, "Grupo H", "Inglaterra", "Ecuador", "2026-06-15T15:00:00", "Arrowhead Stadium, Kansas City", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "🇪🇨", "", ""],
      [9, "Grupo I", "Alemania", "Marruecos", "2026-06-15T19:00:00", "Lincoln Financial Field, Philly", "🇩🇪", "🇲🇦", "", ""],
      [10, "Grupo J", "Uruguay", "Corea del Sur", "2026-06-16T16:00:00", "Levi's Stadium, SF Bay", "🇺🇾", "🇰🇷", "", ""],
      [11, "Grupo K", "Portugal", "Arabia Saudita", "2026-06-16T20:00:00", "Gillette Stadium, Boston", "🇵🇹", "🇸🇦", "", ""],
      [12, "Grupo L", "Bélgica", "Austria", "2026-06-17T17:00:00", "Lumen Field, Seattle", "🇧🇪", "🇦🇹", "", ""],
      [13, "Grupo A", "México", "Polonia", "2026-06-18T18:00:00", "Estadio BBVA, Monterrey", "🇲🇽", "🇵🇱", "", ""],
      [14, "Grupo C", "Estados Unidos", "Italia", "2026-06-19T20:00:00", "AT&T Stadium, Dallas", "🇺🇸", "🇮🇹", "", ""],
      [15, "Grupo D", "Argentina", "Croacia", "2026-06-20T15:00:00", "MetLife Stadium, NY/NJ", "🇦🇷", "🇭🇷", "", ""],
      [16, "Grupo E", "España", "Países Bajos", "2026-06-21T19:00:00", "Hard Rock Stadium, Miami", "🇪🇸", "🇳🇱", "", ""]
    ];
    mockMatches.forEach(row => sheetMatches.appendRow(row));
  }
  
  // 2. Hoja: Pronosticos
  let sheetPreds = ss.getSheetByName("Pronosticos");
  if (!sheetPreds) {
    sheetPreds = ss.insertSheet("Pronosticos");
    sheetPreds.appendRow(["user", "matchId", "scoreA", "scoreB", "timestamp"]);
  }
  
  // 3. Hoja: Usuarios
  let sheetUsers = ss.getSheetByName("Usuarios");
  if (!sheetUsers) {
    sheetUsers = ss.insertSheet("Usuarios");
    sheetUsers.appendRow(["username", "pin"]);
  }

  // 4. Eliminar Hoja default "Hoja 1" si existe
  let defaultSheet = ss.getSheetByName("Hoja 1");
  if (defaultSheet) {
    ss.deleteSheet(defaultSheet);
  }

  Logger.log("Base de datos de la porra creada con éxito.");
}

/**
 * Maneja las peticiones HTTP GET (Descarga de datos)
 */
function doGet(e) {
  const action = e.parameter.action;
  const user = e.parameter.user;
  
  let response = { success: false };
  
  try {
    if (action === "getData") {
      response = {
        success: true,
        matches: getMatchesData(),
        leaderboard: calculateLeaderboard(),
        predictions: user ? getUserPredictionsData(user) : {}
      };
    } else {
      response.message = "Acción desconocida en GET.";
    }
  } catch (err) {
    response.message = "Error en el servidor: " + err.toString();
  }
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Maneja las peticiones HTTP POST (Guardado de datos, Registro, Inicio de Sesión, Admin)
 */
function doPost(e) {
  let response = { success: false };
  
  try {
    let postData;
    if (e.postData && e.postData.contents) {
      postData = JSON.parse(e.postData.contents);
    } else {
      postData = e.parameter;
    }
    
    const action = postData.action;
    
    if (action === "register") {
      response = handleRegister(postData.user, postData.pin);
    } 
    else if (action === "login") {
      response = handleLogin(postData.user, postData.pin);
    } 
    else if (action === "savePrediction") {
      response = handleSavePrediction(postData.user, postData.pin, postData.matchId, postData.scoreA, postData.scoreB);
    } 
    else if (action === "adminLogin") {
      response = handleAdminLogin(postData.adminKey);
    }
    else if (action === "updateResult") {
      response = handleUpdateResult(postData.adminKey, postData.matchId, postData.scoreA, postData.scoreB);
    } 
    else {
      response.message = "Acción POST desconocida.";
    }
    
  } catch (err) {
    response.message = "Error procesando POST: " + err.toString();
  }
  
  // Solución simple para evitar problemas de CORS en navegadores
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
// FUNCIONES AUXILIARES DE BASE DE DATOS
// ==========================================

function getMatchesData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Partidos");
  const data = sheet.getDataRange().getValues();
  
  const headers = data[0];
  const matches = [];
  
  for (let i = 1; i < data.length; i++) {
    let match = {};
    headers.forEach((header, index) => {
      let val = data[i][index];
      // Convertir celdas vacías de marcadores reales en null
      if ((header === "realScoreA" || header === "realScoreB") && val === "") {
        val = null;
      }
      match[header] = val;
    });
    matches.push(match);
  }
  return matches;
}

function getUserPredictionsData(username) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Pronosticos");
  const data = sheet.getDataRange().getValues();
  
  const predictions = {};
  
  for (let i = 1; i < data.length; i++) {
    const rowUser = data[i][0];
    const rowMatchId = data[i][1];
    const rowScoreA = data[i][2];
    const rowScoreB = data[i][3];
    
    if (rowUser.toLowerCase() === username.toLowerCase()) {
      predictions[rowMatchId] = {
        scoreA: rowScoreA,
        scoreB: rowScoreB
      };
    }
  }
  return predictions;
}

// ==========================================
// FUNCIONES DE CONTROLADORES / CASOS DE USO
// ==========================================

function handleRegister(username, pin) {
  if (!username || username.trim().length < 3 || !pin || pin.length !== 4) {
    return { success: false, message: "Datos de registro inválidos." };
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Usuarios");
  const data = sheet.getDataRange().getValues();
  
  // Validar si el usuario ya existe
  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toLowerCase() === username.toLowerCase()) {
      return { success: false, message: "El apodo ya está en uso por otra persona." };
    }
  }
  
  // Agregar usuario nuevo
  sheet.appendRow([username, pin]);
  return { success: true };
}

function handleLogin(username, pin) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Usuarios");
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    const rowUser = data[i][0];
    const rowPin = data[i][1].toString();
    
    if (rowUser.toLowerCase() === username.toLowerCase()) {
      if (rowPin === pin.toString()) {
        return { success: true };
      } else {
        return { success: false, message: "El PIN de 4 dígitos es incorrecto." };
      }
    }
  }
  
  return { success: false, message: "El nombre de usuario no existe." };
}

function handleSavePrediction(username, pin, matchId, scoreA, scoreB) {
  // 1. Validar identidad
  const auth = handleLogin(username, pin);
  if (!auth.success) {
    return { success: false, message: "Error de autenticación: " + auth.message };
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetMatches = ss.getSheetByName("Partidos");
  const matchesData = sheetMatches.getDataRange().getValues();
  
  // 2. Verificar que el partido exista y no haya comenzado
  let matchFound = false;
  let matchDateStr = "";
  
  for (let i = 1; i < matchesData.length; i++) {
    if (parseInt(matchesData[i][0]) === parseInt(matchId)) {
      matchFound = true;
      matchDateStr = matchesData[i][4]; // Columna date
      break;
    }
  }
  
  if (!matchFound) {
    return { success: false, message: "Partido no encontrado." };
  }
  
  // Bloquear pronósticos si el partido ya comenzó
  const matchDate = new Date(matchDateStr);
  const now = new Date();
  if (now > matchDate) {
    return { success: false, message: "El partido ya comenzó. Pronósticos bloqueados." };
  }
  
  // 3. Guardar o actualizar pronóstico
  const sheetPreds = ss.getSheetByName("Pronosticos");
  const predsData = sheetPreds.getDataRange().getValues();
  let rowIndexToUpdate = -1;
  
  for (let i = 1; i < predsData.length; i++) {
    const rowUser = predsData[i][0];
    const rowMatchId = predsData[i][1];
    
    if (rowUser.toLowerCase() === username.toLowerCase() && parseInt(rowMatchId) === parseInt(matchId)) {
      rowIndexToUpdate = i + 1; // +1 porque las filas en Sheets son index-1
      break;
    }
  }
  
  const timestamp = new Date().toISOString();
  
  if (rowIndexToUpdate !== -1) {
    // Actualizar fila existente
    sheetPreds.getRange(rowIndexToUpdate, 3).setValue(scoreA); // scoreA
    sheetPreds.getRange(rowIndexToUpdate, 4).setValue(scoreB); // scoreB
    sheetPreds.getRange(rowIndexToUpdate, 5).setValue(timestamp);
  } else {
    // Crear nueva fila
    sheetPreds.appendRow([username, matchId, scoreA, scoreB, timestamp]);
  }
  
  return { success: true };
}

function handleAdminLogin(adminKey) {
  if (adminKey === ADMIN_PASSCODE) {
    return { success: true };
  }
  return { success: false, message: "Clave de administrador incorrecta." };
}

function handleUpdateResult(adminKey, matchId, scoreA, scoreB) {
  // 1. Validar Admin
  if (adminKey !== ADMIN_PASSCODE) {
    return { success: false, message: "Acceso no autorizado de administrador." };
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetMatches = ss.getSheetByName("Partidos");
  const data = sheetMatches.getDataRange().getValues();
  
  let rowIndex = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (parseInt(data[i][0]) === parseInt(matchId)) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex === -1) {
    return { success: false, message: "Partido no encontrado en la lista." };
  }
  
  // Guardar marcadores reales en las columnas correspondientes (columnas 9 y 10)
  sheetMatches.getRange(rowIndex, 9).setValue(scoreA); // realScoreA
  sheetMatches.getRange(rowIndex, 10).setValue(scoreB); // realScoreB
  
  return { success: true };
}

/**
 * Calcula la clasificación recopilando todos los pronósticos y comparándolos con marcadores reales
 */
function calculateLeaderboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const sheetUsers = ss.getSheetByName("Usuarios");
  const users = sheetUsers.getDataRange().getValues();
  
  const sheetMatches = ss.getSheetByName("Partidos");
  const matches = sheetMatches.getDataRange().getValues();
  
  const sheetPreds = ss.getSheetByName("Pronosticos");
  const preds = sheetPreds.getDataRange().getValues();
  
  // Estructuras de consulta
  const matchesMap = {};
  for (let i = 1; i < matches.length; i++) {
    const id = matches[i][0];
    const rA = matches[i][8];
    const rB = matches[i][9];
    
    matchesMap[id] = {
      realScoreA: rA !== "" ? parseInt(rA) : null,
      realScoreB: rB !== "" ? parseInt(rB) : null
    };
  }
  
  const predictionsByUser = {};
  for (let i = 1; i < preds.length; i++) {
    const user = preds[i][0].toLowerCase();
    const matchId = preds[i][1];
    const sA = parseInt(preds[i][2]);
    const sB = parseInt(preds[i][3]);
    
    if (!predictionsByUser[user]) {
      predictionsByUser[user] = [];
    }
    
    predictionsByUser[user].push({ matchId, sA, sB });
  }
  
  const leaderboard = [];
  
  // Calcular puntos por usuario registrado
  for (let i = 1; i < users.length; i++) {
    const username = users[i][0];
    const userLower = username.toLowerCase();
    
    let points = 0;
    let exacts = 0;
    let outcomes = 0;
    let played = 0;
    
    const userPreds = predictionsByUser[userLower] || [];
    
    userPreds.forEach(p => {
      const match = matchesMap[p.matchId];
      if (match && match.realScoreA !== null && match.realScoreB !== null) {
        played++;
        const pA = p.sA;
        const pB = p.sB;
        const rA = match.realScoreA;
        const rB = match.realScoreB;
        
        // Exact score
        if (pA === rA && pB === rB) {
          points += 3;
          exacts++;
        }
        // Right trend/draw
        else if ((pA > pB && rA > rB) || (pA < pB && rA < rB) || (pA === pB && rA === rB)) {
          points += 1;
          outcomes++;
        }
      }
    });
    
    leaderboard.push({
      username: username,
      points: points,
      exacts: exacts,
      outcomes: outcomes,
      played: played
    });
  }
  
  // Ordenar leaderboard
  leaderboard.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.exacts !== a.exacts) return b.exacts - a.exacts;
    return b.outcomes - a.outcomes;
  });
  
  return leaderboard;
}
