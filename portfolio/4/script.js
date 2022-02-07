const audioKey = new Audio('assets/audio/key.wav');
const audioConfirm = new Audio('assets/audio/confirm.wav');

function playAudioKey() {
    const audio = audioKey;
    audio.volume = 0.6;
    audio.play();
} 

function playAudioConfirm() {
    const audio = audioConfirm;
    audio.volume = 0.1;
    audio.play();   
} 

let seuVotoPara = document.querySelector('.d-1-1 p');
let cargo = document.querySelector('.d-1-2 p');
let numeros = document.querySelector('.numero-voto');
let descricao = document.querySelector('.d-1-4');
let nome = document.querySelector('.d-1-4 .nome');
let partido = document.querySelector('.d-1-4 .partido');
let vicePrefeito = document.querySelector('.d-1-4 .vp');
let aviso = document.querySelector('.d-2');
let fotosCandidato = document.querySelector('.d-1-right');
let fotoVereadorPrefeiro = document.querySelector('.canditado img');
let fotoVicePrefeito = document.querySelector('.vice-prefeito img');
let etapaAtual = 0;
let numero = '';
let statusBranco = false;
let statusNulo = false;

function comecaEtapa() {
    let etapa = etapas[etapaAtual];
    let numeroHtml = '';
    numero = '';
    statusBranco = false;
    statusNulo = false;

    document.querySelector('.tela--fim-voto').style.display = 'none';
    document.querySelector('.d-1').style.display = 'flex';
    document.querySelector('.d-2').style.display = 'block';
    document.querySelector('.box-aviso').style.display = 'none';
    document.querySelector('.vice-prefeito').style.display = 'none';    
    cargo.style.display = 'block';
    document.querySelector('.d-1-3').style.display = 'flex';
    numeros.classList.add('d-1-3');

    for (let i = 0; i < etapa.numeros; i++) {
        if (i === 0) {
            numeroHtml += '<div class="numero pisca"></div>';
        } else {
            numeroHtml += '<div class="numero"></div>';
        }       
    }

    seuVotoPara.style.display = 'none';
    cargo.innerHTML = etapa.titulo;
    descricao.style.display = 'none';
    aviso.style.display  = 'none';
    fotosCandidato.style.display = 'none';
    numeros.innerHTML = numeroHtml;
}

function atualizaInterface() {
    document.querySelector('.box-aviso').style.display = 'none';

    let etapa = etapas[etapaAtual];
    let candidato = etapa.candidatos.filter((item) => {
        if (item.numero === numero) {
            return true;
        } else {
            return false;
        }
    });
    if (candidato.length > 0) {
        candidato = candidato[0];
        seuVotoPara.style.display = 'block';
        descricao.style.display = 'block';
        nome.innerHTML = candidato.nome;
        partido.innerHTML = candidato.partido;
        document.querySelector('.nome-vp').style.display = 'none';

        if (etapaAtual > 0) {
            document.querySelector('.vice-prefeito').style.display = 'flex';
            document.querySelector('.nome-vp').style.display = 'flex';
            vicePrefeito.innerHTML = candidato.vice;
            fotoVicePrefeito.setAttribute('src', candidato.fotos[1].url);
            document.querySelector('.vice-prefeito p').innerHTML = candidato.fotos[1].legenda;
        }
        aviso.style.display  = 'block';        
        fotosCandidato.style.display = 'flex';                
        fotoVereadorPrefeiro.setAttribute('src', candidato.fotos[0].url);
        document.querySelector('.canditado p').innerHTML = candidato.fotos[0].legenda;
    } else {
        statusNulo = true;
        seuVotoPara.style.display = 'block';
        aviso.style.display  = 'block';
        descricao.style.display = 'none';
        document.querySelector('.box-aviso').style.display = 'block';
        document.querySelector('.box-aviso').innerHTML = '<p class="voto-invalido">NÚMERO ERRADO</p><div class="aviso-grande pisca">VOTO NULO</div>';
    }
}

function clicou(n) {
    let elNumero = document.querySelector('.numero.pisca');

    if (elNumero !== null) {
        elNumero.innerHTML = n;
        numero = `${numero}${n}`;

        elNumero.classList.remove('pisca');

        if (elNumero.nextElementSibling !== null) {
            elNumero.nextElementSibling.classList.add('pisca');
        } else {
            atualizaInterface();
        }
        playAudioKey();
    }
}

async function branco() {
    let etapa = etapas[etapaAtual];
    let candidato = etapa.candidatos.filter((item) => {
        if (item.numero === numero) {
            return true;
        } else {
            return false;
        }
    });
    if (numero === '') {
        playAudioKey();
        statusBranco = true;
        seuVotoPara.style.display = 'block';
        aviso.style.display  = 'block';
        document.querySelector('.d-1-3').style.display = 'none';
        document.querySelector('.box-aviso').style.display = 'flex';
        document.querySelector('.box-aviso').innerHTML = '<div class="voto-branco pisca">VOTO EM BRANCO</div>';
    } else if (descricao.style.display == 'none') {        
        playAudioKey();
        aviso.style.display  = 'none';
        document.querySelector('.box-aviso').style.display = 'flex';
        document.querySelector('.box-aviso').innerHTML = '<div class="alert-branco"><p>Para votar em <b>Branco</b></p><p>o campo de voto deve estar vazio.</p><p>Aperte <b>CORRIGE</b> para apagar o campo de voto.</p></div>';

        await sleep(3000);
        
        if (descricao.style.display == 'block') {
            aviso.style.display  = 'block';
        }
        document.querySelector('.box-aviso').style.display = 'none';
    } else {        
        playAudioKey();
        aviso.style.display  = 'none';
        document.querySelector('.box-aviso').style.display = 'flex';
        document.querySelector('.box-aviso').innerHTML = '<div class="alert-branco-selecionado"><p>Para votar em <b>Branco</b></p><p>o campo de voto deve estar vazio.</p><p>Aperte <b>CORRIGE</b> para apagar o campo de voto.</p></div>';

        await sleep(3000);
        
        if (descricao.style.display == 'block') {
            aviso.style.display  = 'block';
        }
        document.querySelector('.box-aviso').style.display = 'none';
    }
}

function corrige() {
    playAudioKey();
    comecaEtapa();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}  

async function confirma() { 
    let etapa = etapas[etapaAtual];
    let votoConfirmado = false;

    if (statusBranco === true) {
        if (etapaAtual === 0) {
            playAudioKey();
        }  
        console.log('confirmado voto branco');
        votoConfirmado = true;
    } else if (numero.length === etapa.numeros && statusNulo === false) {
        if (etapaAtual === 0) {
            playAudioKey();
        } 
        console.log('confirmado voto em :');
        votoConfirmado = true;
    } else if (statusNulo === true) {
        if (etapaAtual === 0) {
            playAudioKey();
        } 
        console.log('confirmado voto nulo');
        votoConfirmado = true;
    } else if (numero.length < etapa.numeros) {        
        playAudioKey();
        aviso.style.display  = 'none';
        document.querySelector('.box-aviso').style.display = 'flex';
        document.querySelector('.box-aviso').innerHTML = '<div class="alert-confirma"><p>Para <b>CONFIRMAR</b> é necessário</b></p><p>digitar pelo menos o número do</p><p>candidato ou votar em <b>BRANCO</b>.</p></div>';
        await sleep(3000);
        document.querySelector('.box-aviso').style.display = 'none';
    }

    if (votoConfirmado) {
        etapaAtual++;
        if (etapas[etapaAtual] !== undefined) {
            comecaEtapa();
        } else {
            document.querySelector('.d-1').style.display = 'none';
            document.querySelector('.d-2').style.display = 'none';
            document.querySelector('.tela--fim-voto').style.display = 'block';
            time();
            playAudioConfirm();
            etapaAtual = 0;
            await sleep(8000); 
            comecaEtapa();
        }
    }
}

function time() {
    let dataAtual = new Date();
    const options = {
        weekday: 'short', 
    };
    let data = dataAtual.toLocaleString('pt-BR', options) + dataAtual.toLocaleString();

    document.querySelector('.fim-data').innerHTML = data.toUpperCase();
}

comecaEtapa();