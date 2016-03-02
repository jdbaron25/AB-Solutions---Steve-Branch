console.log("checking for conflicts");
Titanium.include('config.js');
var win = Ti.UI.currentWindow;
win.backgroundColor = '#fff';
var conflicts = [];
var conn = Titanium.Database.open('mysdb');
// var sql = 'SELECT survey_result_id, count(*) as recordcount FROM responseHeader WHERE survey_result_id BETWEEN 7188 AND 10559 GROUP BY survey_result_id ';
// var sql = 'SELECT survey_result_id, count(*) as recordcount FROM responseHeader r left join surveyResults s on r.survey_results_id = s.survey_results.id WHERE cast(survey_result_id as integer) > 7188 AND cast(survey_result_id as integer) < 10559000 GROUP BY survey_result_id ORDER BY survey_result_id ASC';
// var sql = 'SELECT survey_result_id, count(*) as recordcount FROM responseHeader GROUP BY survey_result_id ';


//get new survyes
var sql = 'SELECT s.survey_result_id FROM surveyResults s left join responseHeader r on s.survey_result_id = r.survey_result_id WHERE cast(s.survey_result_id as integer) BETWEEN 7188 AND 10559 AND r.survey_result_id NOT NULL';
console.log(sql);
var results = conn.execute(sql);
conn.close();
console.log(results.rowCount+" potential conflicts found");
while(results.isValidRow())
{
	// if(results.fieldByName('recordcount')>1)
	// {
		console.log(results.rowCount+" confirmed conflicts found");
		conflicts.push(results.fieldByName('survey_result_id'));
	// }	
	results.next();
}

var conflictList = Ti.UI.createListView({top:0,height:'75%',headerTitle:'Potential Conflicts'});
var conflictSections = [];
var conflictSection = Ti.UI.createListSection({'headerTitle':'New Survey Conflicts'});
var conflictDataSet = [];

conn  = Titanium.Database.open('mysdb');
for(var i=0;i<conflicts.length;i++)
{
	var conflictStatement = 'Internal ID '+conflicts[i]+': ';
	sql = 'SELECT * FROM responseHeader r LEFT JOIN terminals t on r.terminal_id = t.id WHERE survey_result_id = ?';
	var responseHeaders = conn.execute(sql,conflicts[i]);
	for(var j=0;j<responseHeaders.rowCount;j++)
	{
		conflictStatement+= responseHeaders.fieldByName('serialnumber')+'('+responseHeaders.fieldByName('terminal_id')+') entered on '+responseHeaders.fieldByName('survey_Date')+'; ';
	}
	conflictDataSet.push({properties:{title:conflictStatement}});	
}
conn.close();
conflictSection.setItems(conflictDataSet);
conflictSections.push(conflictSection);
conflictList.appendSection(conflictSections);

//Get completed surveys
var conn  = Titanium.Database.open('mysdb');
// var sql = 'SELECT s.survey_result_id FROM surveyResultsComplete s left join responseHeader r on s.survey_result_id = r.survey_result_id WHERE cast(s.survey_result_id as integer) BETWEEN 7188 AND 10559 AND r.survey_result_id NOT NULL';
var sql = 'SELECT survey_result_id, count(*) as recordcount FROM surveyResultsComplete WHERE cast(survey_result_id as integer) BETWEEN 7188 AND 10559 GROUP BY survey_result_id';
console.log(sql);
var results = conn.execute(sql);
conn.close();
console.log(results.rowCount+" completion records to look at.");
while(results.isValidRow())
{
	if(results.fieldByName('recordcount')>1)
	{
		console.log(results.rowCount+" confirmed duplicate completionRecord found");
		console.log(results.fieldByName('survey_result_id') +' has '+results.fieldByName('recordcount')+' records');
		conflicts.push(results.fieldByName('survey_result_id'));
	}	
	results.next();
}

// var conflictList = Ti.UI.createListView({top:0,height:'75%',headerTitle:'Potential Conflicts'});
var conflictSections2 = [];
var conflictSection2 = Ti.UI.createListSection({'headerTitle':'Surveys with Duplicate Completion Records'});
var conflictDataSet2 = [];

conn  = Titanium.Database.open('mysdb');
for(var i=0;i<conflicts.length;i++)
{
	var conflictStatement = 'Internal ID '+conflicts[i]+': ';
	// sql = 'SELECT * FROM responseHeader r LEFT JOIN terminals t on r.terminal_id = t.id WHERE survey_result_id = ?';
	sql = 'SELECT * FROM surveyResultsComplete WHERE survey_result_id = ? AND cast(survey_result_id as integer) BETWEEN 7188 AND 10559';
	console.log(sql);
	var responseHeaders = conn.execute(sql,conflicts[i]);
	// for(var j=0;j<responseHeaders.rowCount;j++)
	var check = 0;
	while(responseHeaders.isValidRow())
	{
		check++;
		console.log('adding '+ check +' to statement');
		conflictStatement+= responseHeaders.fieldByName('serialnumber')+'('+responseHeaders.fieldByName('terminal')+'); ';
		responseHeaders.next();
	}
	conflictDataSet2.push({properties:{title:conflictStatement}});	
}
conn.close();
conflictSection2.setItems(conflictDataSet2);
conflictSections2.push(conflictSection2);
conflictList.appendSection(conflictSections2);





win.add(conflictList);


var closeButton = Ti.UI.createButton({
	title : 'Close Window',
	bottom : 100,
	right : 30,
	height : 'auto',
	font : {
		fontSize : Ti.App.fontSizes.f2,
		fontWeight : 'bold',
	},
});
closeButton.addEventListener('click', function() {
	console.log('close window');
	Ti.UI.currentWindow.close();
	
	});
win.add(closeButton);






