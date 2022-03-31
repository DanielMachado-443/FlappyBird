<div align="center">  
  <h1>Daniel Machado</h1>
</div>

<p align="center">
  Daniel Machado FlappyBird
</p>

---

## Description

- This is my own version of the famous game FlappyBird, which has a score system, a nice group of assets and good mechanics that can be personalized.

## How to start

- In order to see and play the game you got to have installed the Visual Studio Code. Once you got this, all you have to do is to make sure that you already have the live server plugin. Now, just search for the 'index.html' file, right-click on it and then click on 'open with Live Server'.

## About the game source code

- As we can see, to make up this game we've used a JavaScript 'canvas' object and two .png sprites files, containing all the assets we've got to pick afterwards on the code.

<a title="Daniel Machado FlappyBird">
  <img src="https://i.imgur.com/nxiOKMf.png"/>
</a>
 
- This one (below) is an interesting method, which contains all the FlappyBird information, as the sprite coordinates, the height and width, jump values, speed and gravity, by changing it you can modify much of the game mechanics.

<a title="Daniel Machado FlappyBird">
  <img src="https://i.imgur.com/XwBdD6O.png"/>
</a>

- In the red rectangle we see an array with the different versions of FlappyBird, like FlappyBird high wings, medium wings and low wings. These versions will be used to simulate the FlappyBird movement while they're alternating over a certain rate following the main frame in the game loop. In the green rectangle we see the logics that implement the frequency in which the FlappyBird will visually shake it's wings. Lastly, we have the brown rectangle, where we override the sprite FlappyBird coordinates with the actual FlappyBird state (high, medium or low wings).

<a title="Daniel Machado FlappyBird">
  <img src="https://i.imgur.com/olOzY2D.png"/>
</a>

- Then we have the game's main loop first call (red rectangle) of the main loop (green rectangle), which will always call the draw and update methods of any object in the canvas.

<a title="Daniel Machado FlappyBird">
  <img src="https://i.imgur.com/lIqIZar.png"/>
</a>

- And that is the game logics main object called 'Telas.Jogo', which contains the start (inicializa), draw (desenha), click and update (atualiza) methods. 

<a title="Daniel Machado FlappyBird">
  <img src="https://i.imgur.com/U4kPB3W.png"/>
</a>

## TODO

- You can use your imagination and creativity to improve and change the game. It'd be wonderful to see how it evolves. Please, share your version with me.