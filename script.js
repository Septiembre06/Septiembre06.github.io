// script.js - Lógica del juego Impostor Caney

// Variables globales
let numPlayers = 3;
let players = [];
let currentPlayer = 0;
let votes = [];
let impostors = [];
let gameState = 'start';
let timerInterval = null;
let timeLeft = 60;
let selectedTheme = null;
let customNamesList = [];
let availableNames = [];


window.futbolistas = [
    "Lionel Messi", "Cristiano Ronaldo", "Neymar Jr.", "Kylian Mbappé", "Erling Haaland",
    "Kevin De Bruyne", "Mohamed Salah", "Harry Kane", "Bruno Fernandes", "Vinicius Jr.",
    "Pedri", "Gavi", "Ansu Fati", "Ferran Torres", "João Cancelo",
    "Rodri", "Sergio Busquets", "Gerard Piqué", "Carles Puyol", "Xavi Hernández",
    "Andrés Iniesta", "David Villa", "Fernando Torres", "Raúl González", "Iker Casillas",
    "Sergio Ramos", "Marcelo", "Daniel Alves", "Luis Suárez", "Sunil Chhetri",
    "Diego Maradona", "Pelé", "Ronaldinho", "Zlatan Ibrahimović", "Wayne Rooney",
    "David Beckham", "Thierry Henry", "Steven Gerrard", "Frank Lampard", "Didier Drogba",
    "Karim Benzema", "Luka Modric", "Toni Kroos", "Thibaut Courtois", "Manuel Neuer",
    "Thomas Müller", "Robert Lewandowski", "Pierre-Emerick Aubameyang", "Jadon Sancho",
    "Kai Havertz", "Timo Werner", "İlkay Gündoğan", "Phil Foden", "Mason Mount",
    "Christian Pulisic", "Ruben Dias", "Virgil van Dijk", "Alisson Becker", "Sadio Mané",
    "Raheem Sterling", "Jack Grealish", "Trent Alexander-Arnold", "Andrew Robertson", "Jordan Henderson",
    "Fabinho", "Joel Matip", "Ederson", "Bernardo Silva", "Riyad Mahrez",
    "Gabriel Jesus", "Fernandinho", "Aymeric Laporte", "John Stones", "Kyle Walker",
    "Benjamin Mendy", "Marcus Rashford", "Anthony Martial", "Paul Pogba", "Jesse Lingard",
    "Donny van de Beek", "Scott McTominay", "Victor Lindelöf", "Luke Shaw", "Aaron Wan-Bissaka",
    "Harry Maguire", "Luis Enrique", "Gerard Moreno", "Dani Parejo", "Paco Alcácer",
    "José Luis Gayà", "Samuel Umtiti", "Jordi Alba", "Antoine Griezmann", "Ousmane Dembélé",
    "Clément Lenglet", "Ronald Araujo", "Frenkie de Jong", "Memphis Depay"
];

window.cantantes = [
    "Taylor Swift", "Ed Sheeran", "Ariana Grande", "Billie Eilish", "Dua Lipa",
    "The Weeknd", "Bruno Mars", "Adele", "Michael Jackson", "Madonna",
    "Beyoncé", "Rihanna", "Katy Perry", "Lady Gaga", "Justin Bieber",
    "Shawn Mendes", "Olivia Rodrigo", "Harry Styles", "Lizzo", "Doja Cat",
    "Bad Bunny", "J Balvin", "Rosalia", "Shakira", "Enrique Iglesias",
    "Luis Miguel", "Juanes", "Carlos Vives", "Marc Anthony", "Gloria Estefan","Bad bunny"
];

window.marcasFamosas = [
    "Nike", "Adidas", "Apple", "Samsung", "Coca-Cola",
    "Pepsi", "McDonald's", "Starbucks", "Google", "Amazon",
    "Facebook", "Instagram", "Twitter", "YouTube", "Netflix",
    "Disney", "Marvel", "DC Comics", "Sony", "Microsoft",
    "Tesla", "BMW", "Mercedes-Benz", "Audi", "Porsche",
    "Louis Vuitton", "Gucci", "Prada", "Chanel", "Rolex"
];

window.streamers = [
    "Ibai Llanos", "TheGrefg", "AuronPlay", "Rubius", "ElMariana",
    "Vegetta777", "Willyrex", "Alexby11", "Luzu", "ZarcortGame",
    "Shadoune", "Folagor", "ByCalitos", "Cristinini", "Nate Gentile",
    "Amouranth", "Pokimane", "Shroud", "Ninja", "TimTheTatman",
    "DrLupo", "xQc", "Asmongold", "Forsen", "PewDiePie"
];

window.seriesYPeliculas = [
    "Breaking Bad", "Game of Thrones", "The Mandalorian", "Stranger Things", "The Crown",
    "Black Mirror", "The Witcher", "Money Heist", "Narcos", "The Office",
    "Friends", "The Big Bang Theory", "Sherlock", "Doctor Who", "Star Wars",
    "Harry Potter", "Lord of the Rings", "Avengers", "Spider-Man", "Batman",
    "Inception", "Interstellar", "The Dark Knight", "Pulp Fiction", "Forrest Gump",
    "Titanic", "Avatar", "Jurassic Park", "The Matrix", "Gladiator"
];

window.clubesFutbol = [
    "Real Madrid", "FC Barcelona", "Manchester United", "Liverpool", "Chelsea",
    "Manchester City", "Arsenal", "Tottenham", "Bayern Munich", "Borussia Dortmund",
    "Juventus", "AC Milan", "Inter Milan", "Napoli", "Roma",
    "Paris Saint-Germain", "Olympique de Marseille", "Lyon", "Atlético Madrid", "Sevilla",
    "Valencia", "Villarreal", "Athletic Bilbao", "Real Sociedad", "Espanyol",
    "Ajax", "PSV Eindhoven", "Feyenoord", "Benfica", "Porto"
];


const startScreen = document.getElementById('start-screen');
const roleAssignment = document.getElementById('role-assignment');
const discussion = document.getElementById('discussion');
const voting = document.getElementById('voting');
const results = document.getElementById('results');
const modeSelection = document.getElementById('mode-selection');
const customNames = document.getElementById('custom-names');
const playerNames = document.getElementById('player-names');
const assigning = document.getElementById('assigning');
const rolesReveal = document.getElementById('roles-reveal');
const waiting = document.getElementById('waiting');

const playerCountInput = document.getElementById('player-count');
const startGameBtn = document.getElementById('start-game');
const showRoleBtn = document.getElementById('show-role');
const nextPlayerBtn = document.getElementById('next-player');
const startVotingBtn = document.getElementById('start-voting');
const nextVoteBtn = document.getElementById('next-vote');
const restartGameBtn = document.getElementById('restart-game');
const namesInput = document.getElementById('names-input');
const submitNamesBtn = document.getElementById('submit-names');
const submitPlayerNamesBtn = document.getElementById('start-link');
const continueToDiscussionBtn = document.getElementById('continue-to-discussion');

const currentPlayerText = document.getElementById('current-player');
const roleText = document.getElementById('role-text');
const timeLeftSpan = document.getElementById('time-left');
const votingPlayerText = document.getElementById('voting-player');
const voteOptions = document.getElementById('vote-options');
const impostorReveal = document.getElementById('impostor-reveal');
const outcome = document.getElementById('outcome');

// Funciones de sonido (opcional)
function playSound(sound) {
    // Implementar sonidos básicos si es necesario
    // const audio = new Audio('path/to/sound.mp3');
    // audio.play();
}


function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}


function startGame() {
    numPlayers = parseInt(playerCountInput.value);
    if (numPlayers < 3) {
        alert('Mínimo 3 jugadores');
        return;
    }
    if (!selectedTheme) {
        alert('Selecciona un modo');
        return;
    }
    if (selectedTheme === 'personalizado') {
        if (!customNamesList || customNamesList.length < numPlayers) {
            updateCustomScreen();
            showScreen(customNames);
            return;
        }
    }
    
    createPlayerNameInputs();
    showScreen(playerNames);
}


function assignRoles() {

    if (selectedTheme === 'personalizado') {
        availableNames = [...customNamesList];
    } else {
        availableNames = [...window[selectedTheme]];
    }
  
    availableNames = shuffleArray(availableNames);

    const numImpostors = numPlayers > 7 ? 2 : 1;
    const impostorIndices = [];
    while (impostorIndices.length < numImpostors) {
        const idx = Math.floor(Math.random() * numPlayers);
        if (!impostorIndices.includes(idx)) {
            impostorIndices.push(idx);
        }
    }
    impostorIndices.forEach(idx => {
        players[idx].role = 'impostor';
    });
    impostors = players.filter(p => p.role === 'impostor').map(p => p.id);

   
    let nameIndex = 0;
    players.forEach(player => {
        if (player.role !== 'impostor') {
            player.name = availableNames[nameIndex % availableNames.length];
            nameIndex++;
        }
    });

    // Guardar en localStorage
    localStorage.setItem('impostorGame', JSON.stringify({ players, impostors }));
}

// Función para crear inputs de nombres de jugadores
function createPlayerNameInputs() {
    const container = document.getElementById('player-inputs');
    container.innerHTML = '';
    for (let i = 1; i <= numPlayers; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Nombre del Jugador ${i}`;
        input.id = `player-name-${i}`;
        container.appendChild(input);
        container.appendChild(document.createElement('br'));
    }
}

// Función para revelar todos los roles
function revealAllRoles() {
    const container = document.getElementById('roles-list');
    container.innerHTML = '';
    players.forEach(player => {
        const div = document.createElement('div');
        div.innerHTML = `<p>${player.playerName}: <button onclick="showPlayerRole(${player.id})">Ver Rol</button> <span id="role-${player.id}" class="hidden"></span></p>`;
        container.appendChild(div);
    });
}

// Función para mostrar el rol de un jugador específico
function showPlayerRole(id) {
    const player = players.find(p => p.id === id);
    const span = document.getElementById(`role-${id}`);
    if (player.role === 'impostor') {
        span.textContent = '¡Impostor!';
    } else {
        span.textContent = `Personaje - ${player.name}`;
    }
    span.classList.remove('hidden');
}

// Función para actualizar la pantalla de nombres personalizados
function updateCustomScreen() {
    document.getElementById('custom-title').textContent = `Ingresa ${numPlayers} Nombres`;
    document.getElementById('custom-instruction').textContent = `Uno por línea (necesitas ${numPlayers}):`;
    namesInput.placeholder = Array.from({length: numPlayers}, (_, i) => `Nombre ${i+1}`).join('\n');
    namesInput.rows = numPlayers;
}

// Función para empezar la partida después de nombres de jugadores
function empezarPartida() {
    // Recopilar nombres de jugadores
    let playerNames = [];
    for (let i = 1; i <= numPlayers; i++) {
        playerNames.push(document.getElementById(`player-name-${i}`).value.trim() || `Jugador ${i}`);
    }
    // Guardar datos para la nueva página
    localStorage.setItem('gameData', JSON.stringify({ selectedTheme, numPlayers, playerNames, customNamesList }));
    // La página se abrirá con el enlace
    return true;
}

// Mostrar rol del jugador actual
function showRole() {
    const role = players[currentPlayer].role;
    // Al presionar, si es impostor, dice "¡Eres el IMPOSTOR!", si no, muestra "Tu personaje es: [Nombre del futbolista]" (o el tema elegido)
    if (role === 'impostor') {
        roleText.textContent = '¡Eres el IMPOSTOR!';
    } else {
        roleText.textContent = `Tu personaje es: ${players[currentPlayer].name}`;
    }
    roleText.classList.remove('hidden');
    showRoleBtn.classList.add('hidden');
    nextPlayerBtn.classList.remove('hidden');
    playSound('roleReveal');
}

// Pasar al siguiente jugador en asignación
function nextPlayer() {
    currentPlayer++;
    if (currentPlayer >= numPlayers) {
        startDiscussion();
    } else {
        updateRoleDisplay();
    }
}

// Actualizar display de rol
function updateRoleDisplay() {
    currentPlayerText.textContent = `${players[currentPlayer].playerName}, presiona para ver tu rol`;
    roleText.classList.add('hidden');
    showRoleBtn.classList.remove('hidden');
    nextPlayerBtn.classList.add('hidden');
}

// Iniciar fase de discusión
function startDiscussion() {
    gameState = 'discussion';
    showScreen(discussion);
    startTimer();
}

// Temporizador para discusión
function startTimer() {
    timeLeft = 60;
    timeLeftSpan.textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timeLeftSpan.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            startVoting();
        }
    }, 1000);
}

// Iniciar fase de votación
function startVoting() {
    clearInterval(timerInterval);
    gameState = 'voting';
    showScreen(voting);
    currentPlayer = 0;
    votes = new Array(numPlayers).fill(null);
    updateVotingDisplay();
}

// Actualizar display de votación
function updateVotingDisplay() {
    votingPlayerText.textContent = `${players[currentPlayer].playerName}, vota por quién crees que es el impostor:`;
    voteOptions.innerHTML = '';
    players.forEach(player => {
        if (player.id !== players[currentPlayer].id) {
            const btn = document.createElement('button');
            btn.textContent = player.playerName;
            btn.classList.add('vote-button');
            btn.onclick = () => vote(player.id);
            voteOptions.appendChild(btn);
        }
    });
    nextVoteBtn.classList.add('hidden');
}

// Votar
function vote(votedId) {
    votes[currentPlayer] = votedId;
    nextVoteBtn.classList.remove('hidden');
}

// Pasar al siguiente voto
function nextVote() {
    currentPlayer++;
    if (currentPlayer >= numPlayers) {
        calculateResults();
    } else {
        updateVotingDisplay();
    }
}

// Calcular resultados
function calculateResults() {
    gameState = 'results';
    showScreen(results);
    const voteCounts = {};
    votes.forEach(vote => {
        if (vote !== null) {
            voteCounts[vote] = (voteCounts[vote] || 0) + 1;
        }
    });
    let maxVotes = 0;
    let accused = null;
    for (const [player, count] of Object.entries(voteCounts)) {
        if (count > maxVotes) {
            maxVotes = count;
            accused = parseInt(player);
        }
    }
    impostorReveal.textContent = `Los impostores eran: ${impostors.map(id => players.find(p => p.id === id).playerName).join(', ')}.`;
    if (impostors.includes(accused)) {
        outcome.textContent = '¡Los jugadores normales ganaron! El/Los impostor(es) fue(ron) descubierto(s).';
    } else {
        outcome.textContent = '¡El/Los impostor(es) ganó/ganaron! No fue(ron) descubierto(s).';
    }
    playSound(impostors.includes(accused) ? 'victory' : 'defeat');
}

// Reiniciar juego
function restartGame() {
    gameState = 'start';
    selectedTheme = null;
    customNamesList = [];
    availableNames = [];
    showScreen(modeSelection);
    localStorage.removeItem('impostorGame');
}

// Event listeners
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        selectedTheme = btn.dataset.mode;
        showScreen(startScreen);
    });
});

submitNamesBtn.addEventListener('click', () => {
    const names = namesInput.value.split('\n').map(n => n.trim()).filter(n => n);
    if (names.length < numPlayers) {
        alert(`Ingresa al menos ${numPlayers} nombres`);
        return;
    }
    customNamesList = names.slice(0, numPlayers);
    showScreen(startScreen);
});

continueToDiscussionBtn.addEventListener('click', () => {
    startDiscussion();
});

startGameBtn.addEventListener('click', startGame);
showRoleBtn.addEventListener('click', showRole);
nextPlayerBtn.addEventListener('click', nextPlayer);
startVotingBtn.addEventListener('click', startVoting);
nextVoteBtn.addEventListener('click', nextVote);
restartGameBtn.addEventListener('click', restartGame);

// Cargar estado si existe
window.addEventListener('load', () => {
    const saved = localStorage.getItem('impostorGame');
    if (saved) {
        const data = JSON.parse(saved);
        players = data.players;
        impostors = data.impostors;
        // Restaurar estado si es necesario
    }
});