//Gameboard IIFE object maker
const gameboard = (function() {
    
//gameboard array
let board = [1,2,3,4,5,6,7,8,9];


return {

    //methods 

        //Access board
        getBoard() {return board;},

        //replaces tile with player sign by index
        modifyBoard(tile, playerSign) { 
        
        let index = board.indexOf(tile);
        //validates and cuts
        if (index >-1) {
        board.splice (index,1, playerSign );
        

        //returns Success/Fail + player and tile in an obj
        return {success:true, tile, board}}

        else {return {success: false, reason: 'taken',  tile, board}}
        },
        
        //resets board
        resetBoard () {

        return board = [1,2,3,4,5,6,7,8,9];

        }

    };

 
     })();

    //Players Factory

    function player(name, sign, moves) {

        const playerName = name;
        const playerSign = sign;
        const playerMoves = moves;

        return {playerName, playerSign, playerMoves}
    };



    //Gameplay Object IIFE
    const gameController = (function(){

    //variables

    //default players to variables
    const player1 = player('player1', "x", []);       
        
    const player2 = player('player2', "o", []);

    //players array for turn rotation
    let players = [player1, player2];

    //initiate turn
    let turn = 0;

    //Winning state flag
    let gameWon = false;

    //Tied game flag;
    let gameTied = false


    //declare possible win combo arrays by 0 index
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

    //checks if all NUMBERS are gone from board
    const boardFull = curBoard.every(i => typeof i !== 'number');

    //checks if board is numberless AND if the game is not won yet
    gameTied = boardFull && !gameWon;
    
    //returns boolean
    return gameTied;
    },


    //playerMove() Method
    playerMove (tile) {
    
    //calls modifyBoard (tile, current player sign) 
    let result = gameboard.modifyBoard(tile, players[turn].playerSign);
    
    //declare checkWin and CheckTie related status variables
    let won;
    let tie;

    //if move OK 
    if (result.success === true){

    //calls checkWin and asplayerSigns to won
    won = this.checkWin();
    
    //calls checkTie and asplayerSigns to tied
    tie = this.checkTie();

   
    //if game won or tied

    if (won) {console.log('Win!')};
    if (tie) {console.log('Tie!')};
    

    // if not won or tie, increase turn
    if (!won && !tie) {
        turn  ++};


    //if turn is same as players[]lenght, reset turn
    if (turn == players.length){
        turn = 0 ;}
    }
    
    //debug turn/result/players
    return {turn, result, players, won, tie,}
                
    //playerMove ends            
    },

    

//main return end
}
//gamecontroller ends
})();

    
 




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