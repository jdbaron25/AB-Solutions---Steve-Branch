Ti.App.UploadError = false;
function testXhr(completedSurveys)
{
	if(Ti.App.isXHRReady == 0 && Ti.App.isImageXHRReady == true && completedSurveys.isValidRow())
	{	
		var resultID = completedSurveys.fieldByName('survey_result_id');
		console.log("***** THE RESID = " + resultID);
		var sn = completedSurveys.fieldByName('serial_number');
		console.log("***** SN = " + sn);
		var data = getSurveyResults(resultID);
		var params = "data=" + escape(data);
		completedSurveys.next();

		var xhr = Titanium.Network.createHTTPClient();
		//xhr.cache = true;
		console.log(Ti.App.credentials.url.up);
		xhr.open("POST", Ti.App.credentials.url.up);
		xhr.setRequestHeader("ABSOLDATASYNC_USERNAME", Ti.App.credentials.auth.loginUserID);
		xhr.setRequestHeader("ABSOLDATASYNC_TOKEN", Ti.App.credentials.auth.loginToken);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("Content-length", params.length);
		Ti.App.isXHRReady++;

		xhr.onload = function() {
			console.log("testxhr onload");
			var result = 'Error';
			Ti.API.info('RAW =' + this.responseText);
			console.log(this.responseText + " - " + this.readyState + " - " + this.status);
			if (this.status == '200' && this.readyState == 4)
			{
				var dataResponse = JSON.parse(this.responseText);
				console.log("***** " + dataResponse.success);
				if (dataResponse.success == true)
				{
					Ti.App.SurveyCompletion[resultID] = {};
					Ti.App.SurveyCompletion[resultID].dataUploadComplete = true;
					
					result = "Upload Successful";
					Ti.App.uploadSuccessCount++;
					console.log("Sucessfully uploaded "+resultID +". Increasing successCount to  "+Ti.App.uploadSuccessCount);
					activity.message = " - Uploading Data (" + Ti.App.uploadSuccessCount + "/" + Ti.App.uploadTotalCount + ")  Images: (" + Ti.App.uploadedImageSuccessCount + "/" + Ti.App.uploadImageTotalCount + ")";
					sendImages(resultID, sn);
					
					var conn = Titanium.Database.open('mysdb');
					conn.execute('UPDATE surveyResultsComplete SET uploaded=? WHERE survey_result_id=?', "y", resultID);
					conn.close();
					console.log("***** Setting " + resultID + " to complete");
				}
				Ti.App.isXHRReady--;
			}
			else
			{
				result = this.responseText + " - " + this.readyState + " - " + this.status;
			}
			console.log(result);
		};
		
		xhr.onerror =  function(e) {
			// this function is called when an error occurs, including a timeout
			// delete completedSurveys;
			// Ti.App.SurveyCompletion = [];
			console.log("request Status: "+this.status);
			Ti.App.UploadError = true;
			Ti.App.isXHRReady--;
			console.log(this.responseText);
	        Ti.API.debug(e.error);
	        console.log(e.error);
	        alert("Upload Error: " + e.error);
	        activity.hide();
	        
      	};
		xhr.send(params);
	}
	else if(Ti.App.isXHRReady == 0 && !completedSurveys.isValidRow())
	{
		if(isUploadComplete())
		{
			//only show if actually complete
			if(!Ti.App.UploadError)
			{
				showUploadResult("All Uploads Complete!");
			}
			clearInterval(Ti.App.xhrTester);
			if(completedSurveys)
			{
				completedSurveys.close();	
			}
		}
	}
}

function isUploadComplete()
{
	var uploadComplete = true;
	var completionAr = Ti.App.SurveyCompletion;
	fullLoop:
	for(var i in completionAr)
	{
		var survey = completionAr[i];
		if(!survey.dataUploadComplete)
		{
			uploadComplete = false;
			console.log('survey.dataUploadComplete=>' + survey.dataUploadComplete);
		}
		var imagesForSurveyAr = survey.imagesToUploadComplete;
		for(var index in imagesForSurveyAr)
		{
			if(imagesForSurveyAr[index]==false)
			{
				uploadComplete = false;
				console.log(i + ": " +index + "");
			}
		}
	}
	if(uploadComplete)
	{
		console.log("Uploads have all been completed!");
	}
	else
	{
		console.log("Uploads are not complete yet.");	
	}
	return uploadComplete;
}

function upload(e) {
	var conn = Titanium.Database.open('mysdb');
	var completedSurveys = conn.execute('SELECT * FROM surveyResultsComplete WHERE complete=? AND uploaded=?', "y", "n");
	conn.close();
	console.log("***** FOUND " + completedSurveys.rowCount + " ROWS OF SURVEYS");
	Ti.App.isImageXHRReady = true;
	Ti.App.isXHRReady = 0;
	Ti.App.uploadSuccessCount = 0;
	Ti.App.uploadedImageSuccessCount = 0;
	Ti.App.uploadTotalCount = completedSurveys.rowCount;
	Ti.App.uploadImageTotalCount = 0;
	Ti.App.SurveyCompletion = [];	
	Ti.App.xhrTester = setInterval(function () {
		testXhr(completedSurveys);
	}, 2000);
}

function sendImages(resiD, sn) {
	var conn = Titanium.Database.open('mysdb');
	var imagesForStatusTracking = conn.execute('SELECT * FROM imageData WHERE resID=?', resiD);
	
	Ti.App.SurveyCompletion[resiD].imagesToUploadComplete = {};//to keep track of what images have been uploaded 
	
	Ti.App.SurveyImageBSHoldingArray = [];
	Ti.App.SurveyImageBSHoldingArray[resiD] = [];
	
	Ti.App.imagesCount = imagesForStatusTracking.rowCount;
	Ti.App.imagesCurrentCount = 0;
	Ti.App.uploadImageTotalCount+= Ti.App.imagesCount;
	
	while (imagesForStatusTracking.isValidRow())
	{
		var propName = imagesForStatusTracking.fieldByName('filename');
		Ti.App.SurveyCompletion[resiD].imagesToUploadComplete[propName] = false;
		Ti.App.SurveyImageBSHoldingArray[resiD].push(propName);
		
		imagesForStatusTracking.next();
	}
	imagesForStatusTracking.close();
	conn.close();
	
	//var conn = Titanium.Database.open('mysdb');
	//var tidSearch = conn.execute('SELECT serial_number FROM surveyResultsComplete WHERE survey_result_id=?', resiD);
	//var tid = tidSearch.fieldByName('serial_number');
	//conn.close();
	
	console.info(Ti.App.SurveyImageBSHoldingArray[resiD].length + " images to upload for "+ resiD);
	//console.info(Ti.App.SurveyImageBSHoldingArray[resiD].length + " images to upload for "+ sn);
	for(i=0;i<Ti.App.SurveyImageBSHoldingArray[resiD].length;i++)
	{
		sendImageCallback(Ti.App.SurveyImageBSHoldingArray[resiD][i],resiD,sn);	
	}
}

function sendImageCallback(filename,resiD,tid)
{
	activity.message = " - Uploading Data (" + Ti.App.uploadSuccessCount + "/" + Ti.App.uploadTotalCount + ") Images: (" + Ti.App.uploadedImageSuccessCount + "/" + Ti.App.uploadImageTotalCount + ")";
	//var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename);
	var file = Ti.Filesystem.getFile('file:///sdcard/absimages/' + tid + '/', filename);
	if (file.exists()) {
		var data_to_send = {
			"file" : file.read(),
			//"name" : filename + ".jpg",
			"name" : filename,
			"survey_result_id" : resiD
		};
		var xhr2 = Titanium.Network.createHTTPClient();
		xhr2.cache = true;
		xhr2.open("POST", Ti.App.credentials.url.uploadImage);
		xhr2.onload = function() {
			if (this.status == '200' && this.readyState == 4)
			{
				var dataResponse = JSON.parse(this.responseText);
				console.log(this.responseText);
				//alert(xhr2.getCache);
				console.log("!!!!!We received a 200 from the server for "+filename + "=>"+dataResponse.success);
				if (dataResponse.success == true)
				{
					Ti.App.uploadedImageSuccessCount++;
					console.log("********************************************************");
					console.log("Image [" + filename + "] uploaded for "+resiD);
					Ti.App.SurveyCompletion[resiD].imagesToUploadComplete[filename] = true;
					console.log("********************************************************");
					activity.message = " - Uploading Data (" + Ti.App.uploadSuccessCount + "/" + Ti.App.uploadTotalCount + ") Images: (" + Ti.App.uploadedImageSuccessCount + "/" + Ti.App.uploadImageTotalCount + ")";
				}
			}
		};
		xhr2.onerror = function(e){
			alert(e.error);
		};
		
		xhr2.setRequestHeader("ABSOLDATASYNC_USERNAME",  Ti.App.credentials.auth.loginUserID);
		xhr2.setRequestHeader("ABSOLDATASYNC_TOKEN",  Ti.App.credentials.auth.loginToken);
		xhr2.send(data_to_send);
		console.log("Image "+filename+" has been queued for upload");
	}
}

function getSurveyResults(resID) {
	var conn = Titanium.Database.open('mysdb');
	var completedSurveys2 = conn.execute('SELECT * FROM surveyResultsComplete WHERE survey_result_id=?', resID);
	var results = '';
	while (completedSurveys2.isValidRow()) {
		var resID = completedSurveys2.fieldByName('survey_result_id');
		var header = conn.execute('SELECT terminal_id, survey_Date, user_id, terminal_inaccessible, terminal_access_attempt, entered_date FROM responseHeader WHERE survey_result_id=?', resID);
		while (header.isValidRow()) {
			var termID = header.fieldByName('terminal_id');
			var surveyDiate = header.fieldByName('survey_Date');
			var userID = header.fieldByName('user_id');
			var termInaccess = header.fieldByName('terminal_inaccessible');
			var termAccessAtt = header.fieldByName('terminal_access_attempt');
			var enteredDate = header.fieldByName('entered_date');
			header.next();
		}
		header.close();

		var responses = conn.execute('SELECT * FROM responses WHERE survey_result_id=?', resID);
		var resultContents = '{';
		resultContents += '"termnial_id":"' + termID + '",';
		resultContents += '"survey_date":"' + surveyDiate + '",';
		resultContents += '"user_id":"' + userID + '",';
		resultContents += '"terminal_inaccessible":' + termInaccess + ',';
		resultContents += '"terminal_access_attempt":"' + termAccessAtt + '",';
		resultContents += '"enteredDate":"' + enteredDate + '",';
		resultContents += '"SurveyResultQuestion":{';
		if(termInaccess!=1)
		{
			while (responses.isValidRow()) {
				resultContents += '"' + responses.fieldByName('question_id') + "\":{";
				resultContents += '"question_text":"' + encodeURIComponent(responses.fieldByName('question_text').replace('\\', '\\\\').replace(/"/g, '\\"')) + '",';
				//resultContents += '"value":"' + responses.fieldByName('value') + '",';
				resultContents += '"value":"' + encodeURIComponent(responses.fieldByName('value').replace('\\', '\\\\').replace(/"/g, '\\"')) + '",';
				resultContents += '"comments":"' + encodeURIComponent(responses.fieldByName('comments').replace('\\', '\\\\').replace(/"/g, '\\"')) + '",';
				// resultContents += '"comments":"' + responses.fieldByName('comments').replace('\\', '\\\\').replace('"', '\\"') + '",';
				resultContents += '"question_type":"' + responses.fieldByName('question_type') + '"';
				resultContents += '},';
				responses.next();
			}
		
			console.log(resultContents);
			resultContents = resultContents.substr(0, resultContents.length - 1);
		}
		
		responses.close();
		resultContents += '}';
		resultContents += '}';
		results += (results === '' ? '' : ',');
		results += "\"" + resID + "\":" + resultContents;
		completedSurveys2.next();
	}
	completedSurveys2.close();
	conn.close();
	console.log("{" + results + "}");
	return "{" + results + "}";
}
