var win = Ti.UI.currentWindow;
win.backgroundColor = '#fff';

//get list of tables

function getTables()
{
	var tableView = Ti.UI.createTableView({height:'75%',scrollable:true,top:0});
	var tableData = [];
	
	var conn = Titanium.Database.open('mysdb');
	var tables = conn.execute('SELECT name FROM sqlite_master WHERE type="table"');
	console.log(tables);
	conn.close();
	console.log(tables.rowCount+' results');
	
	while(tables.isValidRow())
	{
		console.log(tables);
		tableData.push({title:tables.fieldByName('name'),width:'100%'});
		tables.next();
	}
	tableView.data = tableData;
	
	tableView.addEventListener('longpress',function(e){
		console.log(e.row.title);
		var tableContentWin = Ti.UI.createWindow({
			// tableToLoad:e.row.title,
			backgroundColor:'#ffffff',
			width:'100%',
			height:'100%'			
		});
		var sql = 'SELECT * FROM '+ String(e.row.title);
		var conn = Titanium.Database.open('mysdb');
		var tableContent = conn.execute(sql);
		console.log(tableContent.rowCount+' records to display');
		
		var contentData = [];
		var tableContentTable = Ti.UI.createTableView({});
		// console.log(tables);
		conn.close();
		var fieldNames = [];
		var headerRow = null;
		
		
		while(tableContent.isValidRow())
		{
			if(headerRow==null)
			{ 
				console.log('creating the header row.');
				headerRow = Ti.UI.createTableViewRow();
				console.log(tableContent.fieldCount+' columns');
				for(var i=0;i<tableContent.fieldCount;i++)
				{
					console.log('Fieldname: '+tableContent.fieldName(i));
					fieldNames.push(tableContent.fieldName(i));
				}
								
				for(var i=0;i<fieldNames.length;i++)
				{
					// contentData
					var CellView = Ti.UI.createLabel({
						title:fieldNames[i],
						left: (i*100),
						color:'#000',
						font: { fontSize:12 },
						width:100,
			        });
			        headerRow.add(CellView);
				}
				contentData.push(headerRow);
			}
			
			// console.log('adding content');
			// var contentRow = Ti.UI.createTableViewRow();
			// for(var i=0;i<fieldNames.length;i++)
			// {
				// // contentData
				// var CellView = Ti.UI.createLabel({
					// title:fieldNames[i]
		        // });
		        // contentRow.add(CellView);
			// }
			// contentData.push(contentRow);
			
			tableContent.next();
		}		
		
		console.log(contentData);
		
		tableContentTable.data = contentData;
		tableContentWin.add(tableContentTable);
		
		// console.log(tableContentTable);
		
		tableContentWin.open({
		animated : true});
	});
	
	return tableView;
}

win.add(getTables());

var closeButton = Ti.UI.createButton({
	title : 'Close Window',
	bottom : 100,
	right : 30,
	height : 60,
	font : {
		fontSize : 30,
		fontWeight : 'bold',
	},
});
closeButton.addEventListener('click', function() {
	console.log('close window');
	Ti.UI.currentWindow.close();
	
	});
win.add(closeButton);


