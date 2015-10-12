var battleships = [];
var placements = [];
var letters = ['A','B','C','D','E','F','G','H','I','J'];
var content_elem = document.getElementById( 'content' );
var ship_list_elem = document.getElementById( 'ship_list' );
var body = document.getElementById( 'body' );
var ship_list = ['Destroyer: 2','Cruiser: 3','Sub: 3', 'Battleship: 4','Carrier: 5'];
var ship_sizes = [2, 3, 3, 4, 5];
var ROWS = 11;
var COLS = 11;

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
    if( startRow == endRow )
    {
	//ship is going horizontal
	distance = Math.abs(startCol - endCol) + 1;
    }
    else if( startCol == endCol )
    {
	//ship is going vertical
	distance = Math.abs(startRow - endRow) + 1; 
    }
    else{
	//find a way to print this error on page
	console.log("diagonals are not allowed!");
    }
    return distance;
}

function placeShip(startRow, startCol, endRow, endCol)
{
    var row_elems = content_elem.childNodes;
    console.log("sR: "+ startRow + " sC: " + startCol + " eR: " + endRow + " eC: " + endCol);
    
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
	console.log("switch: sR: "+ startRow + " sC: " + startCol + " eR: " + endRow + " eC: " + endCol);
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
    //console.log("startrow: " + start_row);
    //console.log("startcol: " + start_col);
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
	//console.log("evt row: " + evt.target.row + " evt col: " + evt.target.col);
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
	body.appendChild( button );
    }

}

