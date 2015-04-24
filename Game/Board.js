var Board = function (container, stage) {
    // Kinectjs vars
    this.stage = stage;
    this.pieceLayer = new Kinetic.Layer();

    // Gameplay vars
    this.selectedPiece = undefined;
    this.pieces = new Array(9);
    this.pieces[0] = new Array(9);
    this.pieces[1] = new Array(9);
    this.pieces[2] = new Array(9);
    this.pieces[3] = new Array(9);
    this.pieces[4] = new Array(9);
    this.pieces[5] = new Array(9);
    this.pieces[6] = new Array(9);
    this.pieces[7] = new Array(9);
    this.pieces[8] = new Array(9);
    var me = this;

    // History
    this.history = [];
    this.btnUndo =  document.getElementById('undo');
    this.btnUndo.onclick = function () { me.undo() };
}

Board.prototype.initCross = function () {
    this.addSlot(-65, 0, 3, 0);
    this.addSlot(-20, 0, 4, 0);
    this.addSlot(25, 0, 5, 0);

    this.addSlot(-65, 45, 3, 1);
    this.addSlot(-20, 45, 4, 1);
    this.addSlot(25, 45, 5, 1);

    this.addSlot(-65, 90, 3, 2);
    this.addSlot(-20, 90, 4, 2);
    this.addSlot(25, 90, 5, 2);

    this.addSlot(-200, 135, 0, 3);
    this.addSlot(-155, 135, 1, 3);
    this.addSlot(-110, 135, 2, 3);
    this.addSlot(-65, 135, 3, 3);
    this.addSlot(-20, 135, 4, 3);
    this.addSlot(25, 135, 5, 3);
    this.addSlot(70, 135, 6, 3);
    this.addSlot(115, 135, 7, 3);
    this.addSlot(160, 135, 8, 3);

    this.addSlot(-200, 180, 0, 4);
    this.addSlot(-155, 180, 1, 4);
    this.addSlot(-110, 180, 2, 4);
    this.addSlot(-65, 180, 3, 4);
    this.addSlot(-20, 180, 4, 4, true);
    this.addSlot(25, 180, 5, 4);
    this.addSlot(70, 180, 6, 4);
    this.addSlot(115, 180, 7, 4);
    this.addSlot(160, 180, 8, 4);

    this.addSlot(-200, 225, 0, 5);
    this.addSlot(-155, 225, 1, 5);
    this.addSlot(-110, 225, 2, 5);
    this.addSlot(-65, 225, 3, 5);
    this.addSlot(-20, 225, 4, 5);
    this.addSlot(25, 225, 5, 5);
    this.addSlot(70, 225, 6, 5);
    this.addSlot(115, 225, 7, 5);
    this.addSlot(160, 225, 8, 5);

    this.addSlot(-65, 270, 3, 6);
    this.addSlot(-20, 270, 4, 6);
    this.addSlot(25, 270, 5, 6);

    this.addSlot(-65, 315, 3, 7);
    this.addSlot(-20, 315, 4, 7);
    this.addSlot(25, 315, 5, 7);

    this.addSlot(-65, 360, 3, 8);
    this.addSlot(-20, 360, 4, 8);
    this.addSlot(25, 360, 5, 8);

    this.stage.add(this.pieceLayer);
}

// Createa a single game tile
Board.prototype.addSlot = function (x, y, col, row, state) {
    var piece = new Piece(this, x, y, 20, row, col, state);
    piece.render(this.stage, this.pieceLayer);

    this.pieces[row][col] = piece;
}

// Called when a user wants to select a game tile
Board.prototype.selectPiece = function(piece) {
    if (this.selectedPiece && !piece.isEmpty) {
        this.selectedPiece.deselect(this.pieceLayer);
    }

    this.selectedPiece = piece;
    this.selectedPiece.select(this.pieceLayer);
}

// Called when a user wants to move a ball
Board.prototype.movePiece = function (piece) {
    if (this.selectedPiece) {
        var receivedPiece = this.validateMove(this.selectedPiece, piece);
        
        //console.log("BoardMovePiece = "+this.selectedPiece.row+" , "+receivedPiece.row);

        if (receivedPiece) {
            this.selectedPiece.removeBall(this.pieceLayer);
            this.selectedPiece.deselect(this.pieceLayer);

            this.toggleUndo();
            this.history.push({ src: this.selectedPiece, dest: piece, taken: receivedPiece });

            piece.addBall(this.stage, this.pieceLayer);
            this.pieceLayer.draw();
            
            Game.takeTurn();

            this.selectedPiece = undefined;

            return receivedPiece;
        }
    }
}

// Ensures that the move a user is making is valid
// Returns the jumped piece if valid, and null if not valid
Board.prototype.validateMove = function (src, dest) {
    var angle = Math.atan2(Math.abs(src.y - dest.y), Math.abs(src.x - dest.x)) * 180 / Math.PI;

    if ((angle == 90 || angle == 0) && (Math.abs(src.col - dest.col) <= 2) && (Math.abs(src.row - dest.row) <= 2)) {
        if (src.row >= dest.row && (src.row - dest.row == 1 || src.col - dest.col == 1))
            return;

        var piece = this.pieces[Math.round((src.row + dest.row) / 2)][Math.round((src.col + dest.col) / 2)];
        
        if(piece.isEmpty)
            console.log("WTF DO YOU MEAN ITS EMPTY!");

        piece.isEmpty = false;
        if (piece.isEmpty){
            console.log("WTF DO YOU MEAN ITS EMPTY!");
            return false;
        }

        piece.removeBall(this.pieceLayer);
        
        //console.log("validate Move = "+src.row+" , "+dest.row);

        return piece;
    }
}

// Undos the previous player's turn and resets score
Board.prototype.undo = function () {
    if (this.history.length > 0) {
        var item = this.history.pop();

        item.taken.addBall(this.stage, this.pieceLayer);
        item.src.addBall(this.stage, this.pieceLayer);
        item.dest.removeBall(this.pieceLayer);

        Game.untakeTurn();

        this.toggleUndo();

        this.pieceLayer.draw();
    }
}

Board.prototype.toggleUndo = function() {
    if (this.history.length == 0) {
        if (this.btnUndo.style.display == '') {
            this.btnUndo.style.display = 'none';
        }
        else {
            this.btnUndo.style.display = '';
        }
    }
}