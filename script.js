//Gameboard IIFE object maker
const gameboard = (function() {
    
    //gameboard array
    let board = [1,2,3,4,5,6,7,8,9];

    //methods 

    //Access board
    return {
        getBoard() {return board;},

        //Removes tile by index
        modifyBoard(tile) { 
            let index = board.indexOf(tile);
            //validates and cuts
            if (index >-1) {
            board.splice (index,1);
            

            //returns Success/Fail + player and tile in an obj
            return {success:true, tile}}
            else {return {success: false, reason: 'taken',  tile}}
        },
        
        //reset Board
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

         //default players to variables
            const player1 = player('player1', "x", []);       
                
            const player2 = player('player2', "o", []);

        //players array for turn rotation
            let players = [player1, player2];

        //initiate turn
            let turn = 0;


        //Winning conditions
            const winStates = [

            [1,2,3] , [4,5,6] , [7,8,9],//horizontal win  
            [1,4,7], [2,5,8], [3,6,9], //vertical win 
            [1,5,9], [3,5,7] //diagonal win 

            ];

        //Winning state flag
        let gameWon = false;
        //Tied game flag;
        let gameTied = false

        

        return {

        //Newgame method
        newGame() {

            //call reset of board
            gameboard.resetBoard();

          
            //reset turns
            turn = 0;

            //debug players/turn
            return {players, turn}

        },



        //feeds player{} and tile number
        playerMove (tile) {
            
            //assigns return of move to result variable 
            let result = gameboard.modifyBoard(tile);

            //if move OK 
             if (result.success === true){

            //place tile in player moves array
            players[turn].playerMoves.push(tile)};



    //Check for Win
        
    //current players accumulated tiles
    const currentMoves = players[turn].playerMoves;

    //(outer) loop over winstates
    for (let i = 0; i < winStates.length; i++) {

        //stores single array item in 'pattern'
        const pattern = winStates[i];

        //creates 'is match' set to true
        let isMatch = true;

        //(INNER)loop over each item in pattern
        for (let j=0; j < pattern.length; j++) {

            //stores single array item (single value) in 'number'
            const number = pattern[j];

        //if 'currentMoves' does not include 'number'
            if (!currentMoves.includes(number)){
                isMatch = false;
                break;
            }

        }
        //if currentMoves includes all 'number's
        if (isMatch){
            console.log('Winner!');
            gameWon = true;
            break
        }
    };

    //check for TIE

    //create total elements variable
   const totalElements = player1.playerMoves.length + player2.playerMoves.length;



   if (totalElements === 9 && gameWon != true) {
    console.log('TIE!');
    gameTied = true;
   }

                //increase turn
             turn  ++;


            //if turn is same as lenght, reset
             if (turn == players.length){
                turn = 0 ;}



            //debug turn/result/players
            return {turn, result, players}
            
            
        }


    }

})();

    





// define tie states
// if the total number of selected tiles is = 9
// and there is no winner, game is tied. 




//Display/DOM Object
//renders board
//renders players selected tiles
//displays players names
//start/restart button
// displays score

