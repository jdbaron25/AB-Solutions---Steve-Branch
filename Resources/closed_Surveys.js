var win = Ti.UI.currentWindow;
win.backgroundColor = '#fff';

var conn = Titanium.Database.open('mysdb');
var data = conn.execute('SELECT * FROM surveyResults WHERE complete=?', "y");

if (data.rowCount > 0) {
	var labelText = 'Select a Survey Below';
} else {
	var labelText = 'No completed surveys found';
}

var label1 = Ti.UI.createLabel({
	color : '#000',
	font : {
		fontSize : 28
	},
	text : labelText,
	textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	top : 60,
	width : 'auto',
	height : 'auto'
});


var table = Titanium.UI.createTableView({
	editable : true,
	moveable : false,
	backgroundColor : '#fff',
	separatorColor : '#000',
	top : 150,
	height : 500,
	headerTitle : 'Available Surveys',
	footerTitle : ' ',
});

while (data.isValidRow()) {
	var termInfo = conn.execute('SELECT * FROM terminals WHERE id=?', data.fieldByName('terminal'));
	var row = Ti.UI.createTableViewRow();
	row.height = 'auto';
	var location = termInfo.fieldByName('location');
	var street = termInfo.fieldByName('street');
	var city = termInfo.fieldByName('city');
	var state = termInfo.fieldByName('state');
	var zip = termInfo.fieldByName('zip');
	var titleStr = location + " : " + street + " " + city + " " + state + " " + zip;
	row.rowID = data.fieldByName('survey_revision_id');
	row.color = '#fff';
	row.title = titleStr;
	table.appendRow(row);
	data.next();
}

conn.close();
win.add(table);
win.add(label1);
