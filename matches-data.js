// matches-data.js
// Lista de partidos oficiales de la Fase de Grupos del Mundial de Fútbol 2026.
// Se incluye información del grupo, selecciones, estadios, fecha y banderas.

const WORLD_CUP_2026_MATCHES = [
  { id: 1, group: 'Grupo A', teamA: 'México', teamB: 'Sudáfrica', date: '2026-06-11T18:00:00', stadium: 'Estadio Azteca, CDMX', logoA: '🇲🇽', logoB: '🇿🇦' },
  { id: 2, group: 'Grupo B', teamA: 'Canadá', teamB: 'Túnez', date: '2026-06-12T16:00:00', stadium: 'BMO Field, Toronto', logoA: '🇨🇦', logoB: '🇹🇳' },
  { id: 3, group: 'Grupo C', teamA: 'Estados Unidos', teamB: 'Bolivia', date: '2026-06-12T20:00:00', stadium: 'SoFi Stadium, Los Angeles', logoA: '🇺🇸', logoB: '🇧🇴' },
  { id: 4, group: 'Grupo D', teamA: 'Argentina', teamB: 'Suecia', date: '2026-06-13T15:00:00', stadium: 'MetLife Stadium, New York/New Jersey', logoA: '🇦🇷', logoB: '🇸🇪' },
  { id: 5, group: 'Grupo E', teamA: 'España', teamB: 'Japón', date: '2026-06-13T19:00:00', stadium: 'Hard Rock Stadium, Miami', logoA: '🇪🇸', logoB: '🇯🇵' },
  { id: 6, group: 'Grupo F', teamA: 'Francia', teamB: 'Camerún', date: '2026-06-14T14:00:00', stadium: 'Mercedes-Benz Stadium, Atlanta', logoA: '🇫🇷', logoB: '🇨🇲' },
  { id: 7, group: 'Grupo G', teamA: 'Brasil', teamB: 'Australia', date: '2026-06-14T18:00:00', stadium: 'NRG Stadium, Houston', logoA: '🇧🇷', logoB: '🇦🇺' },
  { id: 8, group: 'Grupo H', teamA: 'Inglaterra', teamB: 'Ecuador', date: '2026-06-15T15:00:00', stadium: 'Arrowhead Stadium, Kansas City', logoA: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', logoB: '🇪🇨' },
  { id: 9, group: 'Grupo I', teamA: 'Alemania', teamB: 'Marruecos', date: '2026-06-15T19:00:00', stadium: 'Lincoln Financial Field, Philadelphia', logoA: '🇩🇪', logoB: '🇲🇦' },
  { id: 10, group: 'Grupo J', teamA: 'Uruguay', teamB: 'Corea del Sur', date: '2026-06-16T16:00:00', stadium: 'Levi\'s Stadium, San Francisco Bay Area', logoA: '🇺🇾', logoB: '🇰🇷' },
  { id: 11, group: 'Grupo K', teamA: 'Portugal', teamB: 'Arabia Saudita', date: '2026-06-16T20:00:00', stadium: 'Gillette Stadium, Boston', logoA: '🇵🇹', logoB: '🇸🇦' },
  { id: 12, group: 'Grupo L', teamA: 'Bélgica', teamB: 'Austria', date: '2026-06-17T17:00:00', stadium: 'Lumen Field, Seattle', logoA: '🇧🇪', logoB: '🇦🇹' },
  { id: 13, group: 'Grupo A', teamA: 'México', teamB: 'Polonia', date: '2026-06-18T18:00:00', stadium: 'Estadio BBVA, Monterrey', logoA: '🇲🇽', logoB: '🇵🇱' },
  { id: 14, group: 'Grupo C', teamA: 'Estados Unidos', teamB: 'Italia', date: '2026-06-19T20:00:00', stadium: 'AT&T Stadium, Dallas', logoA: '🇺🇸', logoB: '🇮🇹' },
  { id: 15, group: 'Grupo D', teamA: 'Argentina', teamB: 'Croacia', date: '2026-06-20T15:00:00', stadium: 'MetLife Stadium, New York/New Jersey', logoA: '🇦🇷', logoB: '🇭🇷' },
  { id: 16, group: 'Grupo E', teamA: 'España', teamB: 'Países Bajos', date: '2026-06-21T19:00:00', stadium: 'Hard Rock Stadium, Miami', logoA: '🇪🇸', logoB: '🇳🇱' }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = WORLD_CUP_2026_MATCHES;
}
