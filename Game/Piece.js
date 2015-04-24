function Piece(board, x, y, radius, row, col, isEmpty) {
    this.x = x;
    this.y = y;
    this.row = row;
    this.col = col;
    this.radius = radius;
    this.circle = undefined;
    this.board = board;
    this.isSelected = false;
    this.isEmpty = isEmpty;
    this.selectColor = '#4B78DB';
}

// Display on stage
Piece.prototype.render = function (stage, layer) {
    this.circle = new Kinetic.Circle({
        x: this.x + 22 + stage.getWidth() / 2,
        y: this.y + 22 + 150,
        radius: this.radius,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 2
    
	
	});
//
    layer.add(this.circle);

    if (!this.isEmpty) {
        this.addBall(stage, layer);
    }
    else {
        this.removeBall(layer);
    }

    layer.draw();
}

// Highlight piece
Piece.prototype.select = function (layer) {
    this.isSelected = true;
    this.circle.fill(this.selectColor);
    layer.draw();
}

// Unhighlight piece
Piece.prototype.deselect = function (layer) {
    this.isSelected = false;
    this.circle.fill('white');
    layer.draw();
}

// Remove the ball from the game tile
Piece.prototype.removeBall = function (layer) {
    var me = this;

    me.circle.off('click');

    me.circle.on('click', function () {
        me.board.movePiece(me);
    });

    if (me.ball) {
        me.ball.destroy();
        me.ball = undefined;
    }

    this.isEmpty = true;
}

// Add a new ball to the game tile
Piece.prototype.addBall = function (stage, layer) {
    var me = this;

    me.circle.off('click');

    me.ball = new Kinetic.Circle({
        x: me.x + 22 + stage.getWidth() / 2,
        y: me.y + 22 + 150,
        radius: 15,
        fill: 'black'
    });

    layer.add(me.ball);

    me.ball.on('mousedown', function () {
        me.board.selectPiece(me);
    });

    this.isEmpty = false;
}