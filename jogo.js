
const som_HIT = new Audio(); // << CREATING A NEW OBJECT OF Audio type
som_HIT.src = './efeitos/hit.wav';


const sprites = new Image(); // << look back to it
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = '#2e4482';
    contexto.fillRect(0, 0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};

// [Chao]
const chao = {
  spriteX: 0,
  spriteY: 610,
  largura: 224,
  altura: 112,
  x: 0,
  y: canvas.height - 112,
  desenha() {
    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY, // << sprites positions
      chao.largura, chao.altura,
      chao.x, chao.y,
      chao.largura, chao.altura,
    );

    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      (chao.x + chao.largura), chao.y,
      chao.largura, chao.altura,
    );
  },
};

function fazColisao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura; // << This 'altura' is filled up by the flappyBoard pixels
  const chaoY = chao.y;

  if (flappyBirdY >= chaoY) { // chao.y has a HIGH y for being at the bottom of the canvas
    return true;
  }

  return false;
}

function criaFlappyBird() { // << Like a constructor, now we can create a pre design object as it was a class object
  const flappyBird = { // << IMPORTANT!!! flappyBird is a const, but I still can change its attributes/properties values
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 4.6, // << video was 4.6

    pula() {
      console.log('Devo pular');
      flappyBird.velocidade = - flappyBird.pulo;  // << Making the flappyBird receive a negative speed
    },

    gravidade: 0.25,
    velocidade: 0,

    atualiza() {
      if (fazColisao(flappyBird, chao)) {
        console.log('Fez colisao');
        som_HIT.play();

        setTimeout(() => {
          mudaParaTela(Telas.INICIO);
        }, 500);       // << Is it how similar to sleep?
        return;
      }

      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    desenha() {
      contexto.drawImage(
        sprites,
        flappyBird.spriteX, flappyBird.spriteY, // Sprite X, Sprite Y
        flappyBird.largura, flappyBird.altura, // Sprite cut size
        flappyBird.x, flappyBird.y,
        flappyBird.largura, flappyBird.altura,
      );
    }
  }
  return flappyBird;
}

// MY idle animation OWN implementation // MY idle animation OWN implementation
var count = 0;
function idleFlappyBird() {
  if (count % 2) {
    globais.flappyBird.x = globais.flappyBird.x + 1;
    globais.flappyBird.y = globais.flappyBird.y - 3;
  }
  else {
    globais.flappyBird.x = globais.flappyBird.x - 1;
    globais.flappyBird.y = globais.flappyBird.y + 3;
  }
  count++
}
// MY idle animation OWN implementation // MY idle animation OWN implementation

/// [mensagemGetReady]
const mensagemGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.sX, mensagemGetReady.sY,
      mensagemGetReady.w, mensagemGetReady.h,
      mensagemGetReady.x, mensagemGetReady.y,
      mensagemGetReady.w, mensagemGetReady.h
    );
  }
}

//
// [Telas]
//
const globais = {} // << Declared as a null object
let telaAtiva = {}; // << object declared null
function mudaParaTela(novaTela) {
  telaAtiva = novaTela; // << Javascript will automaticly guess the type

  if (telaAtiva.inicializa) { // << It checks IF the telaAtiva has a 'inicializa' attribute
    telaAtiva.inicializa(); // << kkkk tava apenas 'inicializa();'
  }
}

const Telas = {
  INICIO: {
    inicializa() {
      globais.flappyBird = criaFlappyBird(); // << CREATING A globais ATTRIBUTE 'flappyBird' IN RUN TIME
    },
    desenha() {
      planoDeFundo.desenha();
      chao.desenha();
      globais.flappyBird.desenha();
      mensagemGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {

    }
  }
};

Telas.JOGO = { // << Is it acting like a Telas property?? Different syntax  // << LOOK BACK TO THIS LATTER!!!  
  desenha() {
    planoDeFundo.desenha();
    chao.desenha();
    globais.flappyBird.desenha();
  },
  click() {
    globais.flappyBird.pula();
  },
  atualiza() {
    globais.flappyBird.atualiza();
  }
}

// MY OWN implementation // MY OWN implementation // MY OWN implementation
let mousePos = {}; // << Picking up the mouse position
window.onmousemove = logMouseMove; // << like a c# delegate?  <<< REVIEW THAT LATTER
function logMouseMove(e) {
  mousePos = { x: e.clientX, y: e.clientY };
}

window.addEventListener('click', function () {
  if (Telas.JOGO.click) {
    Telas.JOGO.click();
  }
});
// MY OWN implementation // MY OWN implementation // MY OWN implementation

window.addEventListener('click', function () {
  if (Telas.INICIO.click) { // << Does it check IF telaAtiva has the function or property click?
    if (mousePos.x >= 463 && mousePos.x <= 785
      && mousePos.y >= 235 && mousePos.y <= 715) {
      Telas.INICIO.click();
      console.log("The mouse x position is: " + mousePos.x + " and y is: " + mousePos.y)
    }
  }
});

var frameCount = 0;
function loop() {
  if (frameCount % 16 == 0) {
    idleFlappyBird();
  }

  telaAtiva.atualiza(); // << telaAtiva has received the Telas object
  telaAtiva.desenha();

  requestAnimationFrame(loop); // << It makes a loop() function callback

  frameCount++;
}

mudaParaTela(Telas.INICIO);
loop(); // << First loop call