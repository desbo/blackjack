'use strict';

export {Deck, Player, Dealer};

var suits = {
  1: 'Diamonds',
  2: 'Hearts',
  3: 'Spades',
  4: 'Clubs'
};

var values = {
  1: 'Ace',
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 'Jack',
  12: 'Queen',
  13: 'King'
};

function Card(suit, value) {
  this.suit = suit;
  this.value = value;
}

/**
 * A deck of cards.
 *
 * The constructor builds a new deck by iterating over the suits and values.
 */
function Deck() {
  this.cards = Object.keys(suits).map((suit) => {
    return Object.keys(values).map((value) => {
      return new Card(suits[suit], parseInt(value));
    });
  }).reduce((a, b) => a.concat(b));

  return this;
}

Deck.prototype.shuffle = function() {
  var shuffled = [];

  while (this.cards.length) {
    var choice = Math.floor(Math.random() * this.cards.length);
    shuffled.push(this.cards.splice(choice, 1)[0]);
  }

  this.cards = shuffled;

  return this;
};

Deck.prototype.deal = function(count) {
  var cards = [];

  for (var i = 0; i < count; i++) {
    cards.push(this.cards.shift());
  }

  return cards;
};

function Player() {
  this.cards = [];
}

/**
 * take a card and update the score
 */
Player.prototype.take = function(cards) {
  this.cards = this.cards.concat(cards);
  this.score = this.getScore();
  return this;
};

Player.prototype.twist = function(dealer) {
  this.take(dealer.deck.deal(1));
};

Player.prototype.getScore = function() {
  return this.cards
    .map((card) => card.value)
    .reduce((a, b) => a + b, 0);
};

Player.prototype.isBust = function() {
  return this.score > 21;
};

/**
 * The Dealer represents the game: it holds the players and its cards.
 *
 * It also inherits the Player prototype, since the dealer plays the game.
 *
 * @param {Object} options
 */
function Dealer(options) {
  Player.call(this);
  this.numPlayers = options.numPlayers || 2;
  this.deck = new Deck();
  this.players = [];
  this.score = 0;

  for (var i = 0; i < this.numPlayers; i++) {
    this.players.push(new Player());
  }
}

Dealer.prototype = Player.prototype;

Dealer.prototype.begin = function() {
  var _this = this;

  this.deck.shuffle();
  this.players.forEach((player) => player.take(_this.deck.deal(2)));
};

Dealer.prototype.getWinner = function() {
  return this.players
    .filter((player) => !player.isBust())
    .reduce((a, b) => b.score > a.score ? b : a, this);
};

Dealer.prototype.constructor = Dealer;