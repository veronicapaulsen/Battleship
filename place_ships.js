var battleships = [];
var placements = [];
var content_elem = document.getElementById( 'content' );
var ROWS = 10;
var COLS = 10;

function pageLoaded()
{
    for( var r = 0; r < ROWS; r++ )
    {
        var row_elem = document.createElement( 'tr' );
        for( var c = 0; c < COLS; c++ )
        {
            var cell_elem = document.createElement( 'td' );
            var img_elem = document.createElement( 'img' );
            img_elem.src = "ocean.jpg";
            img_elem.style.width = "50px";
            cell_elem.appendChild( img_elem );
            row_elem.appendChild( cell_elem );
        }
        content_elem.appendChild( row_elem );
    }
}
