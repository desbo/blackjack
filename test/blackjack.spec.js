'use strict';

var System = require('es6-module-loader').System;

describe('Blackjack', function () {
  var blackjack;

  beforeEach(function(done) {
    System.import('../src/blackjack').then(function (module) {
      blackjack = module;
      done();
    });
  });

  describe('Deck', function() {
    var deck;

    beforeEach(function () {
      deck = new blackjack.Deck();
    });

    it('should start with 52 cards', function() {
      expect(deck.cards.length).toBe(52);
    });

    it('should not have duplicates after shuffle', function() {
      deck.shuffle();

      deck.cards.forEach(function (a) {
        expect(deck.cards.filter(function (b) {
          return b === a;
        }).length).toBe(1);
      });
    });
  });

  describe('Dealer', function() {
    var dealer;

    beforeEach(function () {
      dealer = new blackjack.Dealer({
        numPlayers: 2
      });
      dealer.begin();
    });

    it('should start with the correct number of players', function() {
      expect(dealer.players.length).toBe(2);
    });

    it('should give each player 2 cards', function() {
      dealer.players.forEach(function (player) {
        expect(player.cards.length).toBe(2);
      });
    });

    it('should know who wins', function() {
      var winner;

      dealer.players.forEach(function (player) {
        player.twist(dealer);
      });

      winner = dealer.getWinner();

      expect(winner.isBust()).toBeFalsy();

      dealer.players
        .filter(function (p) { return !p.isBust() && p !== winner; })
        .forEach(function (p) { expect(p.score).not.toBeGreaterThan(winner.score); })
    });
  });

  describe('Player', function() {
    var player, dealer;
    var cards = [{ value: 8, suit: 'Clubs'}, { value: 6, suit: 'Spades' }];

    beforeEach(function () {
      dealer = new blackjack.Dealer({ numPlayers: 1 });
      player = dealer.players[0];
      player.take(cards);
    });

    it('should work out the right score', function() {
      expect(player.score).toBe(14);
    });
  });
});