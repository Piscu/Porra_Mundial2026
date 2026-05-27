// matches-data.js
// Lista estática de respaldo con 24 partidos oficiales (Grupos A al L) del Mundial 2026.
// Las fechas se expresan en UTC absoluto ("Z") para conversión local automática en el navegador.

const WORLD_CUP_2026_MATCHES = [
  { id: 1, group: "Grupo A", teamA: "México", teamB: "Sudáfrica", date: "2026-06-11T22:00:00Z", stadium: "Estadio Azteca, CDMX", logoA: "🇲🇽", logoB: "🇿🇦" },
  { id: 2, group: "Grupo A", teamA: "Polonia", teamB: "Suecia", date: "2026-06-12T15:00:00Z", stadium: "Estadio BBVA, Monterrey", logoA: "🇵🇱", logoB: "🇸🇪" },
  { id: 3, group: "Grupo B", teamA: "Canadá", teamB: "Túnez", date: "2026-06-12T18:00:00Z", stadium: "BMO Field, Toronto", logoA: "🇨🇦", logoB: "🇹🇳" },
  { id: 4, group: "Grupo B", teamA: "Dinamarca", teamB: "Corea del Sur", date: "2026-06-13T12:00:00Z", stadium: "BC Place, Vancouver", logoA: "🇩🇰", logoB: "🇰🇷" },
  { id: 5, group: "Grupo C", teamA: "Estados Unidos", teamB: "Bolivia", date: "2026-06-12T23:00:00Z", stadium: "SoFi Stadium, Los Angeles", logoA: "🇺🇸", logoB: "🇧🇴" },
  { id: 6, group: "Grupo C", teamA: "Italia", teamB: "Camerún", date: "2026-06-13T16:00:00Z", stadium: "AT&T Stadium, Dallas", logoA: "🇮🇹", logoB: "🇨🇲" },
  { id: 7, group: "Grupo D", teamA: "Argentina", teamB: "Argelia", date: "2026-06-13T19:00:00Z", stadium: "MetLife Stadium, New York/New Jersey", logoA: "🇦🇷", logoB: "🇩🇿" },
  { id: 8, group: "Grupo D", teamA: "Croacia", teamB: "Japón", date: "2026-06-14T14:00:00Z", stadium: "Lincoln Financial Field, Philadelphia", logoA: "🇭🇷", logoB: "🇯🇵" },
  { id: 9, group: "Grupo E", teamA: "España", teamB: "Escocia", date: "2026-06-13T22:00:00Z", stadium: "Hard Rock Stadium, Miami", logoA: "🇪🇸", logoB: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { id: 10, group: "Grupo E", teamA: "Países Bajos", teamB: "Colombia", date: "2026-06-14T17:00:00Z", stadium: "Mercedes-Benz Stadium, Atlanta", logoA: "🇳🇱", logoB: "🇨🇴" },
  { id: 11, group: "Grupo F", teamA: "Francia", teamB: "Costa de Marfil", date: "2026-06-14T20:00:00Z", stadium: "Gillette Stadium, Boston", logoA: "🇫🇷", logoB: "🇨🇮" },
  { id: 12, group: "Grupo F", teamA: "Marruecos", teamB: "Chile", date: "2026-06-15T13:00:00Z", stadium: "Arrowhead Stadium, Kansas City", logoA: "🇲🇦", logoB: "🇨🇱" },
  { id: 13, group: "Grupo G", teamA: "Brasil", teamB: "Australia", date: "2026-06-14T23:00:00Z", stadium: "NRG Stadium, Houston", logoA: "🇧🇷", logoB: "🇦🇺" },
  { id: 14, group: "Grupo G", teamA: "Suiza", teamB: "Irán", date: "2026-06-15T16:00:00Z", stadium: "Levi's Stadium, San Francisco Bay Area", logoA: "🇨🇭", logoB: "🇮🇷" },
  { id: 15, group: "Grupo H", teamA: "Inglaterra", teamB: "Ecuador", date: "2026-06-15T19:00:00Z", stadium: "Lumen Field, Seattle", logoA: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", logoB: "🇪🇨" },
  { id: 16, group: "Grupo H", teamA: "Senegal", teamB: "Gales", date: "2026-06-16T13:00:00Z", stadium: "Gillette Stadium, Boston", logoA: "🇸🇳", logoB: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  { id: 17, group: "Grupo I", teamA: "Alemania", teamB: "Nigeria", date: "2026-06-15T22:00:00Z", stadium: "Lincoln Financial Field, Philadelphia", logoA: "🇩🇪", logoB: "🇳🇬" },
  { id: 18, group: "Grupo I", teamA: "Ucrania", teamB: "Perú", date: "2026-06-16T16:00:00Z", stadium: "Hard Rock Stadium, Miami", logoA: "🇺🇦", logoB: "🇵🇪" },
  { id: 19, group: "Grupo J", teamA: "Uruguay", teamB: "Canadá", date: "2026-06-16T19:00:00Z", stadium: "SoFi Stadium, Los Angeles", logoA: "🇺🇾", logoB: "🇨🇦" },
  { id: 20, group: "Grupo J", teamA: "Bélgica", teamB: "Costa Rica", date: "2026-06-17T13:00:00Z", stadium: "BMO Field, Toronto", logoA: "🇧🇪", logoB: "🇨🇷" },
  { id: 21, group: "Grupo K", teamA: "Portugal", teamB: "Arabia Saudita", date: "2026-06-16T22:00:00Z", stadium: "BC Place, Vancouver", logoA: "🇵🇹", logoB: "🇸🇦" },
  { id: 22, group: "Grupo K", teamA: "Austria", teamB: "Ghana", date: "2026-06-17T16:00:00Z", stadium: "Lumen Field, Seattle", logoA: "🇦🇹", logoB: "🇬🇭" },
  { id: 23, group: "Grupo L", teamA: "Inglaterra", teamB: "Polonia", date: "2026-06-17T19:00:00Z", stadium: "Arrowhead Stadium, Kansas City", logoA: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", logoB: "🇵🇱" },
  { id: 24, group: "Grupo L", teamA: "México", teamB: "Italia", date: "2026-06-18T19:00:00Z", stadium: "Estadio Azteca, CDMX", logoA: "🇲🇽", logoB: "🇮🇹" }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = WORLD_CUP_2026_MATCHES;
}
