import random
from mcts import MCTS
winRule = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
            ]

score = {'o':1, 'x':-1, 'draw':0}
anotherPlayer = {'x':'o', 'o':'x'}

class Game:
    def __init__(self, gameState):
        self.gameState = gameState 

    @property
    def availableMoves(self):
        avaMoves = []
        for i in range(9):
            if self.gameState[i] == "":
                avaMoves.append(i)
        return avaMoves

    def printGame(self):
        template = ''
        for i in range(9):
            if self.gameState[i] != "":
                template += f"| {self.gameState[i]} |"
            else:template += '|   |'
            if i % 3 == 2:
                template += '\n'
        print(template)

    def addState(self, moveId, player):
        self.gameState[moveId] = player.name

    def removeState(self, moveId):
        self.gameState[moveId] = ""

    def isFinished(self, player):
        count = 0
        for i in range(9):
            if self.gameState[i] != "": count += 1
        if count < 5: return ""

        for rule in winRule:
            win = True
            for eachElement in rule:
                if self.gameState[eachElement] != player.name:
                    win = False
                    break
            if win:break
        if win: return player.name
        
        if count == 9: return 'draw'
        return ""    

class Player:
    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return self.name

    def makeMove(self, game):
        pass


class Human(Player):
    def __init__(self, name):
        super().__init__(name)
        super().__repr__()

    def makeMove(self, game):
        template = f"Available moves are : {game.availableMoves}\nChoose from 0 - 8 : \t"
        while True:
            moveId = int(input(template))
            if moveId in game.availableMoves: return moveId
            else: print("The Move is not valid.\n")


class Robot(Player):
    def __init__(self, name):
        super().__init__(name)
        super().__repr__()

    @staticmethod
    def randomMove(game):
        print("\n\nRobot is Making a Move\n")
        return random.choice(game.availableMoves)

    def minMaxMove(self, game):
        avaMoves = game.availableMoves

        bestValue = -1000
        bestMove = random.choice(avaMoves)

        for move in avaMoves:
            game.addState(move, robot)
            value = self.minmax(game, False)
            game.removeState(move)
            if value > bestValue:
                bestValue = value
                bestMove = move

        return bestMove

    def minmax(self, game, maxPlayer):
        player = human
        if maxPlayer: player = robot

        isGame_ = game.isFinished(switchPlayer(player))
        if isGame_ != "": return score[isGame_]

        avaMoves = game.availableMoves

        if maxPlayer:
            bestValue = -1000
            for move in avaMoves:
                game.addState(move, player)
                value = self.minmax(game, False)
                game.removeState(move)
                bestValue = max(value, bestValue)
            return bestValue

        else:
            bestValue = 1000
            for move in avaMoves:
                game.addState(move, player)
                value = self.minmax(game, True)
                game.removeState(move)

                bestValue = min(value, bestValue)
            return bestValue

    def makeMove(self, game):
        mcts = MCTS(game, robot)
        result_node = mcts.run(iterations=1000)
        bestUCB = -1000
        bestMove = self.randomMove(game)
        for child_node in result_node.childNodes:
            if child_node.UCB > bestUCB:
                bestMove = child_node.move
                bestUCB = child_node.UCB
        return bestMove


def switchPlayer(current_player):
    if current_player.name == 'x': return robot
    return human


human = Human('x')
robot = Robot('o')
game = Game(['', '', '', '', '', '', '', '', ''])
current_player = human
isGame = game.isFinished(current_player)
game.printGame()

while isGame == "":
    moveId = current_player.makeMove(game)
    game.addState(moveId, current_player)
    game.printGame()
    
    isGame = game.isFinished(current_player)
    current_player = switchPlayer(current_player)

print(isGame)