var win = Ti.UI.currentWindow;

win.backgroundColor = '#fff';
Titanium.UI.Android.hideSoftKeyboard();

var conn = Titanium.Database.open('mysdb');
var data = conn.execute('SELECT * FROM settings LIMIT 1');
conn.close();

if (data.rowCount < 1) {
	var conn = Titanium.Database.open('mysdb');
	conn.execute('INSERT OR REPLACE INTO settings(imageWidth, imageHeight) VALUES (?,?)', 1024, 768);
	conn.close();
	var imageWidth = 1024;
	var imageHeight = 768;
} else {
	var imageWidth = data.fieldByName('imageWidth');
var imageHeight = data.fieldByName('imageHeight');
};



var headerLabel = Ti.UI.createLabel({
	color : '#000',
	font : {
		fontSize : Ti.App.fontSizes.f1,
	},
	text : 'Settings and Configuration',
	top : 0,
	textAlign:"right",
	left : 0,
	
	width : Titanium.UI.FILL,
	height : 'auto'
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

var widthLabel = Ti.UI.createLabel({
	color : '#000',
	font : {
		fontSize : Ti.App.fontSizes.f1,
	},
	text : 'Image Width',
	top : 400,
	left : 0,
	width : Titanium.UI.FILL,
	height : 'auto'
});

var widthField = Ti.UI.createTextField({
	width: 200,
	top : 400,
	left : 300,
	backgroundColor: 'transparent',
	color : '#000000',
	borderWidth : 1,
	borderColor : '#CCCCCC',
	value : imageWidth,
	font : {
		fontSize : Ti.App.fontSizes.f1,
	}
});

var heightLabel = Ti.UI.createLabel({
	color : '#000',
	font : {
		fontSize : Ti.App.fontSizes.f1,
	},
	text : 'Image Height',
	top : 500,
	left : 0,
	width : Titanium.UI.FILL,
	height : 'auto',
	
});

var heightField = Ti.UI.createTextField({
	width: 200,
	top : 500,
	left : 300,
	backgroundColor: 'transparent',
	color : '#000000',
	borderWidth : 1,
	borderColor : '#CCCCCC',
	value : imageHeight,
	font : {
		fontSize : Ti.App.fontSizes.f1,
	}
});

backButton.addEventListener('click', function() {
	var conn = Titanium.Database.open('mysdb');
	conn.execute('DELETE FROM settings');
	conn.execute('INSERT OR REPLACE INTO settings(imageWidth, imageHeight) VALUES (?,?)', widthField.value, heightField.value);
	conn.close();
	
	var homeWin = Titanium.UI.createWindow({
		url : 'window2.js',
		//title : 'Active Surveys'
	});
	homeWin.open({
		//animated : true
	});
	win.close();
});

win.add(headerLabel);
win.add(widthLabel);
win.add(widthField);
win.add(heightField);
win.add(heightLabel);
win.add(backButton);
