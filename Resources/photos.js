var win2 = Ti.UI.currentWindow;
win2.backgroundColor = '#fff';
var revID = Titanium.UI.currentWindow.revID;
var resID = Titanium.UI.currentWindow.resID;
var termID = Titanium.UI.currentWindow.termID;
var tid = Titanium.UI.currentWindow.tid;
var topVal = 100;
var leftVal = 10;
var rowMaxCount = 3;
Titanium.include('config.js');

var conn = Titanium.Database.open('mysdb');
var data = conn.execute('SELECT * FROM settings LIMIT 1');
conn.close();

if (data.rowCount < 1) {
	var imageWidth = 1024;
	var imageHeight = 768;
} else {
	var imageWidth = data.fieldByName('imageWidth');
	var imageHeight = data.fieldByName('imageHeight');
};

console.log(imageWidth + ' x ' + imageHeight);

var _storage = Ti.Filesystem.applicationDataDirectory;
if (Ti.Filesystem.isExternalStoragePresent()) {
	_storage = 'file:///sdcard/';
	console.log('Setting file:///sdcard/');
};

//alert(tid);

var folder = Ti.Filesystem.getFile(_storage, 'absimages/' + tid);
if (!folder.exists()) {
	folder.createDirectory();
	var saveLocation = 'absimages/' + tid + '/';
	console.log('folder not there, setting');
} else {
	console.log('did not find or set the folder for some reason');
}

var conn = Titanium.Database.open('mysdb');
var picNum = conn.execute('SELECT COUNT(*) AS picNum FROM imageData WHERE resiD=? AND termID=?', resID, termID).fieldByName('picNum');
conn.close();

var table = Titanium.UI.createTableView({
	editable : true,
	moveable : false,
	backgroundColor : '#fff',
	separatorColor : '#000',
	top : Ti.App.positioning.p1 * 2,
	height : 'auto',
	headerTitle : 'Images',
	footerTitle : ' ',
	allowsSelection : false,
	//rowHeight : (Ti.App.positioning.p1 * 2) + 10,
});

buildImages();

var close = Titanium.UI.createButton({
	title : 'Back to Survey',
	top : Ti.App.positioning.p1 / 10,
	width : Ti.App.buttonSizes.bw1,
	height : 'auto',
	color : '#000000',
	backgroundColor : '#669999',
	font : {
		fontSize : Ti.App.fontSizes.f2,
	},
});

var takePhoto = Titanium.UI.createButton({
	title : 'Take a Photo',
	top : Ti.App.positioning.p1,
	width : Ti.App.buttonSizes.bw1,
	height : 'auto',
	color : '#000000',
	backgroundColor : '#669999',
	font : {
		fontSize : Ti.App.fontSizes.f2,
	},
});

close.addEventListener('click', function(e) {
	wipeTable();
	win2.close();
	Ti.Gesture.removeEventListener('orientationchange', adjustGalleryLayout);
});

var deleteConfirmationDialog = Titanium.UI.createAlertDialog({
	title : 'Delete Image?',
	message : 'You are about to delete this image. Continue?',
	buttonNames : ['Yes', 'No'],
	cancel : 1
});

deleteConfirmationDialog.addEventListener('click', function(e) {
	if (e.index == 0) {
		var image = this.target;
		var image_thumb = this.target.replace('.jpg', '') + "_thumb";
		var file = Titanium.Filesystem.getFile('file:///sdcard/absimages/' + tid + '/', image);
		//var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, image);
		var file_thumb = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, image_thumb);
		if (file.exists()) {
			file.deleteFile();
		}
		if (file_thumb.exists()) {
			file_thumb.deleteFile();
		}

		var conn = Titanium.Database.open('mysdb');
		conn.execute('DELETE FROM imageData WHERE filename=?', image);
		conn.close();
		deletedDialog.show();

		buildImages();
	} else {
		//code to execute when the user clicked No
	}
});

var deletedDialog = Titanium.UI.createAlertDialog({
	title : 'Image Deleted',
	message : 'Image Has been Deleted',
	buttonNames : ['Ok'],
	cancel : 1
});

function wipeTable() {
	var td = [];
	table.removeAllChildren();
	table.data = td;
	table.setData([]);
}

function buildImages() {
	var screenWidth = Titanium.Platform.displayCaps.platformWidth;
	var screenHeight = Titanium.Platform.displayCaps.platformHeight;
	console.log(screenWidth + ' x ' + screenHeight);

	wipeTable();
	var conn = Titanium.Database.open('mysdb');
	var currentImages = conn.execute('SELECT * FROM imageData WHERE resiD=? AND termID=?', resID, termID);

	picNum = currentImages.rowCount;
	conn.close();
	console.log("***** Found " + currentImages.rowCount + " images");

	var rowCurrentImageCount = 0;
	var row = Ti.UI.createTableViewRow({});
	row.height = "auto";
	var spacerRow = Ti.UI.createTableViewRow({});
	spacerRow.height = 10;

	while (currentImages.isValidRow()) {
		//var image = Titanium.Filesystem.getFile('file:///sdcard/absimages/' + resID + '/', currentImages.fieldByName('filename'));
		//var image = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, currentImages.fieldByName('filename'));
		var image = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, currentImages.fieldByName('filename').replace('.jpg', '') + "_thumb");
		if (!image.exists()) {
			image = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'images/badThumb.png');
			imageOriginal = null;
		}

		var imageView = Ti.UI.createImageView({
			width : 'auto',
			height : 'auto',
			borderRadius : 20,
			borderColor : 'white',
			horizontalWrap : true,
			image : image,
			left : (10 + (rowCurrentImageCount * 500)),
			actualImageName : currentImages.fieldByName('filename'),
		});

		var imageLabel = Ti.UI.createLabel({
			width : 100,
			width : Ti.App.positioning.p1 * 2,
			height : 20,
			top : 110,
			text : currentImages.fieldByName('filename'),
			left : (10 + (rowCurrentImageCount * 400)),
		});

		row.add(imageView);
		rowCurrentImageCount++;
		console.log("Image on row count = " + rowCurrentImageCount);
		if (rowCurrentImageCount >= rowMaxCount) {
			console.log("We are starting a new row.");
			table.appendRow(row);
			table.appendRow(spacerRow);
			console.log("Row appended to table. Resetting row & rowCurrentImageCount");
			row = Ti.UI.createTableViewRow({});
			rowCurrentImageCount = 0;
		}

		//Delete Image
		imageView.addEventListener('longpress', function(e) {
			deleteConfirmationDialog.target = this.actualImageName;
			deleteConfirmationDialog.show();
		});
		//Display large view image
		imageView.addEventListener('click', function(e) {
			var imageViewlarge = Ti.UI.createImageView({
				image : Titanium.Filesystem.getFile('file:///sdcard/absimages/' + tid + '/', this.actualImageName),
				//image : Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, this.actualImageName),
			});
			imageViewlarge.addEventListener('click', function(e) {
				win2.remove(imageViewlarge);
			});
			win2.add(imageViewlarge);
		});
		currentImages.next();
	};
	if (rowCurrentImageCount != 0) {
		table.appendRow(row);
	}
};

takePhoto.addEventListener('click', function(e) {
	Titanium.UI.Android.hideSoftKeyboard();
	takePictures();
});
var adjustGalleryLayout = function(e) {
	if (e.source.isLandscape()) {
		rowMaxCount = 3;
	} else//assume portait
	{
		rowMaxCount = 3;
	}

	buildImages();
};
Ti.Gesture.addEventListener('orientationchange', adjustGalleryLayout);

function padPicNum() {
	return (picNum >= 0 && picNum < 10) ? "0" + picNum : picNum;
}

function takePictures() {

	var screenWidth = Titanium.Platform.displayCaps.platformWidth;
	var screenHeight = Titanium.Platform.displayCaps.platformHeight;

	Titanium.Media.showCamera({

		showControls : true,
		mediaTypes : Ti.Media.MEDIA_TYPE_PHOTO,
		autohide : true,
		allowEditing : true,
		autorotate : false,
		saveToPhotoGallery : false,
		success : function(event) {

			var image = event.media;

			//alert(image.width + ' x ' + imageHeight);

			var paddedPicNum = padPicNum();
			var filename = resID + "_" + paddedPicNum + ".jpg";
			var filenameshort = resID + "_" + paddedPicNum;
			var file = Ti.Filesystem.getFile('file:///sdcard/absimages/' + tid + '/', filename);
			//var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename);
		
			while (file.exists()) {
				picNum++;
				paddedPicNum = padPicNum();
				filename = resID + "_" + paddedPicNum;
				var file = Ti.Filesystem.getFile('file:///sdcard/absimages/' + tid + '/', filename);
				//file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename);
			}

			file.write(image);
			
			Ti.Filesystem.getFile('file:///sdcard/absimages/' + tid + '/', filename).write(image.imageAsResized(imageWidth, imageHeight));
			console.log("Got image from camera & saved it");
			//Save image association
			var conn = Titanium.Database.open('mysdb');
			conn.execute('INSERT OR REPLACE INTO imageData(resID, termID, filename) VALUES (?,?,?)', resID, termID, filename);
			conn.close();
			file = null;

			console.log("About to create thumbnail...");
			try {
				Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filenameshort + "_thumb").write(image.imageAsResized(500, 400));
			} catch(e) {
				console.log(e.message);
			}
			delete image;
			picNum++;
			buildImages();
			win2.add(table);
		},
	});
}

win2.add(table);
win2.add(takePhoto);
win2.add(close);
