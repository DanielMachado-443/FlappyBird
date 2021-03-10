console.log('[DevSoutinho] Flappy Bird');

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

const flappyBird = {
  spriteX: 0,
  spriteY: 0,
  largura: 33,
  altura: 24,
  x: 10,
  y: 50,
  gravidade: 0.08,
  velocidade: 0,
  atualiza() {
    flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
    flappyBird.y = flappyBird.y + flappyBird.velocidade;
    console.log(flappyBird.velocidade);
  },
  desenha() {
    contexto.drawImage(
      sprites,
      flappyBird.spriteX, flappyBird.spriteY, // Sprite X, Sprite Y
      flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
      flappyBird.x, flappyBird.y,
      flappyBird.largura, flappyBird.altura,
    );
  }
}

var count = 0;
function idleFlappyBird() {
  if (count % 2) {
    flappyBird.x = flappyBird.x + 1;
    flappyBird.y = flappyBird.y - 3;
  }
  else {
    flappyBird.x = flappyBird.x - 1;
    flappyBird.y = flappyBird.y + 3;
  }
  count++
}

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
let telaAtiva = {}; // << object declared null
function mudaParaTela(novaTela) {
  telaAtiva = novaTela; // << Javascript will automaticly guess the type
}

const Telas = {
  INICIO: {
    desenha() {
      planoDeFundo.desenha();
      chao.desenha();
      flappyBird.desenha();
      mensagemGetReady.desenha();
    },
    click() {
      mudaParaTela(TelasJOGO);
    },
    atualiza() {

    }
  }
};

TelasJOGO = {
  desenha() {
    planoDeFundo.desenha();
    chao.desenha();
    flappyBird.desenha();
  },
  atualiza() {
    flappyBird.atualiza();
  }
}

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

let mousePos = {}; // << Picking up the mouse position
window.onmousemove = logMouseMove; // << like a c# delegate?  <<< REVIEW THAT LATTER
function logMouseMove(e) {  
	mousePos = { x: e.clientX, y: e.clientY };  	
}

window.addEventListener('click', function () {
  if (telaAtiva.click) { // << Does it check IF telaAtiva has the function or property click?
    if(mousePos.x >= 463 && mousePos.x <= 785
      && mousePos.y >= 235 && mousePos.y <= 715){
        telaAtiva.click();       
        console.log("The mouse x position is: " + mousePos.x + " and y is: " + mousePos.y)    
      }     
  }
});

mudaParaTela(Telas.INICIO);
loop(); // << First loop call