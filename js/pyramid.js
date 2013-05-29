/*
Copyright (c) 2013 Fabrice ECAILLE aka Febbweiss

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var Pyramid = {
	initial_set: [1, 2, 3, 4, 5, 6, 7],
	
	pyramid: new Array(7),
	
	selected: null,
	drawn: new Array(),
	drawn_count: 0,
	
	init: function() {
		var maxCard = Pyramid.initial_set[ Pyramid.initial_set.length - 1];
		var initial_x = (maxCard * CARD_WIDTH) / 2;
		
		var initial_y = 0;
		var playground = $("#playground");
		playground.width( maxCard * CARD_WIDTH);
		playground.height( Pyramid.initial_set.lentgh * CARD_HEIGHT);
		
		
		Deck.shuffle();
		
		for( var i = 0; i < Pyramid.initial_set.length; i++) {
			var cards = Pyramid.initial_set[i];
			var offsetx = initial_x - cards * CARD_WIDTH / 2;
			Pyramid.pyramid[i] = new Array(cards);
			for( var j = 0; j < cards; j++ ) {
				var value = Deck.pop();
				Pyramid.pyramid[i][j] = value;
				$("<img/>",{
					id:"card" + i +j,
					class: "card " + Deck.familly( value ) + "_" + Deck.value(value),
					style: "left: " + offsetx + "px; top: " + ( i * CARD_HEIGHT / 3 ) + "px;"
				}).appendTo(playground);
				
				offsetx += CARD_WIDTH;
			}
		}

		$("#stock").width( CARD_WIDTH ).height( CARD_HEIGHT );
		$("#drawn").width( CARD_WIDTH ).height( CARD_HEIGHT );
		$("#control").width( CARD_WIDTH ).height( 2 * CARD_HEIGHT );
		
		$(".card").click( Pyramid.click );
	},

	click: function(e) {
		var elt = $(this);
		var id = elt.attr('id');
		
		if( id === "stock" ) {
			Pyramid.draw();
			return false;
		}
		
		var card = Pyramid.card(elt);
		
		if( !card )
			return false;
		
		var point = Deck.point(card);
		
		if( point == 13 ) {
			Pyramid.remove(elt);
			Pyramid.win();
			return true;
		}
		
		if( elt.hasClass("selected") ) {
			elt.removeClass("selected");
			Pyramid.selected = null;
			return false;
		} 
		
		var selected = Pyramid.selected; 
		if( selected ) {
			var card = Pyramid.card(Pyramid.selected);
			
			if( (point + Deck.point(card)) == 13 ) {
				Pyramid.remove(elt);
				Pyramid.remove( selected );
				Pyramid.win();
			} else {
				selected.removeClass("selected");
			}
			
			Pyramid.selected = null;
		} else {
			elt.addClass("selected");
			Pyramid.selected = elt;
		}
	},
	
	next: function() {
		var card = Deck.pop();
		Pyramid.drawn.push( card );
		$("#drawn").removeClass().addClass("card").addClass("card " + Deck.familly( card ) + "_" + Deck.value(card));
		if( Deck.cards.length == 0 ) {
			$("#stock").removeClass();
			return false;
		}
	},
	
	card: function(elt) {
		var id = elt.attr('id');
	
		if( id === "drawn" ) {
			if( Pyramid.drawn.length > 0 ) {
				return Pyramid.drawn[Pyramid.drawn.length - 1];
			} else
				return false;
		} else {
			var i = parseInt(id.charAt(4));
			var j = parseInt(id.charAt(5));
			
			if( typeof Pyramid.pyramid[i + 1] != "undefined" 
				&& ( typeof Pyramid.pyramid[i + 1][ j ] != "undefined" || typeof Pyramid.pyramid[i + 1][ j + 1] != "undefined") )
				return false;
			
			return Pyramid.pyramid[i][j];
		}
	},
	
	remove: function(elt) {
		var id = elt.attr('id');
		
		if( id === "drawn" ) {
			Pyramid.drawn.pop();
			$("#drawn").removeClass();
			if( Pyramid.drawn.length > 0 ) {
				card = Pyramid.drawn[Pyramid.drawn.length - 1];
				$("#drawn").addClass("card").addClass("card " + Deck.familly( card ) + "_" + Deck.value(card));
			}
		} else {
			var i = parseInt(id.charAt(4));
			var j = parseInt(id.charAt(5));
			Pyramid.pyramid[i][j] = undefined;
			elt.remove();
		}
	},
	
	draw: function() {
		if( Deck.cards.length > 0 ) {
			Pyramid.drawn_count++;
			Pyramid.next();
			return false;
		}
		
		Deck.cards = Pyramid.drawn.reverse();
		Pyramid.drawn = new Array();
		$("#drawn").removeClass();
		$("#stock").addClass("card").addClass("background");
		$("#")
	},
	
	win: function() {
		var win = true;
		$.each($(".card"), function(index, elt) {
			var id = $(elt).attr('id');
			if(  id !== "stock" && id !== "drawn")
				win = false;
		});
		if( win ) 
			Pyramid.show_win();
		return win;
	},
	
	show_win: function() {
		alert( "Win in " + Pyramid.drawn_count + " draws !!!");
	}
}
