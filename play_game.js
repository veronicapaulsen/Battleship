var enemy_board = document.getElementById( 'enemy_board' );
var your_board = document.getElementById ( 'your_board');
var ROWS = 11;
var COLS = 11;
var letters = ['A','B','C','D','E','F','G','H','I','J'];
var body = document.getElementById( 'body' );

/*@param kvs = an array of the locations of your enemy's boats
*/
function pageLoaded( )
{
    for( var r = 0; r < ROWS; r++ )
    {
        var row_elem = document.createElement( 'tr' );
        for( var c = 0; c < COLS; c++ )
        {
            var cell_elem = document.createElement( 'td' );
	    if( c == 0 && r != 0 )
	    {
		cell_elem.innerHTML = r;
		cell_elem.style.width = "50px";
	    }
	    else if ( c ==0 && r == 0 )
	    {
		cell_elem.innerHTML = '';
		cell_elem.style.width = "50px";
	    }
	    else if (r == 0)
	    {
		cell_elem.innerHTML = letters[c-1];
		cell_elem.style.height = "37px";
	    }
	    else{
		var img_elem = document.createElement( 'img' );
		img_elem.src = "Images/ocean.jpg";
		img_elem.style.width = "50px";
		img_elem.style.height = "37px";
		img_elem.row = r;
		img_elem.col = c;
		cell_elem.appendChild( img_elem );
		/*if( kvs.indexOf(r+"+"+c) >= 0 ){	
		    cell_elem.hasBattleship = true;
		}else{
		    cell_elem.hasBattleship = false;
		}*/
		cell_elem.hasBattleship = false;
		cell_elem.onclick =  guess;
	    }
            row_elem.appendChild( cell_elem );
        }
        enemy_board.appendChild( row_elem );
    }
}

function guess( evt )
{
    if( evt.target.hasBattleship )
    {
	console.log( "You found a battleship!");
    }else{
	console.log("Nope");
    }
}
