
let frames = 0;
let isThereAChaoColisionSong = false;
let createdScore = false;
let whichTela = 0;
let gameScore = 0;
let gameOver = false;

const globais = {} // << Declared as a null object
let telaAtiva = {}; // << object declared null

const som_HIT = new Audio(); // << CREATING A NEW OBJECT OF Audio type
som_HIT.src = './efeitos/hit (mp3cut.net)2.wav';

const som_PULO = new Audio(); // << CREATING A NEW OBJECT OF Audio type
som_PULO.src = './efeitos/pulo (mp3cut.net).wav';

const som_GameOver = new Audio(); // << CREATING A NEW OBJECT OF Audio type
som_GameOver.src = './efeitos/mixkit-retro-arcade-game-over-470.wav';

const som_GameLevel = new Audio(); // << CREATING A NEW OBJECT OF Audio type
som_GameLevel.src = './efeitos/mixkit-game-level-music-689 (mp3cut.net).wav';
som_GameLevel.loop = true;

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
// AFTER criaChao() function bellow
function fazColisaoComOChao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura; // << This 'altura' is filled up by the flappyBoard pixels
  const chaoY = chao.y;

  if (flappyBirdY >= chaoY + 10) { // chao.y has a HIGH y for being at the bottom of the canvas    
    return true;
  }
  return false;
}

function fazColisaoComOTetoOuPoderaFazer(flappyBird) {
  if (flappyBird.y <= 0 + flappyBird.altura) { // chao.y has a HIGH y for being at the bottom of the canvas    
    return true;
  }
  return false;
}

function criaCanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: { // << a particular object or struct
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco: 80, // << Space between the 'canos'
    desenha() {
      canos.pares.forEach(function (par) { // << DIFFERENT foreach SYNTAX <<< PAY ATTENTION!!!
        const yRandom = -180;
        const espacamentoEntreCanos = 100;

        // [Cano do Céu]
        const canoCeuX = par.x; // << Same as canoChaoX, which is 'par.x'
        const canoCeuY = par.y; // << It is set in a position higher then the Canvas 

        contexto.drawImage(
          sprites,
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura, // << Dimensions of the 'ceu' cano on the sprite
        )

        // [Cano do Chao]
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + par.y; // << 'canos.altura' makes the canoChao dont overwrite the canoCeu, the 'espacamento' makes it give a space between
        // ^^ the both, AND the par.y makes them act like one in terms of y position
        contexto.drawImage(
          sprites,
          canos.chao.spriteX, canos.chao.spriteY,
          canos.largura, canos.altura,
          canoChaoX, canoChaoY,
          canos.largura, canos.altura, // << Dimensions of the 'ceu' cano on the sprite
        )

        par.canoCeu = { // << 'canoCeu.y' IS THE ONLY REASON WHY WE NEED THESE TWO OBJECTS IN THE FIRST PLACE, they will be used in the 'temColisaoComOFlappyBird method
          x: canoCeuX, // << It will receive the 'par.x' itself just as the 'canoChaoX' had already done before
          y: canoCeuY + canos.altura // << IMPORTANT!!! We need to sum up the 'canos.altura' because canoCeuY begins ABOVE of the canvas position, being a negative value set by 'atualiza()' 
        }
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY
        }
      })
    },
    temColisaoComOFlappyBird(par) { // << Beyond cheking if the flappy has crossed the cano x number, we need to check if his head and feet have done the same
      const cabecaDoFlappy = globais.flappyBird.y; // << flappyBird.y is the point where the head begins to be drawn
      const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura; // << When we add a value to the y we're getting down in the canvas

      if (globais.flappyBird.x >= (par.x - globais.flappyBird.largura) + 8 && globais.flappyBird.x <= par.x + (globais.canos.largura - 5)) { // << I've made reversed way and it works
        if (cabecaDoFlappy <= par.canoCeu.y - 5) {
          return true;
        }
        if (peDoFlappy >= par.canoChao.y + 5) { // << As long as the flappyBird y value increases, we get DOWN and DOWN in the canvas                 
          return true;
        }
      }
      return false;
    },
    pares: [],
    atualiza() {
      const passou100Frames = frames % 100 === 0; // << Different SYNTAX ... The '===' will turn the 'passou100Frames' variable from double into a boolean
      if (passou100Frames) {
        canos.pares.push({ // << INTERESTING SYNTAX!!!
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        }); // << Pay atention to this SYNTAX
      }

      canos.pares.forEach(function (par) {
        par.x = par.x - 2; // << IT CREATES A SPACE BETWEEN THE 'canos'!!!

        if (canos.temColisaoComOFlappyBird(par)) {
          console.log('Você perdeu!');
          gameOver = true; // << Not used yet
          som_GameLevel.pause();
          som_HIT.play();

          gameScore = globais.placar.pontuacao;
          mudaParaTela(Telas.GAME_OVER); // << Reseting the game
          setTimeout(() => {
            som_GameOver.play();
          }, 250);
        }
        // << DELETING THE GONE 'canos' BELLOW
        if (par.x <= 0 - canos.largura) { // << I'VE MADE IT DIFFERENT, BUT IT WORKS AND I PREFFER THIS WAY
          canos.pares.shift(); // << INTERESTING!!! The shift method removes the first array element, which fits properly in this situation
        }
      });
    }
  }
  return canos;
}

function criaFlappyBird() { // << Like a constructor, now we can create a pre design object as it was a class object
  const flappyBird = { // << IMPORTANT!!! flappyBird is a const, but I still can change its attributes/properties values
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 30,
    y: 120,
    pulo: 4.6,
    gravidade: 0.25,
    velocidade: 0,

    pula() {
      if (!fazColisaoComOTetoOuPoderaFazer(this)) {
        som_PULO.play();
        flappyBird.velocidade = - flappyBird.pulo;  // << Making the flappyBird receive a negative speed          
      }
    },

    atualiza() {
      if (fazColisaoComOChao(flappyBird, globais.chao)) {
        console.log('Colidiu com o chao');
        if (!isThereAChaoColisionSong) {
          gameOver = true;
          som_GameLevel.pause();
          som_HIT.play();
          isThereAChaoColisionSong = true;
        }
        setTimeout(() => {
          gameScore = globais.placar.pontuacao;
          mudaParaTela(Telas.GAME_OVER);
        }, 200);       // << Is it how similar to sleep?
        setTimeout(() => {
          som_GameOver.play();
        }, 250);
        return;
      }

      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade; // << Gravity effect on the speed
      flappyBird.y = flappyBird.y + flappyBird.velocidade; // << Speed effect on the flappyBird y position           
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
      const passouOIntervalo = frames % intervaloDeFrames === 0; // << this 'frames' and 'frameAtual' are NOT the same thing

      if (passouOIntervalo) {
        const baseDoIncremento = 1;
        const incremento = flappyBird.frameAtual + baseDoIncremento; // << Simple: base value + increment value
        const totalMovements = flappyBird.movimentos.length; // << Getting the array of positions 'movimentos' size    
        flappyBird.frameAtual = incremento % totalMovements; // << Making the frameAtual get to 0 again (when the remainder of incremento div by totalM is 0) by updating it
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

function criaPlacar() {
  const placar = {
    pontuacao: 0,
    desenha() {
      contexto.font = '35px "VT323"';
      contexto.textAlign = 'right';
      contexto.fillStyle = '#f4ae00';
      contexto.fillText(`Score: ${placar.pontuacao}`, canvas.width - 10, 35); // << Look back to this SYNTAX
    },
    atualiza() {
      const intervaloDeFrames = 10;
      const passouOIntervalo = frames % intervaloDeFrames === 0; // << this 'frames' and 'frameAtual' are NOT the same thing ... WHY DOES CONST WORK HERE?

      if (passouOIntervalo && !fazColisaoComOChao(globais.flappyBird, globais.chao)) {
        placar.pontuacao = placar.pontuacao + 1;
      }
    }
  }
  return placar;
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
  x: (canvas.width / 2) - 174 / 2, // << Puting the painel on the canvas's center
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

/// [GAME_OVER]
const mensagemGameOver = {
  sX: 134,
  sY: 153,
  w: 226,
  h: 200,
  x: (canvas.width / 2) - 226 / 2, // << Puting the painel on the canvas's center
  y: (canvas.height / 2) - (200 / 2), // << IMPORTANT!!! 'canvas.height / 2' will give us the y center position, as the '200 / 2' will give picture center
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGameOver.sX, mensagemGameOver.sY,
      mensagemGameOver.w, mensagemGameOver.h,
      mensagemGameOver.x, mensagemGameOver.y,
      mensagemGameOver.w, mensagemGameOver.h,
    )
  },
  atualiza() {
    contexto.font = '28px "VT323"',
      contexto.textAlign = 'center',
      contexto.fillStyle = '#f4ae00',
      contexto.fillText(gameScore, canvas.width - 90, 236) // << Look back to this SYNTAX
  }
}

//
// [Telas]
//
function mudaParaTela(novaTela) {
  telaAtiva = novaTela; // << Javascript will automaticly guess the type

  if (telaAtiva.inicializa) { // << It checks IF the telaAtiva has a 'inicializa' attribute
    telaAtiva.inicializa(); // << kkkk tava apenas 'inicializa();'
  }
}

const Telas = {
  INICIO: {
    inicializa() {
      whichTela = 0,
        gameScore = 0;
      gameOver = false;
      isThereAChaoColisionSong = false;
      globais.flappyBird = criaFlappyBird(); // << CREATING A globais ATTRIBUTE 'flappyBird' IN RUN TIME
      globais.chao = criaChao();
      globais.canos = criaCanos();
    },
    desenha() {
      planoDeFundo.desenha(); // << WONDERFUL -> CHANGING THE 'desenha' METHOD CALL ORDER MAKE A PICTURE FROM THE SPRITE OVERRIDE ANOTHER      
      globais.chao.desenha();

      mensagemGetReady.desenha();
      globais.flappyBird.desenha(); // << flappyBird maximum drawing priority
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {
      globais.chao.atualiza(); // << Its necessary to update the chao, because its moving      
    },
  }
};

Telas.JOGO = { // << Declaring a Telas attribute (JOGO) in runtime, AFTER the Telas main declaration  
  inicializa() {
    whichTela = 1,
      som_GameLevel.play();
    globais.placar = criaPlacar();
    globais.flappyBird.pula();
  },
  desenha() {
    planoDeFundo.desenha(); // << WONDERFUL -> CHANGING THE 'desenha' METHOD CALL ORDER MAKE A PICTURE FROM THE SPRITE OVERRIDE ANOTHER
    globais.canos.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha(); // << flappyBird maximum drawing priority
    globais.placar.desenha();
  },
  click() {
    globais.flappyBird.pula(); // << 'pula' method returns the final time                       
  },
  atualiza() {
    globais.canos.atualiza();
    globais.chao.atualiza();
    globais.flappyBird.atualiza();
    globais.placar.atualiza();
  },
};

Telas.GAME_OVER = {
  desenha() {
    whichTela = 2,
    planoDeFundo.desenha(); // << WONDERFUL -> CHANGING THE 'desenha' METHOD CALL ORDER MAKE A PICTURE FROM THE SPRITE OVERRIDE ANOTHER
    globais.canos.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha(); // << flappyBird maximum drawing priority     
    mensagemGameOver.desenha();
  },
  atualiza() {
    mensagemGameOver.atualiza();
  },
  click() {
    whichTela = 0;
    mudaParaTela(Telas.INICIO);
  }
};

window.addEventListener('click', function () {
  if (telaAtiva.click) { // << Does it check IF telaAtiva has the function or property click?          
    telaAtiva.click();
  }
});

function loop() {

  telaAtiva.desenha();
  telaAtiva.atualiza(); // << telaAtiva has received the Telas object

  if (whichTela < 2) { // << I needed to do so because the 'Telas.GAMES_OVER' does not initiate the flappyBird with the criaFlappyBird() method
    if (frames % 12 == 0) {
      idleFlappyBird();
    }
  }

  frames++;
  requestAnimationFrame(loop); // << It makes a loop() function callback  
}

mudaParaTela(Telas.INICIO);
loop(); // << First loop call