/**
 * Created by kavyam on 5/8/2017.
 */

// grid_Assignment_widget is define name that is added in require (main j sfile).
//Make sure the current Define name and File name has to be same
define("grid_Assignment_widget",[
    "esri/layers/FeatureLayer",
    "esri/tasks/QueryTask",
    "esri/tasks/query",
    "esri/graphic",
    "dojo/on",
    "dojo/dom"
], function (
    FeatureLayer ,QueryTask, Query, Graphic, on, dom
){
// create a function to add content and make sure you called the function in main javascript file
    function widgetTool(){
        var assignment_widget=config_assignmentAttributes;

//grid Assignment widget
        var gridbutton = new dijit.form.Button({
            label: "Update",
            onClick: function () {
               //Crew Grid aAssignment Function
                var queryTask = new QueryTask(assignment_widget.url);
                gridid = dom.byId('gridnumber').value;
                //create a query that returns objectid and grid value attributes from the assignment widget rest service
                var query = new Query();
                query.returnGeometry = false;
                query.outFields = ["OBJECTID,GRID_ID"];
                query.where = "GRID_ID='"+gridid+"'";
                queryTask.execute(query, showResults);

                var crewname = dom.byId('crewname').value;
                // alert(crewname);
                var editLayer = mymap.getLayer("assignmentlayer");
                //settime out make the crew value get update after a sec(1000)
                setTimeout(function(){
                    if(gridAssignmentObjectid){
                    var edittAttributes = {
                        OBJECTID: gridAssignmentObjectid,
                        WORKAREA: crewname
                    };
                    //apply updated grahpics on map
                    var editGraphic = new Graphic(null, null, edittAttributes);
                    editLayer.applyEdits(null, [editGraphic], null);
                    alert("assignment updated successfully");

                } }, 1000);

            }
        }, "updatecrew");

        function showResults(results) {

            var resultItems = [];
            var resultCount = results.features.length;

            for (var i = 0; i < resultCount; i++) {
                if (gridid === results.features[i].attributes["GRID_ID"]) {
                    gridAssignmentObjectid = results.features[i].attributes["OBJECTID"];
                }
            }
            dynLayer1.refresh();
            //  alert(gridAssignmentObjectid);
        }
        //remove the assignment value

        var removebutton = new dijit.form.Button({
            label: "Remove",
            onClick: function () {
               //CheckMark Edit Function
                var queryTask = new QueryTask(assignment_widget.url);
                gridid = dom.byId('gridnumber').value;

                var query = new Query();
                query.returnGeometry = false;
                query.outFields = ["OBJECTID,GRID_ID"];
                query.where = "GRID_ID='"+gridid+"'";
                queryTask.execute(query, removeResults);

                var crewname = dom.byId('crewname').value;
                // alert(crewname);
                var editLayer = mymap.getLayer("assignmentlayer");

                setTimeout(function(){ if(gridAssignmentObjectid){
                    var edittAttributes = {
                        OBJECTID: gridAssignmentObjectid,
                        WORKAREA: ''
                    };

                    var editGraphic = new Graphic(null, null, edittAttributes);
                    editLayer.applyEdits(null, [editGraphic], null);
                    alert("assignment cleared successfully");

                } }, 1000);

            }
        }, "Clearcrew");

        function removeResults(results) {

            var resultItems = [];
            var resultCount = results.features.length;

            for (var i = 0; i < resultCount; i++) {
                if (gridid === results.features[i].attributes["GRID_ID"]) {
                    gridAssignmentObjectid = results.features[i].attributes["OBJECTID"];
                }
            }
            dynLayer1.refresh();
            //  alert(gridAssignmentObjectid);
        }

    }

    return{
        widgetTool:function(){
            widgetTool();
        }
    };

});




// grid_Assignment_widget.widgetTool();
