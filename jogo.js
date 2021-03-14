
let frames = 0;
let isThereAChaoColisionSong = false;
let createdScore = false;
let whichTela = 0;
let gameScore = 0;
let gameOver = false;

let firstFlag = false;
let secondFlag = false;

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
sprites.src = './assets/sprites.png';

const NewSprites = new Image(); // << look back to it
NewSprites.src = './assets/NewSprites.png';

const canvas = document.querySelector('canvas'); // << Picking up the 'canvas' object
const contexto = canvas.getContext('2d');


// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 276,
  altura: 176,
  x: 0,
  y: canvas.height - 204, // << We subtract the 'altura' value from canvas.height
  desenha() {
    contexto.fillStyle = '#e158a0';
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
  atualiza() {

    let movimentoDoPF = 0;

    if (gameScore <= 100) {
      movimentoDoPF = 1;
    }

    else if (gameScore > 100 && gameScore <= 300 && firstFlag) { // << THE else if order DOES matter here!!!
      movimentoDoPF = 2;
    }
    else if (gameScore > 100 && gameScore <= 300) {
      movimentoDoPF = 1;
    }

    else if (gameScore > 300 && secondFlag) {
      movimentoDoPF = 3;
    }
    else if (gameScore > 300) {
      movimentoDoPF = 2;
    }

    const movimentacao = planoDeFundo.x - movimentoDoPF;
    const deveRepetirNaMetade = planoDeFundo.largura / 2;
    planoDeFundo.x = movimentacao % deveRepetirNaMetade;  // << INTERESTING, once we are incrementing or decremeting a value (chao.x) that receives the remainder
    // ^^ of a division in which the denomitor is greater than nominator 
    // ^^ the remainder will never overtake this numerator value!!!
    // ^^ Since the remainder of a division of one number by ITSELF is 0
    // ^^ Whenever chao.x gets 0, it will have the 0 value in the next time the atualiza() function is called   
    // ^^ OBS: the remainder of a division in which the denomitor is greater than nominator will ALWAYS be the NOMINATOR ITSELF!!!
  }
};

// [Chao]
function criaChao() {
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 320,
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
      ),
        contexto.drawImage(
          sprites,
          chao.spriteX, chao.spriteY,
          chao.largura, chao.altura,
          (chao.x + chao.largura), chao.y, // << To complete chao after the first chao being ended
          chao.largura, chao.altura,
        );
    },
    atualiza() {

      let movimentoDoChao = 0;

      if (gameScore <= 100) {
        movimentoDoChao = 2;
      }

      else if (gameScore > 100 && gameScore <= 300 && firstFlag) { // << THE else if order DOES matter here!!!
        movimentoDoChao = 3;
      }
      else if (gameScore > 100 && gameScore <= 300) {
        movimentoDoChao = 2;
      }

      else if (gameScore > 300 && secondFlag) {
        movimentoDoChao = 4;
      }
      else if (gameScore > 300) {
        movimentoDoChao = 3;
      }

      const movimentacao = chao.x - movimentoDoChao;
      const deveRepetirNaMetade = chao.largura;
      chao.x = movimentacao % deveRepetirNaMetade;  // << INTERESTING, once we are incrementing or decremeting a value (chao.x) that receives the remainder
      // ^^ of a division in which the denomitor is greater than nominator 
      // ^^ the remainder will never overtake this numerator value!!!
      // ^^ Since the remainder of a division of one number by ITSELF is 0
      // ^^ Whenever chao.x gets 0, it will have the 0 value in the next time the atualiza() function is called   
      // ^^ OBS: the remainder of a division in which the denomitor is greater than nominator will ALWAYS be the NOMINATOR ITSELF!!!                                                
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
        par.canoChao = { // << 'canoChao.y' IS THE ONLY REASON WHY WE NEED THESE TWO OBJECTS IN THE FIRST PLACE, they will be used in the 'temColisaoComOFlappyBird method
          x: canoChaoX,
          y: canoChaoY // << WE DONT NEED TO CHANGE IT, BECAUSE IT ALREADY BEGGINS IN THE SIDE THAT THE FlappyBird CAN HIT
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
      if (gameScore <= 100) {
        const passou100Frames = frames % 100 === 0; // << Different SYNTAX ... The '===' will turn the 'passou100Frames' variable from double into a boolean
        if (passou100Frames) {
          canos.pares.push({ // << INTERESTING SYNTAX!!!
            x: canvas.width,
            y: -175 * (Math.random() + 1),
            frameAtPush: frames,
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
          if (par.x <= 0 - (canos.largura + 3000)) { // << I'VE MADE IT DIFFERENT, BUT IT WORKS AND I PREFFER THIS WAY
            canos.pares.shift(); // << INTERESTING!!! The shift method removes the first array element, which fits properly in this situation
          }
        });
      }
      else if (gameScore > 100 && gameScore <= 300) {
        const passou100Frames = frames % 73 === 0; // << Different SYNTAX ... The '===' will turn the 'passou100Frames' variable from double into a boolean  
        const thatInterval = 100;

        if (passou100Frames) {
          let isItTrue = frames >= this.pares[this.pares.length - 1].frameAtPush + thatInterval || firstFlag == true;
          console.log('Is it true: ', isItTrue);
          if (isItTrue) {
            firstFlag = true,

              canos.pares.push({ // << INTERESTING SYNTAX!!!
                x: canvas.width,
                y: -175 * (Math.random() + 1),
                frameAtPush: frames,
              }); // << Pay atention to this SYNTAX            
          }
        }

        canos.pares.forEach(function (par) {

          if (firstFlag) {
            par.x = par.x - 3; // << IT CREATES A SPACE BETWEEN THE 'canos'!!!
          }
          else {
            par.x = par.x - 2; // << IT CREATES A SPACE BETWEEN THE 'canos'!!!
          }

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
          if (par.x <= 0 - (canos.largura + 3000)) { // << I'VE MADE IT DIFFERENT, BUT IT WORKS AND I PREFFER THIS WAY
            canos.pares.shift(); // << INTERESTING!!! The shift method removes the first array element, which fits properly in this situation
          }
        });
      }
      else {
        const passou100Frames = frames % 60 === 0; // << Different SYNTAX ... The '===' will turn the 'passou100Frames' variable from double into a boolean        
        const thatInterval = 100;

        if (passou100Frames) {
          if (frames >= this.pares[this.pares.length - 1].frameAtPush + thatInterval || secondFlag == true) {
            secondFlag = true,

              canos.pares.push({ // << INTERESTING SYNTAX!!!
                x: canvas.width,
                y: -175 * (Math.random() + 1),
                frameAtPush: frames,
              }); // << Pay atention to this SYNTAX
          }
        }

        canos.pares.forEach(function (par) {

          if (secondFlag) {
            par.x = par.x - 4; // << IT CREATES A SPACE BETWEEN THE 'canos'!!!
          }
          else {
            par.x = par.x - 3; // << IT CREATES A SPACE BETWEEN THE 'canos'!!!
          }

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
          if (par.x <= 0 - (canos.largura + 3000)) { // << I'VE MADE IT DIFFERENT, BUT IT WORKS AND I PREFFER THIS WAY
            canos.pares.shift(); // << INTERESTING!!! The shift method removes the first array element, which fits properly in this situation
          }
        });
      }
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

function criaPlacar() { // << Is it necessary to be a function?
  const placar = {
    pontuacao: 0,
    desenha() {
      contexto.font = '35px "VT323"';
      contexto.textAlign = 'right';
      contexto.fillStyle = '#f4ae00';
      contexto.fillText(`Score: ${placar.pontuacao}`, canvas.width - 10, 35); // << Look back to this SYNTAX
    },
    atualiza() {
      const intervaloDeFrames = 10; // << SCORE
      const passouOIntervalo = frames % intervaloDeFrames === 0; // << this 'frames' and 'frameAtual' are NOT the same thing ... WHY DOES CONST WORK HERE?

      if (passouOIntervalo && !fazColisaoComOChao(globais.flappyBird, globais.chao)) {
        if (gameScore <= 100) {
          placar.pontuacao = placar.pontuacao + 1;
          gameScore = placar.pontuacao;
        }
        else if (gameScore > 100 && gameScore <= 300) {
          placar.pontuacao = placar.pontuacao + (1 * 2);
          gameScore = placar.pontuacao;
        }
        else {
          placar.pontuacao = placar.pontuacao + (1 * 3);
          gameScore = placar.pontuacao;
        }
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

// [Coins]
const Coins = {
  spriteX: 0,
  spriteY: 124, // Golden coin position
  largura: 44,
  altura: 44,
  x: ((canvas.width / 2) - 226 / 2) + 27,
  y: ((canvas.height / 2) - (200 / 2)) + 87,
  desenha() {

    if (gameScore <= 200) {
      contexto.drawImage(
        NewSprites,
        48, 124,
        Coins.largura, Coins.largura, // << It doesnt matter if whether I use 'largura' or 'altura' because this picture is a square
        Coins.x, Coins.y,
        Coins.largura, Coins.largura,
      );
    }
    else if (gameScore > 200 && gameScore <= 400) {
      contexto.drawImage(
        NewSprites,
        48, 78,
        Coins.altura, Coins.altura, // << It doesnt matter if whether I use 'largura' or 'altura' because this picture is a square
        Coins.x, Coins.y,
        Coins.altura, Coins.altura,
      );
    }
    else {
      contexto.drawImage(
        NewSprites,
        Coins.spriteX, Coins.spriteY,
        Coins.largura, Coins.altura, // << It doesnt matter if whether I use 'largura' or 'altura' because this picture is a square
        Coins.x, Coins.y,
        Coins.largura, Coins.altura,
      );
    }
  },
};

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
    ),
      Coins.desenha();
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
    },
  }
};

Telas.JOGO = { // << Declaring a Telas attribute (JOGO) in runtime, AFTER the Telas main declaration  
  inicializa() {
    whichTela = 1,
      som_GameLevel.play();
    globais.placar = criaPlacar();
    globais.flappyBird.pula();

    firstFlag = false;
    secondFlag = false;
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
    planoDeFundo.atualiza();
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