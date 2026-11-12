const nomesPecas = [
    ['Bloco e cilindros', 'O bloco é a estrutura principal do motor. Dentro dos cilindros, os pistões sobem e descem.'],
    ['Pistões', 'Recebem a força dos gases da combustão e movimentam as bielas. Os anéis dos pistões ajudam a vedar a câmara.'],
    ['Bielas', 'Ligam os pistões ao virabrequim e transmitem a força do movimento.'],
    ['Virabrequim', 'Transforma o movimento de subida e descida dos pistões em movimento de rotação.'],
    ['Cabeçote', 'Fica sobre o bloco e abriga passagens de ar e gases, válvulas e outros elementos.'],
    ['Válvulas de admissão', 'Abrem para permitir a entrada de ar ou de mistura de ar e combustível.'],
    ['Válvulas de escape', 'Abrem para liberar os gases depois da combustão.'],
    ['Comando de válvulas', 'Controla o momento de abertura e fechamento das válvulas. Em motores de quatro tempos, gira à metade da rotação do virabrequim.'],
    ['Velas de ignição', 'Em motores a gasolina, produzem a faísca que inicia a combustão da mistura.'],
    ['Cárter', 'Reservatório de óleo localizado na parte inferior do motor.'],
    ['Bomba de óleo', 'Aspira o óleo do cárter e o envia sob pressão para as galerias de lubrificação.'],
    ['Galerias de óleo', 'Canais internos que levam lubrificante aos mancais, ao virabrequim e a componentes do cabeçote.'],
    ['Filtro de óleo', 'Retém partículas e impurezas do óleo em circulação. Não aparece no desenho simplificado.'],
    ['Sistema de arrefecimento', 'Ajuda a controlar a temperatura do motor por meio de líquido de arrefecimento e radiador. Não aparece no desenho.'],
    ['Correia ou corrente de distribuição', 'Sincroniza o virabrequim e o comando de válvulas para manter a abertura das válvulas no momento correto.'],
    ['Volante do motor', 'Ajuda a suavizar a rotação do virabrequim e transmite o movimento ao conjunto de transmissão.']
];

const listaComponentes = document.getElementById('listaComponentes');
nomesPecas.forEach(function (peca, indice) {
    const coluna = document.createElement('div');
    coluna.className = 'col-12 col-md-6 col-lg-4';
    const cartao = document.createElement('article');
    cartao.className = 'motor-peca';
    const titulo = document.createElement('h3');
    titulo.textContent = String(indice + 1).padStart(2, '0') + ' · ' + peca[0];
    const texto = document.createElement('p');
    texto.textContent = peca[1];
    cartao.append(titulo, texto);
    coluna.append(cartao);
    listaComponentes.append(coluna);
});

const espacoSvg = 'http://www.w3.org/2000/svg';
const grupoPecas = document.getElementById('pecasDinamicas');
const cilindros = [];

function criarSvg(tipo, atributos, pai) {
    const elemento = document.createElementNS(espacoSvg, tipo);
    Object.keys(atributos).forEach(function (nome) {
        elemento.setAttribute(nome, atributos[nome]);
    });
    (pai || grupoPecas).appendChild(elemento);
    return elemento;
}

for (let i = 0; i < 4; i++) {
    const x = 130 + i * 170;
    criarSvg('rect', {x: x - 54, y: 202, width: 108, height: 158, rx: 8, fill: 'url(#camara)', stroke: '#c1cbd3', 'stroke-width': 6});
    criarSvg('rect', {x: x - 49, y: 208, width: 98, height: 146, rx: 4, fill: 'none', stroke: '#506474', 'stroke-width': 2});
    for (let j = 0; j < 5; j++) {
        criarSvg('path', {d: `M${x - 51} ${235 + j * 25} h9 M${x + 42} ${235 + j * 25} h9`, stroke: '#8294a0', 'stroke-width': 1, opacity: '.55'});
    }
    const brilho = criarSvg('ellipse', {cx: x, cy: 227, rx: 49, ry: 34, fill: 'url(#explosao)', opacity: 0, filter: 'url(#brilho)'});
    const chama = criarSvg('ellipse', {cx: x, cy: 227, rx: 39, ry: 26, fill: 'url(#explosao)', opacity: 0});
    const valvulaEntrada = criarSvg('g', {});
    criarSvg('path', {d: `M${x-48} 181 L${x-27} 202 M${x-45} 185 L${x-24} 206`, stroke: '#88d5db', 'stroke-width': 4, opacity: '.65'}, valvulaEntrada);
    criarSvg('line', {x1: x - 27, y1: 154, x2: x - 27, y2: 197, stroke: '#d6e3e6', 'stroke-width': 6}, valvulaEntrada);
    criarSvg('path', {d: `M${x - 43} 196 Q${x - 27} 206 ${x - 11} 196 Z`, fill: 'url(#metal)', stroke: '#bfe2e7', 'stroke-width': 2}, valvulaEntrada);
    const valvulaSaida = criarSvg('g', {});
    criarSvg('line', {x1: x + 27, y1: 154, x2: x + 27, y2: 197, stroke: '#d6e3e6', 'stroke-width': 6}, valvulaSaida);
    criarSvg('path', {d: `M${x + 11} 196 Q${x + 27} 206 ${x + 43} 196 Z`, fill: 'url(#metal)', stroke: '#e3b59c', 'stroke-width': 2}, valvulaSaida);
    const comando = criarSvg('g', {});
    criarSvg('ellipse', {cx: x - 27, cy: 125, rx: 17, ry: 11, fill: 'url(#aco)', stroke: '#26313e', 'stroke-width': 3}, comando);
    criarSvg('ellipse', {cx: x + 27, cy: 125, rx: 17, ry: 11, fill: 'url(#aco)', stroke: '#26313e', 'stroke-width': 3}, comando);
    criarSvg('rect', {x: x - 6, y: 163, width: 12, height: 41, rx: 3, fill: '#d5ddd9', stroke: '#64747b', 'stroke-width': 2});
    criarSvg('path', {d: `M${x-5} 203L${x} 212L${x+5} 203`, fill: '#f6c35e'});
    const faisca = criarSvg('path', {d: `M${x-8} 217 L${x+4} 229 L${x-4} 229 L${x+10} 243`, fill: 'none', stroke: '#ffe39b', 'stroke-width': 3, opacity: 0});
    const contrapeso = criarSvg('g', {});
    const manivela = criarSvg('line', {x1: x, y1: 420, x2: x, y2: 420, stroke: '#7a8fa3', 'stroke-width': 20, 'stroke-linecap': 'round'});
    const peso = criarSvg('path', {d: `M${x-32} 408 A35 35 0 0 0 ${x+32} 408 L${x+15} 421H${x-15}Z`, fill: 'url(#aco)', stroke: '#2a3644', 'stroke-width': 3}, contrapeso);
    const bielaSombra = criarSvg('line', {x1: x, y1: 290, x2: x, y2: 400, stroke: '#1a2833', 'stroke-width': 23, 'stroke-linecap': 'round'});
    const biela = criarSvg('line', {x1: x, y1: 290, x2: x, y2: 400, stroke: 'url(#aco)', 'stroke-width': 17, 'stroke-linecap': 'round'});
    const pistao = criarSvg('g', {});
    criarSvg('path', {d: `M${x-44} -24 Q${x} -32 ${x+44} -24 L${x+44} 23 L${x+30} 33 H${x-30} L${x-44} 23 Z`, fill: 'url(#metal)', stroke: '#d9e1e7', 'stroke-width': 2}, pistao);
    criarSvg('path', {d: `M${x-42} -19H${x+42} M${x-43} -12H${x+43} M${x-43} -4H${x+43}`, stroke: '#27333e', 'stroke-width': 3}, pistao);
    criarSvg('path', {d: `M${x-37} 12 H${x+37} M${x-30} 20H${x+30}`, stroke: '#647482', 'stroke-width': 2}, pistao);
    criarSvg('circle', {cx: x, cy: 13, r: 10, fill: '#293643', stroke: '#edf2f4', 'stroke-width': 3}, pistao);
    const pino = criarSvg('circle', {cx: x, cy: 420, r: 14, fill: 'url(#aco)', stroke: '#293a48', 'stroke-width': 5});
    criarSvg('circle', {cx: x, cy: 420, r: 4, fill: '#344c61'}, pino.parentNode);
    const numero = criarSvg('text', {x:x, y:372, 'text-anchor':'middle', 'font-size':11, fill:'#d5e2ef', 'font-weight':'bold', 'letter-spacing':'1'});
    numero.textContent = 'CILINDRO ' + (i+1);
    const fase = criarSvg('text', {x:x, y:389, 'text-anchor':'middle', 'font-size':12, fill:'#f9ab76', 'font-weight':'bold'});
    cilindros.push({x, chama, brilho, faisca, valvulaEntrada, valvulaSaida, comando, manivela, contrapeso, biela, bielaSombra, pistao, pino, fase});
}

const botaoPartida = document.getElementById('botaoPartida');
const botaoReiniciar = document.getElementById('botaoReiniciar');
const controleRpm = document.getElementById('controleRpm');
const rpmSelecionado = document.getElementById('rpmSelecionado');
const leituraRpm = document.getElementById('leituraRpm');
const leituraPressao = document.getElementById('leituraPressao');
const estadoMotor = document.getElementById('estadoMotor');
const oleoAnimado = document.getElementById('oleoAnimado');
const galeriasFluxo = document.getElementById('galeriasFluxo');
const bombaGiro = document.getElementById('bombaGiro');

let ligado = false;
let angulo = 0;
let tempoLigado = 0;
let ultimoQuadro = 0;
let animacao = 0;
const deslocamentosCiclo = [0, Math.PI * 3, Math.PI, Math.PI * 2];
const nomesTempos = ['EXPANSÃO', 'ESCAPE', 'ADMISSÃO', 'COMPRESSÃO'];

function desenhar() {
    cilindros.forEach(function (item, i) {
        const faseVirabrequim = angulo + (i === 0 || i === 3 ? 0 : Math.PI);
        const deslocamentoX = 38 * Math.sin(faseVirabrequim);
        const pinoX = item.x + deslocamentoX;
        const pinoY = 422 - 38 * Math.cos(faseVirabrequim);
        const pistonY = pinoY - Math.sqrt(150 * 150 - deslocamentoX * deslocamentoX);
        item.pistao.setAttribute('transform', `translate(0 ${pistonY})`);
        item.bielaSombra.setAttribute('x1', item.x);
        item.bielaSombra.setAttribute('y1', pistonY + 13);
        item.bielaSombra.setAttribute('x2', pinoX);
        item.bielaSombra.setAttribute('y2', pinoY);
        item.biela.setAttribute('x1', item.x);
        item.biela.setAttribute('y1', pistonY + 8);
        item.biela.setAttribute('x2', pinoX);
        item.biela.setAttribute('y2', pinoY);
        item.manivela.setAttribute('x2', pinoX);
        item.manivela.setAttribute('y2', pinoY);
        item.pino.setAttribute('cx', pinoX);
        item.pino.setAttribute('cy', pinoY);
        item.contrapeso.setAttribute('transform', `rotate(${faseVirabrequim * 180 / Math.PI} ${item.x} 420)`);
        item.comando.setAttribute('transform', `rotate(${angulo * 90 / Math.PI} ${item.x} 125)`);

        const ciclo = ((angulo + deslocamentosCiclo[i]) % (4 * Math.PI) + 4 * Math.PI) % (4 * Math.PI);
        const etapa = Math.floor(ciclo / Math.PI);
        item.fase.textContent = ligado ? nomesTempos[etapa] : 'PARADO';
        item.valvulaEntrada.setAttribute('transform', `translate(0 ${ligado && etapa === 2 ? 10 : 0})`);
        item.valvulaSaida.setAttribute('transform', `translate(0 ${ligado && etapa === 1 ? 10 : 0})`);
        const progresso = ciclo % Math.PI;
        const intensidade = ligado && etapa === 0 && progresso < 1.5 ? Math.max(0, 0.8 - progresso * 0.48) : 0;
        item.chama.setAttribute('opacity', intensidade.toFixed(2));
        item.brilho.setAttribute('opacity', (intensidade * .6).toFixed(2));
        item.faisca.setAttribute('opacity', ligado && etapa === 0 && progresso < .35 ? 1 : 0);
    });
    const progressoOleo = Math.min(1, tempoLigado / 2.5);
    oleoAnimado.setAttribute('opacity', ligado ? progressoOleo : 0);
    galeriasFluxo.setAttribute('opacity', ligado ? progressoOleo : 0);
    oleoAnimado.setAttribute('stroke-dashoffset', -Math.floor(tempoLigado * 45));
    galeriasFluxo.setAttribute('stroke-dashoffset', Math.floor(tempoLigado * 28));
    bombaGiro.setAttribute('transform', `rotate(${Math.round(angulo * 180 / Math.PI)} 4 0)`);
    const pressao = ligado ? Math.min(3.6, tempoLigado * 1.3) : 0;
    leituraPressao.innerHTML = pressao.toFixed(1).replace('.', ',') + ' <small>bar</small>';
}

function quadro(agora) {
    if (!ligado) return;
    const delta = Math.min((agora - ultimoQuadro) / 1000, 0.06);
    ultimoQuadro = agora;
    tempoLigado += delta;
    const rpm = Number(controleRpm.value);
    const voltasVisuais = 0.75 + (rpm / 6500) * 2.8;
    angulo += delta * voltasVisuais * Math.PI * 2;
    desenhar();
    animacao = requestAnimationFrame(quadro);
}

function desligar() {
    ligado = false;
    cancelAnimationFrame(animacao);
    controleRpm.disabled = true;
    leituraRpm.innerHTML = '0 <small>RPM</small>';
    estadoMotor.textContent = '● DESLIGADO';
    estadoMotor.classList.remove('ligado');
    botaoPartida.textContent = '▶ DAR PARTIDA';
    botaoPartida.classList.remove('btn-outline-danger');
    botaoPartida.classList.add('btn-danger');
    desenhar();
}

botaoPartida.addEventListener('click', function () {
    if (ligado) {
        desligar();
        return;
    }
    ligado = true;
    tempoLigado = 0;
    controleRpm.disabled = false;
    leituraRpm.innerHTML = Number(controleRpm.value).toLocaleString('pt-BR') + ' <small>RPM</small>';
    estadoMotor.textContent = '● FUNCIONANDO';
    estadoMotor.classList.add('ligado');
    botaoPartida.textContent = '■ DESLIGAR';
    botaoPartida.classList.remove('btn-danger');
    botaoPartida.classList.add('btn-outline-danger');
    ultimoQuadro = performance.now();
    animacao = requestAnimationFrame(quadro);
});

botaoReiniciar.addEventListener('click', function () {
    desligar();
    controleRpm.value = 900;
    rpmSelecionado.textContent = '900 RPM';
    angulo = 0;
    tempoLigado = 0;
    desenhar();
});

controleRpm.addEventListener('input', function () {
    const valor = Number(controleRpm.value).toLocaleString('pt-BR') + ' RPM';
    rpmSelecionado.textContent = valor;
    if (ligado) leituraRpm.innerHTML = valor.replace(' RPM', '') + ' <small>RPM</small>';
});

desenhar();
