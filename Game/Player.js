function Player(id, name) {
    this.id = id;
    this.name = name;
    this.score = 0;
    this.isTurn = false;
}

Player.prototype.toggleTurn = function() {
    this.isTurn = !this.isTurn;
}