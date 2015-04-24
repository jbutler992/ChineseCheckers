/* Example of using the various public methods available to control the game.
 
 Note: All methods here will not interfer with the game in an unintended way. Feel
 free to add other methods, but just make sure it does not intefere with any game logic
 or you may get wierd visual results.
 */
// Getters
console.log(Game.getPlayer1());
console.log(Game.getPlayer2());

//If AI moving first
//makeMoves();

// Recieve a notification when a player has finished his/her turn
Game.bindPlayerTurnEvent(Game.getPlayer1(), function (player) {
                         console.log("====Player: " + player.name + " has taken his/her turn!");
                         //If AI moving second
                         makeMoves();
                         });
Game.bindPlayerTurnEvent(Game.getPlayer2(),function (player) {
                         console.log("====Player: " + player.name + " has taken his/her turn!");
                         //If AI moving first
                         //makeMoves();
                         });
//Function to find empty pieces off a given board
function findEmpty(board){
    //console.log("****fINDING EMPTY STARTED");
    var pieces = board;
    var emptyArray = [];
    for (var i = 0; i < pieces.length; i++){
        for (var j = 0; j < pieces[i].length; j++){
            var emptyPiece = board[i][j];
            if (emptyPiece != undefined){
                if (emptyPiece.isEmpty)
                    emptyArray.push(emptyPiece);
            }
        }
    }
    return emptyArray;
}
//Function to find number of moves off a given board
function findMoves(board){
    //console.log("$$$$FINDING MOVES STARTED");
    var emptyPieces = findEmpty(board);
    //console.log("there are a total of "+emptyPieces.length+" empty spots");
    var moves = [];
    //For all the empty spots, search for the possible L, R, U, D moves
    for(var i = 0; i < emptyPieces.length; i++){
        //Look for left moves
		var leftMove = [2];
        leftMove[0] = emptyPieces[i];
        var leftMoveCol = emptyPieces[i].col - 2;
        var leftMoveRow = emptyPieces[i].row;
        leftMoveStartPiece = board[leftMoveRow][leftMoveCol];
		var pieceToTake = board[leftMoveRow][leftMoveCol+1];
        if(leftMoveStartPiece != undefined && !pieceToTake.isEmpty) {
            if(!leftMoveStartPiece.isEmpty){
                leftMove[1] = leftMoveStartPiece;
                moves.push(leftMove);
            }
		}
        
        //Look for right moves
		var rightMove = [2];
        rightMove[0] = emptyPieces[i];
        var rightMoveCol = emptyPieces[i].col + 2;
        var rightMoveRow = emptyPieces[i].row;
        rightMoveStartPiece = board[rightMoveRow][rightMoveCol];
		var pieceToTake = board[rightMoveRow][rightMoveCol -1];
        if(rightMoveStartPiece != undefined && !pieceToTake.isEmpty) {
            if(!rightMoveStartPiece.isEmpty){
                rightMove[1] = rightMoveStartPiece;
                moves.push(rightMove);
            }
		}
        
        //Look for up moves
		var upMove = [2];
        upMove[0] = emptyPieces[i];
        var upMoveCol = emptyPieces[i].col;
        var upMoveRow = emptyPieces[i].row + 2;
        if(upMoveRow < 9 && upMoveRow > -1){
            upMoveStartPiece = board[upMoveRow][upMoveCol];
            var pieceToTake = board[upMoveRow -1][upMoveCol];
            if(upMoveStartPiece != undefined && !pieceToTake.isEmpty) {
                if(!upMoveStartPiece.isEmpty){
                    upMove[1] = upMoveStartPiece;
                    moves.push(upMove);
                }
			}
        }
        
        //Look for down moves
		var downMove = [2];
        downMove[0] = emptyPieces[i];
        var downMoveCol = emptyPieces[i].col;
        var downMoveRow = emptyPieces[i].row - 2;
        if(downMoveRow > -1 && downMoveRow < 9){
            downMoveStartPiece = board[downMoveRow][downMoveCol];
            var pieceToTake = board[downMoveRow +1][downMoveCol];
            if(downMoveStartPiece != undefined && !pieceToTake.isEmpty) {
                if(!downMoveStartPiece.isEmpty){
                    downMove[1] = downMoveStartPiece;
                    moves.push(downMove);
                }
			}
        }
    }
    //Return the array of possible moves
    return moves;
}

//Evaluation function to create min max search
function evaluation(board, depth, alpha, beta, count){
    var possibleMoves = findMoves(board);
    var posNextMoves = new Array(possibleMoves.length);
    var moveToTake = 0;
    var highestEven = 0;
	var alpha = alpha;
	var beta = beta;
    
    //for each move create a hypothetical board and emulate move by setting empty value
	for(var i = 0; i < possibleMoves.length; i++){
        //console.log("AT DEPTH: "+count+" possible move: "+i);
        var possibleBoard = board;
        var move = possibleMoves[i];
        var startColumn = move[1].col;
        var startRow = move[1].row;
        var endColumn = move[0].col;
        var endRow = move[0].row;
        var jumpedRow = startRow;
        var jumpedColumn = startColumn;
        possibleBoard[startRow][startColumn].isEmpty = true;
        possibleBoard[endRow][endColumn].isEmpty = false;
        //Up or Down move
        if(startRow - endRow != 0){
            jumpedColumn = startColumn;
            if(startRow > endRow)
                jumpedRow = startRow -1;
            else
                jumpedRow = startRow +1;
        }
        //Left Right move
        else if(startColumn - endColumn != 0){
            jumpedRow = startRow;
            if(startColumn > endColumn)
                var jumpedColumn = startColumn -1;
            else
                var jumpedColumn = startColumn +1;
        }
        
        possibleBoard[jumpedRow][jumpedColumn].isEmpty = true;
        
        //If not at final depth recursively search
        if(count < depth){
            if(count%2 != 0){//Opponents turn Checking for minimizer
                var newCount = count+1;
                posNextMoves[i] = evaluation(possibleBoard, depth, alpha, beta, newCount);
                if(posNextMoves[i] >= beta){
                    possibleBoard[jumpedRow][jumpedColumn].isEmpty = false;
                    possibleBoard[endRow][endColumn].isEmpty = true;
                    possibleBoard[startRow][startColumn].isEmpty = false;
                    //console.log("BETA CUT");
                    break;
                }
                else if(alpha < posNextMoves[i])
                    alpha = posNextMoves[i];
            }
            else if(count%2 == 0){//Our turn checking for maximizer
                var newCount = count+1;
                posNextMoves[i]=evaluation(possibleBoard, depth, alpha, beta, newCount);
                if(posNextMoves[i] <= alpha){
                    possibleBoard[jumpedRow][jumpedColumn].isEmpty = false;
                    possibleBoard[endRow][endColumn].isEmpty = true;
                    possibleBoard[startRow][startColumn].isEmpty = false;
                    //console.log("ALPHA CUT");
                    break;
                }
                else if(beta > posNextMoves[i])
                    beta = posNextMoves[i];
            }
        }
        possibleBoard[jumpedRow][jumpedColumn].isEmpty = false;
        possibleBoard[endRow][endColumn].isEmpty = true;
        possibleBoard[startRow][startColumn].isEmpty = false;
    }
	//If done with recursive search look for highest even for best move
    if(count == 0){//root
        for(var i = 0; i < possibleMoves.length; i++){
            //console.log("posNextMoves = "+posNextMoves[i]);
            if(posNextMoves[i]%2 != 0)
                continue;
            if(posNextMoves[i] > highestEven){
                highestEven = posNextMoves[i];
                //console.log("Highest Even Set to: "+highestEven);
				moveToTake = i;
            }
        }
        console.log("Move to take equals: "+moveToTake);
        return moveToTake;
    }
    //If leaf node get value of possible moves
	else if(count == depth){//leaves
		//console.log("fuck u::"+posNextMoves.length);
		return posNextMoves.length;
    }
    //If even look for beta
	else if(count%2 == 0){//min level
        for(var i = 0; i < possibleMoves.length; i++){
            //console.log("entered odd:::"+posNextMoves[i]+":::"+beta);
            if(posNextMoves[i] < beta){
                beta = posNextMoves[i];
                //console.log("beta  Set to: "+beta);
            }
		}
        return beta;
	}
	else{
        for(var i = 0; i < possibleMoves.length; i++){
            if(posNextMoves[i] > alpha){
                alpha = posNextMoves[i];
                //console.log("alphaSet to: "+alpha);
            }
        }
        return alpha;
	}
}
//Function to run evaluation of possible moves
function makeMoves(){
    console.log("^^^^MAKE MOVES STARTED");
    Game.getPlayer1().toggleTurn();
    Game.getPlayer2().toggleTurn();
    var initialBoard = Game.getPieces();
    var possibleMoves = findMoves(initialBoard);
    var moveToTake = 0;
    var count = 0;
    //Create depth bound min max
	
	var moveToTake = evaluation(initialBoard, 5, -9999, 9999, count);
	
	//Take move
    var taken = Game.movePiece(possibleMoves[moveToTake][1], possibleMoves[moveToTake][0]);
    //Log and return to player
    console.log("The piece jumped was: " + taken);
    Game.getPlayer2().toggleTurn();
    Game.getPlayer1().toggleTurn();
}