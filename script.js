//GAMEBOARD IIFE object maker
const gameboard = (function() {
    
//gameboard array
let board = Array(9).fill(null);

return {

    //methods 

    //Access board
    getBoard() {return board;},

    //updates tile array with currentplayer sign
    modifyBoard(index, playerSign) { 
    
    //if the board index is not empty, return
    if (board[index] !== null){

    return {success: false, reason: 'taken', index, board}
    };

    //otherwise, playersign replaces the index
    board[index] = playerSign;
    return {success:true, reason: 'empty', index, board};

    },
        
    //resets board
    resetBoard () {

    board = Array(9).fill(null);

    return board;

    },

    };

 //end of gameboard
     })();

    //Players Factory

    function player(name, sign,) {

        const playerName = name;
        const playerSign = sign;

    return {playerName, playerSign}
};



//GAMECONTROLLER Object IIFE
const gameController = (function(){

//Variables

    //declare gameOver flag
    let gameOver = false;

    //declare players array
    let players = [];

    //declare currentPlayer(turn)
    let currentPlayer = null;

    //return helper function:
    function buildState(gameOver, result, won, tie){
        return {gameOver, result, won, tie, currentPlayer, players}
    };


    //declare win states arrays 
    const winStates = [

    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];
        
    return {

    //methods


    //update player names from UI
    setPlayers(name1, name2) {

        //call player factory 
        const player1 =  player (name1, 'X');
        const player2 = player(name2, 'O');

        //assign players to array
        players = [player1, player2];

        //sets currentplayer as the player object at index 0
        //of the players array
        currentPlayer = players[0];

        //return array of players
        return players;

    },

    //getter for isReady players length check
    getPlayers() {
        return players;
    },

    //Newgame method
    newGame() {

    //call reset of board
    gameboard.resetBoard();

    //reset flags and turn
    gameOver = false;
    //sets currentplayer as the player object at index 0
    //of the players array
    currentPlayer = players[0];

    //players/turn
    return {players, currentPlayer}

    },
    //controller guard boolean return
    isReady(){

    return players.length === 2;
    
    },

    //checkWin method
    checkWin(currentSign) {

    //assign current board to variable
    const curBoard = gameboard.getBoard();
    
    // if any of the winState patterns
    return  winStates.some(pattern => {

        //deconstructed
        const[a,b,c] = pattern;

        //return true to this pattern/player sign equality test
        return( 
            
                curBoard[a] === currentSign &&
                curBoard[b] === currentSign &&
                curBoard[c] === currentSign
            );
    }); 

    
},
    
    checkTie() {

    //assign board to variable
    const curBoard = gameboard.getBoard();

    //checks if all tiles are not null/empty
    const boardFull = curBoard.every(i => i !== null);
     
    //returns boolean
    return boardFull;
    },


    //playerMove() Method
    playerMove (tile) {
    
    //blocks controller move if no players names
   if(!gameController.isReady()) 
    return    
            buildState(true, null, false, false);

    // blocks controller move if gameover
    if(gameOver)
    return  buildState(true, null, false, false);

    //declare result variable
    let result =  null;

    //declare checkWin and CheckTie related status variables
    let won = false;
    let tie = false;


    //proceeds with move
    //calls modifyBoard (tile, current player sign) & assigns to variable
    result = gameboard.modifyBoard(tile, currentPlayer.playerSign);


    //if move OK 
    if (result.success){

    //calls checkWin with current sign
    won = this.checkWin(currentPlayer.playerSign);
    
    //calls checkTie IF no winner
    tie = !won && this.checkTie();
    
    //gameOver if won or tied
    if(won || tie){
        //updates variable
        gameOver = true;
        //gameOver, result, won, tie
        return buildState(true, result,won,tie)
                

    };

    //ternary toggle(turn)
    //is currentplayer at index 0
    currentPlayer = currentPlayer === players[0]
    //true, move to index 1
    ? players[1]
    //false move to index 0
    :players [0];

    }

    
    // gameOver, result, won, tie
    return buildState(false,
            result,
            won,
            tie,
    );
            
                
    //playerMove ends            
    },

    

}
//gamecontroller ends
})();

//DOM IIFE object
const domObj = (function(){

//variables

//name entry turn counter
let nameStage = 0;

//players name variables
let name1;
let name2;

//DOM elements

//start button
const start = document.querySelector('.startButton');

//main grid 
const grid = document.querySelector('.boardGrid');

//all tiles selector
const tiles = document.querySelectorAll('.tile');

//status display selector
const display = document.querySelector('.statusDisplay');

//prompt display 
const prompt = document.querySelector('.promptDisplay');
prompt.textContent = 'PLAYER 1';

//players names entry form 
const form = document.querySelector('form');

//players name entry inout
const input = document.querySelector('input');


//listeners


//Initial display game prompt
start.addEventListener("click", function(){
    
    //blocks DOM if 2 players not ready
    if(!gameController.isReady()
    ) return;
    
    //newGame call
    gameController.newGame(); 
    
    //resets tiles UI
    tiles.forEach((element) => element.textContent= '');
    
    //reset status display
    display.textContent= "PLACE YOUR MARK";
    
});

    
//players name form listener and logic
form.addEventListener('submit', function(event){

    //prevents default  submit reloading of page
    event.preventDefault();
    
    //first turn user name entry caching
    if (nameStage === 0){
    name1 = input.value;
    //clear prompt
    prompt.textContent = '';
    
    //prompt update
    prompt.append("PLAYER 2")
    input.value = '';
    //increase naming turn counter
    nameStage ++;
    return};
    
    //2nd user caching
    if (nameStage === 1){
    name2 = input.value;
    //call setplayers with names
    gameController.setPlayers(name1, name2);
    form.remove();
    display.textContent ='PLACE YOUR MARK'};
});
    

//listener for clicked tile elements (move)

grid.addEventListener('click', function(event){


    //declare variable for closest element to tile in the DOM
    const tile = event.target.closest('.tile');

    //if not tile 
    if(!tile) return;

    
    //gets index dataset value of clicked tile
    let index = Number(tile.dataset.index);
    
    
    //calls playerMove with tile index
    const moveData = gameController.playerMove(index);
    

    //block if gameOver & result is not null(legit winning move)
     if(moveData.gameOver && !moveData.result){
        return
    };

    //if move is legit
    if(moveData.result && moveData.result.success){

    //1) resets display
    display.textContent='';

    //2) render tile with index sign of resulted move
    tile.textContent = moveData.result.board[index];
    

    //TIE display update
    if (moveData.tie === true){
        
        display.textContent = `The only winning move is not to play.`;
        
    };
    //WON display update
    if(moveData.won === true)
    {display.textContent = `${moveData.currentPlayer.playerName} WINS!`;

    if (moveData.gameOver){
        return
    };
    
    };

    }
})
})();