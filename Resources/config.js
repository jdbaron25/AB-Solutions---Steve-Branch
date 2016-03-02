var dpi = Titanium.Platform.displayCaps.dpi;

if(Titanium.Platform.displayCaps.platformWidth > Titanium.Platform.displayCaps.platformHeight){
	var screenVar = Titanium.Platform.displayCaps.platformHeight;
} else {
	var screenVar = Titanium.Platform.displayCaps.platformWidth;
};

var dpiAdjust = (screenVar / Titanium.Platform.displayCaps.dpi) * 8;

Ti.App.fontSizes = {};
Ti.App.fontSizes.f1 = '20sp';
Ti.App.fontSizes.f2 = '30sp';
Ti.App.fontSizes.f3 = '60sp';

var vpf = (dpiAdjust / 72) * Titanium.Platform.displayCaps.dpi;
Ti.App.positioning = {};
Ti.App.positioning.p1 = vpf;

Ti.App.buttonSizes = {};
Ti.App.buttonSizes.bw1 = '90%';

Ti.App.imageRes = {};
Ti.App.imageRes.width = 1024;
Ti.App.imageRes.height = 768;
