
let frames = 0;
const som_HIT = new Audio(); // << CREATING A NEW OBJECT OF Audio type
som_HIT.src = './efeitos/hit.wav';


const sprites = new Image(); // << look back to it
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas'); // << Picking up the 'canvas' object
const contexto = canvas.getContext('2d');

// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204, // << We subtract the 'altura' value from canvas.height
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
function criaChao() {
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza() {
      const movimentoDoChao = 1;
      const deveRepetirNaMetade = chao.largura / 2; 
      const movimentacao = chao.x - movimentoDoChao;
      chao.x = movimentacao % deveRepetirNaMetade;  // << INTERESTING, once we are incrementing or decremeting a value (chao.x) that receives the remainder
                                                    // ^^ of a division in which the denomitor is greater than nominator 
                                                    // ^^ the remainder will never overtake this numerator value!!!
                                                    // ^^ Since the remainder of a division of one number by ITSELF is 0
                                                    // ^^ Whenever chao.x gets 0, it will have the 0 value in the next time the atualiza() function is called   
                                                    // ^^ OBS: the remainder of a division in which the denomitor is greater than nominator will ALWAYS be the NOMINATOR ITSELF!!!                                                
    },
    desenha() {
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY, // << sprites positions
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura,
      ),

        contexto.drawImage(
          sprites,
          chao.spriteX, chao.spriteY,
          chao.largura, chao.altura,
          (chao.x + chao.largura), chao.y,
          chao.largura, chao.altura,
        );
    },
  };
  return chao;
}

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
      if (fazColisao(flappyBird, globais.chao)) {
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

    // Changing flappyBird wings position implementation BELLOW
    movimentos: [ // << Array of spriteX and spriteY
      { spriteX: 0, spriteY: 0, }, // asa pra cima
      { spriteX: 0, spriteY: 26, }, // asa no meio 
      { spriteX: 0, spriteY: 52, }, // asa pra baixo
      { spriteX: 0, spriteY: 26, }, // asa no meio ... It has to be repeated because this is the transition position
    ],

    frameAtual: 0, // << A separated attribute    
    atualizaOFrameAtual() {
      const intervaloDeFrames = 10;
      const passouOIntervalo = frames % intervaloDeFrames; // << this 'frames' and 'frameAtual' are NOT the same thing

      if(passouOIntervalo == 0) {
        const baseDoIncremento = 1;
        const incremento = flappyBird.frameAtual + baseDoIncremento; // << Simple: base value + increment value
        const totalMovements = flappyBird.movimentos.length; // << Getting the array of positions 'movimentos' size    
        flappyBird.frameAtual = incremento % totalMovements; // << Updating the frameAtual base value
      }    
    },
    // Changing flappyBird wings position implementation ABOVE

    desenha() {
      flappyBird.atualizaOFrameAtual();
      const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual] // << DIFFERENT SYNTAX... DESESTRUTURAR ... It is const but its value changes... ???      

      contexto.drawImage(
        sprites,

        // Picking up the image sprite
        spriteX, spriteY, // Sprite X, Sprite Y
        flappyBird.largura, flappyBird.altura, // Sprite cut size
        // Picking up the image sprite
        
        flappyBird.x, flappyBird.y,
        flappyBird.largura, flappyBird.altura,
      );
    }
  }
  return flappyBird;
}

// MY idle animation OWN implementation // MY idle animation OWN implementation
let count = 0;
function idleFlappyBird() {
  if (count % 2) { // << Alternating the moviments
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
      globais.chao = criaChao();
    },
    desenha() {
      planoDeFundo.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha();
      mensagemGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {
      globais.chao.atualiza();
    }
  }
};

Telas.JOGO = { // << Declaring a Telas attribute (JOGO) in runtime, AFTER the Telas main declaration 
  desenha() {
    planoDeFundo.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
  },
  click() {
    globais.flappyBird.pula();
  },
  atualiza() {
    globais.flappyBird.atualiza();
    globais.chao.atualiza();
  }
}

window.addEventListener('click', function () {
  if (Telas.INICIO.click) { // << Does it check IF telaAtiva has the function or property click?    
    Telas.INICIO.click();
  }
});

window.addEventListener('click', function () {
  if (Telas.JOGO.click) {
    Telas.JOGO.click();
  }
});

function loop() {
  if (frames % 12 == 0) {
    idleFlappyBird();
  }

  telaAtiva.atualiza(); // << telaAtiva has received the Telas object
  telaAtiva.desenha();

  requestAnimationFrame(loop); // << It makes a loop() function callback

  frames++;
}

mudaParaTela(Telas.INICIO);
loop(); // << First loop call