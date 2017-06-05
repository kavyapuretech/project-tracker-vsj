/**
 * Created by tavonm on 3/29/2017.
 */
//var map;

// Create Arrays for data to be loaded to index.html from json config file
var json_configAppData  = {};

//When document ready call the json function that grab files
$(document).ready(function() {
    json_configAppData = getjsondata("Config/appConfig.json");
    loadMapLayers(json_configAppData);
    gettrucklayerdata(json_configAppData);
//adding trucktracting function to json variable
    checktruckstatus(json_configAppData);
    setTimeout(function(){checktruckmoment();
    },30*60*1000);
});

//function that loads json file for parsing from getjsondata("Config/appConfig.json")
function getjsondata(filepath) {
    var result;
    $.ajax({
        type:'GET',
        url:filepath,
        dataType:'json',
        async:false,
        success:function(data){
            result = data;
        }
    });
    return result;
}

//Global Variables for dynamic map Url across app
//define empty map layer objects
var config_mapProjection={};
var config_mapExtent={};
var config_dynamicLayer1={};
var config_dynamicLayer2={};
var config_dynamicLayer3={};
var config_dynamicLayer4={};
var config_dynamicLayer5={};
var config_dynamicLayer6={};
var config_dynamicLayer7={};
var config_dynamicLayer8={};

var config_infowindowfeatureLayer={};
var config_dbQueryAttributes={};
var config_assignmentAttributes={};
var config_webtoolsAttribuites={};
var config_valvsearchLayer={};
var config_hydrentsearchLayer={};
var config_isotrace=[];

//function that grabs layer informationfrom config file
function loadMapLayers(appConfigData) {
    //set empty Global variables to hold json data from config
//set spatial reference from config
    config_mapProjection = {
        wkid: appConfigData.configSettings.spatialref.wkid,
        localwkid: appConfigData.configSettings.spatialref.localWKID
    };
    config_mapExtent = {
        xmin: appConfigData.configSettings.mapcontent.xmin,
        ymin: appConfigData.configSettings.mapcontent.ymin,
        xmax: appConfigData.configSettings.mapcontent.xmax,
        ymax: appConfigData.configSettings.mapcontent.ymax,
        InitialWKID: appConfigData.configSettings.mapcontent.initialWKID
    };
    config_dynamicLayer1 = {
        url: appConfigData.configSettings.dynamiclayer1.url,
        alpha: appConfigData.configSettings.dynamiclayer1.alpha,
        id: appConfigData.configSettings.dynamiclayer1.id
    };
    config_dynamicLayer2 = {
        url: appConfigData.configSettings.dynamiclayer2.url,
        alpha: appConfigData.configSettings.dynamiclayer2.alpha,
        id: appConfigData.configSettings.dynamiclayer2.id
    };
    config_dynamicLayer3 = {
        url: appConfigData.configSettings.dynamiclayer3.url,
        alpha: appConfigData.configSettings.dynamiclayer3.alpha,
        id: appConfigData.configSettings.dynamiclayer3.id
    };
    config_dynamicLayer4 = {
        url: appConfigData.configSettings.dynamiclayer4.url,
        alpha: appConfigData.configSettings.dynamiclayer4.alpha,
        id: appConfigData.configSettings.dynamiclayer4.id
    };
    config_dynamicLayer5 = {
        url: appConfigData.configSettings.dynamiclayer5.url,
        alpha: appConfigData.configSettings.dynamiclayer5.alpha,
        id: appConfigData.configSettings.dynamiclayer5.id
    };
    config_dynamicLayer6 = {
        url: appConfigData.configSettings.dynamiclayer6.url,
        alpha: appConfigData.configSettings.dynamiclayer6.alpha,
        id: appConfigData.configSettings.dynamiclayer6.id
    };
    config_dynamicLayer7 = {
        url: appConfigData.configSettings.dynamiclayer7.url,
        alpha: appConfigData.configSettings.dynamiclayer7.alpha,
        id: appConfigData.configSettings.dynamiclayer7.id
    };
    config_dynamicLayer8 = {
        url: appConfigData.configSettings.dynamiclayer8.url,
        alpha: appConfigData.configSettings.dynamiclayer8.alpha,
        id: appConfigData.configSettings.dynamiclayer8.id
    };

    config_infowindowfeatureLayer = {
        url: appConfigData.configSettings.infowindowfeaturelayer.url,
        source: appConfigData.configSettings.infowindowfeaturelayer.source,
        uniqueid: appConfigData.configSettings.infowindowfeaturelayer.uniqueid,
        alpha: appConfigData.configSettings.infowindowfeaturelayer.alpha,
        outfields: appConfigData.configSettings.infowindowfeaturelayer.outFields.split(",")
    };
//set  activity table from config
    config_dbQueryAttributes = {
        url: appConfigData.configSettings.dbquerying.url,
        source: appConfigData.configSettings.dbquerying.source,
        uniqueid: appConfigData.configSettings.dbquerying.uniqueid,
        outfields: appConfigData.configSettings.dbquerying.outFields.split(","),
        dbdatefield: appConfigData.configSettings.dbquerying.dbDateField
    };
//set assignmrnt widget from config
    config_assignmentAttributes = {
        url: appConfigData.configSettings.assigmentfeaturelayer.url,
        source: appConfigData.configSettings.assigmentfeaturelayer.source,
        uniqueid: appConfigData.configSettings.assigmentfeaturelayer.uniqueid
    };
//set web notes from config
    config_webtoolsAttribuites ={
        responsePointsurl: appConfigData.configSettings.webtools.responsePointsurl,
        responselinesurl: appConfigData.configSettings.webtools.responselinesurl,
        responsePolyurl: appConfigData.configSettings.webtools.responsePolyurl
    };
//set Search from config
    config_valvsearchLayer = {
        url: appConfigData.configSettings.querytaskvalveactivities.url,
        source: appConfigData.configSettings.querytaskvalveactivities.source,
        placeholder: appConfigData.configSettings.querytaskvalveactivities.placeholder,
        uniqueid: appConfigData.configSettings.querytaskvalveactivities.uniqueid
    };
    config_hydrentsearchLayer = {
        url: appConfigData.configSettings.querytaskHydrantactivities.url,
        source: appConfigData.configSettings.querytaskHydrantactivities.source,
        placeholder: appConfigData.configSettings.querytaskHydrantactivities.placeholder,
        uniqueid: appConfigData.configSettings.querytaskHydrantactivities.uniqueid
    };
    config_isotrace = {
        url: appConfigData.configSettings.isotrace.url

    };
//set client logs, projectnames links from config
    var clientlogo = appConfigData.configSettings.clientlogo;
    var apptitle = appConfigData.configSettings.apptitle;
    var companylogo = appConfigData.configSettings.companylogo;
    var companyminilogo = appConfigData.configSettings.companyminilogo;

    var homelink = appConfigData.configSettings.homelink.url;
    var newslink = appConfigData.configSettings.newslink.url;
    var solutionslink = appConfigData.configSettings.solutionslink.url;
    var serviceslink = appConfigData.configSettings.serviceslink.url;

    document.getElementById("clienticon").src = clientlogo;
    document.getElementById("citytagname").innerHTML = apptitle;
    document.getElementById("companyicon").src = companylogo;
    document.getElementById("companyminiicon").src = companyminilogo;

    document.getElementById("homelink").href = homelink;
    document.getElementById("newslink").href = newslink;
    document.getElementById("solutionslink").href = solutionslink;
    document.getElementById("serviceslink").href = serviceslink;

//set quick select from config
    config_QuickSelectMenu = {
        defaultlabel: appConfigData.configSettings.QuickSelectAttributes.defaultlabel,
        baseurl: appConfigData.configSettings.QuickSelectAttributes.QuickSelectBaseURL

    };
    var config_QuickSelectdefaultLabel;
    var config_QuickSelectBase_url;
    //set quick select default label from config
    $("#queryMenuBtn").append('<option>' + config_QuickSelectMenu.defaultlabel + '</option>');
    $("#miniqueryMenuBtn").append('<option>' + config_QuickSelectMenu.defaultlabel + '</option>');

    var config_QuickSelectquerySelectionNode;
    config_QuickSelectquerySelectionNode = appConfigData.configSettings.QuickSelectAttributes.QueryItem;

    for (i = 0; i < appConfigData.configSettings.QuickSelectAttributes.QueryItem.length; i++) {

        var elementid = appConfigData.configSettings.QuickSelectAttributes.QueryItem[i].serviceindex;
        var elementvalue = appConfigData.configSettings.QuickSelectAttributes.QueryItem[i].label;
        var elementdata = appConfigData.configSettings.QuickSelectAttributes.QueryItem[i].where;

        var optValue = elementid + "," + elementdata;

        $("#queryMenuBtn").append('<option id="' + elementid + '" where="' + elementdata + '" value="' + optValue + '" >' + elementvalue + '</option>');
        $("#miniqueryMenuBtn").append('<option id="' + elementid + '" where="' + elementdata + '" value="' + optValue + '" >' + elementvalue + '</option>');
    }

    //set reports from config
    config_reportMenu = {
        defaultlabel: appConfigData.configSettings.ReportMenuItem.defaultlabel
    };
    $("#reportsMenuBtn").append('<option>' + config_reportMenu.defaultlabel + '</option>');
    $("#minireportsMenuBtn").append('<option>' + config_reportMenu.defaultlabel + '</option>');
    var config_reportsSelectionNode;
    config_reportsSelectionNode = appConfigData.configSettings.ReportMenuItem.listitems;

    for (i = 0; i < appConfigData.configSettings.ReportMenuItem.listitems.length; i++) {

        var lablevalue = appConfigData.configSettings.ReportMenuItem.listitems[i].label;
        var lableurl = appConfigData.configSettings.ReportMenuItem.listitems[i].url;

        // var optValue = elementid + "," + elementdata;

        $("#reportsMenuBtn").append('<option value="' + lableurl + '" >' + lablevalue + '</option>');
        $("#minireportsMenuBtn").append('<option value="' + lableurl + '" >' + lablevalue + '</option>');
    }
}

var truckdataurl;
var trucksarray;
var truckresponse;
var interval;
var trcukcoordinates = [];
var trucklables = [];

function gettrucklayerdata(configAppData){

    truckdataurl  = configAppData.configSettings.TruckTracking.url;
    trucksarray = configAppData.configSettings.TruckTracking.TruckNames;
    interval = configAppData.configSettings.TruckTracking.timer;

    $.ajax({                type:'GET',
        //  url:'http://www.wwsprojecttracker.com/comet/exports/gpsdata.xml',
        url:truckdataurl,
        dataType:'xml',
        async:false,
        success:function(data){
            truckresponse = data;
        }
    });
    var points = truckresponse.getElementsByTagName('GPS');
trcukcoordinates = [];
    for(var i = 0 ;  i < points.length ; i ++){

        var truckname = points[i].getElementsByTagName('Name')[0].childNodes[0].nodeValue;
        for(var j = 0 ; j<trucksarray.length; j++){
            if(truckname === trucksarray[j].FilterName) {
                trcukcoordinates.push([parseFloat(points[i].getElementsByTagName('Long')[0].childNodes[0].nodeValue), parseFloat(points[i].getElementsByTagName('Lat')[0].childNodes[0].nodeValue)]);
                trucklables.push(trucksarray[j].Lable);
                break;
            }
        }
    }
}

//set trucktracking from config
var ctruckdataurl;
var ctrucksarray;
var ctruckresponse;
var ctrcukcoordinates = [];
function  checktruckstatus(configAppData){
    ctruckdataurl  = configAppData.configSettings.TruckTracking.url;
    ctrucksarray = configAppData.configSettings.TruckTracking.TruckNames;

//adding data from xml url
    $.ajax({
        type: 'GET',
        url: truckdataurl,
        dataType:'xml',
        async: false,
        success:function(data){
            ctruckresponse = data;
        }
    });
    var points = ctruckresponse.getElementsByTagName('GPS');
    for (var i = 0 ;  i < points.length ; i ++)
    {
        var truckname = points[i].getElementsByTagName('Name')[0].childNodes[0].nodeValue;
        for (var j = 0 ; j<ctrucksarray.length; j++)
        {
            if (truckname === ctrucksarray[j].FilterName) {
                ctrcukcoordinates.push([parseFloat(points[i].getElementsByTagName('Long')[0].childNodes[0].nodeValue),
                    parseFloat(points[i].getElementsByTagName('Lat')[0].childNodes[0].nodeValue)]);
                break;
            }
        }
    }
}
function checktruckmoment(){
    setInterval(function() {
        for (var j = 0 ; j<ctrcukcoordinates.length; j++) {
            if (trcukcoordinates[j] === ctrcukcoordinates [j]) {
                // alert("there is no action on truck number" +trucklables[j]);
            }
        }
        checktruckstatus(json_configAppData);
    }, 30*60*1000); }

//  if  && trcukcoordinates[j][0] === ctrcukcoordinates[j][0] && trcukcoordinates[j][1] === ctrcukcoordinates[j][1])
// +trucklables[j]
