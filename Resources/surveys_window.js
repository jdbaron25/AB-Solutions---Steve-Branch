var win = Ti.UI.currentWindow;
win.backgroundColor = '#fff';
Titanium.UI.Android.hideSoftKeyboard();
var surveyCount = surveyCount();
var currentCount = surveyCount.open;
var rowsPerPage = 25;
Titanium.include('config.js');

function pageCount(totalRecords)
{
	var val = 0;
	if(totalRecords<=0)
	{
		val = 1;	
	}
	else
	{
		val = Math.ceil(totalRecords/rowsPerPage);
	}
	
	return val;
}

//alert(Ti.App.positioning.p1 * 3);

var table = Titanium.UI.createTableView({
	editable : true,
	moveable : false,
	backgroundColor : '#fff',
	separatorColor : '#000',
	top : (Ti.App.positioning.p1 * 3),
	right : 0,
	height : Titanium.UI.SIZE,
	headerTitle : 'Available Surveys',
	footerTitle : ' ',
	font : {
		fontSize : Ti.App.fontSizes.f2,
	},
});

var rowColor1 = "#cccccc";
var rowColor2 = "#c0d6e4";
var rowCurrentColor = rowColor1;
var currentPage = 1;

var label1 = Ti.UI.createLabel({
	color : '#000',
	right : 0,
	font : {
		fontSize : Ti.App.fontSizes.f2,
	},
	textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	top : (Ti.App.positioning.p1 * 2.5),
	visible : false,
});
var pageLabel = Ti.UI.createLabel({
	color : '#000',
	font : {
		fontSize : Ti.App.fontSizes.f2,
	},
	textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	top : 0,
	right: 10,
	text: "Page "+currentPage +"/"+pageCount(currentCount) + " ("+ currentCount +" Total Surveys)",
});


var loadingLabel = Ti.UI.createLabel({
	text : "Loading Results ...",
	color : '#000',
	font : {
		fontSize : Ti.App.fontSizes.f2,
	},
	visible : false,
});

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
		//title : 'Active Surveys'
	});
	homeWin.open({
		//animated : true
	});
	
	win.backButton = null;
	win.prevButton = null;
	win.nextButton = null;
	win.filterTermField = null;
	win.filterData = null;
	win.label1 = null;
	table.setData([]);
	win.table = null;
	win.close();
	win = null;
});


var resetData = Titanium.UI.createButton({
	title : 'Reset',
	top : Ti.App.positioning.p1 * 1.9,
	left : Ti.App.positioning.p1 / 5,
	height : 'auto',
	color : '#000000',
	backgroundColor : '#669999',
	visible : false,
	font : {
		fontSize : Ti.App.fontSizes.f2,
	},
});

resetData.addEventListener('click', function() {
	resetData.visible = false;
	filterData.visible = true;
	table.setData([]);
	currentPage = 1;
	prevButton.visible = false;
	Titanium.UI.Android.hideSoftKeyboard();
	//label1.text = 'Available Surveys';
	label1.visible = false;
	
	Ti.App.surveyFilter = '';
	filterTermField.value = "";
	
	currentCount = surveyCount.open;
	pageLabel.text = "Page "+currentPage +"/"+pageCount(surveyCount.open)+ " ("+ currentCount +" Total Surveys)";
	
	loadSurveys(currentPage);
	
	var paginationCalcNum = (currentPage-1)*rowsPerPage;
	if((paginationCalcNum + rowsPerPage) < currentCount)
	{
		console.log("Show Next");
		nextButton.visible = 'True';
	}
	else
	{	
		console.log("Hide Next");
		nextButton.visible = 'False';
	}
	
	prevButton.visible = false;
	Titanium.UI.Android.hideSoftKeyboard();
	//label1.text = 'Available Surveys';
	label1.visible = false;
});

var filterData = Titanium.UI.createButton({
	title : 'Filter by Terminal',
	//top : Ti.App.positioning.p1,
	//left : '30%',
	//right : '30%',
	top : Ti.App.positioning.p1 * 1.9,
	left : Ti.App.positioning.p1 / 5,
	height : 'auto',
	color : '#000000',
	backgroundColor : '#669999',
	//width : '30%',
	font : {
		fontSize : Ti.App.fontSizes.f2,
	},
});

filterData.addEventListener('click', function() {
	resetData.visible = true;
	filterData.visible = false;
	table.setData([]);
	currentPage = 1;
	Ti.App.surveyFilter = filterTermField.value;
	// filterTermField.value = "";
	var conn = Titanium.Database.open('mysdb');
	var countData = conn.execute('SELECT count(*) as total FROM surveyResults WHERE complete=? AND serial_number LIKE ? ', "n", Ti.App.surveyFilter + "%");
	conn.close();
	console.log("CC=>"+currentCount);
	currentCount = countData.fieldByName('total');
	console.log("CC=>"+currentCount);
	delete countData;
	
	pageLabel.text = "Page "+currentPage +"/"+pageCount(currentCount) + " ("+ currentCount +" Total Surveys)";
	console.log("reset pageLabel to "+pageLabel.text);
	
	loadSurveys(currentPage);
	Titanium.UI.Android.hideSoftKeyboard();
	label1.visible = true;
	label1.text = 'Filter \'' + Ti.App.surveyFilter + '\'';
});

if (Ti.App.surveyFilter == '') {
	label1.visible = false;
	//label1.text = 'Available Surveys';
} else {
	label1.visible = true;
	label1.text = 'Filter \'' + Ti.App.surveyFilter + '\'';
};

var nextButton = Titanium.UI.createButton({
	title : "Next Page",
	top : '4%',
	right : '2%',
	height : 'auto',
	color : '#000000',
	backgroundColor : '#669999',
	width : '25%',
	font : {
		fontSize : Ti.App.fontSizes.f2,
	},
	visible: (currentCount>rowsPerPage)?'True':'False',
});

nextButton.addEventListener('click', function() {
	nextButton.enabled = false;
	prevButton.enabled = false;
	table.visible = false;
	loadingLabel.visible = true;
	var td = [];
	table.data = td;
	table.setData([]);
	
	currentPage = currentPage + 1;
	pageLabel.text = "Page "+currentPage +"/"+pageCount(currentCount) + " ("+ currentCount +" Total Surveys)";
	loadSurveys(currentPage);
	
	var paginationCalcNum = (currentPage-1)*rowsPerPage;
	console.log("Current page: "+currentPage+"Pagination calculation: "+paginationCalcNum+" Open Count: "+surveyCount.open); 
	if((paginationCalcNum + rowsPerPage) < currentCount)
	{
		console.log("Show Next");
		nextButton.visible = 'True';
	}
	else
	{	
		console.log("Hide Next");
		nextButton.visible = 'False';
	}
	
	if (currentPage > 1) {
		prevButton.visible = 'True';
	};
	nextButton.enabled = true;
	prevButton.enabled = true;
});

var prevButton = Titanium.UI.createButton({
	title : "Prev Page",
	top : '10%',
	right : '2%',
	height : 'auto',
	visible : false,
	color : '#000000',
	backgroundColor : '#669999',
	width : '25%',
	font : {
		fontSize : Ti.App.fontSizes.f2,
	},
});

prevButton.addEventListener('click', function() {
	nextButton.enabled = false;
	prevButton.enabled = false;
	if (currentPage > 1) {
		table.visible = false;
		loadingLabel.visible = true;
		table.setData([]);
		currentPage = currentPage - 1;
		pageLabel.text = "Page "+currentPage +"/"+pageCount(currentCount) + " ("+ currentCount +" Total Surveys)";
		if (currentPage == 1) {
			prevButton.visible = 'False';
		};
		
		loadSurveys(currentPage);
		
		var paginationCalcNum = (currentPage-1)*rowsPerPage;
		console.log("Current page: "+currentPage+"Pagination calculation: "+paginationCalcNum+" Open Count: "+surveyCount.open); 
		if((paginationCalcNum + rowsPerPage) < currentCount)
		{
			console.log("Show Next");
			nextButton.visible = 'True';
		}
		else
		{	
			console.log("Hide Next");
			nextButton.visible = 'False';
		}
	}
	nextButton.enabled = true;
	prevButton.enabled = true;
});

//alert(Ti.App.positioning.p1);

var filterTermField = Titanium.UI.createTextField({
	width : '20%',
	top : Ti.App.positioning.p1,
	left : Ti.App.positioning.p1 / 5,
	backgroundColor: 'transparent',
	color : '#000000',
	borderWidth : 1,
	borderColor : '#CCCCCC',
	font : {
		fontSize : Ti.App.fontSizes.f2,
	},
});
function surveyCount()
{
	var conn = Titanium.Database.open('mysdb');
	var data = conn.execute('SELECT count(CASE WHEN complete="n" THEN 1 END) as open, count(CASE WHEN complete!="n" THEN 1 END) as closed  FROM surveyResults');
	conn.close();
	return {open:data.fieldByName('open'),closed:data.fieldByName('closed')};
}
function loadSurveys(currentPage) {
	win.remove(table);
	var conn = Titanium.Database.open('mysdb');
	var offsetValue = (currentPage - 1) * rowsPerPage;
	filterTerm = Ti.App.surveyFilter;
	if (filterTerm == "") {
		var data = conn.execute('SELECT * FROM surveyResults WHERE complete=? LIMIT ' + rowsPerPage + ' OFFSET ' + offsetValue, "n");
	} else {
		var data = conn.execute('SELECT * FROM surveyResults WHERE complete=? AND serial_number LIKE ? LIMIT ' + rowsPerPage + ' OFFSET ' + offsetValue, "n", filterTerm + "%");
	}
	while (data.isValidRow()) {
		var resultID = data.fieldByName('survey_result_id');
		var termInfo = conn.execute('SELECT * FROM terminals WHERE id=?', data.fieldByName('terminal'));
		
		var row = Ti.UI.createTableViewRow({
			color : "#000000",
			backgroundColor : rowCurrentColor,
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
			//var tid = data.fieldByName('serial_number');
			var titleStr = data.fieldByName('serial_number') + " - " + location + " : " + street + " " + city + " " + state + " " + zip;
			row.title = titleStr;
		} else {
			row.title = data.fieldByName('serial_number') + " - Terminal Info Unavailable.";
		}
		row.rowID = data.fieldByName('survey_revision_id') + "," + resultID + "," + data.fieldByName('terminal');
		
		
		table.appendRow(row);
		if (rowCurrentColor == rowColor1) {
			rowCurrentColor = rowColor2;
		} else {
			rowCurrentColor = rowColor1;
		}
		data.next();
	}
	conn.close();
	console.log("***** Connection Closed *****");

	win.add(table);
	loadingLabel.visible = false;
	table.visible = true;
}

table.addEventListener('click', function(e) {
	
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
	survey.isEdit = false;
	survey.open({
		animated : true
	});
	
	win.backButton = null;
	win.prevButton = null;
	win.nextButton = null;
	win.filterTermField = null;
	win.filterData = null;
	win.label1 = null;
	table.setData([]);
	win.table = null;
	
	win.close();
	win = null;
});

loadSurveys(currentPage);
win.add(backButton);
win.add(prevButton);
win.add(resetData);
win.add(pageLabel);
win.add(nextButton);
win.add(filterTermField);
win.add(filterData);
win.add(label1);
win.add(loadingLabel);