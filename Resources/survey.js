Titanium.include('questionBuilder.js');
Titanium.include('config.js');

var revID = Titanium.UI.currentWindow.revID;
var resID = Titanium.UI.currentWindow.resID;
var termID = Titanium.UI.currentWindow.termID;

var delimiter = Titanium.UI.currentWindow.titleStr.indexOf(" - ");
var tid = Titanium.UI.currentWindow.titleStr.substr(0, delimiter);
var isEdit = Titanium.UI.currentWindow.isEdit;

Ti.App.userID = Ti.App.credentials.auth.loginUserID;

//alert(tid);

var fontSize = Ti.App.fontSizes.f1;

var comments = new Array();
var left = Ti.App.positioning.p1 / 5;
var textColor = '#000';
var termInaccess = "0";
var top = 0;
var picNum = 0;
var win2 = Titanium.UI.createWindow({
	title : 'Survey Window',
});
var win2 = Ti.UI.currentWindow;
win2.backgroundColor = '#fff';

var view = Ti.UI.createView({
	borderRadius : 0,
	width : 'auto',
	height : 'auto',
	top : 0,
	//backgroundColor: 'Red',
});

var scrollView = Titanium.UI.createScrollView({
	contentWidth : 'match_parent',
	contentHeight : 'match_parent',
	//top : Ti.App.positioning.p1 / 1.5,
	top : 118,
	showVerticalScrollIndicator : true,
	showHorizontalScrollIndicator : false,
	//backgroundColor: 'Blue',
});

scrollView.addEventListener('scroll',  function(e){
	Titanium.UI.Android.hideSoftKeyboard();
});

//scrollView.addEventListener('swipe',  function(e){
//	Titanium.UI.Android.hideSoftKeyboard();
//});

var backButton = Titanium.UI.createButton({
	title : 'Back',
	//top : Ti.App.positioning.p1 / 5,
	//left : Ti.App.positioning.p1 / 5,
	top : 35,
	left : 35,
	height : 'auto',
	color : '#000000',
	backgroundColor : '#669999',
	font : {
		fontSize : Ti.App.fontSizes.f1,
	},
});
var resetButton = Titanium.UI.createButton({
	title : 'Reset',
	top : 35,
	right : 35,
	height : 'auto',
	color : '#000000',
	backgroundColor : '#669999',
	font : {
		fontSize : Ti.App.fontSizes.f1,
	},
});

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
} 

backButton.addEventListener('click', function() {
	var url = 'surveys_window.js';
	var title = 'Active Surveys';
	console.log(isEdit);
	if(isEdit==true)
	{
		console.log("editing, swap url and title");
		url = 'upload_Surveys.js';
		title = "Completed Surveys";
	}
	var homeWin = Titanium.UI.createWindow({
		url : url,
		title : title
	});
	homeWin.open({
		animated : true
	});
	win2.close();
});
resetButton.addEventListener('click', function() {
	confirmResetNotification.show();
});

var confirmResetNotification = Titanium.UI.createAlertDialog({
    title: 'Reset',
    message: 'Are you sure you wish reset this survey?\nYou will lose any unsaved changes.',
    buttonNames: ['Yes', 'No'],
    cancel: 1
});
confirmResetNotification.addEventListener('click', function(e){   
    if (e.cancel === e.index || e.cancel === true) {
    	return false;
    }
    else
    {
    	resetSurveyWindow();
    }
});
function resetSurveyWindow()
{
	console.log("reset!");
	var survey = Titanium.UI.createWindow({
		url : 'survey.js',
		title : 'Survey',
	});
	survey.revID = revID;
	survey.resID = resID;
	survey.termID = termID;
	survey.titleStr = Titanium.UI.currentWindow.titleStr;
	survey.isEdit = isEdit;
	survey.open({
		animated : true
	});	
	win2.close();	
	
}

top = 177;
var h = createHeader('Survey ID: ' + resID, textColor, fontSize, top, left);
view.add(h);
top = top + 50;
var h = createHeader('User ID: ' + Ti.App.userID, textColor, fontSize, top, left);
view.add(h);
top = top + 50;
var h = createHeader(Titanium.UI.currentWindow.titleStr, textColor, fontSize, top, left);
view.add(h);
top = top + 50;
var h = createHeader("Survey Date : ", textColor, fontSize, top, left);
view.add(h);

var surveyDate = Ti.UI.createTextField({
	top : top,
	right: '2%',
	height : 'auto',
	backgroundColor: 'transparent',
	color : '#000000',
	borderWidth : 1,
	borderColor : '#CCCCCC',
	enabled : false,
	width : '20%',
	font : {
		fontSize : Ti.App.fontSizes.f1,
	},
	value : getDate()
});

top = top + 50;

//var h = createHeader("Terminal Inaccessible : ", textColor, fontSize, top, left);
//view.add(h);
var checkbox = Ti.UI.createSwitch({
	style : Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
	title : "Terminal Inaccessible",
	value : false,
	borderWidth : 1,
	backgroundColor: 'transparent',
	borderColor : '#CCCCCC',
	color : '#000000',
	font : {
		fontSize : Ti.App.fontSizes.f1,
	},
	//top : 120,
	top : top,
	left : left
});

function getDate() {
	var currentDate = new Date();
	var month = currentDate.getMonth() + 1;
	var day = currentDate.getDate();
	var year = currentDate.getFullYear();
	return month + "/" + day + "/" + year;
}

checkbox.addEventListener('change', function(e) {
	if (checkbox.value == true) {
		inaccessDate.value = getDate();
		termInaccess = "1";
	} else {
		inaccessDate.value = "";
		termInaccess = "0";
	};
});

var inaccessDate = Ti.UI.createTextField({
	top : top + 15,
	right: '2%',
	height : 'auto',
	width : '20%',
	enabled : false,
	backgroundColor: 'transparent',
	borderColor : '#CCCCCC',
	borderWidth : 1,
	color : '#000000',
	font : {
		fontSize : Ti.App.fontSizes.f1,
	},
});

top = top + 50;
view.add(surveyDate);
view.add(checkbox);
view.add(inaccessDate);

top = top + 50;

var conn = Titanium.Database.open('mysdb');
//var questions = conn.execute('SELECT * FROM questions WHERE revID=? LIMIT 3', revID);
var questions = conn.execute('SELECT * FROM questions WHERE revID=?', revID);

while (questions.isValidRow()) {
	if (questions.fieldByName('type') == 'Heading') {
		var id = questions.fieldByName('question_id');
		var questionText = questions.fieldByName('qtext');
		top = top + 50;
		var q = CreateQuestionHeading(id, questionText, textColor, fontSize, top, left);
		view.add(q);
		top = top;
	}

	if (questions.fieldByName('type') == 'Question') {
		var id = questions.fieldByName('question_id');
		var questionText = questions.fieldByName('qtext');
		var q = CreateQuestion(id, questionText, textColor, fontSize, top, left);
		view.add(q);
		top = top + 50;
		var answerList = [];
		var answers = conn.execute('SELECT * FROM answers WHERE qid=?', questions.fieldByName('question_id'));
		answerList.push('');
		while (answers.isValidRow()) {
			answerList.push(answers.fieldByName('value'));
			answers.next();
		}
				
		var selectedAnswer = conn.execute('SELECT value, comments FROM responses WHERE survey_result_id = ? AND question_id = ? ',resID,id);
		
		if(selectedAnswer.rowCount>0 && !isEdit)
		{
			isEdit = true;
		}
		
		var a = CreateChoices(questions.fieldByName('question_id'), top, answerList, selectedAnswer);
		top = top + 10;
		view.add(a);
		var cArr = new Array();
		cArr[0] = questions.fieldByName('question_id');
		cArr[1] = CreateCommentField(cArr[0], top, textColor,selectedAnswer);
		comments.push(cArr);
		view.add(cArr[1]);
		top = top + 200;
		//top = top ;
	}
	questions.next();
}
conn.close();


var photoConfirmationDialog = Titanium.UI.createAlertDialog({
	title : 'Did you remember to take all your photos?',
	message : 'If you need to add additional photos, you may \ndo so in the "Completed Surveys" screen. \nContinue?',
	buttonNames : ['Yes', 'No'],
	cancel : 1,
});

photoConfirmationDialog.addEventListener('click', function(e) {
	if (e.index == 0) {
		saveSurvey();
	} else {
		//User clicked "No"
	}
});

var saveButton = Titanium.UI.createButton({
	title : 'Save',
	top : top + 40,
	height : 'auto',
	width : '90%',
	backgroundColor : '#669999',
	font : {
		fontSize : Ti.App.fontSizes.f1,
		fontWeight : 'bold',
	},
});

var activity = Ti.UI.createActivityIndicator({
	color : 'blue',
	message : ' - Saving Data',
	top : top,
	left : 70,
	height : 20,
	width : 'auto'
});

var takePhoto = Titanium.UI.createButton({
	title : 'Take Photos',
	top : 0,
	left:'2%',
	width : '45%',
	color : '#000000',
	height : 'auto',
	backgroundColor : '#669999',
	font : {
		fontSize : Ti.App.fontSizes.f1,
		fontWeight : 'bold',
	},
});
var saveButton2 = Titanium.UI.createButton({
	title : 'Save',
	top : 0,
	right:'2%',
	height : 60,
	width : '45%',
	color : '#000000',
	height : 'auto',
	backgroundColor : '#669999',
	font : {
		fontSize : Ti.App.fontSizes.f1,
		fontWeight : 'bold',
	},
});

view.add(saveButton);
view.add(activity);
view.add(backButton);
view.add(resetButton);

takePhoto.addEventListener('click', function(e) {
	var photosWin = Titanium.UI.createWindow({
		url : 'photos.js',
		title : 'Photos',
		width : 'auto'
	});
	photosWin.revID = revID;
	photosWin.resID = resID;
	photosWin.termID = termID;
	photosWin.tid = tid;

	photosWin.open({
		animated : true
	});
});

saveButton.addEventListener('click', function(e) {
	photoConfirmationDialog.show();
});
saveButton2.addEventListener('click', function(e) {
	photoConfirmationDialog.show();
});
function saveSurvey()
{
	activity.show();
	var conn = Titanium.Database.open('mysdb');
	var numPics = conn.execute('SELECT * FROM imageData WHERE resID=?', resID);
	
	var defMaps = [];
	if (termInaccess == "0") {
		//validation
		var questions2 = conn.execute('SELECT * FROM questions WHERE revid=?', revID);
		while (questions2.isValidRow()) {
			qid = questions2.fieldByName('question_id');
			qtext = questions2.fieldByName('qtext');
			if (questions2.fieldByName('type') !== 'Heading') {
				curAnswer = (Ti.App.picker[qid]);
				//Verify all questions are answered
				if (curAnswer == undefined || curAnswer == '') {
					var spaceNum = qtext.indexOf(" ");
					alert('No answer for question #' + qtext.substring(0, spaceNum));
					saveButton.enabled = true;
					activity.hide();
					return;
				}
			}
			questions2.next();
		}

		//var ans = conn.execute('SELECT * FROM answers WHERE value=? AND qid=? AND default_map!=?', curAnswer, qid, "");
		var ans = conn.execute('SELECT * FROM answers WHERE default_map!=? AND revID=?', "", revID);
		while (ans.isValidRow()) {
			// Parse JSON question constraints
			var defaultVal = JSON.parse(ans.fieldByName('default_map'));

			// "AND"s
			var outerState = false;
			var raisins = Array();

			for (key in defaultVal) {
				// "OR"s
				var innerState = false;
				var message = defaultVal[key];

				// Is message an array or a string?
				if ( typeof message == 'object') {
					for (var pa = 0; pa < message.length; pa++) {
						// Is chosen answer = one of the valid results?
						if (Ti.App.picker[key] == message[pa]) {
							innerState = true;
						}
					}

					// The chosen answer of the constraint did NOT match any of the valid results... fail the selection
					if (innerState == true) {
						outerState = true;
						raisins.push(key);
					}
				} else// Message is a string for direct comparison
				{
					// If chosen answer of the constraint is not message, then fail the selection
					if (Ti.App.picker[key] != message) {
						raisins.push(key);
						outerState = true;
					}
				}
			}

			// All of the contraint requirements matched... so check the answer that we gave
			if (outerState == true) {
				console.log("***Final Result: needs to be " + ans.fieldByName('value'));
				console.log("***Question picker array " + ans.fieldByName('qid') + " was: " + Ti.App.picker[ans.fieldByName('qid')]);
				// Check given answer of current question
				if (Ti.App.picker[ans.fieldByName('qid')] != ans.fieldByName('value')) {
					var questionText = conn.execute('SELECT qtext FROM questions WHERE question_id=?', ans.fieldByName('qid'));
					var errrr = "Question '" + questionText.fieldByName('qtext') + "' requires an answer of '" + ans.fieldByName('value') + "' because:\n";
					for (var raisin = 0; raisin < raisins.length; raisin++) {
						var raisinText = conn.execute('SELECT qtext AS raisin FROM questions WHERE question_id=?', raisins[raisin]);
						errrr += "Q: '" + raisinText.fieldByName('raisin') + " is '" + Ti.App.picker[raisins[raisin]] + "'\n";
					}
					alert(errrr);
					saveButton.enabled = true;
					activity.hide();
					return;
				} else {
					console.log("Question validation by constraint was successful.");
				}
			} else {
				console.log("Question constraints did not apply");
			}
			ans.next();
		}
		// Close answer result set
		ans.close();

		var qCommentReq = conn.execute('SELECT question_id, comment_req_mapping FROM questions WHERE revid=? AND comment_req_mapping!=\'\'', revID);
		while (qCommentReq.isValidRow()) {
			try {
				var qid = qCommentReq.fieldByName('question_id');
				var requirements = JSON.parse(qCommentReq.fieldByName('comment_req_mapping'));
				console.info('Checking comment req for qid:' + qid + ' - ' + qCommentReq.fieldByName('comment_req_mapping'));
				// loop through question requirements
				var commentRequired = true;
				for (reqQid in requirements) {
					var reqAnswers = requirements[reqQid];
					var answerMatched = false;
					for (var a = 0; a < reqAnswers.length; a++) {
						if (reqAnswers[a] === Ti.App.picker[reqQid]) {
							answerMatched = true;
							console.info('Answer Requirement Met.');
						}
					}
					if (!answerMatched) {
						console.info('Comment was not required');
						commentRequired = false;
					}
				}

				if (commentRequired) {
					var realcommentid = -1;
					// Find the right comment for this question
					console.info('Number of comments... ' + comments.length);

					for (var cid = 0; cid < comments.length; cid++) {
						if (comments[cid][0] == qid) {
							realcommentid = cid;
						}
					}

					if (realcommentid !== -1) {
						if (comments[realcommentid][1].getValue().length === 0) {
							var questionText = conn.execute('SELECT qtext FROM questions WHERE question_id=?', qid);
							var errrr = "Question '" + questionText.fieldByName('qtext') + "' requires a comment.";
							alert(errrr);

							saveButton.enabled = true;
							activity.hide();
							return;
						} else {
							console.info('A comment (that was required) was entered for qid: ' + qid);
						}
					} else {
						console.info('Under our current assumptions, this should never happen.. Something went horribly wrong!!!!');
						alert('A fatal error has occurred. Please contact your system administrator with the following info:{' + qid + ':' + realcommentid + '}');
					}
				}
			} catch(err) {
				alert('There was an error parsing the comment requirement of question #:' + qid + "\n Please contact your administrator and redownload the surveys after the issue is resolved. (Error was '" + err.message + "')");
				// Leave save button disabled because there is a fatal issue with the survey
				activity.hide();
				return;
			}
			qCommentReq.next();
		}
		// close question result set
		qCommentReq.close();

	};

	var questions2 = conn.execute('SELECT * FROM questions WHERE revid=?', revID);
	conn.execute("BEGIN IMMEDIATE TRANSACTION");
	while (questions2.isValidRow()) {
		qid = questions2.fieldByName('question_id');
		qtext = questions2.fieldByName('qtext');
		var index = -1;
		for (var i = 0; i < comments.length; i++) {
			if (comments[i][0] == qid) {
				index = i;
				break;
			}
		}
		//Titanium.UI.getCurrentTab
		if (questions2.fieldByName('type') !== 'Heading') {
			comText = comments[index][1].getValue();
		} else {
			comText = '';
		}

		if (questions2.fieldByName('type') !== 'Heading') {
			curAnswer = (Ti.App.picker[qid]);
		} else {
			curAnswer = '';
		}
		
		if(isEdit==true)
		{
			conn.execute('UPDATE responses SET value= ?, comments = ? WHERE survey_result_id = ? AND question_id = ?',curAnswer,comText,resID,qid); 
		}
		else
		{
			conn.execute('INSERT INTO responses(survey_result_id, question_id, question_type, question_text, value, comments) VALUES (?,?,?,?,?,?)', resID, qid, questions2.fieldByName('type'), qtext, curAnswer, comText);	
		}
			
		
		questions2.next();
	};
	rows = conn.execute('SELECT * from responses');
	
	conn.execute('DELETE FROM responseHeader WHERE survey_result_id=?', resID);
	conn.execute('INSERT INTO responseHeader (survey_result_id, terminal_id, survey_Date, user_id, terminal_inaccessible, terminal_access_attempt, entered_date) VALUES (?,?,?,?,?,?,?)', resID, termID, surveyDate.value, Ti.App.userID, termInaccess, inaccessDate.value, surveyDate.value);
		
	//mark survey complete
	conn.execute('UPDATE surveyResults SET complete =? WHERE survey_result_id=?', "y", resID);
	//move the completed survey to the new table
	conn.execute('INSERT INTO surveyResultsComplete SELECT *, 0 FROM surveyResults WHERE complete=?', "y");
	//delete the survey from the surveyResults table
	conn.execute('DELETE FROM surveyResults WHERE complete=?', "y");
	conn.execute("COMMIT TRANSACTION");
	conn.close();
	
// clear answers from ze sorbet
	Ti.App.picker = Array();
	activity.hide();
	//saveButton.enabled = true;
	alert('Survey Data Saved');
	scrollView.remove(view);
	win2.remove(scrollView);
	view = null;
	scrollView = null;
	
	var homeWin = Titanium.UI.createWindow({
		url : 'window2.js',
		title : 'Active Surveys'
	});
	homeWin.open({
		animated : true
	});
	
	win2.close();
}
scrollView.add(view);
win2.add(scrollView);
win2.add(takePhoto);
win2.add(saveButton2);
