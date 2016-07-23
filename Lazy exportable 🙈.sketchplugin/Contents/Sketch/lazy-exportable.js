var onRun = function(context) {
	var doc = context.document,
		artboard = doc.currentPage().currentArtboard(),
		page = doc.currentPage(),
		artboards = page.artboards(),
		selection = context.selection;

	var flag = ( flag === false ) ? NSOffState : NSOnState;

	var checkboxShapes = NSButton.alloc().initWithFrame( NSMakeRect( 0, 0, 300, 18 ) );
	checkboxShapes.setButtonType( NSSwitchButton );
	checkboxShapes.setTitle( 'Shapes' );
	checkboxShapes.setState( true );

	var checkboxGroups = NSButton.alloc().initWithFrame( NSMakeRect( 0, 0, 300, 18 ) );
	checkboxGroups.setButtonType( NSSwitchButton );
	checkboxGroups.setTitle( 'Groups' );
	checkboxGroups.setState( true );

	var checkboxSymbols = NSButton.alloc().initWithFrame( NSMakeRect( 0, 0, 300, 18 ) );
	checkboxSymbols.setButtonType( NSSwitchButton );
	checkboxSymbols.setTitle( 'Symbols' );
	checkboxSymbols.setState( true );

	var checkboxText = NSButton.alloc().initWithFrame( NSMakeRect( 0, 0, 300, 18 ) );
	checkboxText.setButtonType( NSSwitchButton );
	checkboxText.setTitle( 'Text' );
	checkboxText.setState( false );

	var checkboxBitmaps = NSButton.alloc().initWithFrame( NSMakeRect( 0, 0, 300, 18 ) );
	checkboxBitmaps.setButtonType( NSSwitchButton );
	checkboxBitmaps.setTitle( 'Bitmaps' );
	checkboxBitmaps.setState( false );

	var checkboxSuffix = NSButton.alloc().initWithFrame( NSMakeRect( 0, 0, 300, 18 ) );
	checkboxSuffix.setButtonType( NSSwitchButton );
	checkboxSuffix.setTitle( 'Suffix ^' );
	checkboxSuffix.setState( false );

	var userInput = COSAlertWindow.new();
	userInput.addAccessoryView(checkboxGroups);
	userInput.addAccessoryView(checkboxShapes);
	userInput.addAccessoryView(checkboxSymbols);
	userInput.addAccessoryView(checkboxText);
	userInput.addAccessoryView(checkboxBitmaps);
	userInput.addAccessoryView(checkboxSuffix);
	userInput.setMessageText('Exportable what?');
	userInput.addTextLabelWithValue("Exportable by name:");
	userInput.addTextFieldWithValue("");

	userInput.addButtonWithTitle('Make it')
	userInput.addButtonWithTitle('Not today')
	var responseCode = userInput.runModal();


	var selectLayersOfType_inContainer = function(layerType) {
		
		var children = page.children(),
			predicate = NSPredicate.predicateWithFormat("(className == %@)", layerType),
			layers = children.filteredArrayUsingPredicate(predicate);
		
		var loop = layers.objectEnumerator(), layer;
		while (layer = loop.nextObject()) {
			layer.select_byExpandingSelection(true, true);
			layer.exportOptions().addExportFormat();
		}

		log(layers.count() + " " + layerType + "s selected ")
	}


	if (responseCode == 1000){

		doc.currentPage().deselectAllLayers();

		if ( checkboxGroups.state() == true ) {
			selectLayersOfType_inContainer("MSLayerGroup");
		}
		if ( checkboxShapes.state() == true ) {
			selectLayersOfType_inContainer("MSShapeGroup");
		}
		if ( checkboxSymbols.state() == true ) {
			selectLayersOfType_inContainer("MSSymbolInstance");
		}
		if ( checkboxText.state() == true ) {
			selectLayersOfType_inContainer("MSTextLayer");
		}
		if ( checkboxBitmaps.state() == true ) {
			selectLayersOfType_inContainer("MSBitmapLayer");
		} if ( checkboxSuffix.state() == true ) {
		
			var layers = page.children();
			var matchTimes = 0;

			for ( var i = 0; i < layers.count(); i++ ) {
				if ( layers[i].name().match( /\^+$/gi ) ) {
					matchTimes++;
					layers[i].select_byExpandingSelection(true, true);
					layers[i].exportOptions().addExportFormat();
				}
			};
			log(matchTimes);

		} if (userInput.viewAtIndex(7).stringValue() != "") {
			var layers = page.children();
			var find = new RegExp( userInput.viewAtIndex(7).stringValue() );
			var matchTimes = 0;

			for ( var i = 0; i < layers.count(); i++ ) {
				if ( layers[i].name().match( find ) ) {
					matchTimes++;
					layers[i].select_byExpandingSelection(true, true);
					layers[i].exportOptions().addExportFormat();
				}
			};
			log(matchTimes + " " + userInput.viewAtIndex(7).stringValue());
		}
	}

	if (responseCode == 1001){
		doc.showMessage('Right choise) Make it manualy)')
	}
}