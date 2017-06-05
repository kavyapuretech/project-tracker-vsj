
/**
 * Created by kavyam on 5/9/2017.
 */
/**
 * The javascript file which contains define continuation of the require funtion
 */
// trucktracking_widget is define name that is added in require (main j sfile).
//Make sure the current Define name and File name has to be same

var  Graphic_Truck_Layer;

define("trucktracking_widget",[
    "dojo/dom", "esri/graphic", "esri/symbols/PictureMarkerSymbol","esri/symbols/TextSymbol",  "esri/Color",
    "esri/geometry/Point","dijit/form/ToggleButton",
    "esri/renderers/SimpleRenderer","esri/layers/GraphicsLayer",
    "dojo/domReady!"
], function(
    dom, Graphic,
    PictureMarkerSymbol, TextSymbol, Color, Point, ToggleButton, SimpleRenderer, GraphicsLayer
){

    // parser.parse();
    
    // create a function to add content and make sure you called the function in main javascript file
    function trackingTool(){
//  truck markers start
        var truckRenderer = new SimpleRenderer();
        Graphic_Truck_Layer = new GraphicsLayer({
                        id:  "trucklayer"
                }); 
       mymap.addLayer(Graphic_Truck_Layer);
        // Graphic_Truck_Layer.clear();
        var iconPath = 'https://static.arcgis.com/images/Symbols/Shapes/BluePin1LargeB.png';
        setInterval(function () {
            gettrucklayerdata(json_configAppData);
         var pictureSymbol = new PictureMarkerSymbol(iconPath, 50, 50).setOffset(0, 22);
         if(Graphic_Truck_Layer){
             mymap.removeLayer(Graphic_Truck_Layer);
          Graphic_Truck_Layer = new GraphicsLayer({
                        id:  "trucklayer"
                    });
       mymap.addLayer(Graphic_Truck_Layer);
         }
        
           // var layer = mymap.getLayer('trucklayer');
           // alert(trcukcoordinates.length);
            for(var i = 0 ;  i < trcukcoordinates.length ; i ++){
                var truckname= trucklables[i];
                //get the layer using the layer id
                

                var textSymbol = new TextSymbol(trucklables[i]).setColor(
                    new Color([255, 255, 255])).setOffset(0, 16);
                var truckgraphics = new Graphic(new Point(trcukcoordinates[i]), pictureSymbol);
                var trucklablegraphic= new Graphic(new Point(trcukcoordinates[i]),textSymbol);
                  Graphic_Truck_Layer.add(truckgraphics);
                    Graphic_Truck_Layer.add(trucklablegraphic);
               
                // mymap.graphics.add(truckgraphics, trucklablegraphic);
            }
        }, interval);

        //trucktracking on/off button
        var truckSymbolBtn = new ToggleButton({
            onChange: function (evt) {
                if(evt===true){
                    // mymap.graphics.setVisibility(false);
                    Graphic_Truck_Layer.setVisibility(false);
                    this.set('label', 'trucktracking:start');
                }
                else{
                    Graphic_Truck_Layer.setVisibility(true);
                    this.set('label', 'trucktracking:stop');
                }
            },
            label: "trucktracking"

        },  "my_button").startup();
    }

    return{
        trackingTool:function(){
            trackingTool();
        }
    };

});




// trucktracking_widget.initializeTool();



