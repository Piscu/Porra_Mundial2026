// app.js
// Lógica principal de la Porra Mundialista 2026

document.addEventListener('DOMContentLoaded', () => {
  // --- ESTADO GLOBAL ---
  let state = {
    currentUser: null,
    currentPIN: null,
    apiUrl: localStorage.getItem('porra_db_url') || 'https://script.google.com/macros/s/AKfycbwrKdm4IIponPyNuRBnKmscJyEkfPWvqcGaoTGUqAUSHqPcKbzEvG9oUTWbMH1nWx-y/exec',
    activeTab: 'tab-matches',
    filterGroup: 'all',
    matches: [],
    predictions: {}, // { matchId: { scoreA, scoreB, saved: true } }
    leaderboard: [],
    adminKey: localStorage.getItem('porra_admin_key') || '',
    isAdminLoggedIn: false
  };

  // Clave de administrador local (por defecto, para el modo demo)
  const DEFAULT_ADMIN_PASSCODE = 'admin123';

  // --- ELEMENTOS DEL DOM ---
  const headerActions = document.getElementById('header-actions');
  const userAvatarInitial = document.getElementById('user-avatar-initial');
  const usernameDisplay = document.getElementById('username-display');
  const logoutBtn = document.getElementById('logout-btn');
  const mainNav = document.getElementById('main-nav');
  
  const connStatusBadge = document.getElementById('conn-status-badge');
  const connStatusText = document.getElementById('conn-status-text');
  const btnConfigDb = document.getElementById('btn-config-db');
  
  const authView = document.getElementById('auth-view');
  const authForm = document.getElementById('auth-form');
  const authTitle = document.getElementById('auth-title');
  const authSubtitle = document.getElementById('auth-subtitle');
  const authUsername = document.getElementById('auth-username');
  const authPin = document.getElementById('auth-pin');
  const btnAuthSubmit = document.getElementById('btn-auth-submit');
  const authSwitchLink = document.getElementById('auth-switch-link');
  const authSwitchText = document.getElementById('auth-switch-text');
  
  const tabMatches = document.getElementById('tab-matches');
  const tabLeaderboard = document.getElementById('tab-leaderboard');
  const tabRules = document.getElementById('tab-rules');
  const tabAdmin = document.getElementById('tab-admin');
  
  const matchesContainer = document.getElementById('matches-container');
  const leaderboardTbody = document.getElementById('leaderboard-tbody');
  const groupFilters = document.getElementById('group-filters');
  const btnRefreshLeaderboard = document.getElementById('btn-refresh-leaderboard');
  
  const adminAuthSection = document.getElementById('admin-auth-section');
  const adminControlSection = document.getElementById('admin-control-section');
  const adminPasscode = document.getElementById('admin-passcode');
  const btnAdminLogin = document.getElementById('btn-admin-login');
  const btnAdminLogout = document.getElementById('btn-admin-logout');
  const adminMatchesList = document.getElementById('admin-matches-list');
  const btnSyncFootballData = document.getElementById('btn-sync-football-data');
  const btnSyncGitHub = document.getElementById('btn-sync-github');
  const adminFootballDataKey = document.getElementById('admin-football-data-key');
  const syncStatusMessage = document.getElementById('sync-status-message');
  
  const dbModal = document.getElementById('db-modal');
  const dbScriptUrl = document.getElementById('db-script-url');
  const btnSaveDbUrl = document.getElementById('btn-save-db-url');
  const btnCloseDbModal = document.getElementById('btn-close-db-modal');
  const btnClearDbUrl = document.getElementById('btn-clear-db-url');
  const dbUrlClearContainer = document.getElementById('db-url-clear-container');
  
  let isLoginMode = false; // Alterna entre Registro e Inicio de Sesión

  // --- INICIALIZACIÓN ---
  function init() {
    setupMockDataIfNeeded();
    checkAuthSession();
    updateConnectionBanner();
    registerEvents();
    renderMatches();
    renderLeaderboard();
  }

  // --- SECCIÓN MOCK DATA (Para que funcione inmediatamente local) ---
  function setupMockDataIfNeeded() {
    // Si no existen partidos en local, guardamos la base inicial de matches-data.js
    if (!localStorage.getItem('porra_local_matches')) {
      // WORLD_CUP_2026_MATCHES viene cargado desde matches-data.js
      const initialMatches = WORLD_CUP_2026_MATCHES.map(m => ({
        ...m,
        realScoreA: null,
        realScoreB: null
      }));
      localStorage.setItem('porra_local_matches', JSON.stringify(initialMatches));
    }
    state.matches = JSON.parse(localStorage.getItem('porra_local_matches'));

    // Crear algunos usuarios mock para poblar la clasificación y que se vea bonita
    if (!localStorage.getItem('porra_local_users')) {
      const mockUsers = [
        { username: 'Carlos_90', pin: '1234' },
        { username: 'Sofia_Gol', pin: '1111' },
        { username: 'Diego_DT', pin: '2222' }
      ];
      localStorage.setItem('porra_local_users', JSON.stringify(mockUsers));

      // Guardar pronósticos simulados para estos usuarios
      const mockPredictions = [
        // Carlos_90
        { user: 'Carlos_90', matchId: 1, scoreA: 2, scoreB: 1 },
        { user: 'Carlos_90', matchId: 2, scoreA: 1, scoreB: 1 },
        { user: 'Carlos_90', matchId: 3, scoreA: 3, scoreB: 1 },
        { user: 'Carlos_90', matchId: 4, scoreA: 2, scoreB: 0 },
        // Sofia_Gol
        { user: 'Sofia_Gol', matchId: 1, scoreA: 1, scoreB: 0 },
        { user: 'Sofia_Gol', matchId: 2, scoreA: 0, scoreB: 2 },
        { user: 'Sofia_Gol', matchId: 3, scoreA: 2, scoreB: 2 },
        { user: 'Sofia_Gol', matchId: 4, scoreA: 1, scoreB: 2 },
        // Diego_DT
        { user: 'Diego_DT', matchId: 1, scoreA: 1, scoreB: 1 },
        { user: 'Diego_DT', matchId: 2, scoreA: 2, scoreB: 0 },
        { user: 'Diego_DT', matchId: 3, scoreA: 4, scoreB: 1 },
        { user: 'Diego_DT', matchId: 4, scoreA: 3, scoreB: 0 }
      ];
      localStorage.setItem('porra_local_predictions_all', JSON.stringify(mockPredictions));

      // Poner algunos marcadores reales ya terminados (ej. partido 1, 2)
      // Esto hace que el cálculo de puntos y la clasificación cobren vida instantáneamente
      const updatedMatches = [...state.matches];
      updatedMatches[0].realScoreA = 2; // México 2-1 Sudáfrica (Carlos_90 hace pleno!)
      updatedMatches[0].realScoreB = 1;
      
      updatedMatches[1].realScoreA = 1; // Canadá 1-2 Túnez (Sofia_Gol hace pleno!)
      updatedMatches[1].realScoreB = 2;
      
      updatedMatches[2].realScoreA = 3; // USA 1-1 Bolivia (Nadie hace pleno, pero aciertan tendencia)
      updatedMatches[2].realScoreB = 1;

      localStorage.setItem('porra_local_matches', JSON.stringify(updatedMatches));
      state.matches = updatedMatches;
    }
  }

  // --- GESTIÓN DE SESIÓN ---
  function checkAuthSession() {
    const savedUser = localStorage.getItem('porra_current_user');
    const savedPIN = localStorage.getItem('porra_current_pin');
    
    if (savedUser && savedPIN) {
      state.currentUser = savedUser;
      state.currentPIN = savedPIN;
      
      // Mostrar info de cabecera
      headerActions.style.display = 'flex';
      userAvatarInitial.textContent = savedUser.charAt(0).toUpperCase();
      usernameDisplay.textContent = savedUser;
      
      // Mostrar navegación y ocultar login
      mainNav.style.display = 'flex';
      authView.style.display = 'none';
      
      // Cargar pronósticos del usuario activo
      loadUserPredictions();
      switchTab(state.activeTab);
    } else {
      // Mostrar pantalla de Login/Registro
      headerActions.style.display = 'none';
      mainNav.style.display = 'none';
      authView.style.display = 'block';
      
      // Ocultar pestañas activas
      tabMatches.classList.remove('active');
      tabLeaderboard.classList.remove('active');
      tabRules.classList.remove('active');
      tabAdmin.classList.remove('active');
    }
  }

  function handleAuthSubmit(e) {
    e.preventDefault();
    const username = authUsername.value.trim().replace(/[^a-zA-Z0-9_]/g, ''); // Limpiar caracteres raros
    const pin = authPin.value.trim();

    if (!username || username.length < 3) {
      showToast('El apodo debe tener al menos 3 letras o números sin espacios.', 'error');
      return;
    }
    if (!/^[0-9]{4}$/.test(pin)) {
      showToast('El PIN debe ser de exactamente 4 números.', 'error');
      return;
    }

    if (state.apiUrl) {
      // --- CONEXIÓN DE RED (Google Sheets) ---
      showToast('Conectando con Google Sheets...', 'pending');
      const action = isLoginMode ? 'login' : 'register';
      
      fetch(state.apiUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action, user: username, pin })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('porra_current_user', username);
          localStorage.setItem('porra_current_pin', pin);
          showToast(isLoginMode ? '¡Inicio de sesión exitoso!' : '¡Usuario registrado con éxito!');
          checkAuthSession();
          fetchDataFromGoogleSheets();
        } else {
          showToast(data.message || 'Error de autenticación.', 'error');
        }
      })
      .catch(err => {
        console.error(err);
        showToast('Error de conexión con Google Sheets. Revisa la URL.', 'error');
      });

    } else {
      // --- MODO LOCAL ---
      let users = JSON.parse(localStorage.getItem('porra_local_users')) || [];
      const userExists = users.find(u => u.username.toLowerCase() === username.toLowerCase());

      if (isLoginMode) {
        // Iniciar Sesión
        if (!userExists || userExists.pin !== pin) {
          showToast('Nombre de usuario o PIN incorrectos.', 'error');
          return;
        }
        showToast('¡Bienvenido de vuelta, ' + username + '!');
      } else {
        // Registrarse
        if (userExists) {
          showToast('El apodo ya está en uso. Elige otro o Inicia Sesión.', 'error');
          return;
        }
        users.push({ username, pin });
        localStorage.setItem('porra_local_users', JSON.stringify(users));
        showToast('¡Registro completado! PIN guardado.');
      }

      localStorage.setItem('porra_current_user', username);
      localStorage.setItem('porra_current_pin', pin);
      checkAuthSession();
    }
  }

  function handleLogout() {
    localStorage.removeItem('porra_current_user');
    localStorage.removeItem('porra_current_pin');
    state.currentUser = null;
    state.currentPIN = null;
    state.predictions = {};
    
    // Cerrar admin si estaba abierto
    state.isAdminLoggedIn = false;
    adminControlSection.style.display = 'none';
    adminAuthSection.style.display = 'block';
    
    showToast('Sesión cerrada.');
    checkAuthSession();
  }

  // --- CARGAR PRONÓSTICOS ---
  function loadUserPredictions() {
    if (state.apiUrl) {
      fetchDataFromGoogleSheets();
    } else {
      // Local
      const allPreds = JSON.parse(localStorage.getItem('porra_local_predictions_all')) || [];
      const userPreds = allPreds.filter(p => p.user === state.currentUser);
      
      state.predictions = {};
      userPreds.forEach(p => {
        state.predictions[p.matchId] = {
          scoreA: p.scoreA,
          scoreB: p.scoreB,
          saved: true
        };
      });
      renderMatches();
      renderLeaderboard();
    }
  }

  // --- INTEGRACIÓN CON GOOGLE SHEETS ---
  function updateConnectionBanner() {
    if (state.apiUrl) {
      connStatusBadge.textContent = 'Conectado a Google Sheets';
      connStatusBadge.className = 'conn-badge connected';
      connStatusText.innerHTML = 'Compartiendo datos en vivo. ¡Estás jugando en multijugador con tu grupo! 🚀';
      dbScriptUrl.value = state.apiUrl;
      dbUrlClearContainer.style.display = 'block';
    } else {
      connStatusBadge.textContent = 'Modo Demo Local';
      connStatusBadge.className = 'conn-badge';
      connStatusText.innerHTML = 'Los datos se guardan solo en tu navegador. <strong>Conéctala a un Google Sheet</strong> para jugar con amigos.';
      dbUrlClearContainer.style.display = 'none';
    }
  }

  function fetchDataFromGoogleSheets() {
    if (!state.apiUrl) return;
    
    fetch(`${state.apiUrl}?action=getData&user=${encodeURIComponent(state.currentUser || '')}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Actualizar partidos reales
          if (data.matches && data.matches.length > 0) {
            state.matches = data.matches;
            localStorage.setItem('porra_local_matches', JSON.stringify(data.matches));
          }
          
          // Clasificación recalculada por el Apps Script
          if (data.leaderboard) {
            state.leaderboard = data.leaderboard;
          }
          
          // Pronósticos de este usuario específico
          if (data.predictions) {
            state.predictions = {};
            for (const matchId in data.predictions) {
              state.predictions[matchId] = {
                scoreA: data.predictions[matchId].scoreA,
                scoreB: data.predictions[matchId].scoreB,
                saved: true
              };
            }
          }
          
          renderMatches();
          renderLeaderboardTable(state.leaderboard);
        }
      })
      .catch(err => {
        console.error(err);
        showToast('Error al descargar datos de Google Sheets.', 'error');
      });
  }

  // --- CÁLCULO DE PUNTOS (Local Engine) ---
  function calculatePointsLocal() {
    // Si estamos en modo Google Sheets, la API nos devuelve el leaderboard hecho.
    // Pero si estamos en local, lo calculamos aquí de manera inteligente.
    const users = JSON.parse(localStorage.getItem('porra_local_users')) || [];
    const allPredictions = JSON.parse(localStorage.getItem('porra_local_predictions_all')) || [];
    const matches = state.matches;

    const board = users.map(u => {
      let totalPoints = 0;
      let exacts = 0;
      let outcomes = 0;
      let played = 0;

      const uPreds = allPredictions.filter(p => p.user === u.username);

      uPreds.forEach(p => {
        const m = matches.find(match => match.id === p.matchId);
        if (m && m.realScoreA !== null && m.realScoreB !== null) {
          played++;
          
          const pA = p.scoreA;
          const pB = p.scoreB;
          const rA = m.realScoreA;
          const rB = m.realScoreB;

          // Acierto exacto (Pleno)
          if (pA === rA && pB === rB) {
            totalPoints += 3;
            exacts++;
          }
          // Acierto de resultado/empate (Tendencia)
          else if ((pA > pB && rA > rB) || (pA < pB && rA < rB) || (pA === pB && rA === rB)) {
            totalPoints += 1;
            outcomes++;
          }
        }
      });

      return {
        username: u.username,
        points: totalPoints,
        exacts: exacts,
        outcomes: outcomes,
        played: played
      };
    });

    // Ordenar: Puntos desc, Plenos desc, Outcomes desc
    board.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.exacts !== a.exacts) return b.exacts - a.exacts;
      return b.outcomes - a.outcomes;
    });

    state.leaderboard = board;
    return board;
  }

  // --- RENDERIZADO DE PARTIDOS ---
  function renderMatches() {
    matchesContainer.innerHTML = '';
    
    // Filtrar partidos
    let filteredMatches = state.matches;
    if (state.filterGroup !== 'all') {
      if (state.filterGroup === 'Eliminatorias') {
        filteredMatches = state.matches.filter(m => !m.group.startsWith('Grupo'));
      } else {
        filteredMatches = state.matches.filter(m => m.group === state.filterGroup);
      }
    }

    if (filteredMatches.length === 0) {
      matchesContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">
          No hay partidos en esta categoría.
        </div>`;
      return;
    }

    filteredMatches.forEach(m => {
      const pred = state.predictions[m.id] || { scoreA: '', scoreB: '', saved: false };
      const isPast = new Date(m.date) < new Date();
      const hasRealResult = m.realScoreA !== null && m.realScoreB !== null;

      // Calcular puntos de esta tarjeta si ya tiene resultado
      let pointBadgeHtml = '';
      if (hasRealResult && pred.scoreA !== '') {
        const pA = parseInt(pred.scoreA);
        const pB = parseInt(pred.scoreB);
        const rA = m.realScoreA;
        const rB = m.realScoreB;

        if (pA === rA && pB === rB) {
          pointBadgeHtml = '<span class="points-earned points-exact">+3 Pts (Pleno)</span>';
        } else if ((pA > pB && rA > rB) || (pA < pB && rA < rB) || (pA === pB && rA === rB)) {
          pointBadgeHtml = '<span class="points-earned points-outcome">+1 Pt (Acierto)</span>';
        } else {
          pointBadgeHtml = '<span class="points-earned points-none">0 Pts</span>';
        }
      }

      // Formatear Fecha de forma robusta en UTC y mostrar en local
      let dateStr = m.date;
      if (dateStr && !dateStr.endsWith('Z') && !dateStr.includes('+') && dateStr.includes('T')) {
        // Asegurarse de que no tenga otro offset antes de añadir Z
        if (!/[-+]\d{2}:\d{2}$/.test(dateStr)) {
          dateStr += 'Z';
        }
      }
      const dateObj = new Date(dateStr);
      const formattedDate = dateObj.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' }) + 
                            ' - ' + 
                            dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' hs';

      const matchCard = document.createElement('article');
      matchCard.className = `match-card ${isPast ? 'past-match' : ''}`;
      matchCard.id = `match-card-${m.id}`;

      matchCard.innerHTML = `
        <div class="match-header">
          <span class="match-stadium">🏟️ ${m.stadium}</span>
          <span>${m.group}</span>
        </div>
        
        <div class="match-body">
          <div class="teams-wrapper">
            <div class="team-row">
              <div class="team-info">
                <span class="team-flag">${m.logoA}</span>
                <span>${m.teamA}</span>
              </div>
            </div>
            <div class="team-row">
              <div class="team-info">
                <span class="team-flag">${m.logoB}</span>
                <span>${m.teamB}</span>
              </div>
            </div>
          </div>
          
          <div class="score-inputs">
            <div class="score-row">
              <input type="number" class="score-input" id="scoreA-${m.id}" min="0" max="99" 
                value="${pred.scoreA}" 
                placeholder="-" 
                ${isPast ? 'disabled' : ''} 
                aria-label="Goles de ${m.teamA}">
              <span class="score-dash">-</span>
              <input type="number" class="score-input" id="scoreB-${m.id}" min="0" max="99" 
                value="${pred.scoreB}" 
                placeholder="-" 
                ${isPast ? 'disabled' : ''} 
                aria-label="Goles de ${m.teamB}">
            </div>
          </div>
        </div>
        
        <div class="match-footer">
          <div style="color: var(--text-muted); font-size: 0.75rem; display: flex; flex-direction: column; gap: 2px;">
            <span>📅 ${formattedDate}</span>
            ${isPast ? '<span style="color: var(--danger); font-weight: 700;">🚫 Pronóstico bloqueado</span>' : ''}
          </div>
          
          <div class="action-status-area" id="action-area-${m.id}">
            ${hasRealResult ? `<span class="real-result">Resultado: ${m.realScoreA} - ${m.realScoreB}</span>` : ''}
            ${pointBadgeHtml}
            ${!isPast ? `
              <button class="btn-save-prediction" id="btn-save-${m.id}" onclick="window.savePrediction(${m.id})">
                ${pred.saved ? 'Actualizar' : 'Guardar'}
              </button>
            ` : ''}
          </div>
        </div>
      `;

      matchesContainer.appendChild(matchCard);
    });
  }

  // --- GUARDAR PRONÓSTICO ---
  window.savePrediction = function(matchId) {
    const valA = document.getElementById(`scoreA-${matchId}`).value.trim();
    const valB = document.getElementById(`scoreB-${matchId}`).value.trim();

    if (valA === '' || valB === '') {
      showToast('Por favor introduce goles para ambos equipos.', 'error');
      return;
    }

    const scoreA = parseInt(valA);
    const scoreB = parseInt(valB);

    if (isNaN(scoreA) || isNaN(scoreB) || scoreA < 0 || scoreB < 0) {
      showToast('El marcador no es válido.', 'error');
      return;
    }

    const btn = document.getElementById(`btn-save-${matchId}`);
    if (btn) btn.disabled = true;

    if (state.apiUrl) {
      // Servidor
      showToast('Guardando en la nube...', 'pending');
      fetch(state.apiUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'savePrediction',
          user: state.currentUser,
          pin: state.currentPIN,
          matchId: matchId,
          scoreA: scoreA,
          scoreB: scoreB
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          state.predictions[matchId] = { scoreA, scoreB, saved: true };
          showToast('¡Marcador guardado en Google Sheets!');
          renderMatches();
          fetchDataFromGoogleSheets(); // Refrescar clasificación
        } else {
          showToast(data.message || 'Error al guardar.', 'error');
          if (btn) btn.disabled = false;
        }
      })
      .catch(err => {
        console.error(err);
        showToast('Error de red al guardar en Google Sheets.', 'error');
        if (btn) btn.disabled = false;
      });

    } else {
      // Local
      let allPreds = JSON.parse(localStorage.getItem('porra_local_predictions_all')) || [];
      
      // Borrar pronóstico anterior si existía para este partido
      allPreds = allPreds.filter(p => !(p.user === state.currentUser && p.matchId === matchId));
      
      // Guardar el nuevo
      allPreds.push({
        user: state.currentUser,
        matchId: matchId,
        scoreA: scoreA,
        scoreB: scoreB
      });
      localStorage.setItem('porra_local_predictions_all', JSON.stringify(allPreds));

      state.predictions[matchId] = { scoreA, scoreB, saved: true };
      showToast('¡Marcador guardado localmente!');
      renderMatches();
      renderLeaderboard();
    }
  };

  // --- RENDERIZADO DE CLASIFICACIÓN ---
  function renderLeaderboard() {
    if (state.apiUrl) {
      // Si está conectado, refrescamos desde Google Sheets directamente
      fetchDataFromGoogleSheets();
    } else {
      // En local, calculamos
      const board = calculatePointsLocal();
      renderLeaderboardTable(board);
    }
  }

  function renderLeaderboardTable(board) {
    leaderboardTbody.innerHTML = '';
    
    if (!board || board.length === 0) {
      leaderboardTbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 3rem;">
            No hay participantes registrados aún.
          </td>
        </tr>`;
      return;
    }

    board.forEach((row, index) => {
      const isCurrentUser = row.username.toLowerCase() === (state.currentUser || '').toLowerCase();
      
      let rankHtml = index + 1;
      if (index === 0) rankHtml = '<span class="rank-badge rank-1">🥇</span>';
      else if (index === 1) rankHtml = '<span class="rank-badge rank-2">🥈</span>';
      else if (index === 2) rankHtml = '<span class="rank-badge rank-3">🥉</span>';

      const tr = document.createElement('tr');
      if (isCurrentUser) tr.style.background = 'rgba(16, 185, 129, 0.04)';
      
      tr.innerHTML = `
        <td class="rank-cell">${rankHtml}</td>
        <td>
          <div class="player-cell ${isCurrentUser ? 'current-user' : ''}">
            <div class="player-avatar">${row.username.charAt(0).toUpperCase()}</div>
            <span>${row.username}</span>
            ${isCurrentUser ? '<span class="current-user-tag">Tú</span>' : ''}
          </div>
        </td>
        <td class="points-cell" style="text-align: center;">${row.points} pts</td>
        <td class="stat-cell" style="text-align: center;">${row.exacts}</td>
        <td class="stat-cell" style="text-align: center;">${row.outcomes}</td>
        <td class="stat-cell" style="text-align: center;">${row.played}</td>
      `;
      leaderboardTbody.appendChild(tr);
    });
  }

  // --- ADMINISTRACIÓN ---
  function handleAdminLogin() {
    const passcode = adminPasscode.value.trim();

    if (state.apiUrl) {
      // Validar clave del administrador en Google Sheets
      showToast('Autenticando administrador...', 'pending');
      fetch(state.apiUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'adminLogin',
          adminKey: passcode
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          state.adminKey = passcode;
          state.isAdminLoggedIn = true;
          localStorage.setItem('porra_admin_key', passcode);
          
          adminAuthSection.style.display = 'none';
          adminControlSection.style.display = 'block';
          showToast('¡Administrador autenticado!');
          renderAdminMatches();
        } else {
          showToast(data.message || 'Clave incorrecta.', 'error');
        }
      })
      .catch(err => {
        console.error(err);
        showToast('Error de red al autenticar admin.', 'error');
      });
    } else {
      // Local - Comparar con el por defecto
      if (passcode === DEFAULT_ADMIN_PASSCODE) {
        state.isAdminLoggedIn = true;
        adminAuthSection.style.display = 'none';
        adminControlSection.style.display = 'block';
        showToast('¡Modo Admin Local Activado! Clave: "admin123"');
        renderAdminMatches();
      } else {
        showToast('Clave incorrecta. En modo demo es "admin123".', 'error');
      }
    }
  }

  function handleAdminLogout() {
    state.isAdminLoggedIn = false;
    localStorage.removeItem('porra_admin_key');
    state.adminKey = '';
    adminPasscode.value = '';
    adminControlSection.style.display = 'none';
    adminAuthSection.style.display = 'block';
    showToast('Sesión de administrador cerrada.');
  }

  // --- SINCRONIZACIÓN DE PARTIDOS DESDE API ---
  
  function handleSyncFootballData() {
    if (!state.isAdminLoggedIn) {
      showToast('Debes iniciar sesión como administrador primero.', 'error');
      return;
    }

    const apiKey = adminFootballDataKey.value.trim();
    showToast('Sincronizando con football-data.org...', 'pending');
    
    syncStatusMessage.style.display = 'block';
    syncStatusMessage.textContent = '⏳ Sincronizando partidos...';
    
    const payload = {
      action: 'syncMatches',
      adminKey: state.adminKey,
      source: 'football-data',
      apiKey: apiKey
    };

    fetch(state.apiUrl, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showToast('✅ Sincronización completada desde football-data.org', 'success');
        syncStatusMessage.textContent = '✅ ' + (data.message || 'Sincronización exitosa');
        syncStatusMessage.style.color = 'var(--success)';
        
        // Recargar partidos
        loadData();
      } else {
        showToast('❌ Error: ' + (data.message || 'No se pudo sincronizar'), 'error');
        syncStatusMessage.textContent = '❌ ' + (data.message || 'Error durante la sincronización');
        syncStatusMessage.style.color = 'var(--danger)';
      }
    })
    .catch(err => {
      showToast('Error de conexión: ' + err.message, 'error');
      syncStatusMessage.textContent = '❌ Error de conexión: ' + err.message;
      syncStatusMessage.style.color = 'var(--danger)';
    });
  }

  function handleSyncGitHub() {
    if (!state.isAdminLoggedIn) {
      showToast('Debes iniciar sesión como administrador primero.', 'error');
      return;
    }

    showToast('Sincronizando desde GitHub...', 'pending');
    
    syncStatusMessage.style.display = 'block';
    syncStatusMessage.textContent = '⏳ Sincronizando partidos desde GitHub...';
    
    const payload = {
      action: 'syncMatches',
      adminKey: state.adminKey,
      source: 'github'
    };

    fetch(state.apiUrl, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showToast('✅ Sincronización completada desde GitHub', 'success');
        syncStatusMessage.textContent = '✅ ' + (data.message || 'Sincronización exitosa');
        syncStatusMessage.style.color = 'var(--success)';
        
        // Recargar partidos
        loadData();
      } else {
        showToast('❌ Error: ' + (data.message || 'No se pudo sincronizar'), 'error');
        syncStatusMessage.textContent = '❌ ' + (data.message || 'Error durante la sincronización');
        syncStatusMessage.style.color = 'var(--danger)';
      }
    })
    .catch(err => {
      showToast('Error de conexión: ' + err.message, 'error');
      syncStatusMessage.textContent = '❌ Error de conexión: ' + err.message;
      syncStatusMessage.style.color = 'var(--danger)';
    });
  }

  function renderAdminMatches() {
    adminMatchesList.innerHTML = '';

    state.matches.forEach(m => {
      const scoreAVal = m.realScoreA !== null ? m.realScoreA : '';
      const scoreBVal = m.realScoreB !== null ? m.realScoreB : '';

      const matchRow = document.createElement('div');
      matchRow.className = 'admin-match-row';
      matchRow.innerHTML = `
        <div class="admin-match-info">
          <div class="admin-match-teams">
            <span>${m.logoA} ${m.teamA}</span>
            <span style="color: var(--text-muted);">vs</span>
            <span>${m.logoB} ${m.teamB}</span>
          </div>
          <div class="admin-match-meta">
            <span>ID: #${m.id} | ${m.group} | 🏟️ ${m.stadium}</span>
          </div>
        </div>
        
        <div class="admin-actions">
          <div class="score-row">
            <input type="number" class="score-input" id="admin-scoreA-${m.id}" value="${scoreAVal}" placeholder="-">
            <span class="score-dash">:</span>
            <input type="number" class="score-input" id="admin-scoreB-${m.id}" value="${scoreBVal}" placeholder="-">
          </div>
          <button class="admin-save-btn" onclick="window.saveRealScore(${m.id})">Guardar</button>
        </div>
      `;
      adminMatchesList.appendChild(matchRow);
    });
  }

  window.saveRealScore = function(matchId) {
    const valA = document.getElementById(`admin-scoreA-${matchId}`).value.trim();
    const valB = document.getElementById(`admin-scoreB-${matchId}`).value.trim();

    if (valA === '' || valB === '') {
      showToast('Por favor introduce el marcador real completo.', 'error');
      return;
    }

    const scoreA = parseInt(valA);
    const scoreB = parseInt(valB);

    if (isNaN(scoreA) || isNaN(scoreB)) {
      showToast('El marcador no es válido.', 'error');
      return;
    }

    if (state.apiUrl) {
      showToast('Guardando marcador en Google Sheets...', 'pending');
      fetch(state.apiUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'updateResult',
          adminKey: state.adminKey,
          matchId: matchId,
          scoreA: scoreA,
          scoreB: scoreB
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showToast('¡Resultado real actualizado y puntos recalculados!');
          fetchDataFromGoogleSheets();
          // Actualizar vista de admin
          const matchIndex = state.matches.findIndex(m => m.id === matchId);
          if (matchIndex !== -1) {
            state.matches[matchIndex].realScoreA = scoreA;
            state.matches[matchIndex].realScoreB = scoreB;
          }
          renderAdminMatches();
        } else {
          showToast(data.message || 'Error al guardar.', 'error');
        }
      })
      .catch(err => {
        console.error(err);
        showToast('Error de red al actualizar resultado real.', 'error');
      });
    } else {
      // Local
      const updatedMatches = [...state.matches];
      const matchIndex = updatedMatches.findIndex(m => m.id === matchId);
      
      if (matchIndex !== -1) {
        updatedMatches[matchIndex].realScoreA = scoreA;
        updatedMatches[matchIndex].realScoreB = scoreB;
        localStorage.setItem('porra_local_matches', JSON.stringify(updatedMatches));
        state.matches = updatedMatches;
        
        showToast('¡Resultado real guardado! Clasificación actualizada.');
        renderMatches();
        renderLeaderboard();
        renderAdminMatches();
      }
    }
  };

  // --- TABS & NAVEGACIÓN ---
  function switchTab(tabId) {
    state.activeTab = tabId;
    
    // Activar botones de nav
    document.querySelectorAll('.tab-btn').forEach(btn => {
      const controls = btn.getAttribute('aria-controls');
      if (controls === tabId) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // Mostrar contenido de pestaña
    document.querySelectorAll('.tab-content').forEach(content => {
      if (content.id === tabId) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });

    // Lógicas de carga al entrar en ciertas pestañas
    if (tabId === 'tab-matches') {
      renderMatches();
    } else if (tabId === 'tab-leaderboard') {
      renderLeaderboard();
    } else if (tabId === 'tab-admin') {
      if (state.isAdminLoggedIn) {
        renderAdminMatches();
      }
    }
  }

  // --- TOAST NOTIFICATIONS ---
  let toastTimeout = null;
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    // Cambiar ícono y color según el tipo
    if (type === 'error') {
      toastIcon.textContent = '❌';
      toast.classList.add('error');
    } else if (type === 'pending') {
      toastIcon.textContent = '⏳';
      toast.classList.remove('error');
    } else {
      toastIcon.textContent = '🏆';
      toast.classList.remove('error');
    }

    toastMessage.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    
    // Si no es un estado pendiente, ocultarlo después de 3.5 segundos
    if (type !== 'pending') {
      toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    }
  }

  // --- REGISTRO DE EVENTOS ---
  function registerEvents() {
    // Formulario de Auth
    authForm.addEventListener('submit', handleAuthSubmit);
    
    // Switch entre Registro/Login
    authSwitchLink.addEventListener('click', () => {
      isLoginMode = !isLoginMode;
      if (isLoginMode) {
        authTitle.textContent = 'Iniciar Sesión';
        authSubtitle.textContent = 'Introduce tu apodo y PIN de 4 dígitos para ingresar.';
        btnAuthSubmit.textContent = 'Iniciar Sesión';
        authSwitchText.textContent = '¿No tienes una cuenta creada?';
        authSwitchLink.textContent = 'Registrarse';
      } else {
        authTitle.textContent = 'Registrarse en la Porra';
        authSubtitle.textContent = 'Crea tu usuario y únete a la diversión del mundial.';
        btnAuthSubmit.textContent = 'Registrarme y Entrar';
        authSwitchText.textContent = '¿Ya tienes un usuario creado?';
        authSwitchLink.textContent = 'Iniciar Sesión';
      }
    });

    // Salir / Cerrar Sesión
    logoutBtn.addEventListener('click', handleLogout);

    // Navegación Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('aria-controls');
        switchTab(tabId);
      });
    });

    // Filtros de Partidos
    groupFilters.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        document.querySelectorAll('#group-filters .filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        state.filterGroup = e.target.getAttribute('data-filter');
        renderMatches();
      }
    });

    // Actualizar clasificación manual
    btnRefreshLeaderboard.addEventListener('click', () => {
      showToast('Actualizando datos...', 'pending');
      if (state.apiUrl) {
        fetchDataFromGoogleSheets();
        setTimeout(() => showToast('¡Datos descargados!'), 500);
      } else {
        renderLeaderboard();
        setTimeout(() => showToast('Clasificación recalculada localmente.'), 500);
      }
    });

    // Modal de Conexión Google Sheets
    btnConfigDb.addEventListener('click', () => {
      dbModal.style.display = 'flex';
      dbScriptUrl.value = state.apiUrl;
    });

    btnCloseDbModal.addEventListener('click', () => {
      dbModal.style.display = 'none';
    });

    // Guardar URL de Apps Script
    btnSaveDbUrl.addEventListener('click', () => {
      const url = dbScriptUrl.value.trim();
      if (url === '') {
        showToast('Introduce una URL válida.', 'error');
        return;
      }
      
      state.apiUrl = url;
      localStorage.setItem('porra_db_url', url);
      updateConnectionBanner();
      dbModal.style.display = 'none';
      showToast('¡Google Sheets vinculado correctamente!');
      
      // Si ya hay usuario conectado, descargamos los datos reales del Sheet
      if (state.currentUser) {
        fetchDataFromGoogleSheets();
      }
    });

    // Desvincular Google Sheets
    btnClearDbUrl.addEventListener('click', () => {
      state.apiUrl = '';
      localStorage.removeItem('porra_db_url');
      updateConnectionBanner();
      dbModal.style.display = 'none';
      showToast('Desvinculado. Volviendo a Modo Demo.');
      loadUserPredictions(); // Cargar los del local
    });

    // Admin login / logout
    btnAdminLogin.addEventListener('click', handleAdminLogin);
    btnAdminLogout.addEventListener('click', handleAdminLogout);
    
    // Sincronización de API
    btnSyncFootballData.addEventListener('click', handleSyncFootballData);
    btnSyncGitHub.addEventListener('click', handleSyncGitHub);
  }

  // Ejecutar inicialización
  init();
});
