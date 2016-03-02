//All Database changes should occur in this file. Add new changes at the bottom of the file. 
console.log("******************************************************");
console.log("Preparing to run DB Migrations...");
console.log("******************************************************");

var conn = Titanium.Database.open('mysdb');
//Add db versioning table
conn.execute('CREATE TABLE IF NOT EXISTS database_version (version NUMERIC)');

//get version number
var version = 0; 
try{
	var versionSet = conn.execute('SELECT version FROM database_version LIMIT 1');
	while(versionSet.isValidRow()) {
		version = versionSet.field(0);
		versionSet.next();
	}
	console.log("Running Database Version " + version);
}
catch(e)
{
	console.log(e.message);
	console.log("Installing DB for the first time");
}
//********* ALL DATABASE MIGRATIONS SHOULD BE BELOW THIS LINE ***********//
//run DB upgrades based on version
if(version<1.20130516)
{
	var newVersion = 1.20130516;
	conn.execute('BEGIN');
	console.log("Running database migration...");
	try{
		conn.execute('ALTER TABLE surveyResultsComplete ADD COLUMN backed_up NUMERIC DEFAULT 0');	
	}
	catch(e)
	{
		console.log(e.message);
	}
	
	conn.execute('INSERT OR REPLACE INTO database_version (version) VALUES (?)', newVersion);
	version = newVersion;
	console.log("Database upgraded to version " + version);
	conn.execute('COMMIT');
}
		
	
		
		
		
		
//********* ALL DATABASE MIGRATIONS SHOULD BE ABOVE THIS LINE ***********//		
conn.close;
delete version;