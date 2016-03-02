Titanium.include('config.js');

function CreateQuestion(id, questionText, textColor, fontSize, top, left) {
	return Ti.UI.createLabel({
		text : questionText,
		color : textColor,
		font : {
			fontSize : fontSize,
		},
		top : top + 50,
		left : left,
	});
}



function CreateQuestionHeading(id, questionText, textColor, fontSize, top, left) {
	return Ti.UI.createLabel({
		text : "-----" + questionText + "-----",
		color : textColor,
		font : {
			fontSize : fontSize,
			fontWeight : 'bold',
		},
		top : top,
		left : left,
	});
}

function CreateCommentField(id, top, textColor, selectedAnswer) {
	var textArea = Ti.UI.createTextArea({
		height : 'auto',
		width : '90%',
		top : top + 150,
		//top = top + (Ti.App.positioning.p1 * 2.5),
		left : Ti.App.positioning.p1 / 5,
		backgroundColor : 'white',
		borderColor : 'gray',
		borderWidth : 2,
		id : "comment_" + id,
		font : {
			fontSize : Ti.App.fontSizes.f1,
			fontWeight : 'bold',
		},
		color : textColor,
		textAlign : 'left',
		borderWidth : 2,
		borderRadius : 5,
		//editable : false,
	});
	if (( typeof (selectedAnswer) != 'undefined') && selectedAnswer.rowCount > 0) {
		console.log("Comment on this question=>" + selectedAnswer.fieldByName('comments'));
		textArea.value = selectedAnswer.fieldByName('comments');
	}
	
	textArea.addEventListener('return', function(e) {
		//textArea.value = textArea.value.replace(/\n/g, '');
		textArea.value = textArea.value.replace(/\n/, '');
		textArea.blur();
	});
	return textArea;
}

function CreateChoices(id, top, answers, selectedAnswer) {
	var data = [];
	var selectedRow = null;
	for (var a = 0; a < answers.length; a++) {
		if (( typeof (selectedAnswer) != 'undefined') && selectedAnswer.rowCount > 0) {
			if (answers[a] == selectedAnswer.fieldByName('value')) {
				selectedRow = a;
			}
		}
		data[a] = Titanium.UI.createPickerRow({
			title : answers[a],
		});
	}
	var picker1 = Titanium.UI.createPicker({
		id : id,
		top : top + 75,
		left : Ti.App.positioning.p1 / 5,
		height : 'auto',
		backgroundColor : '#494949',
		borderWidth : 2,
		borderRadius : 5,
		borderColor : '#000000',
		selectionIndicator : true,
		focusable : true,
		width : '90%',
		font : {
			fontSize : Ti.App.fontSizes.f2,
		},
	});

	picker1.add(data);

	if (( typeof (selectedAnswer) != 'undefined') && selectedAnswer.rowCount > 0) {
		picker1.setSelectedRow(0, selectedRow, false);
		Ti.App.picker[id] = answers[selectedRow];
	}

	picker1.addEventListener('change', function(e) {
		Titanium.UI.Android.hideSoftKeyboard();
		eval("Ti.App.picker[" + id + "] = this.getSelectedRow(0).title");
		var conn = Titanium.Database.open('mysdb');
		var data = conn.execute('SELECT * FROM answers WHERE value=?', this.getSelectedRow(0).title);
		conn.close();
	});
	
	//picker1.addEventListener('click', function(e){
	//	Ti.App.textarea.comment_1.blur();
		
	//});
	
	return picker1;
}

function createHeader(text, textColor, fontSize, top, left) {
	return Ti.UI.createLabel({
		text : text,
		color : textColor,
		font : {
			fontSize : fontSize,
		},
		top : top,
		left : left,
	});
}