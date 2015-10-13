var letters = ['A','B','C','D','E','F','G','H','I','J'];
var content_elem = document.getElementById( 'content' );
var ship_list_elem = document.getElementById( 'ship_list' );
var enemy_board = document.getElementById( 'enemy_board' );
var body = document.getElementById( 'body' );
var ship_list = ['Destroyer: 2','Cruiser: 3','Sub: 3', 'Battleship: 4','Carrier: 5'];
var ship_sizes = [2, 3, 3, 4, 5];
var ROWS = 11;
var COLS = 11;
var finalPositions = [];

function pageLoaded()
{
    content_elem.startPointRow = null;
    content_elem.startPointCol = null;
    for(var i=0; i < ship_list.length; i++ )
    {
	var ship_name_elem = document.createElement( 'li' );
	ship_name_elem.innerHTML = ship_list[i];
	ship_name_elem.ship_size = ship_sizes[i];
	ship_name_elem.onclick = clickShipType;
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
		img_elem.src = "Images/ocean.jpg";
		img_elem.style.width = "50px";
		img_elem.style.height = "37px";
		img_elem.row = r;
		img_elem.col = c;
		cell_elem.appendChild( img_elem );
		cell_elem.hasBattleship = false;
		cell_elem.onclick =  addShip;
	    }
            row_elem.appendChild( cell_elem );
        }
        content_elem.appendChild( row_elem );
    }
}

function clickShipType(evt)
{
    var childNodes = ship_list_elem.childNodes;
    for( var i=1; i < childNodes.length; i++)
    {
	if(childNodes[i].className == "highlighted")
	{
	    childNodes[i].className = "not_highlighted";
	}
    }
    evt.target.className = "highlighted";
}

function isLegal(startRow, startCol, endRow, endCol)
{
    var distance = 0;
    var row_elems = content_elem.childNodes;
    if( startRow == endRow )
    {
	//ship is going horizontal
	var row = row_elems[startRow+1];
	if( startCol > endCol )
	{
	    var temp = endCol;
	    endCol = startCol;
	    startCol = temp;
	}	
	for( var j = startCol; j <= endCol; j++)
	{
	    var cell_elem = row.childNodes[j];
	    if (cell_elem.hasBattleship == true)
	    {
		console.log("this is an illegal placement");
		//reset
		content_elem.startPointRow = null;
		content_elem.startPointCol = null;
		return 0;
	    }
	}
	distance = Math.abs(startCol - endCol) + 1;
    }
    else if( startCol == endCol )
    {
	//ship is going vertical
	if( startRow > endRow )
	{
	    var temp = endRow;
	    endRow = startRow;
	    startRow = temp;
	}
	for( var i = startRow+1; i <= endRow+1; i++)
	{
	    var row = row_elems[i];
	    var cell_elem = row.childNodes[startCol];
	    if(cell_elem.hasBattleship == true)
	    {
		console.log("this is an illegal placement");
		//reset
		content_elem.startPointRow = null;
		content_elem.startPointCol = null;		
		return 0;
	    }
	}
	distance = Math.abs(startRow - endRow) + 1; 
    }    
    else{
	//find a way to print this error on page
	console.log("diagonals are not allowed!");
	//reset
	content_elem.startPointRow = null;
	content_elem.startPointCol = null;
    }
    return distance;
}

function placeShip(startRow, startCol, endRow, endCol)
{
    var row_elems = content_elem.childNodes;
    
    if( startRow == endRow)
    {
	var row = row_elems[startRow+1];
	//switch start & end if backwards 
	if( startCol > endCol )
	{
	    var temp = endCol;
	    endCol = startCol;
	    startCol = temp;
	}
	for( var j = startCol; j <= endCol; j++)
	{
	    var cell_elem = row.childNodes[j];
	    cell_elem.hasBattleship = true;
	    var img_elem = cell_elem.childNodes[0];
	    img_elem.src = "Images/grey.jpg";
	}
    }
    else if ( startCol == endCol)
    {
	if( startRow > endRow )
	{
	    var temp = endRow;
	    endRow = startRow;
	    startRow = temp;
	}
	for( var i = startRow+1; i <= endRow+1; i++)
	{
	    var row = row_elems[i];
	    var cell_elem = row.childNodes[startCol];
	    cell_elem.hasBattleship = true;
	    var img_elem = cell_elem.childNodes[0];
	    img_elem.src = "Images/grey.jpg";
	}
    }
}

function addShip(evt)
{
    //first we have to check which kind of ship they are adding from the list
    var list_children = ship_list_elem.childNodes;
    var ship_size_needed = 0;
    var ship_type = null;
    var start_row = content_elem.startPointRow;
    var start_col = content_elem.startPointCol;
    for( var i=1; i < list_children.length; i++)
    {
	if(list_children[i].className == "highlighted")
	{
	    ship_type = list_children[i];
	    ship_size_needed = list_children[i].ship_size;
	}
    }
    //check if we are on the first click
    if(content_elem.startPointRow == null && content_elem.startPointCol == null )
    {
	content_elem.startPointRow = evt.target.row;
	content_elem.startPointCol = evt.target.col;
    }else
    {
	//we're on the second click:
	var size_given = isLegal(start_row, start_col, evt.target.row, evt.target.col);
	if(size_given == ship_size_needed)
	{
	    placeShip(start_row, start_col, evt.target.row, evt.target.col);
	    //reset
	    content_elem.startPointRow = null;
	    content_elem.startPointCol = null;
	    //delete the ship type from the list
	    ship_list_elem.removeChild(ship_type);
	}
    }
    //check if we're done!
    if( ship_list_elem.childNodes.length == 1 )
    {
	var button = document.createElement("button");
	button.innerHTML = "Play Battleship!!!";
	button.onclick = send_board; 
	body.appendChild( button );
    }

}

function send_board()
{
    //store all the positions of the placed board here.
    var row_elems = content_elem.childNodes;
    for( var i = 2; i < row_elems.length; i++)
    {
	var row = row_elems[i];
	for( var j = 1; j < row.childNodes.length; j++)
	{
	    var cell = row.childNodes[j];
	    if(cell.hasBattleship)
	    {
		var img = cell.childNodes[0];
		var position = [];
		position[0] = img.row;
		position[1] = img.col;
		finalPositions.push(position);
	    }
	}
    }
    //create the url with the finalPos info
    var url = "";
    for(var i=0; i < finalPositions.length; i++)
    {
	url+="block"+i+"="+finalPositions[i][0];
	url+="+";
	url+=finalPositions[i][1];
	if( i !== finalPositions.length-1)
	{
	    url+="&";
	}
    }    

    console.log(url);
    var xhr = new XMLHttpRequest();    
    xhr.open("get", "/place_ships?"+url, true);
    xhr.addEventListener( "load", new_board );
    xhr.send();
    url = "";
}

function new_board( evt )
{
    var kvs_str = evt.target.responseText ;
    var kvs = {};
    var key_value_pairs = kvs_str.split( "&" );
    for( var i = 0; i < key_value_pairs.length; i++ )
    {
        var key_value = key_value_pairs[i].split( "=" );
        kvs[ key_value[0] ] = key_value[1];
    }
    console.log(kvs[0]);
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
		if( kvs_str.indexOf(r+"+"+c) >= 0 ){	
		    cell_elem.hasBattleship = true;
		}else{
		    cell_elem.hasBattleship = false;
		}
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
