// Queries
const cells = document.querySelectorAll(".cell");
const gameTag = document.querySelector(".game");
const container = document.querySelector(".container");
const winner = document.querySelector(".winner");
const nextRound = document.querySelector(".next_round")

let winRule = [
  [1, 2, 3],
  [1, 5, 9],
  [1, 4, 7],
  [3, 6, 9],
  [3, 5, 7],
  [4, 5, 6],
  [2, 5, 8],
  [7, 8, 9],
];

let scores = {'x' : -1, 'o': 1, 'draw' : 0};

const anotherPlayer = (current_player) => {
  if (current_player.name == "x") {
    return robot;
  }
  return human;
};

const handleFinish = (gameResult) => {
  gameTag.classList.add("win");
  let textContext = gameResult;
  let finishElement = document.createElement("h1");
  finishElement.textContent = textContext;
  winner.appendChild(finishElement);
};

nextRound.addEventListener('click', e=>{
  location.reload();
})

class Game {
  constructor(gameState) {
    this.gameState = gameState;
  }

  availableMoves() {
    let avaMoves = [];
    for (let i = 0; i < 9; i++) {
      if (this.gameState[i] == "") {
        avaMoves.push(i);
      }
    }
    return avaMoves;
  }

  addState(moveId, player) {
    this.gameState[moveId] = player.name;
  }

  removeState(moveId) {
    this.gameState[moveId] = "";
  }

  isFinished(player) {
    let gameResult_ = "";
    const res = winRule
      .map((rule) =>
        rule
          .map((eachCell) => this.gameState[eachCell - 1] == player.name)
          .every((res) => res == true)
      )
      .some((res) => res == true);

    if (res) {
      gameResult_ = player.name;
    } else if (this.availableMoves().length == 0) {
      gameResult_ = "draw";
    }
    return gameResult_;
  }
}

class Player {
  constructor(name) {
    this.name = name;
  }

  makeMove(game) {
    return;
  }
}

class Human extends Player {
  constructor(name) {
    super(name);
  }

  makeMove(game) {
    return;
  }
}

class Robot extends Player {
  constructor(name) {
    super(name);
  }

  randomMove(game) {
    let avaMoves = game.availableMoves();
    let moveId = Math.floor(Math.random() * avaMoves.length);
    cells[avaMoves[moveId]].click();
  }

  makeMove(game) {
    let avaMoves = game.availableMoves()
    let moveLength = avaMoves.length
    let moveId = avaMoves[Math.floor(Math.random() * moveLength)]
    // Get MoveId
    let bestValue = -1000;
    for (let i=0; i<moveLength; i++){
      game.addState(avaMoves[i], robot)
      let value = this.minMax(game, 1, false)
      game.removeState(avaMoves[i])
      if (value > bestValue){
        moveId = avaMoves[i]
        bestValue = value
      }
    }
    cells[moveId].click();
  }

  minMax(game, depth, maxPlayer){
    let player = human
    if (maxPlayer){player=robot}

    let prePlayer = anotherPlayer(player)
    let isGame_ = game.isFinished(prePlayer)
    if (isGame_ != ""){return (scores[isGame_] * (10-depth))}

    let avaMoves = game.availableMoves()
    let numAvaMoves = avaMoves.length

    if (maxPlayer){
      let bestValue = -1000
      for (let i=0; i<numAvaMoves; i++){
        game.addState(avaMoves[i], player)
        let value = this.minMax(game, depth+1, false)
        bestValue = Math.max(bestValue, value)
        game.removeState(avaMoves[i])
      }
      return bestValue;
    }
    else{
      let bestValue = 1000
      for (let i=0; i<numAvaMoves; i++){
        game.addState(avaMoves[i], player)
        let value = this.minMax(game, depth+1, true)
        bestValue = Math.min(bestValue, value)
        game.removeState(avaMoves[i])
      }
      return bestValue;
    }
  }
}

const human = new Human("x");
const robot = new Robot("o");
const game = new Game(["", "", "", "", "", "", "", "", ""]);
let current_player = human;

const clickEventHandler = (moveId) => {
  cells[moveId].classList.add(current_player.name);
  cells[moveId].classList.remove('x_hover')
  game.addState(moveId, current_player);
  isGame = game.isFinished(current_player);
  if (isGame != "") {
    console.log("The Game is Finished with : ", isGame);
    handleFinish(isGame);
  }

  current_player = anotherPlayer(current_player);
  if (current_player.name == "o") {
    robot.makeMove(game);
  }
};

const clickHandler = (event) => {
  let moveId = event.target.id;
  clickEventHandler(moveId);
};

cells.forEach((cell) => {
  cell.addEventListener("click", clickHandler, { once: true });
});
