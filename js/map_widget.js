/**
 * Created by kavyam on 5/8/2017.
 */
/**
 * The javascript file which contains define continuation of the require funtion
 */

define("map_widget",[
    "dojo/dom", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/FeatureLayer", "esri/InfoTemplate", "esri/dijit/BasemapGallery",  "esri/dijit/LayerList",
    "esri/dijit/LocateButton", "esri/dijit/Scalebar", "esri/dijit/Search",  "esri/symbols/SimpleMarkerSymbol", "esri/Color",  "esri/tasks/QueryTask",
    "esri/tasks/query", "dojo/on", "dijit/registry", "esri/toolbars/draw","esri/toolbars/navigation",
    "dojo/domReady!"
], function(
    dom, ArcGISDynamicMapServiceLayer, FeatureLayer, InfoTemplate, BasemapGallery, LayerList, LocateButton, Scalebar,Search,SimpleMarkerSymbol, Color, QueryTask, Query, on, registry, Draw, Navigation

){
    // parser.parse();
    function initializeTool(){

        //load varialbles map layer objects using data pulled by js configloader
        var dynamicLayer1=config_dynamicLayer1;
        var dynamicLayer2=config_dynamicLayer2;
        var dynamicLayer3=config_dynamicLayer3;
        var dynamicLayer4=config_dynamicLayer4;
        var dynamicLayer5=config_dynamicLayer5;
        var dynamicLayer6=config_dynamicLayer6;
        var dynamicLayer7=config_dynamicLayer7;
        var dynamicLayer8=config_dynamicLayer8;

        //create layer definitions from config file
        dynLayer1 = new ArcGISDynamicMapServiceLayer(dynamicLayer1.url, {
            "opacity" : dynamicLayer1.alpha,
            "id" : dynamicLayer1.id
        });
        dynLayer2 = new ArcGISDynamicMapServiceLayer(dynamicLayer2.url, {
            "opacity" : dynamicLayer2.alpha,
            "id" : dynamicLayer2.id
        });
        dynLayer3 = new ArcGISDynamicMapServiceLayer(dynamicLayer3.url, {
            "opacity" : dynamicLayer3.alpha,
            "id" : dynamicLayer3.id
        });
        dynLayer4 = new ArcGISDynamicMapServiceLayer(dynamicLayer4.url, {
            "opacity" : dynamicLayer4.alpha,
            "id" : dynamicLayer4.id
        });
        dynLayer5 = new ArcGISDynamicMapServiceLayer(dynamicLayer5.url, {
            "opacity" : dynamicLayer5.alpha,
            "id" : dynamicLayer5.id
        });
        dynLayer6 = new ArcGISDynamicMapServiceLayer(dynamicLayer6.url, {
            "opacity" : dynamicLayer6.alpha,
            "id" : dynamicLayer6.id
        });
        dynLayer7 = new ArcGISDynamicMapServiceLayer(dynamicLayer7.url, {
            "opacity" : dynamicLayer2.alpha,
            "id" : dynamicLayer2.id
        });
        dynLayer8 = new ArcGISDynamicMapServiceLayer(dynamicLayer8.url, {
            "opacity" : dynamicLayer8.alpha,
            "id" : dynamicLayer8.id
        });

        // add the MapServicelayers in a neat array
        var arrlayers = [];
        arrlayers[0] = dynLayer1;
        arrlayers[1] = dynLayer2;
        arrlayers[2] = dynLayer3;
        arrlayers[3] = dynLayer4;
        arrlayers[4] = dynLayer5;
        arrlayers[5] = dynLayer6;
        arrlayers[6] = dynLayer7;
        arrlayers[7] = dynLayer8;

        //add layers to map using array
        mymap.addLayers(arrlayers);

//layerlist widget
        var layerList =  new LayerList({
            map : mymap,
            showLegend : true,
            showSubLayers : true,
            showOpacitySlider : true,
            layers : [{layer:dynLayer1}]
        }, "layerListDom");
        layerList.startup();

//BaaseMapGallary
        var basemaps = [];
        var basemapRoad = new esri.dijit.Basemap({
            layers : [new esri.dijit.BasemapLayer({
                type : "BingMapsRoad"
            })],
            id : "bmRoad",
            title : "Bing Road",
            thumbnailUrl : "Assets/topo_map_2.jpg"
        });

        basemaps.push(basemapRoad);
        var basemapHybrid = new esri.dijit.Basemap({
            layers : [new esri.dijit.BasemapLayer({
                type : "BingMapsHybrid"
            })],
            id : "bmHybrid",
            title : "Bing Aerial",
            thumbnailUrl : "Assets/imagery_labels.jpg"
        });
        basemaps.push(basemapHybrid);

        var basemapGallery = new esri.dijit.BasemapGallery({
            showArcGISBasemaps : true,
            basemaps : basemaps,
            bingMapsKey : "Ao-1ZsdYgIJ78TGQYHHQ2BucDl37tg1R3iPX1ekLuMMoj7b3pOMkQHUV-myGUr3I",
            map : mymap
        }, "basemapGallery");
        basemapGallery.startup();

//ScaleBar Widget
        var scalebar = new Scalebar({
            map: mymap,
            // "dual" displays both miles and kilometers
            scalebarUnit: "dual"
        });

//GeoLocator
        geoLocate = new LocateButton({
            map: mymap
        }, "Locate_Button");
        geoLocate.startup();

//Search Widget Config
        var Vlv_search_layer=config_valvsearchLayer;
        var Hyd_search_layer=config_hydrentsearchLayer;
        var search = new Search({
            enableButtonMode: true, //this enables the search widget to display as a single button
            enableLabel: false,
            enableInfoWindow: true,
            showInfoWindowOnSelect: true,
            map: mymap
            // sources: [] //disables all default sources from search dropdown eg. ESRI WorldGeocoder from search Bar
        }, "search");
        var vlvsearchItems = search.get("sources");//create getSource object to feed search button before startup...valves
        var hydsearchItems = search.get("sources");//create getSource object to feed search button before startup...hyrdants
        //Push additional sources to the search dropdown
        vlvsearchItems.push({
            featureLayer: new FeatureLayer(Vlv_search_layer.url),
            searchFields: [Vlv_search_layer.uniqueid],
            displayField: Vlv_search_layer.uniqueid,
            exactMatch: false,
            outFields: ["*"],
            name: [Vlv_search_layer.source],//set the dropdown tab label
            highlightSymbol: new SimpleMarkerSymbol().setStyle(SimpleMarkerSymbol.STYLE_CIRCLE).setSize(20).setAngle(255).setColor(new Color([255,255,0,0.5])),
            placeholder: Vlv_search_layer.placeholder,
            maxResults: 6,
            maxSuggestions: 6,
            //Create an InfoTemplate
            infoTemplate: new InfoTemplate("Search Results", "ASSETID:${"+Vlv_search_layer.uniqueid+"}"),
            enableSuggestions: true,
            minCharacters: 0
        });
        hydsearchItems.push({
            featureLayer: new FeatureLayer(Hyd_search_layer.url),
            searchFields: [Hyd_search_layer.uniqueid],
            displayField: Hyd_search_layer.uniqueid,
            exactMatch: false,
            outFields: ["*"],
            name: [Hyd_search_layer.source],//set the dropdown tab label
            highlightSymbol: new SimpleMarkerSymbol().setStyle(SimpleMarkerSymbol.STYLE_CIRCLE).setSize(20).setAngle(255).setColor(new Color([255,255,0,0.5])),
            placeholder: Hyd_search_layer.placeholder,
            maxResults: 6,
            maxSuggestions: 6,
            //Create an InfoTemplate
            infoTemplate: new InfoTemplate("Search Results", "ASSETID:${"+Hyd_search_layer.uniqueid+"}"),
            enableSuggestions: true,
            minCharacters: 0
        });
        //Set the sources above to the search widget
        search.set("sources", vlvsearchItems);
        search.set("sources", hydsearchItems);
        search.startup();
        search.clear();

//Quick Select Query Task and symbol
        var queryTask = null;
        var QuickSelectSymbol =  new SimpleMarkerSymbol();
        QuickSelectSymbol.setSize(10);
        QuickSelectSymbol = new SimpleMarkerSymbol({
            "color": [204, 51, 255],
            "size": 12,
            "angle": -30,
            "fill-opacity":0.5,
            "xoffset": 0,
            "yoffset": 0,
            "type": "esriSMS",
            "style": "esriSMSCircle",

            "outline": {
                "color": [153, 0, 204, 255],
                "width": 1,
                "type": "esriSLS",
                "style": "esriSLSSolid"
            }
        });

        //fire event when quick select menu is changed
        on(dom.byId("queryMenuBtn"), "change", executeQueryTask);
        function executeQueryTask() {
            //variable for url to selection from quick select
            var strQuickSelectURL = dom.byId("queryMenuBtn").value;
            //array for URL and Items from config
            var idxArray = [];
            idxArray = strQuickSelectURL.split(",");
            //closepanels();

            //combine url and idx array items
            var base_url=config_QuickSelectMenu.baseurl;
            queryTask = new QueryTask(base_url + "" + idxArray[0]);

            query = new Query();
            query.returnGeometry = true;
            query.where = idxArray[1];//beginning at 1 to skip default label
            queryTask.execute(query, showResults);

        }
        //fire event when results are returned
        function showResults(featureSet) {

            mymap.graphics.clear();
            var resultFeatures = featureSet.features;
            var extent = esri.graphicsExtent(featureSet.features);
            mymap.setExtent(extent.expand(1.25), true);
            for (var i = 0,
                     il = resultFeatures.length; i < il; i++) {

                var graphic = resultFeatures[i];
                graphic.setSymbol(QuickSelectSymbol);
                mymap.graphics.add(graphic);


            }
            dom.byId("queryMenuBtn").value="Quick Queries";
        }


//adding the navigation toolbar on left
        var navToolbar;
        navToolbar = new Navigation(mymap);

        on(navToolbar, "onExtentHistoryChange", extentHistoryChangeHandler);
        registry.byId("zoomin").on("click", function() {
            navToolbar.activate(Navigation.ZOOM_IN);
        });

        registry.byId("zoomout").on("click", function() {
            navToolbar.activate(Navigation.ZOOM_OUT);
        });

        registry.byId("zoomfullext").on("click", function() {
            navToolbar.zoomToFullExtent();
             mymap.setExtent(startExtent);
        });

        registry.byId("zoomprev").on("click", function() {
            navToolbar.zoomToPrevExtent();
        });

        registry.byId("zoomnext").on("click", function() {
            navToolbar.zoomToNextExtent();
        });

        registry.byId("pan").on("click", function() {
            navToolbar.activate(Navigation.PAN);
        });
        function extentHistoryChangeHandler() {
            registry.byId("zoomprev").disabled = navToolbar.isFirstExtent();
            registry.byId("zoomnext").disabled = navToolbar.isLastExtent();
        }
    }

    return{
        initializeTool:function(){
            initializeTool();
        }
    };

});



// map_widget.initializeTool();

