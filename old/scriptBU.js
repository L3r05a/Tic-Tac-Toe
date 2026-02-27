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
        //otherwise, current playersign replaces the index
        board[index] = playerSign;
        return {success:true, index, board};

    },
        
        //resets board
        resetBoard () {

        board = Array(9).fill(null);

        return board;

        },

    };

 
     })();

    //Players Factory

    function player(name, sign, moves) {

        const playerName = name;
        const playerSign = sign;
        const playerMoves = moves;

        return {playerName, playerSign, playerMoves}
    };



    //GAMECONTROLLER Object IIFE
    const gameController = (function(){

    //variables

    //default players to variables
    const player1 = player('player1', "X", []);       
        
    const player2 = player('player2', "0", []);

    //players array for turn rotation
    let players = [player1, player2];

    //initiate turn
    let turn = 0;

    //Winning state flag
    let gameWon = false;

    //Tied game flag;
    let gameTied = false


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

    //Newgame method
    newGame() {

    //call reset of board
    gameboard.resetBoard();

    
    //reset flags and turn
    player1.playerMoves.length = 0;
    player2.playerMoves.length = 0;
    turn = 0;
    gameWon = false;
    gameTied = false;

    //debug players/turn
    return {players, turn}

    },

    //checkWin method
    checkWin() {

    //assign current board to variable
    const curBoard = gameboard.getBoard();

    //assign current player sign to variable
    const currentSign = players[turn].playerSign;
    
    //gameWon = ANY of the Winstates patterns
    gameWon = winStates.some(pattern => {

        //deconstructed
        const[a,b,c] = pattern;

        //returns true or fase based on these tests
        return( 
            
                curBoard[a] === currentSign &&
                curBoard[b] === currentSign &&
                curBoard[c] === currentSign
            );
    }); 
    //returns current gameWon boolean
    return gameWon;
    
},
    
    checkTie() {

    //assign board to variable
    const curBoard = gameboard.getBoard();

    //checks if all tiles are not null/empty
    const boardFull = curBoard.every(i => i !== null);

    //checks if board is full AND if the game is not won
    gameTied = boardFull && !gameWon;
    
    //returns boolean
    return gameTied;
    },


    //playerMove() Method
    playerMove (tile) {

    //initialise result variable
    let result =  null;

    //initialise checkWin and CheckTie related status variables
    let won = false;
    let tie = false;
    
    //prevent further moves after win/tie
    if (gameTied || gameWon){

        return {gameOver: true,
                turn,
                result,
                won,
                tie,
        };
    }

    //calls modifyBoard (tile, current player sign) 
    result = gameboard.modifyBoard(tile, players[turn].playerSign);
    


    //if move OK 
    if (result.success){

    //calls checkWin and asplayerSigns to won
    won = this.checkWin();
    
    //calls checkTie and asplayerSigns to tied
    tie = this.checkTie();


    // if not won or tie, increase turn
    if (!won && !tie) {
        turn  ++};


    //if turn is same as players[]lenght, reset turn
    if (turn == players.length){
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

//DOM elements

//re/start button
const start = document.querySelector('.startButton');

//main grid 
const grid = document.querySelector('.boardGrid');

//all tiles selector

const tiles = document.querySelectorAll('.tile');

//status display selector
const display = document.querySelector('.statusDisplay');



//listeners

//start button

//newGame call
start.addEventListener("click", gameController.newGame);

//reset tile UI
start.addEventListener("click", function(){tiles.forEach((element) => element.innerHTML='')});

//reset display UI
start.addEventListener("click", function(){display.innerHTML=''});

//Initial display game prompt
start.addEventListener("click", function(){display.innerHTML='Place your mark'});




//listener for each clicked tile element
tiles.forEach((element, index)=>{
    element.addEventListener('click', () =>{


    //call playerMove with the index of the tile
    const moveData = gameController.playerMove(index);
    // console.log(moveData)

    //
    if (moveData.gameOver){
        return
    };

    //if move legit...
    if(moveData.result.success === true){

    //1) resets display
    display.innerHTML='';

    //2) updates tile with board turn player sign
    element.append(moveData.result.board[index]);
    };

    //TIE UI Message
    if (moveData.tie === true){
        display.append(`Tie! The only winning move is not to play Dr Faulkner`);
        
    };
    //WON UI message
    if(moveData.won === true)
    {
    display.append(`Player ${moveData.result.board[index]} Wins!`);
    
    };

    })
})



})();
//start listener to newGame()


//DOM Module

//Display/DOM Object
//renders board
//renders players selected tiles
//displays players names
//start/restart button
// displays score




//OBSOLETE

//     //current players accumulated tiles
    //     const currentMoves = players[turn].playerMoves;

    //     //(outer) iterates over winstates
    //     for (let i = 0; i < winStates.length; i++) {

    //     //stores single array item in 'pattern'
    //     const pattern = winStates[i];

    //     //creates 'is match' set to true
    //     let isMatch = true;

    //     //(INNER)iterates over each item in pattern
    //     for (let j=0; j < pattern.length; j++) {

    //     //stores single array item (single value) in 'number'
    //     const number = pattern[j];
            
    //     //if 'currentMoves' does not include 'number'
    //         if (!currentMoves.includes(number)){
    //             isMatch = false;
    //             break;
    //         }
    //     //inner loop ends
    //     };
    //     //if currentMoves includes all 'number's
    //     if (isMatch){
    //         gameWon = true;
    //         console.log('Winner!', "Won?", gameWon, "Tied?", gameTied);
    //         break
    //     };

        
    // //outloop end
    // }
    // //boolean

    //create total elements variable
        // const totalElements = player1.playerMoves.length + player2.playerMoves.length;

                //if all tiles taken and no win it's a tie
        // if (totalElements === 9 && gameWon != true) {
        //     gameTied = true;
        //     console.log('TIE!');
        // };

        //Winning conditions
    // const winStates = [

    // [1,2,3] , [4,5,6] , [7,8,9],//horizontal win  
    // [1,4,7], [2,5,8], [3,6,9], //vertical win 
    // [1,5,9], [3,5,7] //diagonal win 

    // ];

    //place tile in player moves array
    //players[turn].playerMoves.push(tile);