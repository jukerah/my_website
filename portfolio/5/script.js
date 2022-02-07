// Dados iniciais
let quadro = {
    a1: '', a2: '', a3: '',
    b1: '', b2: '', b3: '',
    c1: '', c2: '', c3: ''
};
let playing = false;
let vez = 'x';
let warning = '';

reset();

// Eventos
document.querySelector('.reset').addEventListener('click', reset);

document.querySelectorAll('.item').forEach((item)=>{
    item.addEventListener('click', (e) => {
        let loc = e.target.getAttribute('data-item');
        
        if(playing && quadro[loc] === '') {
            quadro[loc] = vez;
            renderQuadro();
            togglePlayer();
        }
    });
});

// Funções
function reset() {
    warning = '';

    // definir a vez
    let random = Math.floor(Math.random() * 2);
    vez = random === 0 ? 'x' : 'o';

    // resetar os quadros
    for(let i in quadro) {
        quadro[i] = '';
    }

    // renderizar tudo
    renderQuadro();
    renderInfo();

    playing = true;

    for(let i in quadro) {
        document.querySelector(`div[data-item=${i}]`).classList.remove('item-fim', 'line-winner');
        document.querySelector(`div[data-item=${i}]`).classList.add('item');
    }

    document.querySelector('.info-winner').style.display = 'none';
    document.querySelector('.info-winner img').style.display = 'none';
    document.querySelector('.info-vez').style.display = 'flex';
    document.querySelector('.reset').style.display = 'none';
}

function renderQuadro() {
    for(let i in quadro) {
        let item = document.querySelector(`div[data-item=${i}]`);
        if(quadro[i] !== '') {
            item.innerHTML = quadro[i].toUpperCase();
        } else {
            item.innerHTML = '';
        }
    }

    checkGame();
}

function renderInfo() {
    
    if (checkWinnerFor('x') || checkWinnerFor('o')) {
        document.querySelector('.resultado').innerHTML = warning;
    }
    if (isFull) {
        document.querySelector('.vez').innerHTML = `Player "${vez.toUpperCase()}" é sua vez`;
    }

    let status = true;
    for (let i in quadro) {
        if (quadro[i] === '') {
            status = false;
        }
    }
    if (status) {
        document.querySelector('.info-vez').style.display = 'none';
        document.querySelector('.info-winner').style.display = 'flex';
        document.querySelector('.resultado').innerHTML = warning;
        document.querySelector('.reset').style.display = 'block';
    } 
}

function togglePlayer() {
    vez = vez === 'x' ? 'o' : 'x';
    renderInfo();
}

function checkGame() {
    if(checkWinnerFor('x')) {
        warning = 'JOGADOR "X" VENCEU';
        playing = false;
    } else if(checkWinnerFor('o')) {
        warning = 'JOGADOR "O" VENCEU';
        playing = false;
    } else if(isFull()) {
        warning = 'DEU EMPATE';
        playing = false;
    }
}

function checkWinnerFor(i) {
    let pos = [
        'a1,a2,a3',
        'b1,b2,b3',
        'c1,c2,c3',

        'a1,b1,c1',
        'a2,b2,c2',
        'a3,b3,c3',

        'a1,b2,c3',
        'a3,b2,c1'
    ];

    for(let w in pos) {
        let pArray = pos[w].split(',');
        let hasWon = pArray.every(option=>quadro[option] === i);
        if(hasWon) {  
            document.querySelector(`div[data-item=${pos[w].substring(0,2)}]`).classList.add('line-winner');
            document.querySelector(`div[data-item=${pos[w].substring(3,5)}]`).classList.add('line-winner');
            document.querySelector(`div[data-item=${pos[w].substring(6,8)}]`).classList.add('line-winner');

            for(let i in quadro) {
                document.querySelector(`div[data-item=${i}]`).classList.add('item-fim');
                document.querySelector(`div[data-item=${i}]`).classList.remove('item');
            }

            document.querySelector('.area').style.cursor = 'default';
            document.querySelector('.reset').style.display = 'block';
            document.querySelector('.info-vez').style.display = 'none';            
            document.querySelector('.info-winner').style.display = 'flex';
            document.querySelector('.info-winner img').style.display = 'block';

            return true;
        }
    }
    
    return false;
}

function isFull() {
    for(let i in quadro) {
        if(quadro[i] === '') {
            return false;
        }
    }
    return true;
}