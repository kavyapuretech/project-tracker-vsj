/**
 * Created by kavyam on 4/7/2017.
 */
var basemapstatus = "off";
var layerstatus = "off";
var webtoolstatus = "off";
function openBasemap() {

    if (basemapstatus === "off") {
        document.getElementById("basemapPanelDiv").style.display = "block";
        document.getElementById("layerlist").style.display = "none";
        document.getElementById("webtoolswidget").style.display = "none";

        basemapstatus = "on";
    } else if (basemapstatus === "on") {
        document.getElementById("basemapPanelDiv").style.display = "none";
        basemapstatus = "off";
    }
}

function openLayer() {

    if (layerstatus === "off") {
        document.getElementById("layerlist").style.display = "block";
        document.getElementById("basemapPanelDiv").style.display = "none";
        document.getElementById("webtoolswidget").style.display = "none";

        layerstatus = "on";
    } else if (layerstatus === "on") {
        document.getElementById("layerlist").style.display = "none";
        layerstatus = "off";

    }
}
function openwebtools() {

    if (webtoolstatus === "off") {
        document.getElementById("webtoolswidget").style.display = "block";
        document.getElementById("layerlist").style.display = "none";
        document.getElementById("basemapPanelDiv").style.display = "none";

        webtoolstatus = "on";
    } else if (webtoolstatus === "on") {
        document.getElementById("webtoolswidget").style.display = "none";
        webtoolstatus = "off";

    }
}


function closepanels() {

    // if (layerstatus === "on") {
    // document.getElementById("layerlist").style.display = "none";
    // layerstatus = "off";
    // }
    if (basemapstatus === "on") {
        document.getElementById("basemapPanelDiv").style.display = "none";
        basemapstatus = "off";
    }
    if (webtoolswidget === "on") {
        document.getElementById("webtoolswidget").style.display = "none";
        webtoolswidget = "off";
    }

    $('body').removeClass('nav-expanded');



}