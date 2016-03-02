var win = Ti.UI.currentWindow;
win.backgroundColor = '#fff';
Titanium.include('upload.js');
Titanium.include('config.js');

var conn = Titanium.Database.open('mysdb');
var data = conn.execute('SELECT * FROM surveyResultsComplete WHERE uploaded=? AND complete=? ORDER BY survey_result_id ASC', "n", "y");
conn.close();
var rowColor1 = "#cccccc";
var rowColor2 = "#c0d6e4";
var rowCurrentColor = rowColor1;

var backButton = Titanium.UI.createButton({
	title : 'Back',
	top : Ti.App.positioning.p1 / 5,
	left : Ti.App.positioning.p1 / 5,
	height : 'auto',
	color : '#000000',
	backgroundColor : '#669999',
	font : {
		fontSize : Ti.App.fontSizes.f2,
	},
});

var markUploaded = Titanium.UI.createButton({
	title : 'Mark as Uploaded',
	top : Ti.App.positioning.p1 / 5,
	right : Ti.App.positioning.p1 / 5,
	//right : '2%',
	width : 'auto',
	color : '#000000',
	height : 'auto',
	backgroundColor : '#669999',
	font : {
		fontSize : Ti.App.fontSizes.f1,
	},
});

var alertDialog = Titanium.UI.createAlertDialog({
	title : 'Mark Uploaded?',
	message : 'You are about to mark all of the listed surveys as uploded. Continue?',
	buttonNames : ['Yes', 'No'],
	cancel : 1
});

alertDialog.addEventListener('click', function(e) {
	if (e.index == 0) {
		var conn = Titanium.Database.open('mysdb');
		conn.execute('UPDATE surveyResultsComplete SET uploaded =? WHERE complete=?', "y", "y");
	 	conn.close();
	 	var homeWin = Titanium.UI.createWindow({
	 		url : 'window2.js',
	 		title : 'Active Surveys'
	 	});
	 	homeWin.open({
	 		animated : true
	 	});
	 	win.close();
		
		// }
	} else {
		//code to execute when the user clicked No
	}
});

markUploaded.addEventListener('click', function(e) {
	alertDialog.show();
});

var upload_Surveys = Titanium.UI.createButton({
	title : '----- Upload -----',
	top : Ti.App.positioning.p1 / 1,
	right : Ti.App.positioning.p1 / 5,
	color : '#000000',
	height : 'auto',
	backgroundColor : '#669999',
	font : {
		fontSize : Ti.App.fontSizes.f1,
		fontWeight : 'bold',
	},
});

if (data.rowCount > 0) {
	var labelText = '';
} else {
	var labelText = 'No completed surveys found';
	upload_Surveys.enabled = false;
}

if (Titanium.Network.networkType == Titanium.Network.NETWORK_NONE) {
	alert('Internet connection not detected.  Upload disabled.');
	upload_Surveys.enabled = false;
};

var activity = Ti.UI.createActivityIndicator({
	color : 'blue',
	message : ' - Uploading Data',
	textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
	top : Ti.App.positioning.p1,
	left : Ti.App.positioning.p1 / 5,
	height : 'auto',
	width : 'auto',
	font : {
		fontSize : Ti.App.fontSizes.f1,
	},
});
win.add(activity);

var label1 = Ti.UI.createLabel({
	color : '#000',
	font : {
		fontSize : Ti.App.fontSizes.f1,
	},
	text : labelText,
	width : 'auto',
	height : 'auto'
});

var table = Titanium.UI.createTableView({
	editable : true,
	moveable : false,
	backgroundColor : '#fff',
	separatorColor : '#000',
	top : Ti.App.positioning.p1 * 2,
	height : 'auto',
	headerTitle : 'Available Surveys',
	footerTitle : ' ',
	allowsSelection : false
});

while (data.isValidRow()) {
	var resultID = data.fieldByName('survey_result_id');
	var conn = Titanium.Database.open('mysdb');
	var termInfo = conn.execute('SELECT * FROM terminals WHERE id=?', data.fieldByName('terminal'));
	conn.close();
	var row = Ti.UI.createTableViewRow({
		color : "#000000",
		backgroundColor : rowCurrentColor,
		font : {
			fontSize : Ti.App.fontSizes.f1,
		},
	});
	row.height = 'auto';
	if (termInfo.isValidRow()) {
		var location = termInfo.fieldByName('location');
		var street = termInfo.fieldByName('street');
		var city = termInfo.fieldByName('city');
		var state = termInfo.fieldByName('state');
		var zip = termInfo.fieldByName('zip');
		var titleStr = data.fieldByName('serial_number') + " - " + location + " : " + street + " " + city + " " + state + " " + zip;
		// row.rowID = data.fieldByName('survey_revision_id') + "," + resultID + "," + data.fieldByName('terminal');
		row.title = titleStr;
	} else {
		row.title = data.fieldByName('serial_number') + " - Survey reset for upload";
	}
	row.rowID = data.fieldByName('survey_revision_id') + "," + resultID + "," + data.fieldByName('terminal');
	
	row.name = "R_" + data.survey_result_id;
	row.editable = true;
	table.appendRow(row);
	if (rowCurrentColor == rowColor1) {
		rowCurrentColor = rowColor2;
	} else {
		rowCurrentColor = rowColor1;
	}
	data.next();
}

backButton.addEventListener('click', function() {
	var homeWin = Titanium.UI.createWindow({
		url : 'window2.js',
		title : 'Mobile Survey Application'
	});
	homeWin.open({
		animated : true
	});
	win.close();
});

upload_Surveys.addEventListener('click', function() {
	upload_Surveys.enabled = false;
	activity.show();
	upload();
});

function showUploadResult(uploadStatus) {
	var homeWin = Titanium.UI.createWindow({
		url : 'window2.js',
		title : 'Active Surveys'
	});
	var resultDialog = Ti.UI.createAlertDialog({
		message : uploadStatus,
		ok : 'Ok',
		title : 'Upload Result'
	}).show();
	upload_Surveys.enabled = true;

	activity.hide();
	homeWin.open({
		animated : true
	});
	win.close();
}

table.addEventListener('click', function(e) {
	win.backButton = null;
	win.prevButton = null;
	win.nextButton = null;
	win.filterTermField = null;
	win.filterData = null;
	win.label1 = null;
	table.setData([]);
	win.table = null;
	
	var survey = Titanium.UI.createWindow({
		url : 'survey.js',
		title : 'Survey',
	});
	var rowID = String(e.row.rowID);
	var comma1 = rowID.indexOf(",");
	var comma2 = rowID.indexOf(",", comma1 + 1);
	survey.revID = rowID.substr(0, comma1);
	survey.resID = rowID.substr(comma1 + 1, comma2 - comma1 - 1);
	survey.termID = rowID.substr(comma2 + 1);
	survey.titleStr = e.row.title;
	survey.isEdit = true;
	survey.open({
		animated : true
	});
	win.close();
	win = null;
});


win.add(backButton);
win.add(markUploaded);
win.add(upload_Surveys);
win.add(table);
win.add(label1);
