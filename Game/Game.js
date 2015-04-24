var Game = {
    init: function () {
        this.stage = new Kinetic.Stage({
            container: container,
            width: 1024,
            height: 768,
        });

        this.uiLayer = new Kinetic.Layer();

        this.player1 = new Player(1, "Player");
        this.player2 = new Player(2, "Computer");

        this.player1.isTurn = true;

        this.board = new Board('container', this.stage);
        this.board.initCross();

        this.renderUI();
    },
    renderUI: function () {
        this.player1Text = this.renderText(this.player1.name, this.player1.isTurn, 30, 15);
        this.player2Text = this.renderText(this.player2.name, this.player2.isTurn, 30, 75);

        this.player1ScoreText = this.renderText(this.player1.score, false, 30, 45);
        this.player2ScoreText = this.renderText(this.player2.score, false, 30, 105);

        this.stage.add(this.uiLayer);
    },
    updateUI: function() {
        this.player1Text.setFontStyle(this.player1.isTurn ? "bold" : "");
        this.player2Text.setFontStyle(this.player2.isTurn ? "bold" : "");

        this.player1ScoreText.setText(this.player1.score);
        this.player2ScoreText.setText(this.player2.score);

        this.uiLayer.draw();
    },
    takeTurn: function () {
        if (this.player1.isTurn) {
            this.player1.score++;
           
            if (this.player1.turnCallback)
                this.player1.turnCallback(this.player1);
        }
        else if (this.player2.isTurn) {
            this.player2.score++;

            if (this.player2.turnCallback)
                this.player2.turnCallback(this.player2);
        }

        this.player1.toggleTurn();
        this.player2.toggleTurn();

        this.updateUI();
    },
    untakeTurn: function () {
        if (this.player1.isTurn)
            this.player2.score--
        else if (this.player2.isTurn)
            this.player1.score--

        this.player1.toggleTurn();
        this.player2.toggleTurn();

        this.updateUI();
    },
    renderText: function (name, bold, x, y) {
        var simpleText = new Kinetic.Text({
            x: x,
            y: y,
            text: name,
            fontSize: 30,
            fontFamily: 'Calibri',
            fontStyle: bold ? "bold" : "",
            fill: '#4B78DB'
        });

        this.uiLayer.add(simpleText);

        return simpleText;
    },
    /* PUBLIC METHODS - ALL METHODS LISTED HERE CAN BE ACCESSED ANYWHERE ELSE */

    // Returns the array of pieces on the board
    getPieces: function () {
        return this.board.pieces;
    },
    // Get player 1 object
    getPlayer1: function () {
        return this.player1;
    },
    // Get player 2 object
    getPlayer2: function () {
        return this.player2;
    },
    // Bind to this event when you would like to know when a player has finished taking their turn
    bindPlayerTurnEvent: function (player, callback) {
        player.turnCallback = callback;
    },
    // Moves a src piece to a destination piece - will return the jumped piece if valid otherwise will return null
    movePiece: function (srcPiece, destPiece) {
        console.log("MovePiece = "+srcPiece.row+" , "+destPiece.row);
        this.board.selectPiece(srcPiece);
        var taken = this.board.movePiece(destPiece);

        srcPiece.deselect(this.board.pieceLayer);

        return taken;
    }
}

Game.init();