var win = Ti.UI.currentWindow;
Titanium.include('decrypt.js');
Titanium.include('upload.js');
Titanium.include('config.js');

win.backgroundColor = '#fff';
Titanium.UI.Android.hideSoftKeyboard();

var userInfoLabel = Ti.UI.createLabel({
	color : '#000',
	font : {
		fontSize : Ti.App.fontSizes.f1,
	},
	text : 'Hello'+(Ti.App.credentials.user.firstName!=null?" " + Ti.App.credentials.user.firstName + " " + Ti.App.credentials.user.lastName:"") + "!     ",
	top : 0,
	left : 0,
	textAlign:"right",
	width : Titanium.UI.FILL,
	height : 'auto'
});
win.add(userInfoLabel);

var filterlabel = Ti.UI.createLabel({
	color : '#000',
	font : {
		fontSize : Ti.App.fontSizes.f1,
	},
	text : 'Terminal Filter:',
	top : '10%',
	left : '10%',
	width : 'auto',
	height : 'auto'
});
win.add(filterlabel);

var filterTermField = Titanium.UI.createTextField({
	width: '50%',
	top : '10%',
	right : '5%',
	backgroundColor: 'transparent',
	color : '#000000',
	borderWidth : 1,
	borderColor : '#CCCCCC',
	font : {
		fontSize : Ti.App.fontSizes.f1,
	},
});


var open_Surveys = Titanium.UI.createButton({
	title : 'Open Surveys',
	top : '20%',
	width : Ti.App.buttonSizes.bw1,
	height : 'auto',
	color : '#000000',
	backgroundColor : '#669999',
	font : {
		fontSize : Ti.App.fontSizes.f1,
		fontWeight : 'bold',
	},
});
win.add(open_Surveys);

var width1 = Ti.App.buttonSizes.bw1;
var width2 = ((parseInt(Ti.App.buttonSizes.bw1) - 50) + '%');

var upload_Surveys = Titanium.UI.createButton({
	title : 'Completed Surveys',
	top : '30%',
	width : Ti.App.buttonSizes.bw1,
	height : 'auto',
	color : '#000000',
	backgroundColor : '#669999',
	font : {
		fontSize : Ti.App.fontSizes.f1,
		fontWeight : 'bold',
	},
});
win.add(upload_Surveys);

var downloadData = Titanium.UI.createButton({
	title : 'Download Data',
	top : '40%',
	height : 'auto',
	color : '#000000',
	width : Ti.App.buttonSizes.bw1,
	visible : false,
	backgroundColor : '#669999',
	font : {
		fontSize : Ti.App.fontSizes.f1,
	},
});
win.add(downloadData);

var uploadReset = Titanium.UI.createButton({
	title : 'Re-Upload Utility',
	top : '50%',
	height : 'auto',
	width : Ti.App.buttonSizes.bw1,
	color : '#000000',
	visible : false,
	backgroundColor : '#669999',
	font : {
		fontSize : Ti.App.fontSizes.f1,
	},
});
win.add(uploadReset);

var conflictCheckButton = Ti.UI.createButton({
	title : 'Check for Conflicts',
	top : '60%',
	height : 'auto',
	color : '#000000',
	width : Ti.App.buttonSizes.bw1,
	visible : false,
	backgroundColor : '#669999',
	font : {
		fontSize : Ti.App.fontSizes.f1,
	},
});
win.add(conflictCheckButton);

var logout = Titanium.UI.createButton({
	title : 'Logout',
	top : '70%',
	height : 'auto',
	color : '#000000',
	width : Ti.App.buttonSizes.bw1,
	visible : false,
	backgroundColor : '#669999',
	font : {
		fontSize : Ti.App.fontSizes.f1,
	},
});
win.add(logout);

var showUtilities = false;

var utilities = Titanium.UI.createButton({
	title : 'Utilities',
	top : '90%',
	height : 'auto',
	color : '#000000',
	width : Ti.App.buttonSizes.bw1,
	backgroundColor : '#669999',
	font : {
		fontSize : Ti.App.fontSizes.f1,
	},
});
win.add(utilities);

utilities.addEventListener('click', function() {
	if(showUtilities == false){
		downloadData.visible = true;
		uploadReset.visible = true;
		conflictCheckButton.visible = true;
		logout.visible = true;
		showUtilities = true;
	} else {
		downloadData.visible = false;
		uploadReset.visible = false;
		conflictCheckButton.visible = false;
		logout.visible = false;
		showUtilities = false;
	};
});

var activity = Ti.UI.createActivityIndicator({
	message : ' - Downloading Data',
	color : 'blue',
	top : '1%',
	left : '1%',
	height : 'auto',
	width : 'auto',
});
win.add(activity);

var versionInfoLabel = Ti.UI.createLabel({
	color : '#000',
	font : {
		fontSize : Ti.App.fontSizes.f2,
	},
	text : 'Version '+ Ti.App.getVersion() +'   Host: '+Ti.App.credentials.url.host,
	bottom : 0,
	left : 0,
	textAlign:"right",
	width : 'auto',
	height : 'auto'
});
win.add(versionInfoLabel);

upload_Surveys.addEventListener('click', function() {
	var uploadSurveysWin = Titanium.UI.createWindow({
		url : 'upload_Surveys.js',
		title : 'Closed Surveys Available for Upload'
	});
	uploadSurveysWin.open({
		animated : true
	});
	win.close();
});

userInfoLabel.addEventListener('click', function() {
	var configWin = Titanium.UI.createWindow({
		url : 'configWin.js',
		title : 'Settings and Configuration'
	});
	configWin.open({
		animated : true
	});
	win.close();
});

open_Surveys.addEventListener('click', function() {
	Ti.App.surveyFilter = filterTermField.value;

	var tabGroup2 = Titanium.UI.createTabGroup();
	var surveysWin = Titanium.UI.createWindow({
		url : 'surveys_window.js',
		//url : 'backup.js',
		title : 'Active Surveys'
	});
	surveysWin.open();
	win.close();
	win = null;
});

uploadReset.addEventListener('click', function() {
	var resetWin = Titanium.UI.createWindow({
		url : 'reset_surveys_window.js',
		title : 'Reset Surveys'
	});
	resetWin.open({
		animated : true
	});
	win.close();
	win = null;
});

conflictCheckButton.addEventListener('click', function() {
	var conflictSurveysWin = Titanium.UI.createWindow({
		url : 'conflictCheck.js',
		title : 'Check for Conflicts'
	});

		conflictSurveysWin.open({
		animated : true
	});
});

logout.addEventListener('click', function() {
	confirmLogoutNotification.show();
});

var confirmLogoutNotification = Titanium.UI.createAlertDialog({
    title: 'Logout',
    message: 'Are you sure you wish log out?\nYou must have internet connectivity to log in again.',
    buttonNames: ['Yes', 'No'],
    cancel: 1
});

confirmLogoutNotification.addEventListener('click', function(e){
    var loginWin = Titanium.UI.createWindow({
	    url:'loginWindow.js',
	    title:'Log into Survey Application',
	    backgroundColor: '#fff'
	});
    
    if (e.cancel === e.index || e.cancel === true) {
    	return false;
    }
    if (e.index === 0){
      var conn = Titanium.Database.open('mysdb');
		//clear auth data
		conn.execute('DELETE FROM authData');
		conn.close();
		
		loginWin.open();
		win.close();
    }
});

downloadData.addEventListener('click', function() {
	console.log('***** Checking connection');
	activity.show();
	if (Titanium.Network.networkType == Titanium.Network.NETWORK_NONE) {
		alert('Internet connection not detected.  Download disabled.');
		return;
	};

	activity.show();
	downloadData.enabled = false;
	var url = Ti.App.credentials.url.down + Ti.App.credentials.auth.loginUserID + "/?decode";
	console.log(url);

	var loginUserID = Ti.App.credentials.auth.loginUserID;
	var loginToken = Ti.App.credentials.auth.loginToken;
	
	console.log(loginUserID + ": " + loginToken);
	var client = Ti.Network.createHTTPClient({
		onerror : function(e) {
			Ti.API.error('Bad Sever =>' + e.error);
			alert("Error attempting to access server : " + e.error);
			console.log(this.responseText);
			downloadData.enabled = true;
			activity.hide();
		},

		onload : function() {
			var conn = Titanium.Database.open('mysdb');

			//move completed surveys to surveyResultsComplete table
			conn.execute('INSERT INTO surveyResultsComplete SELECT *,0 FROM surveyResults WHERE complete=?', "y");
			conn.execute('DELETE FROM surveyResults WHERE complete=?', "y");
			
			var resCount = conn.execute('SELECT * FROM surveyResults');
			var resCompCount = conn.execute('SELECT * FROM surveyResultsComplete');

			conn.execute('DROP TABLE IF EXISTS surveyResults');
			conn.execute('DROP TABLE IF EXISTS questions');
			conn.execute('DROP TABLE IF EXISTS answers');
			conn.execute('DROP TABLE IF EXISTS terminals');
			conn.execute('CREATE TABLE IF NOT EXISTS surveyResults (terminal TEXT, survey_result_id TEXT, survey_revision_id TEXT, complete TEXT, uploaded TEXT, serial_number TEXT)');
			conn.execute('CREATE TABLE IF NOT EXISTS questions (revID TEXT, qtext TEXT, qorder TEXT, type TEXT, has_comment TEXT, comment_req_mapping TEXT, question_id TEXT)');
			conn.execute('CREATE TABLE IF NOT EXISTS answers (qid TEXT, id TEXT, value TEXT, qorder TEXT, default_map TEXT, revID TEXT)');
			conn.execute('CREATE TABLE IF NOT EXISTS terminals (id TEXT, serialnumber TEXT, location TEXT, street TEXT, city TEXT, state TEXT, zip TEXT)');
			conn.execute('CREATE TABLE IF NOT EXISTS imageData(resiD TEXT, termID TEXT, filename TEXT)');
			conn.execute('CREATE TABLE IF NOT EXISTS responseHeader (survey_result_id TEXT, terminal_id TEXT, survey_Date TEXT, user_id TEXT, terminal_inaccessible TEXT, terminal_access_attempt TEXT, entered_date TEXT)');
			conn.execute('CREATE TABLE IF NOT EXISTS responses (survey_result_id TEXT, question_id TEXT, question_type TEXT, question_text TEXT, value TEXT, comments TEXT)');

			var data = JSON.parse(this.responseText);
			var surveyResultsCount = data.surveyResults.length;

			conn.execute("BEGIN IMMEDIATE TRANSACTION");
			var terminalLoops = 0;

			for (var x = 0; x < (data.terminals.length); x++) {
				conn.execute('INSERT INTO terminals(id, serialnumber, location, street, city, state, zip) VALUES (?,?,?,?,?,?,?)', data.terminals[x].id, data.terminals[x].serialnumber, data.terminals[x].location, data.terminals[x].street, data.terminals[x].city, data.terminals[x].state, data.terminals[x].zip);
				terminalLoops++;
			}

			var sn = conn.execute('SELECT id, serialnumber FROM terminals');
			var termserials = Array();
			while (sn.isValidRow()) {
				termserials[sn.fieldByName('id')] = sn.fieldByName('serialnumber');
				sn.next();
			}
			sn.close();
			for (var i = 0; i < data.surveyResults.length; i++) {
				conn.execute('INSERT INTO surveyResults(terminal, survey_result_id, survey_revision_id, complete, uploaded, serial_number) VALUES (?,?,?,?,?,?)', data.surveyResults[i].terminal, data.surveyResults[i].survey_result_id, data.surveyResults[i].survey_revision_id, "n", "n", termserials[data.surveyResults[i].terminal]);
			}
			
			termserials = Array();
			for (var surveyresult_id in data.questions) {
				questionset = data.questions[surveyresult_id];
				for (var i = 0; i < questionset.length; i++) {
					conn.execute('INSERT INTO questions(revID, qtext, qorder, type, has_comment, comment_req_mapping, question_id) VALUES (?,?,?,?,?,?,?)', surveyresult_id, questionset[i].text, questionset[i].order, questionset[i].type, questionset[i].has_commnet, questionset[i].comment_req_mapping, questionset[i].question_id);
					if (questionset[i].type == 'Question') {
						for (var a = 0; a < (questionset[i].answers.length); a++) {
							conn.execute('INSERT INTO answers(qid, id, value, qorder, default_map, revID) VALUES (?,?,?,?,?,?)', questionset[i].question_id, questionset[i].answers[a].id, questionset[i].answers[a].value, questionset[i].answers[a].order, questionset[i].answers[a].default_map, surveyresult_id);
						}
					}
				}
			}
			conn.execute("COMMIT TRANSACTION");
			conn.close();
			console.log("*** Data Transfer COMPLETED ***");
			var successDialog = Ti.UI.createAlertDialog({
				message : 'Successfully Downloaded ' + terminalLoops + ' Terminals',
				ok : 'Okay',
				title : 'Success!'
			}).show();
			activity.hide();
			downloadData.enabled = true;
		},
	});
	client.open("GET", url);
	client.setRequestHeader("ABSOLDATASYNC_USERNAME", loginUserID);
	client.setRequestHeader("ABSOLDATASYNC_TOKEN", loginToken);
	client.send();
});
win.add(filterTermField);
filterTermField.blur();

/*Inactive features
var backupSurveys = Titanium.UI.createButton({
	title : 'Backup Completed Surveys',
	top : 630,
	left : 30,
	right : 30,
	height : 60,
	font : {
		fontSize : 30,
		fontWeight : 'bold',
	},
});
win.add(backupSurveys);

var queryBrowserButton = Ti.UI.createButton({
	title : 'View Tables',
	bottom : 100,
	left : 30,
	height : 60,
	font : {
		fontSize : 30,
		fontWeight : 'bold',
	},
});

queryBrowserButton.addEventListener('click', function() {
	var queryBrowserWin = Titanium.UI.createWindow({
		url : 'queryBrowser.js',
		title : 'View Tables'
	});
	queryBrowserWin.open({
		animated : true
	});
});

var take_Photos = Titanium.UI.createButton({
	title : 'Take Photos',
	top : 390,
	left : 30,
	right : 30,
	height : 60,
	font : {
		fontSize : 30,
		fontWeight : 'bold',
	},
});

var logo_fn=Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,'images/logo.jpg');
var logo=Titanium.UI.createImageView({
    image:logo_fn,
    top:10,
    left:10,
    width:161,
    height:72
});
win.add(logo);
*/

