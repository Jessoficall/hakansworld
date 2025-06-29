// script.js - Hakan'ın Dünyası

// Taş-Kağıt-Makas Mini Oyun
function playRPS(playerChoice) {
    const choices = ['taş', 'kağıt', 'makas'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    let result = '';
    if (playerChoice === computerChoice) {
        result = `Berabere! Bilgisayar da ${computerChoice} seçti.`;
    } else if (
        (playerChoice === 'taş' && computerChoice === 'makas') ||
        (playerChoice === 'kağıt' && computerChoice === 'taş') ||
        (playerChoice === 'makas' && computerChoice === 'kağıt')
    ) {
        result = `Kazandın! Bilgisayar ${computerChoice} seçti.`;
    } else {
        result = `Kaybettin! Bilgisayar ${computerChoice} seçti.`;
    }
    document.getElementById('rps-result').textContent = result;
}

// Türkçe Wordle Mini Oyun
const wordleWords = ["ELMA", "KEDİ", "ARABA", "KARTO", "MASAL", "BİLGİ", "KİTAP", "OYUNU", "RENKL", "DOSTU"];
let wordleTarget = wordleWords[Math.floor(Math.random() * wordleWords.length)];
let wordleTries = [];
function playWordle() {
    const input = document.getElementById('wordle-input');
    const guess = input.value.toUpperCase();
    if (guess.length !== 5) {
        document.getElementById('wordle-feedback').textContent = '5 harfli bir kelime gir!';
        return;
    }
    let feedback = '';
    for (let i = 0; i < 5; i++) {
        if (guess[i] === wordleTarget[i]) {
            feedback += `<span style='color:green;font-weight:bold'>${guess[i]}</span>`;
        } else if (wordleTarget.includes(guess[i])) {
            feedback += `<span style='color:orange'>${guess[i]}</span>`;
        } else {
            feedback += `<span style='color:gray'>${guess[i]}</span>`;
        }
    }
    wordleTries.push(feedback);
    document.getElementById('wordle-feedback').innerHTML = (guess === wordleTarget) ? 'Tebrikler! Doğru bildin!' : feedback;
    document.getElementById('wordle-history').innerHTML = wordleTries.join('<br>');
    if (guess === wordleTarget) {
        wordleTarget = wordleWords[Math.floor(Math.random() * wordleWords.length)];
        wordleTries = [];
        setTimeout(() => {
            document.getElementById('wordle-feedback').textContent = 'Yeni kelime seçildi!';
            document.getElementById('wordle-history').innerHTML = '';
        }, 2000);
    }
    input.value = '';
}

// Mini Çengel Bulmaca (Crossword)
const crosswordData = {
    board: [
        ["K", "E", "D", "I", ""],
        ["", "", "", "", ""],
        ["A", "R", "A", "B", "A"],
        ["", "", "", "", ""],
        ["E", "L", "M", "A", ""],
    ],
    clues: [
        {dir: "across", row: 0, col: 0, clue: "Evcil hayvan (yatay)"},
        {dir: "across", row: 2, col: 0, clue: "Dört tekerli taşıt (yatay)"},
        {dir: "across", row: 4, col: 0, clue: "Kırmızı meyve (yatay)"},
    ]
};
function renderCrossword() {
    const boardDiv = document.getElementById('crossword-board');
    const cluesDiv = document.getElementById('crossword-clues');
    boardDiv.innerHTML = '';
    cluesDiv.innerHTML = '<b>İpuçları:</b><ul>' + crosswordData.clues.map(c => `<li>${c.clue}</li>`).join('') + '</ul>';
    for (let r = 0; r < crosswordData.board.length; r++) {
        const rowDiv = document.createElement('div');
        rowDiv.style.display = 'flex';
        for (let c = 0; c < crosswordData.board[r].length; c++) {
            const cell = crosswordData.board[r][c];
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.style.width = '28px';
            input.style.height = '28px';
            input.style.textAlign = 'center';
            input.style.margin = '1px';
            input.style.textTransform = 'uppercase';
            input.dataset.row = r;
            input.dataset.col = c;
            if (cell === "") {
                input.disabled = true;
                input.style.background = '#eee';
            } else {
                input.oninput = function() { checkCrossword(); };
            }
            rowDiv.appendChild(input);
        }
        boardDiv.appendChild(rowDiv);
    }
}
function checkCrossword() {
    const board = crosswordData.board;
    let correct = true;
    const inputs = document.querySelectorAll('#crossword-board input');
    inputs.forEach(input => {
        const r = input.dataset.row, c = input.dataset.col;
        if (board[r][c] && input.value.toUpperCase() !== board[r][c]) {
            correct = false;
        }
    });
    if (correct) {
        document.getElementById('crossword-clues').innerHTML += '<br><b>Tebrikler! Tüm kelimeleri buldun!</b>';
    }
}

// Puzzle (Parça Birleştirme) - Gelişmiş ve Çocuklara Uygun
const puzzleImages = [
    {src: 'https://placehold.co/80x80?text=🦊', alt: 'Tilki'},
    {src: 'https://placehold.co/80x80?text=🐱', alt: 'Kedi'},
    {src: 'https://placehold.co/80x80?text=🐶', alt: 'Köpek'},
    {src: 'https://placehold.co/80x80?text=🐻', alt: 'Ayı'}
];
let puzzleOrder = [0, 1, 2, 3];
let puzzleDragging = null;

function shufflePuzzle() {
    puzzleOrder = puzzleOrder.sort(() => Math.random() - 0.5);
}

function renderPuzzle() {
    const board = document.getElementById('puzzle-board');
    board.innerHTML = '';
    puzzleOrder.forEach((idx, i) => {
        const piece = document.createElement('img');
        piece.src = puzzleImages[idx].src;
        piece.alt = puzzleImages[idx].alt;
        piece.className = 'puzzle-img-piece';
        piece.draggable = true;
        piece.dataset.index = i;
        piece.title = puzzleImages[idx].alt;
        piece.ondragstart = function(e) {
            puzzleDragging = i;
            e.dataTransfer.effectAllowed = 'move';
        };
        piece.ondragover = function(e) { e.preventDefault(); };
        piece.ondrop = function(e) {
            e.preventDefault();
            const from = puzzleDragging;
            const to = i;
            [puzzleOrder[from], puzzleOrder[to]] = [puzzleOrder[to], puzzleOrder[from]];
            renderPuzzle();
            checkPuzzle();
        };
        board.appendChild(piece);
    });
    // Altına açıklama ve karıştır butonu
    const info = document.createElement('div');
    info.className = 'puzzle-info';
    info.innerHTML = '<b>Parçaları sürükleyip doğru sıraya koy!</b>';
    board.appendChild(info);
    const shuffleBtn = document.createElement('button');
    shuffleBtn.textContent = 'Karıştır';
    shuffleBtn.className = 'show-answer-btn';
    shuffleBtn.onclick = function() { shufflePuzzle(); renderPuzzle(); };
    board.appendChild(shuffleBtn);
}

function checkPuzzle() {
    if (puzzleOrder.every((v, i) => v === i)) {
        const board = document.getElementById('puzzle-board');
        board.innerHTML += '<div style="color:green;font-weight:bold;margin-top:10px">Tebrikler! Doğru sıraladın! 🎉</div>';
    }
}

// Menüde tıklanan bölüme yumuşak kaydırma
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            e.preventDefault();
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Toggle section visibility by ID
function toggleSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.toggle('active');
        // Oyunlar açıldığında otomatik başlat
        if (id === 'crossword-content' && el.classList.contains('active')) renderCrossword();
        if (id === 'puzzle-content' && el.classList.contains('active')) renderPuzzle();
    }
}

// Cevabı göster fonksiyonu
function showGameAnswer(sectionId, answer) {
    const answerDiv = document.getElementById('answer-' + sectionId);
    if (answerDiv) {
        answerDiv.innerHTML = answer;
        answerDiv.style.display = 'block';
    }
}
