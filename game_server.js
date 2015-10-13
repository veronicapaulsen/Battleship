var fs   = require( 'fs' );
var http = require( 'http' );
//var url_utils = require( './url_utils.js' );
var ROWS = 11;
var COLD = 11;


function getFormValuesFromURL( url )
{
    var kvs = {};
    var parts = url.split( "?" );
    if( parts.length === 2 )
    {
        var key_value_pairs = parts[1].split( "&" );
        for( var i = 0; i < key_value_pairs.length; i++ )
        {
            var key_value = key_value_pairs[i].split( "=" );
            kvs[ key_value[0] ] = key_value[1];
        }
    }
    return kvs
}

function serveFile( req, res )
{
    if( req.url === "/" || req.url === "/place_ships" )
    {
        req.url = "/place_ships.html";
    }
    var filename = "./" + req.url;
    try {
        var contents = fs.readFileSync( filename );
        res.writeHead( 200 );
        res.end( contents );
        return true;
    }
    catch( exp ) {
        return false;
    }
}

function serverFun( req, res )
{
    console.log( "The URL: '", req.url, "'" );
    var file_worked = serveFile( req, res );
    if( req.url.indexOf("play_game?") >=0 )
    {
        var kvs = getFormValuesFromURL(req.url);	
	//JSON.stringify
	res.end( kvs );
    }
}

function init()
{
    var server = http.createServer( serverFun );
    server.listen( 8080 );
}


init();
