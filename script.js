const board = document.getElementById('game-board');
// 1. Lista com os nomes das tuas fotos (devem estar na pasta 'images')
const fotos = ['colega1.jpg', 'colega2.jpg', 'colega3.jpg', 'colega4.jpg'];
// 2. Cria os pares (4 fotos x 2 = 8 cartas)
let cartasDoJogo = [...fotos, ...fotos];
// 3. Embaralha as cartas
cartasDoJogo.sort(() => Math.random() - 0.5);

let primeiraCarta = null;
let segundaCarta = null;
let bloqueioTabuleiro = false;
let paresEncontrados = 0;

// Variável global pro som (pra resetar e tocar várias vezes se quiser)
const somVitoria = new Audio('city/city_boy.mp3');

// 4. Cria o tabuleiro
function criarTabuleiro() {
    board.innerHTML = '';
   
    cartasDoJogo.forEach(foto => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.foto = foto;
        card.innerHTML = `<img src="images/${foto}" />`;
        card.addEventListener('click', virarCarta);
        board.appendChild(card);
    });
}

// 5. Vira a carta
function virarCarta() {
    if (bloqueioTabuleiro) return;
    if (this === primeiraCarta) return;
    this.classList.add('virada');
    if (!primeiraCarta) {
        primeiraCarta = this;
        return;
    }
    segundaCarta = this;
    checarPar();
}

// 6. Verifica se é par
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

// 7. Mantém cartas viradas se acertou
function desabilitarCartas() {
    primeiraCarta.removeEventListener('click', virarCarta);
    segundaCarta.removeEventListener('click', virarCarta);
    resetarVariaveis();
}

// 8. Vira as cartas de volta se errou
function desvirarCartas() {
    bloqueioTabuleiro = true;
    setTimeout(() => {
        primeiraCarta.classList.remove('virada');
        segundaCarta.classList.remove('virada');
        resetarVariaveis();
    }, 1000);
}

// 9. Final do jogo → Mostra botão pra tocar o som
function finalizarJogo() {
    // Cria um overlay simples com botão
    const overlay = document.createElement('div');
    overlay.id = 'victory-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0, 0, 0, 0.7)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';

    const box = document.createElement('div');
    box.style.background = '#fff';
    box.style.padding = '40px';
    box.style.borderRadius = '15px';
    box.style.textAlign = 'center';
    box.style.maxWidth = '400px';
    box.innerHTML = `
        <h1>Parabéns, Aurudo! 🎉</h1>
        <p>Encontraste todos os pares!</p>
        <button id="btnTocaSom" style="font-size: 1.4em; padding: 15px 35px; margin-top: 20px; cursor: pointer; background: #ff4444; color: white; border: none; border-radius: 10px;">
            Toca o som épico! 🔥
        </button>
        <br><small style="margin-top:15px; display:block;">(clica pra ouvir o city boy kkk)</small>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // Evento de clique no botão → toca o som
    document.getElementById('btnTocaSom').addEventListener('click', () => {
        somVitoria.currentTime = 0; // reseta pro início
        somVitoria.play()
            .then(() => console.log("Som tocou!"))
            .catch(err => {
                console.error("Erro ao tocar:", err);
                alert("Ops... o som não rolou. Verifica se o arquivo 'city/city_boy.mp3' existe!");
            });
    });

    // Opcional: fecha o overlay clicando fora dele
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

// 10. Reseta variáveis
function resetarVariaveis() {
    primeiraCarta = null;
    segundaCarta = null;
    bloqueioTabuleiro = false;
}

// Inicia o jogo
criarTabuleiro();