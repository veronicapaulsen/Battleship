var battleships = [];
var placements = [];
var letters = ['A','B','C','D','E','F','G','H','I','J'];
var content_elem = document.getElementById( 'content' );
var ship_list_elem = document.getElementById( 'ship_list' );
var ship_list = ['Destroyer: 2','Cruiser: 3','Sub: 3', 'Battleship: 4','Carrier: 5'];
var ROWS = 11;
var COLS = 11;

function pageLoaded()
{
    for(var i=0; i < ship_list.length; i++ )
    {
	var ship_name_elem = document.createElement( 'li' );
	ship_name_elem.innerHTML = ship_list[i];
	ship_list_elem.appendChild( ship_name_elem );
    }
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
		img_elem.src = "ocean.jpg";
		img_elem.style.width = "50px";
		cell_elem.appendChild( img_elem );
	    }
            row_elem.appendChild( cell_elem );
        }
        content_elem.appendChild( row_elem );
    }
}
