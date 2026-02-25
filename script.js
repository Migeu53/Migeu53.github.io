const board = document.getElementById('game-board');
const tentativasSpan = document.getElementById('tentativas');

const fotos = ['colega1.jpg', 'colega2.jpg', 'colega3.jpg', 'colega4.jpg'];
let cartasDoJogo = [...fotos, ...fotos];
cartasDoJogo.sort(() => Math.random() - 0.5);

let primeiraCarta = null;
let segundaCarta = null;
let bloqueioTabuleiro = false;
let paresEncontrados = 0;
let tentativas = 0;

const somVitoria = new Audio('city/city_boy.mp3');

// Debug do áudio (veja no console F12)
somVitoria.addEventListener('error', (e) => {
    console.error('Erro ao carregar o áudio:', e);
    if (somVitoria.error) {
        console.log('Código de erro do áudio:', somVitoria.error.code);
        console.log('Mensagem:', somVitoria.error.message);
    }
});

function criarTabuleiro() {
    board.innerHTML = '';

    cartasDoJogo.forEach(foto => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.foto = foto;

        const img = document.createElement('img');
        img.src = `images/${foto}`;
        img.alt = 'Foto do colega';
        img.onerror = () => console.error(`Imagem não encontrada: images/${foto}`);
        card.appendChild(img);

        card.addEventListener('click', virarCarta);
        board.appendChild(card);
    });
}

function virarCarta() {
    if (bloqueioTabuleiro) return;
    if (this === primeiraCarta) return;

    this.classList.add('virada');

    if (!primeiraCarta) {
        primeiraCarta = this;
        return;
    }

    segundaCarta = this;
    tentativas++;
    tentativasSpan.textContent = tentativas;
    checarPar();
}

function checarPar() {
    const isMatch = primeiraCarta.dataset.foto === segundaCarta.dataset.foto;

    if (isMatch) {
        paresEncontrados++;
        desabilitarCartas();
        if (paresEncontrados === fotos.length) {
            finalizarJogo();
        }
    } else {
        desvirarCartas();
    }
}

function desabilitarCartas() {
    primeiraCarta.removeEventListener('click', virarCarta);
    segundaCarta.removeEventListener('click', virarCarta);
    resetarVariaveis();
}

function desvirarCartas() {
    bloqueioTabuleiro = true;
    setTimeout(() => {
        primeiraCarta.classList.remove('virada');
        segundaCarta.classList.remove('virada');
        resetarVariaveis();
    }, 1200); // um pouco mais de tempo pra ver a virada
}

function finalizarJogo() {
    const overlay = document.createElement('div');
    overlay.id = 'victory-overlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.75)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';

    const box = document.createElement('div');
    box.style.background = '#ffffff';
    box.style.padding = '40px 50px';
    box.style.borderRadius = '20px';
    box.style.textAlign = 'center';
    box.style.maxWidth = '450px';
    box.style.boxShadow = '0 15px 40px rgba(0,0,0,0.4)';
    box.innerHTML = `
        <h1>Parabéns, Aurudo! 🎉</h1>
        <p>Encontraste todos os pares em <strong>${tentativas}</strong> tentativas!</p>
        <button id="btnTocaSom" style="font-size: 1.5em; padding: 18px 40px; margin: 25px 0 10px; cursor: pointer; background: #ff4444; color: white; border: none; border-radius: 12px; font-weight: bold;">
            Toca o som épico! 🔥
        </button>
        <br><small>(clica pra ouvir o city boy kkk)</small>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    document.getElementById('btnTocaSom').addEventListener('click', () => {
        somVitoria.currentTime = 0;
        somVitoria.play()
            .then(() => {
                console.log("Som tocou com sucesso!");
            })
            .catch(err => {
                console.error("Erro ao tentar tocar:", err.name, err.message);
                alert("Som não rolou! Provável motivo: abra com servidor local (Live Server ou python -m http.server) e não direto do arquivo.");
            });
    });

    // Fecha o overlay clicando fora
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

function resetarVariaveis() {
    primeiraCarta = null;
    segundaCarta = null;
    bloqueioTabuleiro = false;
}

// Inicia o jogo
criarTabuleiro();