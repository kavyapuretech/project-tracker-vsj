/**
 * Created by Tavonellis on 3/11/17.
 */
/**
 * The main javascript file which contains require funtion and the js files which use define are the continuation of this js file
 */

//global variables
var mymap;
var GPSProjectSymbol;
var gridid;
var gridAssignmentObjectid;
var startExtent;

//define javascript filenames which use ESRI APIs in require and in function
require(["map_widget", "grid_Assignment_widget", "trucktracking_widget", "webtools_widget", "isotrace_widget", "dojo/parser", "dijit/layout/ContentPane","esri/map","dojo/dom", "esri/geometry/Extent",
        "dojo/on",  "esri/layers/FeatureLayer","esri/InfoTemplate", "esri/dijit/editing/AttachmentEditor","esri/dijit/FeatureTable", "esri/tasks/QueryTask","esri/tasks/query",
        "esri/graphic", "esri/symbols/SimpleMarkerSymbol",  "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleLineSymbol", "esri/toolbars/edit",
        "esri/Color", "esri/geometry/Point", "esri/SpatialReference", "esri/tasks/GeometryService", "esri/tasks/ProjectParameters","esri/tasks/StatisticDefinition", "dojo/_base/array",
        "dijit/form/Button", "dojo/ready", "dojo/domReady!"],
    function(map_widget, grid_Assignment_widget, trucktracking_widget, webtools_widget, isotrace_widget, parser, ContentPane, Map, dom, Extent, on, FeatureLayer, InfoTemplate, AttachmentEditor,
             FeatureTable,QueryTask, Query ,Graphic, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, Edit,
             Color, Point, SpatialReference, GeometryService, ProjectParameters, StatisticDefinition, Button, ready
    ) {
        parser.parse();
        // Cross-Origin Resource Sharing (CORS) allows web applications to bypass the browser's same origin policy file and access resources
//         esriConfig.defaults.io.corsEnabledServers.push("https://solutions.puretechltd.com");
// //create a proxy to define the location of code to your application to communicate using ProxyUrl
//         esriConfig.defaults.io.proxyUrl = "https://solutions.puretechltd.com/sample/DotNet/proxy.ashx";
//         // specify whether or not the proxy should always be used for communication using alwaysUseProxy
//         esriConfig.defaults.io.alwaysUseProxy = false;
// //define a proxy rule specify the url for the proxy and the prefix for the resources that need to be accessed through the proxy.
//         urlUtils.addProxyRule({
//             urlPrefix: "https://solutions.puretechltd.com",
//             proxyUrl: "DotNet/proxy.ashx"
//         });
        //set map extent from json
        var map_Extent= config_mapExtent;
        //defining min and max values to a variable
        var xmin=map_Extent.xmin;
        var ymin=map_Extent.ymin;
        var xmax=map_Extent.xmax;
        var ymax=map_Extent.ymax;
        var InitialWKID=map_Extent.InitialWKID;
//Create map new extent
        startExtent = new Extent();
        //parse float lets to read the decimal values
        startExtent.xmin = parseFloat(xmin);
        startExtent.ymin = parseFloat(ymin);
        startExtent.xmax = parseFloat(xmax);
        startExtent.ymax = parseFloat(ymax);
        startExtent.spatialReference = new SpatialReference({ wkid:parseFloat(InitialWKID) });
//Create a map
        mymap = new Map("mapDiv", {
            basemap : "topo", // For full list of pre-defined basemaps,
            sliderStyle : "large", //slidezoom
            extent: startExtent //setting extent to map
        });//map
//Javascript filename.function() separated from the main js file using Define
        //  map.initializeTool contain all map API widgets
        map_widget.initializeTool();
        // __widget.__Tool contains different widgets used on map and feature services who apply edits on the services
        trucktracking_widget.trackingTool();
        grid_Assignment_widget.widgetTool();
        webtools_widget.editortool();
        isotrace_widget.isotraceTool();

//run mapLoaded function after map loaded
        mapOnLoad = mymap.on("load", mapLoaded);

        //create a new infowindow object using the config file
        var infowindowfeatureLayer= config_infowindowfeatureLayer;
        //create a new dbqueryTable object using the config file
        var DBQueryTable_Layer=config_dbQueryAttributes;
        var assignment_widget=config_assignmentAttributes;

//Load Map
        function mapLoaded() {
//DB Date Function
            getDBDate();
//infowindow
            //grab the unique faciltid fr the clicked featurelayer graphic
            //load feature service for infowindow, attachments and edits
            var infoWindowLayer = new FeatureLayer(infowindowfeatureLayer.url, {
                opacity: infowindowfeatureLayer.alpha,
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: ["*"],
                id: "fLayer"
            });
            mymap.addLayer(infoWindowLayer);
//Add and identify featureTable Layer to be used for activities table results later
            var DBQueryTableLayer = new FeatureLayer(DBQueryTable_Layer.url, {
                opacity : 0.5,
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields : ["*"],
                definitionExpression : "1=2",//don't want to load all records on load
                id : DBQueryTable_Layer.source
            });
//Gridassignment Ferature layer
            var gridFeatureLayer = new FeatureLayer(assignment_widget.url, {
                opacity : 0.5,
                //mode: FeatureLayer.MODE_ONDEMAND,
                outFields : ["*"],
                definitionExpression : "1=2",//don't want to load all records on load
                id : assignment_widget.source
            });
            mymap.addLayer(gridFeatureLayer);
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

            var clickedcout =0;
            //add infowindow for click response
            infoWindowLayer.on("click", function (evt) {
                // assigne the clickcount to zero after every time the layer is clicked
                clickedcout= clickedcout+1;
                //loop through outfields and create html format and string with atttributes for window
                var infowindowOutfields=infowindowfeatureLayer.outfields;
                var infowindowTextContent = "";
                for (i = 0; i < infowindowOutfields.length; i++) {
                    infowindowTextContent   += "<b>"
                        + infowindowOutfields[i]
                        + "</b> : "
                        + evt.graphic.attributes["" + infowindowOutfields[i] + ""]
                        + "<br>";
                }


                //set title of infowindow to current uniqueID field value and content to outfields
                var feature;
                feature = evt.graphic;
                var infowindowUniqueField=infowindowfeatureLayer.uniqueid;
                //set the title to the uniqueID field
                mymap.infoWindow.setTitle(feature.attributes[infowindowUniqueField]);
                var ClickedUniqueID = feature.attributes[infowindowUniqueField];
                console.log(ClickedUniqueID);
                var objectidField = infoWindowLayer.objectIdField;
                console.log(objectidField);
                var ClickedObjectID = feature.attributes[objectidField];
                console.log(ClickedObjectID);
                //Set content of infowindow
                mymap.infoWindow.setContent(
                    "<div id='infowindowContent'>"+
                    "<div id='infowindowText' style='margin:10px; height:250px; width:250px display: table;';> " +
                    "<span>"+ infowindowTextContent +"</span>"   +
                    "</div>" + //infowindowtext
                    //custom buttons for activities and checkmarks
                    "<div id='DBQueryDiv'>" +
                    "<button class='actvBtn' id=\"" + ClickedUniqueID  + clickedcout + "\"></button>" +
                    //set ID to dynamic id so that it doesn't try to register duplicate existing ID on every click
                    "<button class='chkBtn' id=\"" + ClickedObjectID  + clickedcout + "\"></button>" +
                    "</div>" +
                    "<div id='attachmentEditorDiv' style='width:100%'></div>" +
                    "</div>"
                );//infowindowcontent
                //add attachment editor
                var attachmentEditor = new AttachmentEditor({}, dom.byId("attachmentEditorDiv"));
                attachmentEditor.startup();
                attachmentEditor.showAttachments(feature, infoWindowLayer);
                //Checkmark function: grab the objectID for the clicked featureLayer graphic for variable
//Button functionality for Checkmark button
            var checkmarkBtn = new dijit.form.Button({
                    iconClass: "chkBtn",
                    label : "",
                    onClick :function () {
                        //CheckMark Edit Function
                        //grab field for correct spelling of objectID field
                        var editLayer = mymap.getLayer("fLayer");
                        var ClickedVisitDate=feature.attributes["VISIT_DATE_WEB"];
                        console.log(ClickedVisitDate);
                        var currentDate = new Date();
                        var edittAttributes;
                        if(ClickedVisitDate>0){
                           edittAttributes = {
                            ObJectID: ClickedObjectID,
                            VISIT_DATE_WEB:  null
                        };
                        var edit_Graphic = new Graphic(null, null, edittAttributes);
                        editLayer.applyEdits(null, [edit_Graphic], null);
                        
                        }
                       
                        else{
                            edittAttributes = {
                            ObJectID: ClickedObjectID,
                            VISIT_DATE_WEB:   (currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear()
                        }; 
                        var editGraphic = new Graphic(null, null, edittAttributes);
                        editLayer.applyEdits(null, [editGraphic], null);
                        }
                        
                        dynLayer1.refresh();
                    }

                },  "" + ClickedObjectID  + clickedcout +"").startup();


                //create dbquery object for config Wachs Atvitiy DBQuery
                // var dbQueryAttributes = config_dbQueryAttributes;
                //loop through to grab outfields and create html format and string with atttributes for window
                var dbqueryOutfields = DBQueryTable_Layer.outfields;
                var formattedDBQueryOutfields = "";
                for ( i = 0; i < dbqueryOutfields.length; i++) {
                    formattedDBQueryOutfields += '\"' + dbqueryOutfields[i] + '\",';
                }
                //Activities Button functinality for Activities button
                var activitytableBtn = new dijit.form.Button({
                    iconClass: "actvBtn", //not used
                    label : "CLICK FOR WACHS ACTIVITIES",
                    onClick :  function() {
                        setTimeout(function tableload (){
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
                        $("#hiddenActivitiesGrid").fadeIn(3000);},1000);
                    }
                },    "" + ClickedUniqueID + clickedcout +"").startup();
                //Close button for activites table found below outside of click event
                //set size of infowindow
                mymap.infoWindow.resize(300, 300);
                //show infowindow
                mymap.infoWindow.show(evt.mapPoint, mymap.getInfoWindowAnchor(evt.mapPoint));
                //project gps point when feature clicked
                addGPSProjectionPoint(evt);
            });
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

        }//Map Loaded

//MapProjection
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
            //GPS_X, GPS_Y are the field attributs from rest service
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
                console.log(projectedmappt);
                console.log(mappt);
            });
        }

//DB Date
        function timeConverter(UNIX_timestamp) {
            var a = new Date(UNIX_timestamp);
            var months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var day = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var time = month + '/' + day + '/' + year;// + ' ' + hour + ':' + min + ':' + sec;
            return time;
        }
        var dbDateField =["DATE_OPERATED"];
        var DBDateTableLayer = new FeatureLayer(DBQueryTable_Layer.url, {
        });
        var maxDateDef = new StatisticDefinition();
        maxDateDef.statisticType = "max";
        maxDateDef.onStatisticField = "DATE_OPERATED";
        maxDateDef.outStatisticFieldName = "maxDBDATE";

        // Set the base parameters for the query. All statistic definition objects
        // are passed as an array into the outStatistics param
        var queryParams = new Query();
        queryParams.outFields = dbDateField;
        queryParams.outStatistics = [ maxDateDef];

        //Executes when map loads
        function getDBDate(){

            // Execute the statistics query against the feature service and call the getStats() callback
            DBDateTableLayer.queryFeatures(queryParams, getStats, errback);
        }

        // Executes on each getdb() call
        function getStats(results){
            // The return object of the query containing the statistics requested
            var stats = results.features[0].attributes;
            // Print the statistic results to the DOM
            dom.byId("dbDateResult").innerHTML = timeConverter(stats.maxDBDATE);
        }

        function errback(err){
            console.log("Couldn't retrieve summary statistics. ", err);
        }
    });//function
