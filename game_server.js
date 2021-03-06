var fs   = require( 'fs' );
var http = require( 'http' );
//var url_utils = require( './url_utils.js' );
var partnerIDs = [];
var game_positions = [];
var playerTurn = "";
var tempStorage = [];


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
	var index = kvs_str.indexOf("&");
	var partner_url = kvs_str.substring(0,index);
	var partner_kv = partner_url.split("=");
	kvs_str = kvs_str.substring(index+1);
//	console.log("SERVERFUN AFTER MOD: " + kvs_str);
	var partner_id = partner_kv[1];
	var IP_addr = req.connection.remoteAddress;
	
	if( kvs_str.indexOf("status")>=0 ){
	    for(var i = 0; i < game_positions.length; i++){
		if( game_positions[i][0] == partner_id && game_positions[i][1] != IP_addr ){		    
		    tempStorage.push( [game_positions[i][0], game_positions[i][1], kvs_str]);
		    console.log(tempStorage);
		}
	    }
	}else if( kvs_str.indexOf("pingtest") >= 0){
	    console.log("PINGPID: " + partner_id);
	    console.log("pingKVS: " + kvs_str);
	    var response = "";
	    for( var i = 0; i < tempStorage.length; i++ ){
		if( tempStorage[i][0] == partner_id ){
		    if( tempStorage[i][1] != IP_addr ){
			response = "yourTurn&"+tempStorage[i][2];
			console.log(response);
			tempStorage.splice(i,1);
			console.log(tempStorage);
		    }
		}
	    }
	    res.end(response);
	}
	else{
	    //check if info is already stored before you push
	    var count = 0;	
	    for(var i = 0; i < game_positions.length; i++)
	    {
		if( game_positions[i][1] != IP_addr ){
		    count++;
		}
	    }
	    if(count == game_positions.length){
		game_positions.push([partner_id, IP_addr, kvs_str]);
	    }
	    
	    console.log("PID: " + partner_id);
	    console.log("IPA: " + IP_addr);
	    var check = match_users( IP_addr, partner_id );
	    //JSON.stringify?
	    console.log("CHECK: " + check);
	    if( check == 0 ){
		res.end( "check="+check+"&"+kvs_str );
	    }else{
		for( var i = 0; i < game_positions.length; i++){
		    if( game_positions[i][0] == partner_id && game_positions[i][1] != IP_addr ){
			kvs_str = game_positions[i][2];
			res.end( "check="+check+"&"+kvs_str );
		    }
		}
	    }
	}
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
