<div align="center">  
  <h1>Daniel Machado</h1>
</div>

<p align="center">
  Unbreakable Console Products .csv Exporter
</p>

---

## Description

- This is a weird experimental source code where I think that I've covered almost any circumstances that could lead the execution to be broken while reading the user inputs. Also, it reads and creates lists of products to be exported in a .csv format. Enjoy!

## How to start

- In order to start seeing the code, you'll need to have installed the Visual Studio with C# packages.

## About the code

- The code is made up of a scheme in which we ALWAYS have a try/catch (green arrow) inside of a while (red square), meaning that any triggered exception will be caught and will as well force the execution line to return to the beginning of the while. The blue arrows are showing us the Int32.TryParse method, which will reveal IF the written input is, at least, a string, otherwise it will trigger a personal exception that will cause the execution to be brought up the same way.
 
<a title="Winforms Product Lister">
  <img src="https://i.imgur.com/PfZy6un.png"/>
</a>


## TODO

- I think that this code is really able to be enhanced with clarity and less lines, as well as a cleaver logic to achieve the same results, feel free to do your own version of it and share that with us.