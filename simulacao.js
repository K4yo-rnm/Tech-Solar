const barra = document.getElementById("barra");
const sol = document.getElementById("sol");
const lua = document.getElementById("lua");
const ceu = document.getElementById("ceu");
const quantidade = document.getElementById("quantidade");
const painel = document.getElementById("painel");
const estrelasContainer = document.getElementById("estrelas");
const nuvensContainer = document.getElementById("nuvens");
const bonus = document.getElementById("bonus");
const botao = document.getElementById("toggleSol");

let energiaAcumulada = 0;
let geracao = 0;
let ciclo = 0;
let intensidade = 1; // 1 = dia pleno, 0.5 = nublado
let energiaBonus = 0;

// Criar estrelas
const numEstrelas = 50;
for (let i = 0; i < numEstrelas; i++) {
    const star = document.createElement("div");
    star.style.position = "absolute";
    const size = Math.random() * 2 + 1;
    star.style.width = star.style.height = size + "px";
    star.style.top = Math.random() * 150 + "px";
    star.style.left = Math.random() * 400 + "px";
    star.style.background = "white";
    star.style.borderRadius = "50%";
    star.style.opacity = 0;
    star.style.transition = "opacity 1s ease";
    estrelasContainer.appendChild(star);
}

// Criar nuvens
const numNuvens = 5;
const nuvens = [];
for (let i = 0; i < numNuvens; i++) {
    const nuvem = document.createElement("div");
    nuvem.classList.add("nuvem");
    nuvem.style.width = 50 + Math.random() * 50 + "px";
    nuvem.style.height = 20 + Math.random() * 20 + "px";
    nuvem.style.top = Math.random() * 80 + "px";
    nuvem.style.left = Math.random() * 400 + "px";
    nuvem.style.animationDuration = 30 + Math.random() * 20 + "s";
    nuvensContainer.appendChild(nuvem);
    nuvens.push(nuvem);
}

// Alternar nuvens
botao.addEventListener("click", () => {
    intensidade = intensidade === 1 ? 0.5 : 1;
});

function atualizarSimulacao() {
    ciclo += 0.5;
    if (ciclo > 100) ciclo = 0;

    const dia = ciclo < 50;

    // Atualiza estrelas
    Array.from(estrelasContainer.children).forEach(star => {
        star.style.opacity = dia ? 0 : Math.random();
    });

    // Atualiza nuvens
    nuvens.forEach(nuvem => {
        nuvem.style.opacity = intensidade < 1 && dia ? 0.7 : 0;
    });

    if (dia) {
        ceu.classList.remove("noite");

        // Movimento do sol
        const solLeft = (ciclo / 50) * 340;
        const solTop = 20 + Math.sin((ciclo / 50) * Math.PI) * 80;
        sol.style.left = solLeft + "px";
        sol.style.top = solTop + "px";
        sol.style.opacity = 1;
        sol.style.boxShadow = `0 0 ${15 + intensidade * 20}px #ffd700`;

        lua.style.opacity = 0;

        // Altura do sol influencia a produção
        const alturaSol = Math.sin((ciclo / 50) * Math.PI);

        // Se for o início do dia, zera a barra
        if (Math.abs(ciclo - 0) < 0.5) {
            energiaAcumulada = 0;
        }

        // Energia acumulada aumenta com intensidade e altura do sol
        energiaAcumulada += alturaSol * intensidade * 0.05;

        // Atualiza a porcentagem da barra com base na energia acumulada
        geracao = Math.min((energiaAcumulada / 5) * 100, 100);

        // Painel piscando
        painel.style.boxShadow = `inset 0 0 ${5 + Math.random() * 5}px #0f5c0f`;

    } else {
        ceu.classList.add("noite");

        // Movimento da lua
        const luaLeft = 340 - ((ciclo - 50) / 50) * 340;
        const luaTop = 20 + Math.sin(((ciclo - 50) / 50) * Math.PI) * 80;
        lua.style.left = luaLeft + "px";
        lua.style.top = luaTop + "px";
        lua.style.opacity = 1;

        sol.style.opacity = 0;

        // Zera a barra à noite
        geracao = 0;

        // Energia bônus enviada à rede elétrica
        energiaBonus += energiaAcumulada * 0.001;

        painel.style.boxShadow = "inset 0 0 5px #000";
    }

    // Atualiza visualmente
    barra.style.width = geracao + "%";
    quantidade.textContent = energiaAcumulada.toFixed(2);
    bonus.textContent = energiaBonus.toFixed(3);
}

// Atualiza a cada 150ms
setInterval(atualizarSimulacao, 150);


