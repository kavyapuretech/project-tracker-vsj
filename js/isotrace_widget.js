/**
 * Created by kavyam on 5/16/2017.
 */

/**
 * The javascript file which contains define continuation of the require funtion
 */

var isosubmit;
// isotrace_widget is define name that is added in require (main j sfile).
//Make sure the current Define name and File name has to be same
define("isotrace_widget",[
    "dojo/dom", "dojo/on", "esri/renderers/SimpleRenderer", "esri/layers/GraphicsLayer", "esri/tasks/FeatureSet", "esri/tasks/Geoprocessor",
    "esri/graphic", "esri/symbols/PictureMarkerSymbol",  "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleLineSymbol",  "esri/Color", "esri/geometry/Point","dijit/form/Button",
    "esri/layers/ArcGISDynamicMapServiceLayer", "dojo/domReady!"
], function(
    dom, on, SimpleRenderer, GraphicsLayer, FeatureSet, Geoprocessor, Graphic,
    PictureMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, Color, Point, Button, ArcGISDynamicMapServiceLayer
){

    // parser.parse();
// create a function to add content and make sure you called the function in main javascript file
    function isotraceTool(){
//  isotrace widget
        var gp;
        var feature;
        var driveTimes = "1 2 3";
        var isotracewidget=config_isotrace;
        // Initialize map, GP and image params

        var mapLocalPixelPoint= new Point;
        var mapLocalPixelPoint_Skips= new Point;
        var clickx;
        var clicky;
        var arrayOfObject_Skips=[];
        var arrayOfObject_Barriers=[];

        gp = new Geoprocessor(isotracewidget.url);
        gp.setOutputSpatialReference({wkid: 3857});
//              var localwkid=new SpatialReference(3857);
//           gp.setProcessSpatialReference(localwkid);

        var isoPoly = new SimpleFillSymbol("none", new SimpleLineSymbol("dashdot", new Color([255,0,0]), 2), new Color([255,255,0,0.25]));
        var isoLine = new SimpleLineSymbol( SimpleLineSymbol.STYLE_SOLID,new Color([255,0,0,0.5]),5);
        var isoPoint = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 12, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0, 0.9]), 2), new dojo.Color([255, 230, 0, 0.9]));
        var flagPicSymbol= new  PictureMarkerSymbol('Assets/images/btn/i_blueIsoFlag.png', 25, 25);
        var XPicSymbol = new  PictureMarkerSymbol('Assets/Icons/blueX_50.png');

        var myGraphicsLayerIsoMain = new GraphicsLayer();
        var isoMainRenderer = new SimpleRenderer();
        myGraphicsLayerIsoMain.setRenderer(isoMainRenderer);

        var myGraphicsLayerIsoValve = new GraphicsLayer();
        var isoPointRenderer = new SimpleRenderer();
        myGraphicsLayerIsoValve.setRenderer(isoPointRenderer);

        var myGraphicsLayerIsoAffectedArea = new GraphicsLayer();
        var isoPolyRenderer = new SimpleRenderer();
        myGraphicsLayerIsoAffectedArea.setRenderer(isoPointRenderer);


        var myGraphicsLayerIsoStartPoint = new GraphicsLayer();
        var myGraphicsLayerIsoSkips = new GraphicsLayer(XPicSymbol);

        var arrGraphiclayers = [];
        arrGraphiclayers[0] = myGraphicsLayerIsoMain;
        arrGraphiclayers[1] = myGraphicsLayerIsoValve;
        arrGraphiclayers[2] = myGraphicsLayerIsoAffectedArea;
        arrGraphiclayers[3] = myGraphicsLayerIsoStartPoint;
        arrGraphiclayers[4] = myGraphicsLayerIsoSkips;

        mymap.addLayers(arrGraphiclayers);

        mymap.on("click", isoExecution);

        var flagfeatures = [];
        var skipfeatures = [];
        var barrierfeatures = [];
        function isoExecution(evt){


            if(isoenabled==="on"){


                if(isoParamType==="ISOPOINT"){
                    mapLocalPixelPoint=evt.mapPoint;
                    console.log(mapLocalPixelPoint);
                    clickx= mapLocalPixelPoint.x.toFixed(3);
                    console.log(clickx);
                    clicky=mapLocalPixelPoint.y.toFixed(3);
                    console.log(clicky);

                    var isoClickPointGraphic = new Graphic(mapLocalPixelPoint,flagPicSymbol);
                       isoClickPointGraphic.geometry=new Point(mapLocalPixelPoint.x,mapLocalPixelPoint.y);
                    isoClickPointGraphic.geometry= mapLocalPixelPoint;
                    flagfeatures.push(isoClickPointGraphic);
                    myGraphicsLayerIsoStartPoint.add(isoClickPointGraphic);
                    console.log(myGraphicsLayerIsoStartPoint);

                }
                if(isoParamType==="SKIPPOINT") {

                    mapLocalPixelPoint_Skips = evt.mapPoint;
                    console.log(mapLocalPixelPoint_Skips);
                    clickx = mapLocalPixelPoint_Skips.x.toFixed(3);
                    console.log(clickx);
                    clicky = mapLocalPixelPoint_Skips.y.toFixed(3);
                    console.log(clicky);

                    var isoSkipPointGraphicTest = new Graphic();
                    isoSkipPointGraphicTest.geometry=mapLocalPixelPoint_Skips;
                    myGraphicsLayerIsoSkips.add(isoSkipPointGraphicTest);
                    var isoSkipPointGraphic = new Graphic(new Point(mapLocalPixelPoint_Skips.x, mapLocalPixelPoint_Skips.y, mapLocalPixelPoint_Skips.spatialReference), isoPoint);
                    arrayOfObject_Skips.push(isoSkipPointGraphic);
                    skipfeatures=arrayOfObject_Skips;
                }
                //debugger;

                var featureSet = new FeatureSet();
                featureSet.features = flagfeatures;//[{"geometry":{"x":-8550288.34081677,"y":4709602.758659419,"spatialReference":{"wkid":102100}}}];
                var skipfeatureSet = new FeatureSet();
                skipfeatureSet.features = skipfeatures;//[{"geometry":{"x":-8550288.34081677,"y":4709602.758659419,"spatialReference":{"wkid":102100}}}];
                //Alert.show(skipfeatureSet.features.length.toString())
                var barrierfeatureSet = new FeatureSet();
                //barrierfeatureSet.features =[];//[{"geometry":{"x":-8550288.34081677,"y":4709602.758659419,"spatialReference":{"wkid":102100}}}];
                var emptyfeatureSet = new FeatureSet();

                console.log(featureSet);
//, "Barriers": barrierfeatureSet , "SkipLocations": skipfeatureSet

                params = { "Flags": featureSet};
//                         gp.submitJob(params, completeCallback, statusCallback,gpJobFailed);
                var debugPlaceholder;
            }
        }
        var isoBreakPtBtn = new dijit.form.Button({
            label : "Flag",
            onClick : function() {
                isoParamType="ISOPOINT";
                //alert(isoParamType);

            }
        },"isoBreakPointBtnDiv");
        var isoSkipBtn = isoSkipBtn = new dijit.form.Button({
            label : "Skip",
            onClick: function () {
                isoParamType = "SKIPPOINT";
                //alert(isoParamType);
            }
        }, "isoSkipBtnDiv");
        var isoExecuteBtn = new dijit.form.Button({
            label : "Barrier",
            onClick : function() {
                alert("Trace Started");
                isoExecution();
            }
        },"isoTraceSubmitBtn");

       var isosubmit = new dijit.form.Button({

            label : "Trace",
            onClick : function() {
                submitisojob();
                myGraphicsLayerIsoStartPoint.clear();
            }
        },"submitjob");

        function submitisojob(){
            gp.submitJob(params, completeCallback, statusCallback,gpJobFailed);
        }
        var cleariso = new dijit.form.Button({

            label : "Clear",
            onClick : function() {
                clear_isojob();
            }
        },"clearjob");

        function clear_isojob(){
            // gp.clearJob(params, completeCallback, statusCallback,gpJobFailed);
            // mymap.graphics.clear(feature);

            myGraphicsLayerIsoMain.clear();
            console.log(myGraphicsLayerIsoMain);
            myGraphicsLayerIsoValve.clear();
            console.log(myGraphicsLayerIsoValve);
            myGraphicsLayerIsoAffectedArea.clear();
            console.log(myGraphicsLayerIsoAffectedArea);
        }
        function completeCallback(jobInfo) {
            // debugger;
            //gp.get-result-data-complete(GeoprocessorEvent.GET_RESULT_DATA_COMPLETE, onGetResult);
            gp.on("job-complete",onGetResult);
            var status = jobInfo.jobStatus;

            if (status === "esriJobSucceeded"){
                console.log("success, jobId:" + jobInfo.jobId);
                //gp.getResultData(jobInfo.jobId, "Isolating_Valves", onGetResult, displayError);
                gp.getResultData(jobInfo.jobId, "Isolating_Valves", displayResultVlv);
                gp.getResultData(jobInfo.jobId, "Isolated_Mains", displayResultMain);
                gp.getResultData(jobInfo.jobId, "Affected_Area",displayResultArea);

            }
            console.log("getting data");

        }
        function onGetResult() {
            // alert('Results Complete');
        }
        function displayResultMain(result, messages) {
            var features = result.value.features;
            dom.byId("mainvalves").innerHTML = "Main Valves Count:" +features.length;
            alert("main valves count:" +features.length);
            for (var f=0, fl=features.length; f<fl; f++) {
                 feature = features[f];
                feature.setSymbol(isoLine);
                myGraphicsLayerIsoMain.add(feature);
            }
        }
        function displayResultVlv(result, messages) {
            var features = result.value.features;
            dom.byId("isolatingvalves").innerHTML = "Isolating Valves Count:" +features.length;
            alert("isolating valves count:" +features.length);
            for (var f=0, fl=features.length; f<fl; f++) {
                feature = features[f];
                feature.setSymbol(isoPoint);
                myGraphicsLayerIsoValve.add(feature);
            }
        }
        function displayResultArea(result, messages) {
            alert("affected area count:" +features.length);
            var features = result.value.features;
            for (var f=0, fl=features.length; f<fl; f++) {
                 feature = features[f];
                feature.setSymbol(isoPoly);
                mymap.graphics.add(feature);
            }
        }

        function statusCallback(jobInfo) {
            // debugger;
            console.log(jobInfo.jobStatus);
        }
        function gpJobFailed(error){
            debugger;
            alert(error);
        }
        dojo.query("#waterisolation").connect("onclick", function () {
            if(isolationwindow === "off"){
                openisolationwindow();
            }
        });
        dojo.query("#inputflag").connect("onclick", function () {
            if(flagenabled === "off"){
                isisoenabled();
            }
        });
        dojo.query("#inputskip").connect("onclick", function () {
            if(skipenabled === "off"){
                isisoenabledforskippoint();
            }
        });
        dojo.query("#clearjob").connect("onclick", function () {
            if(flagenabled === "on"){
                clearisojob();
            }
        });
        var isolationwindow = "off";
        function openisolationwindow(){
            if(isolationwindow === "off"){
                isolationwindow = "on";
            }
            else{
                isolationwindow = "off";
                flagenabled = "off";
                isoenabled = "off";
                skipenabled = "off";
                isoParamType="ISOPOINT";
            }
        }

        var isoenabled = "off";
        var flagenabled = "off";
        var skipenabled = "off";

        function isisoenabled(){

            if(flagenabled === "off"){
                $("#inputflag").css('border-color','#005ce6');
                flagenabled = "on";
                isoenabled = "on";
                skipenabled = "off";
                isoParamType="ISOPOINT";
            }else{
                flagenabled = "off";
                isoenabled = "off";
            }
        }
        function isisoenabledforskippoint() {

            if (skipenabled === "off") {
                $("#inputskip").css('border-color','#005ce6');
                flagenabled = "off";
                isoenabled = "on";
                skipenabled = "on";
                isoParamType = "SKIPPOINT";
            } else {
                skipenabled = "off";
                isoenabled = "off";
                isoParamType = "ISOPOINT";
            }
        }
        function clearisojob(){
            if(isolationwindow = "on"){
               isolationwindow = "off";
                flagenabled = "off";
                isoenabled = "off";
                skipenabled = "off";
                isoParamType="ISOPOINT";
                alert("cleared");
            }
        }
    }

    return{
        isotraceTool:function(){
            isotraceTool();
        }
    };

});




// isotrace_widget.isotraceTool();