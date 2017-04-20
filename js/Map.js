/**
 * Created by Tavonellis on 3/11/17.
 */


//global variables
var GPSProjectSymbol;
var gridid;
var gridAssignmentObjectid; //test push

require(["dojo/parser","dijit/layout/ContentPane","esri/map","esri/dijit/BasemapGallery","esri/dijit/Search","dojo/dom", "dojo/on", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/FeatureLayer",
        "esri/InfoTemplate",  "esri/dijit/editing/AttachmentEditor","esri/dijit/FeatureTable", "esri/tasks/QueryTask","esri/tasks/query","esri/graphic","esri/symbols/SimpleMarkerSymbol", "esri/dijit/LayerList",
        "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleLineSymbol","esri/Color", "esri/geometry/Point", "esri/SpatialReference", "esri/tasks/GeometryService", "esri/tasks/ProjectParameters",
        "esri/dijit/LocateButton", "esri/dijit/Scalebar", "dijit/registry", "esri/toolbars/draw","esri/toolbars/navigation", "esri/dijit/editing/Editor", "esri/dijit/editing/TemplatePicker", "dojo/_base/array",
        "dojo/keys","dijit/form/ToggleButton","dijit/Toolbar", "dijit/form/Button", "dojo/domReady!"],
    function(parser, ContentPane, Map, BasemapGallery, Search, dom, on, ArcGISDynamicMapServiceLayer, FeatureLayer, InfoTemplate, AttachmentEditor, FeatureTable, QueryTask, Query ,Graphic, SimpleMarkerSymbol,
             LayerList, SimpleFillSymbol, SimpleLineSymbol, Color, Point, SpatialReference, GeometryService, ProjectParameters, LocateButton, Scalebar, registry, Draw, Navigation, Editor,TemplatePicker,arrayUtils,
             keys,ToggleButton) {

        parser.parse();
        mymap = new Map("mapDiv", {
            basemap : "topo", // For full list of pre-defined basemaps,
            center : [-76.627362, 39.283028], // longitude, latitude
            sliderStyle : "large", //slidezoom
            zoom : 18
        });//map
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
        var layerList = new LayerList({
            map : mymap,
            showLegend : true,
            showSubLayers : true,
            showOpacitySlider : true,
            layers : [{layer:dynLayer1}]
        }, "layerListDom");
        layerList.startup();
        //run mapLoaded function after map loaded
        mymap.on("load", mapLoaded);

        //create a new infowindow object using the config file
        var infowindowfeatureLayer= config_infowindowfeatureLayer;
        //create a new dbqueryTable object using the config file
        var DBQueryTableLayer=config_dbQueryAttributes;
        var assignment_widget=config_assignmentAttributes;
        //var webtools_widget=config_webtoolsAttribuites;
        ////have to load feature layer after the mapis loaded
//         mymap.on("layers-add-result", initEditor);
//         //layers-add-result Fires specified layer has been added to the map donot have nothing to do with onload funtion and services inside it
//         var responsePoints = new FeatureLayer(webtools_widget.responsePointsurl, {
//             // mode: FeatureLayer.MODE_ONDEMAND
//         });
//         var responselines = new FeatureLayer(webtools_widget.responselinesurl, {
//             //mode: FeatureLayer.MODE_ONDEMAND
//         });
//         var responsePoly = new FeatureLayer(webtools_widget.responsePolyurl, {
//             //mode: FeatureLayer.MODE_ONDEMAND
//         });
//         mymap.addLayers([responsePoints,responselines,responsePoly]);
//         responsePoints.setVisibility(true);
//         responselines.setVisibility(true);
//         responsePoly.setVisibility(true);
//         //toggle button used to highlihgt:on and off the webtool servics on map
//         var togglewebtoolbutton = new ToggleButton({
//             showLabel: true,
//             onChange: function(val){
//
//                 if (val === true) {
//                     responsePoints.setVisibility(false);
//                     responselines.setVisibility(false);
//                     responsePoly.setVisibility(false);
//                     this.set('label', 'highlights:off');
//                 }
//                 else {
//                     responsePoints.setVisibility(true);
//                     responselines.setVisibility(true);
//                     responsePoly.setVisibility(true);
//                     this.set('label', 'highlights:on');
//                 }
//             }, label: "highlights"
//         },"webtoolhighlightbutton");//.startup();
// // webtools widget
//         function initEditor(evt) {
//             var templateLayers = arrayUtils.map(evt.layers, function(result){
//                 return result.layer;
//             });
//             var templatePicker = new TemplatePicker({
//                 featureLayers: templateLayers,
//                 grouping: true,
//                 rows: "auto",
//                 columns: 3
//             }, "templateDiv");
//             templatePicker.startup();
//
//             var layers = arrayUtils.map(evt.layers, function(result) {
//                 return { featureLayer: result.layer };
//             });
//             var settings = {
//                 map: mymap,
//                 templatePicker: templatePicker,
//                 layerInfos: layers,
//                 toolbarVisible: true,
//                 createOptions: {
//                     polylineDrawTools:[ Editor.CREATE_TOOL_FREEHAND_POLYLINE ],
//                     polygonDrawTools: [ Editor.CREATE_TOOL_FREEHAND_POLYGON,
//                         Editor.CREATE_TOOL_CIRCLE,
//                         Editor.CREATE_TOOL_TRIANGLE,
//                         Editor.CREATE_TOOL_RECTANGLE
//                     ]
//                 },
//                 toolbarOptions: {
//                     reshapeVisible: true
//                 }
//             };
//
//             var params = { settings: settings };
//             var myEditor = new Editor(params, 'editorDiv');
//             //define snapping options
//             var symbol = new SimpleMarkerSymbol(
//                 SimpleMarkerSymbol.STYLE_CROSS,
//                 15,
//                 new SimpleLineSymbol(
//                     SimpleLineSymbol.STYLE_SOLID,
//                     new Color([255, 0, 0, 0.5]),
//                     5
//                 ),
//                 null
//             );
//             mymap.enableSnapping({
//                 snapPointSymbol: symbol,
//                 tolerance: 20,
//                 snapKey: keys.ALT
//             });
//
//             myEditor.startup();
//         }
        function mapLoaded() {
//infowindow
            //grab the unique faciltid fr the clicked featurelayer graphic
            //load feature service for infowindow, attachments and edits
            infoWindowLayer = new FeatureLayer(infowindowfeatureLayer.url, {
                opacity: infowindowfeatureLayer.alpha,
                //mode: FeatureLayer.MODE_ONDEMAND
                outFields: ["*"],
                id: "infoLayer"
            });
            mymap.addLayer(infoWindowLayer);

//Add and identify featureTable Layer to be used for activities table results later
            DBQueryTableLayer = new FeatureLayer(DBQueryTableLayer.url, {
                opacity : 0.5,
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields : ["*"],
                definitionExpression : "1=2",//don't want to load all records on load
                id : DBQueryTableLayer.source
            });
//Gridassignment Ferature layer
            var myFeatureLayer = new FeatureLayer(assignment_widget.url, {
                opacity : 0.5,
                //mode: FeatureLayer.MODE_ONDEMAND,
                outFields : ["*"],
                definitionExpression : "1=2",//don't want to load all records on load
                id : assignment_widget.source
            });
            mymap.addLayer(myFeatureLayer);

            //Use DBQueryTableLayer to create feature table and add content, link to dom : FeatureTableNode
            var dbQueryTable = new FeatureTable({
                featureLayer : DBQueryTableLayer,
                map : mymap,
                editable : true,
                syncSelection : true,
                dateOptions : {
                    datePattern : 'M/d/y',
                    timeEnabled : true,
                    timePattern : 'H:mm'
                },

                outFields: ["MXASSETNUM", "CREW_CHIEF", "FIELD_NOTES", "DATE_OPERATED", "PRIMARY_ACTIVITY", "VALVE_SIZE", "EXERCISE",
                    "VALVE_CONDITION", "OPNUT_DEPTH", "SURFACE_COVER", "TURNS", "OP_METHOD", "OPEN_DIRECTION", "FROZEN"],

                // use fieldInfos object to change field's label (column header)
                fieldInfos : [{
                    name : 'MXASSETNUM',
                    alias : 'FacilityID',
                    editable : false //disable editing on this field
                }, {
                    name : 'CREW_CHIEF',
                    alias : 'CREW CHIEF'
                },
                    {
                        name: 'FIELD_NOTES',
                        alias: 'NOTES'
                    }
                ]
            }, 'FeatureTableNode');
            dbQueryTable.startup();
            /*add custom close button to dbquery grid container div*/
            var closeTblBtn = new dijit.form.Button({
                style:"right:1px",
                label : "X",
                onClick : function() {
                    DBQueryTableLayer.setDefinitionExpression("1=2");
                    $("#hiddenActivitiesGrid").css({
                        "z-index" : "-100",
                        "opacity" : "0",
                        "transition" : "all 2s",
                        "-webkit-transition" : "all 2s"
                    });
                    //$("#hiddenActivitiesGrid").fadeOut("slow");
                }
            }, "featuretablecloseBtn");

            //add gps symbol for projection on infowindow click
            GPSProjectSymbol = new SimpleMarkerSymbol().setStyle(SimpleMarkerSymbol.STYLE_X).setSize(20).setAngle(255);
            GPSProjectSymbol.outline.setWidth(2).setColor(new Color([255,0,0]));


            //add infowindow for click response
            infoWindowLayer.on("click", function (evt) {

                // //loop through outfields and create html format and string with atttributes for window
                var infowindowOutfields=infowindowfeatureLayer.outfields;
                var infowindowTextContent = "";
                for (i = 0; i < infowindowOutfields.length; i++) {
                    infowindowTextContent   += "<b>"
                        + infowindowOutfields[i]
                        + "</b> : "
                        + evt.graphic.attributes["" + infowindowOutfields[i] + ""]
                        + "<br>";
                }

                // //set title of infowindow to current uniqueID field value and content to outfields
                var infowindowUniqueField=infowindowfeatureLayer.uniqueid;
                // //set the title to the uniqueID field
                mymap.infoWindow.setTitle(evt.graphic.attributes[infowindowUniqueField]);
                var ClickedUniqueID = evt.graphic.attributes[infowindowUniqueField];
                console.log(ClickedUniqueID);
                // //grab field for correct spelling of objectID field
                var objectidField = infoWindowLayer.objectIdField;
                console.log(objectidField);
                var ClickedObjectID = evt.graphic.attributes[objectidField];
                console.log(ClickedObjectID); //working

                // //Set content of infowindow
                mymap.infoWindow.setContent(
                    "<div id='infowindowContent'>"+
                    "<div id='infowindowText' style='margin:10px; height:250px; width:250px display: table;';> " +
                    "<span>"+ infowindowTextContent +"</span>"   +
                    "</div>" + //infowindowtext
                    //custom buttons for activities and checkmarks
                    "<div id='DBQueryDiv'>" +
                    //"<button class='actvBtn' id=\"" + ClickedUniqueID + 1 + "\"></button>" +
                    "<button class='actvBtn' id=\"" + ClickedUniqueID  + 1 + "\"></button>" +
                    //set ID to dynamic id so that it doesn't try to register duplicate existing ID on every click
                    "<button class='chkBtn' id=\"" + ClickedObjectID + "\"></button>" +
                    "</div>" +
                    "<div id='attachmentEditorDiv' style='padding:.5rem;'></div>" +
                    "</div>" //infowindowcontent
                );

                //Checkmark function: grab the objectID for the clicked featureLayer graphic for variable
                //Button functionality for Checkmark button
                var button = new dijit.form.Button({
                    iconClass: 'chkBtnIcon',
                    label : "",
                    onClick :function (evt) {
                        //CheckMark Edit Function
                        var editLayer = mymap.getLayer("infoLayer");
                        var feature, featureId, query;
                        if (evt.graphic && evt.graphic.attributes && evt.graphic.attributes[objectidField]) {
                            feature = evt.graphic,
                                featureId = feature.attributes[objectidField];
                            var ClickedVisitDate=feature.attributes["VISIT_DATE_WEB"];
                            var currentDate = new Date();
                            var edittAttributes = {
                                ObJectID: ClickedObjectID,
                                VISIT_DATE_WEB:   (currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear()
                            };
                            var editGraphic = new Graphic(null, null, edittAttributes);
                            editLayer.applyEdits(null, [editGraphic], null);
                            infoWindowLayer.refresh();
                        }
                    }
                },  "" + ClickedObjectID +"");


                //create dbquery object for config Wachs Atvitiy DBQuery
               var dbQueryAttributes = config_dbQueryAttributes;
                //loop through to grab outfields and create html format and string with atttributes for window
                var dbqueryOutfields = dbQueryAttributes.outfields;
                var formattedDBQueryOutfields = "";
                for ( i = 0; i < dbqueryOutfields.length; i++) {
                    formattedDBQueryOutfields += '\"' + dbqueryOutfields[i] + '\",';
                }
                //Activities Button functinality for Activities button
                var button1 = new dijit.form.Button({
                    iconClass: 'actvBtnIcon', //not used
                    label : "CLICK FOR WACHS ACTIVITIES",
                    onClick : function() {
                        //filter activities that have the same id as clicked feature
                        DBQueryTableLayer.setDefinitionExpression("MXASSETNUM='" + ClickedUniqueID + "'");
                        dbQueryTable.refresh();
                        //Set css to slide in and fade in
                        $("#hiddenActivitiesGrid").css({
                            "z-index": "100",
                            "height": "300",
                            "opacity": "1",
                            "transition": "all 2s",
                            "-webkit-transition": "all 2s"
                        });
                        $("#hiddenActivitiesGrid").fadeIn(3000);
                    }
                },    "" + ClickedUniqueID  +1 +"");
                //Close button for activites table found below outside of click event
                //add attachment editor
                var attachmentEditor = new AttachmentEditor({}, dom.byId("attachmentEditorDiv"));
                attachmentEditor.startup();
                attachmentEditor.showAttachments(evt.graphic, infoWindowLayer);

                //set size of infowindow
                mymap.infoWindow.resize(300, 300);
                //show infowindow
                mymap.infoWindow.show(evt.screenPoint, mymap.getInfoWindowAnchor(evt.screenPoint));
                //project gps point when feature clicked
                addGPSProjectionPoint(evt);
            });
//grid Assignment widget
            var gridbutton = new dijit.form.Button({
                label: "Update",
                onClick: function () {
                    // //CheckMark Edit Function

                    var queryTask = new QueryTask(assignment_widget.url);
                    gridid = dom.byId('gridnumber').value.toUpperCase();

                    var query = new Query();
                    query.returnGeometry = false;
                    query.outFields = ["OBJECTID,GRID_ID"];
                    query.where = "1=1";
                    queryTask.execute(query, showResults);

                    var crewname = dom.byId('crewname').value;
                    alert(crewname);
                    var editLayer = mymap.getLayer("assignmentlayer");

                    var edittAttributes = {
                        OBJECTID: gridAssignmentObjectid,
                        WORKAREA: crewname
                    };
                    var editGraphic = new Graphic(null, null, edittAttributes);
                    editLayer.applyEdits(null, [editGraphic], null);

                }
            }, "updatecrew");

            function showResults(results) {

                var resultItems = [];
                var resultCount = results.features.length;


                for (var i = 0; i < resultCount; i++) {
                    if (gridid == results.features[i].attributes["GRID_ID"]) {
                        gridAssignmentObjectid = results.features[i].attributes["OBJECTID"]
                    }
                }
                infoWindowLayer.refresh();
                dynLayer1.refresh();
                alert(gridAssignmentObjectid);
            }


        }//Map Loaded
// MapProjection
        //setup map projection object from config for clicked feature
        var mapProjection=config_mapProjection;
        //grab input and output projections
        var localspatialreference=mapProjection.localwkid;
        var outspatialreference=mapProjection.wkid;

        //load geometry service and create paramaeters for new projection
        var geometryService = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
        var outSR = new SpatialReference({"wkid":outspatialreference});
        var GPSparams = new ProjectParameters();
        //project using clicked id and gps x/y fields and paramters with input and output parameters
        function addGPSProjectionPoint(evt) {
            // debugger;
            var mappt = new Point(evt.graphic.attributes.GPS_X, evt.graphic.attributes.GPS_Y, new SpatialReference({"wkid":localspatialreference}));
            GPSparams.geometries = [mappt];
            GPSparams.outSR = outSR;
            geometryService.project(GPSparams, function(projectedGPS) {
                //debugger;
                var projectedmappt = new Point(projectedGPS[0].x, projectedGPS[0].y,new SpatialReference(projectedGPS[0].spatialReference.wkid));
                mymap.graphics.clear();
                mymap.graphics.add(
                    new esri.Graphic(
                        projectedmappt,GPSProjectSymbol
                    )
                );

            });
        }

//Quick Select Query Task and symbol
        var queryTask = null;
        var QuickSelectSymbol =  new SimpleMarkerSymbol();
        QuickSelectSymbol.setSize(10);
        QuickSelectSymbol = new SimpleMarkerSymbol({
            "color": [204, 51, 255],
            "size": 12,
            "angle": -30,
            "opacity":0.5,
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
            dom.byId("queryMenuBtn").value="Select";
        }

//Search Widget Config
        var Vlv_search_layer=config_valvsearchLayer;
        var Hyd_search_layer=config_hydrentsearchLayer;
        var search = new Search({
            enableButtonMode: true, //this enables the search widget to display as a single button
            enableLabel: false,
            enableInfoWindow: true,
            showInfoWindowOnSelect: true,
            map: mymap,
            sources: [] //disables all default sources from search dropdown eg. ESRI WorldGeocoder from search Bar
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

//ScaleBar Widget
        var scalebar = new Scalebar({
            map: mymap,
            // "dual" displays both miles and kilometers
            scalebarUnit: "dual"
        });
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

//GeoLocator
        geoLocate = new LocateButton({
            map: mymap
        }, "Locate_Button");
        geoLocate.startup();
    });//function
