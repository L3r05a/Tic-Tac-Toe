
//GAMEBOARD IIFE object maker
const gameboard = (function() {
    
//gameboard array
let board = Array(9).fill(null);

return {

    //methods 

    //Access board
    getBoard() {return board;},

    //replaces tile with player sign by index
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

    //initiate turn
    let turn = 0;

    //initiaye gameOver flag
    let gameOver = false;

    //initiate players array
    let players = [];

    //win combo arrays by 0 index
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

    //received player names from UI
    setPlayers(name1, name2) {

        const player1 =  player (name1, 'X');
        const player2 = player(name2, 'O');

        return players = [player1, player2]

    },

    getPlayers() {
        return players;
    },

    //Newgame method
    newGame() {

    //call reset of board
    gameboard.resetBoard();

    //reset flags and turn

    gameOver = false;
    turn = 0;

    //debug players/turn
    return {players, turn}

    },
    //controller guard for players check 
    isReady(){
        
    if(this.getPlayers().lenght === 2)

    return true
    },

    //checkWin method
    checkWin(currentSign) {

    //assign current board to variable
    const curBoard = gameboard.getBoard();
    
    // if any of the winState patterns
    return  winStates.some(pattern => {

        //deconstructed
        const[a,b,c] = pattern;

        //return true to this pattern/playerSing equality test
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
    
    //guard against DOM clicks before players names
   if(players.length === 0) {
    return {    
            gameOver: true,
            result: null,
            won: false,
            tie: false,
            turn, 
            players,
        };}

    // gameover check variable
    if(gameOver){
    return {
            gameOver: true,
            result: null,
            won: false,
            tie: false,
            turn, 
            players,
        };
    }


    //initialise result variable
    let result =  null;

    //initialise checkWin and CheckTie related status variables
    let won = false;
    let tie = false;


    //proceeds with move
    //calls modifyBoard (tile, current player sign) 
    result = gameboard.modifyBoard(tile, players[turn].playerSign);


    //if move OK 
    if (result.success){

    //calls checkWin with current sign
    won = this.checkWin(players[turn].playerSign);
    
    //calls checkTie IF no winner
    tie = !won && this.checkTie();
    
    //sets variable and returns if won or tie
    if(won || tie){
        gameOver = true;
        return {gameOver : true,
                turn,
                result,
                players,
                won,
                tie

    }};


    // if not won or tie, increase turn
    if (!won && !tie) {
        turn  ++};

    //if turn is same as players[]lenght, reset turn
    if (turn === players.length){
        turn = 0 ;}
    }
    
    // turn, result, players, won, tie object 
    return {gameOver: false,
            turn,
            result,
            players,
            won,
            tie};
                
    //playerMove ends            
    },

    
//main return end
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

//re/start button
const start = document.querySelector('.startButton');

//main grid 
const grid = document.querySelector('.boardGrid');

//all tiles selector
const tiles = document.querySelectorAll('.tile');

//status display selector
const display = document.querySelector('.statusDisplay');

//prompt display 
const prompt = document.querySelector('.promptDisplay');
prompt.textContent = 'Enter Player 1 Name';

//players names entry form 
const form = document.querySelector('form');

//players name entry inout
const input = document.querySelector('input');


//listeners


//Initial display game prompt
start.addEventListener("click", function(){
    
if(!gameController.getPlayers().length){

    return};
  
    if (gameController.getPlayers().length){
    //newGame call
    gameController.newGame(); 
    
    //reset tile UI
    tiles.forEach((element) => element.textContent='');
    
    //reset status display
    display.textContent="";
    
    //begin  text prompt
    prompt.textContent ='Place your mark';

    };

});

    
//players name entry listener and logic
form.addEventListener('submit', function(event){

    event.preventDefault();
    
    if (nameStage === 0){
    name1 = input.value;
    prompt.textContent = '';
    
    prompt.append("Enter Player 2 Name")
    input.value = '';
    nameStage ++;
    // console.log(nameStage)
    return};

    if (nameStage === 1){
    name2 = input.value;
    gameController.setPlayers(name1, name2);
    form.remove();
    prompt.textContent ='Place your mark'};
});
    

//listener for each clicked tile element
tiles.forEach((element, index)=>{
    element.addEventListener('click', () =>{


    // //guards if no players are named
    // if(!gameController.isReady()
    // ) return;

    //call playerMove with the index of the tile
    const moveData = gameController.playerMove(index);
    console.log(moveData)
    


    //if gameOver & result is not null(legit winning move)
    if(moveData.gameOver && !moveData.result){
        return
    };

    //if move legit...
    if(moveData.result && moveData.result.success){

    //1) resets display
    prompt.textContent='';

    //2) render tile with board turn player sign
    element.append(moveData.result.board[index]);
    };


    //TIE UI Message
    if (moveData.tie === true){
        display.append(`Tie! The only winning move is not to play Dr Faulkner`);
        
    };
    //WON UI message
    if(moveData.won === true)
    {
    display.append(`${moveData.players[moveData.turn].playerName} Wins!`);

        if (moveData.gameOver){
          return
    };
    
    };



    })
})



})();