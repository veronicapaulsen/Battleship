var fs   = require( 'fs' );
var http = require( 'http' );
//var url_utils = require( './url_utils.js' );
var partnerIDs = [];


function getFormValuesFromURL( url )
{
    //var kvs = {};
    var kvs_str = "";
    var parts = url.split( "?" );
    if( parts.length === 2 )
    {
        /*var key_value_pairs = parts[1].split( "&" );
        for( var i = 0; i < key_value_pairs.length; i++ )
        {
            var key_value = key_value_pairs[i].split( "=" );
            kvs[ key_value[0] ] = key_value[1];
        }*/
	kvs_str = parts[1];
    }
    return kvs_str;
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
    if( !file_worked )
    {
        var kvs_str = getFormValuesFromURL(req.url);
	console.log("SERVERFUN BEFORE MOD: " + kvs_str);
	var index = kvs_str.indexOf("&");
	var partner_url = kvs_str.substring(0,index);
	var partner_kv = partner_url.split("=");
	kvs_str = kvs_str.substring(index+1);
	console.log("SERVERFUN AFTER MOD: " + kvs_str);
	var partner_id = partner_kv[1];
	var IP_addr = req.connection.remoteAddress;
	console.log("PID: " + partner_id);
	console.log("IPA: " + IP_addr);
	var check = match_users( IP_addr, partner_id );
	//JSON.stringify?
	console.log("CHECK: " + check);
	res.end( "check="+check+"&"+kvs_str );
    }
}

function match_users( IP_addr, partner_id )
{
    var check = 0;
    for(var i=0; i < partnerIDs.length; i++)
    {
	console.log(partnerIDs[i][0]+": " + partnerIDs[i][1]);
	if(partnerIDs[i][0] != IP_addr)
	{	
	    if( partnerIDs[i][1] == partner_id )
	    {
		check = 1;
	    }
	}
    }
    if(check == 1)
    {
	console.log("You have a match!");
	partnerIDs.push([IP_addr, partner_id]);
    }else{
	var count = 0;	
	for(var i = 0; i < partnerIDs.length; i++)
	{
	    count++;
	    if( partnerIDs[i][0] != IP_addr ){
		count++;
	    }
	}
	if(count == partnerIDs.length){
	    partnerIDs.push([IP_addr, partner_id]);
	}
	console.log("Waiting for partner");
    }
    return check;
}

function init()
{
    var server = http.createServer( serverFun );
    server.listen( 8080 );
}


init();
