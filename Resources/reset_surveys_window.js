var win = Ti.UI.currentWindow;
win.backgroundColor = '#fff';
Titanium.UI.Android.hideSoftKeyboard();
var surveysList = new Array();
Titanium.include('config.js');

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
backButton.addEventListener('click', function() {
	var homeWin = Titanium.UI.createWindow({
		url : 'window2.js',
		title : 'AB Solutions Mobile Survey Application'
	});
	homeWin.open({
		animated : true
	});
	win.close();
	win = null;
});

var resetButton = Titanium.UI.createButton({
	title : 'Reset selected',
	top : Ti.App.positioning.p1*2,
	right : Ti.App.positioning.p1 / 5,
	height : 'auto',
	color : '#000000',
	backgroundColor : '#669999',
	font : {
		fontSize : Ti.App.fontSizes.f2,
	},
	visible : false,
});

var label1 = Ti.UI.createLabel({
	color : 'black',
	text : 'Resend Completed Surveys',
	textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	font : {
		fontSize : Ti.App.fontSizes.f2,
		fontWeight : 'bold',
	},
	top : 50,
});

var table = Titanium.UI.createTableView({
	editable : true,
	moveable : false,
	backgroundColor : '#fff',
	separatorColor : '#000',
	top : (Ti.App.positioning.p1 * 3),
	height : Titanium.UI.SIZE,
	headerTitle : 'Completed Surveys',
	footerTitle : ' ',
});

// var rowColor1 = "#cccccc";
// var rowColor2 = "#c0d6e4";
// var rowCurrentColor = rowColor1;

var loadingLabel = Ti.UI.createLabel({
	text : "Loading Results",
	color : '#000',
	font : {
		fontSize : Ti.App.fontSizes.f2,
	},
	visible : false,
});

var filterData = Titanium.UI.createButton({
	title : 'Search (M/D/YYYY)',
	top : Ti.App.positioning.p1*2,
	left : Ti.App.positioning.p1 / 5,
	height : 'auto',
	color : '#000000',
	backgroundColor : '#669999',
	font : {
		fontSize : Ti.App.fontSizes.f2,
	},
});

var filterDateField = Titanium.UI.createTextField({
	width : '40%',
	top : Ti.App.positioning.p1,
	left : Ti.App.positioning.p1 / 5,
	backgroundColor: 'transparent',
	value : '',
	color : '#000000',
	borderWidth : 1,
	borderColor : '#CCCCCC',
	font : {
		fontSize : Ti.App.fontSizes.f2,
	},
});

filterData.addEventListener('click', function() {
	if (table.data.length > 0) {
		for (var i = table.data[0].rows.length - 1; i >= 0; i--) {
			table.deleteRow(i);
		}
	}
	//table.setData([]);
	loadSurveys();
	Titanium.UI.Android.hideSoftKeyboard();
	if (filterDateField.value !== '') {
		label1.text = 'Surveys completed on \'' + filterDateField.value + '\'';
	};
});

var infoWin = Titanium.UI.createWindow({
	backgroundColor : '#FFFFFF',
	top : 0,
	left : 0,
	opacity : 1,
	zIndex : 100
});

var alertDialog = Titanium.UI.createAlertDialog({
	title : 'Reset Selected Surveys?',
	message : 'You are about to reset the selected surveys for upload. Continue?',
	buttonNames : ['Yes', 'No'],
	cancel : 1
});

alertDialog.addEventListener('click', function(e) {
	if (e.index == 0) {
		resetSurveys();
		Titanium.UI.Android.hideSoftKeyboard();
	} else {
		//code to execute when the user clicked No
	}
});

resetButton.addEventListener('click', function(e) {
	alertDialog.show();
});

var completeDialog = Titanium.UI.createAlertDialog({
	title : 'Selected Surveys Reset',
	message : 'Selected Surveys Reset.  Would you like to upload them now?',
	buttonNames : ['Yes', 'No'],
	cancel : 1
});

function resetSurveys() {
	var tableData = table.getData();
	var rows = tableData[0].rows;
	// console.log(tableData[0]);
	console.log('Rows in table: ' + tableData[0].rowCount);
	if (tableData[0].rowCount > 0) {
		//Loop through table, not surveysList.
		//If the row has a 'selected' option of 1, grab the 'surveyId' property of the same row and execute the below statement.
		var conn = Titanium.Database.open('mysdb');
		// for (var i = 0; i < surveysList.length; i++) {

		for (var i = 0; i < rows.length; i++) {
			console.log(rows[i]);
			if (rows[i].selected == 1) {
				console.log('Found a selected row.');
				console.log('UPDATE surveyResultsComplete SET uploaded =? WHERE survey_result_id = ' + rows[i].resultID);
				conn.execute('UPDATE surveyResultsComplete SET uploaded =? WHERE survey_result_id=?', "n", rows[i].resultID);
			}
		}
		conn.close();
	}
	completeDialog.show();
}

completeDialog.addEventListener('click', function(e) {
	if (e.index == 0) {
		var uploadWin = Titanium.UI.createWindow({
			url : 'upload_Surveys.js',
			title : 'Survey Upload'
		});
		uploadWin.open({
			animated : true
		});
		win.close();
		win = null;
	} else {
		var homeWin = Titanium.UI.createWindow({
			url : 'window2.js',
			title : 'AB Solutions'
		});
		homeWin.open({
			animated : true
		});
		win.close();
		win = null;
	}
});

function loadSurveys() {
	surveysList = ([]);
	var conn = Titanium.Database.open('mysdb');
	filterTerm = filterDateField.value;
	console.log("***** FiterTerm = " + filterTerm);
	if (filterTerm == "") {
		alert('Enter a date first');
		return;
	} else {
		//var data = conn.execute('SELECT * FROM surveyResultsComplete WHERE uploaded=?', "y");
		//var data = conn.execute('SELECT * FROM responseHeader');
		var data = conn.execute('SELECT surveyResultsComplete.* FROM surveyResultsComplete INNER JOIN responseHeader ON surveyResultsComplete.survey_result_id=responseHeader.survey_result_id WHERE uploaded=? AND responseHeader.survey_Date=? ORDER BY survey_result_id ASC', "y", filterTerm);
	}
	
	//alert(data.rowCount);
	
	while (data.isValidRow()) {
		resetButton.visible = true;
		var resultID = data.fieldByName('survey_result_id');
		surveysList.push(resultID);
		var termInfo = conn.execute('SELECT * FROM terminals WHERE id=?', data.fieldByName('terminal'));
		var row = Ti.UI.createTableViewRow({
			color : "#000000",
			// backgroundColor : rowCurrentColor,
			font : {
				fontSize : Ti.App.fontSizes.f2,
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
			row.title = data.fieldByName('serial_number') + " - Terminal info not available.";
		}
		row.rowID = data.fieldByName('survey_revision_id') + "," + resultID + "," + data.fieldByName('terminal');
		row.resultID = resultID;

		table.appendRow(row);
		// if (rowCurrentColor == rowColor1) {
		// rowCurrentColor = rowColor2;
		// } else {
		// rowCurrentColor = rowColor1;
		// }
		data.next();
	}
	conn.close();
	console.log("***** Connection Closed *****");
	table.addEventListener('click', function(e) {
		if (!e.row.selected) {
			e.row.backgroundColor = '#c0d6e4';
			// e.row.color = '#fff';
			e.row.selected = 1;
			console.log("***** Pick *****");
		} else if (e.row.selected) {
			e.row.backgroundColor = '#fff';
			// e.row.color = '#000';
			e.row.selected = 0;
			console.log("***** Un-Pick *****");
		}
	});
	win.add(table);
	loadingLabel.visible = false;
	table.visible = true;
	// console.log("Rows in table:"+table.data.length);
	// console.log(table.data[0]);
}

win.add(label1);
win.add(backButton);
win.add(filterDateField);
win.add(filterData);
win.add(resetButton);
//win.open();