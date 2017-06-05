/**
 * Created by kavyam on 5/9/2017.
 */

/**
 * The javascript file which contains define continuation of the require funtion
 */

var editorWidget;
var editLayers;
var editorstatus ='off';

// webtools_widget is define name that is added in require (main j sfile).
//Make sure the current Define name and File name has to be same

define("webtools_widget",[
    "esri/layers/FeatureLayer",
    "dijit/form/ToggleButton",
    "esri/graphic", "esri/dijit/editing/Editor",
    "esri/dijit/editing/TemplatePicker",   "esri/config",   "esri/tasks/GeometryService",
    "dojo/_base/array", "dojo/keys", "esri/urlUtils",
    "dojo/on",
    "dojo/dom"
], function (
    FeatureLayer, ToggleButton, Graphic,  Editor, TemplatePicker, esriConfig, GeometryService,
    arrayUtils, keys, urlUtils, on, dom
){
    // create a function to add content and make sure you called the function in main javascript file
    function editortool(){
// webtools
        var webtools_layer=config_webtoolsAttribuites;
//         Proxy Cross enable service on server
// Cross-Origin Resource Sharing (CORS) allows web applications to bypass the browser's same origin policy file and access resources
        esriConfig.defaults.io.corsEnabledServers.push("http://localhost:63342");
// create a proxy to define the location of code to your application to communicate using ProxyUrl
        esriConfig.defaults.io.proxyUrl = "https://localhost:63342/ProjectTrackerJS_Template_v1.1/DotNet/proxy.ashx";
//         specify whether or not the proxy should always be used for communication using alwaysUseProxy
        esriConfig.defaults.io.alwaysUseProxy = false;
// define a proxy rule specify the url for the proxy and the prefix for the resources that need to be accessed through the proxy.
        urlUtils.addProxyRule({
            urlPrefix: "https://localhost:63342",
            proxyUrl: "DotNet/proxy.ashx"
        });
//          geometry service for use within your applications.
        esriConfig.defaults.geometryService = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

        //layers-add-result Fires specified layer has been added to the map donot have nothing to do with onload funtion and services inside it
        var responsePoints = new FeatureLayer(webtools_layer.responsePointsurl, {
            // mode: FeatureLayer.MODE_ONDEMAND
        });
        var responselines = new FeatureLayer(webtools_layer.responselinesurl, {
            //mode: FeatureLayer.MODE_ONDEMAND
        });
        var responsePoly = new FeatureLayer(webtools_layer.responsePolyurl, {
            //mode: FeatureLayer.MODE_ONDEMAND
        });
        mymap.addLayers([responsePoints,responselines,responsePoly]);
        responsePoints.setVisibility(true);
        responselines.setVisibility(true);
        responsePoly.setVisibility(true);
        //toggle button used to highlihgt:on and off the webtool servics on map
        var togglewebtoolbutton = new ToggleButton({
            showLabel: true,
            onChange: function(val){

                if (val === true) {
                    responsePoints.setVisibility(false);
                    responselines.setVisibility(false);
                    responsePoly.setVisibility(false);
                    this.set('label', 'off');
                }
                else {
                    responsePoints.setVisibility(true);
                    responselines.setVisibility(true);
                    responsePoly.setVisibility(true);
                    this.set('label', 'on');
                }
            }, label: "on"
        },"webtoolhighlightbutton");//.startup();
        dojo.connect(mymap, "onLayersAddResult", getEditableLayers);

        function getEditableLayers(results){
            editLayers = dojo.map(results, function(result) {
                return {
                    'featureLayer': result.layer
                };
            });
        }

        function createEditor() {
            editorstatus = 'on';
            if (editorWidget) {
                return;
            }

            if (editLayers.length > 0) {

                responsePoints.setVisibility(true);
                responselines.setVisibility(true);
                responsePoly.setVisibility(true);
                //create template picker
                var templateLayers = dojo.map(editLayers, function (layer){
                    return layer.featureLayer;
                });


                var eDiv = dojo.create("div", {
                    id: "editDiv"
                });
                dojo.byId('templatePickerPane').appendChild(eDiv);

                var templatePicker = new TemplatePicker({
                    featureLayers: templateLayers,
                    rows: 'auto',
                    columns: '3',
                    style: 'height:98%;width:98%;'
                }, 'editDiv');
                templatePicker.startup();

                var settings = {
                    map: mymap,
                    templatePicker: templatePicker,
                    layerInfos: editLayers,
                    toolbarVisible: false

                };
                var params = {
                    settings: settings
                };
                editorWidget = new Editor(params);
                editorWidget.startup();
            }
            dojo.query(".panel-title").connect("onclick", function () {
                if ( editorstatus === 'on') {
                    destroyEditor();
                }
            })

        }
        var  editorstatus = 'off';
        function destroyEditor() {
            if (editorWidget) {
                editorstatus = 'off';
                editorWidget.destroy();
                editorWidget = null;
            }
            responsePoints.setVisibility(false);
            responselines.setVisibility(false);
            responsePoly.setVisibility(false);
        }
        var addBtn2 = new ToggleButton({
            showLabel: true,
            onChange: function(val){
                if (val === true) {
                    this.set('label', 'stop');
                    createEditor();
                }
                else {
                    this.set('label', 'start');
                    destroyEditor()
                }
            }, label: "stop"
        },"toggleeditor");//.startup();
    }

    return{
        editortool:function(){
            editortool();
        }
    };

});




// grid_Assignment_widget.widgetTool();
