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
//var config_infowindowOutfields;

//function that grabs layer informationfrom config file
function loadMapLayers(appConfigData) {
    //set empty Global variables to hold json data from config
    config_mapProjection = {
        wkid: appConfigData.configSettings.map.wkid,
        localwkid: appConfigData.configSettings.map.localWKID
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

    config_dbQueryAttributes = {
        url: appConfigData.configSettings.dbquerying.url,
        source: appConfigData.configSettings.dbquerying.source,
        uniqueid: appConfigData.configSettings.dbquerying.uniqueid,
        outfields: appConfigData.configSettings.dbquerying.outFields.split(","),
        dbdatefield: appConfigData.configSettings.dbquerying.dbDateField
    };
    config_assignmentAttributes = {
        url: appConfigData.configSettings.assigmentfeaturelayer.url,
        source: appConfigData.configSettings.assigmentfeaturelayer.source,
        uniqueid: appConfigData.configSettings.assigmentfeaturelayer.uniqueid
    };
    config_webtoolsAttribuites ={
        responsePointsurl: appConfigData.configSettings.webtools.responsePointsurl,
        responselinesurl: appConfigData.configSettings.webtools.responselinesurl,
        responsePolyurl: appConfigData.configSettings.webtools.responsePolyurl
    }
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
    var clientlogo = appConfigData.configSettings.clientlogo;
    var apptitle = appConfigData.configSettings.apptitle;
    var companylogo = appConfigData.configSettings.companylogo;

    var homelink = appConfigData.configSettings.homelink.url;
    var newslink = appConfigData.configSettings.newslink.url;
    var solutionslink = appConfigData.configSettings.solutionslink.url;
    var serviceslink = appConfigData.configSettings.serviceslink.url;

    document.getElementById("clienticon").src = clientlogo;
    document.getElementById("citytagname").innerHTML = apptitle;
    document.getElementById("companyicon").src = companylogo;

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


    var config_QuickSelectquerySelectionNode;
    config_QuickSelectquerySelectionNode = appConfigData.configSettings.QuickSelectAttributes.QueryItem;

    for (i = 0; i < appConfigData.configSettings.QuickSelectAttributes.QueryItem.length; i++) {

        var elementid = appConfigData.configSettings.QuickSelectAttributes.QueryItem[i].serviceindex;
        var elementvalue = appConfigData.configSettings.QuickSelectAttributes.QueryItem[i].label;
        var elementdata = appConfigData.configSettings.QuickSelectAttributes.QueryItem[i].where;

        var optValue = elementid + "," + elementdata;

        $("#queryMenuBtn").append('<option id="' + elementid + '" where="' + elementdata + '" value="' + optValue + '" >' + elementvalue + '</option>');
    }

 //set reports from config
    config_reportMenu = {
        defaultlabel: appConfigData.configSettings.ReportMenuItem.defaultlabel
    };
    $("#reportsMenuBtn").append('<option>' + config_reportMenu.defaultlabel + '</option>');

    var config_reportsSelectionNode;
    config_reportsSelectionNode = appConfigData.configSettings.ReportMenuItem.listitems;

    for (i = 0; i < appConfigData.configSettings.ReportMenuItem.listitems.length; i++) {

        var lablevalue = appConfigData.configSettings.ReportMenuItem.listitems[i].label;
        var lableurl = appConfigData.configSettings.ReportMenuItem.listitems[i].url;

       // var optValue = elementid + "," + elementdata;

        $("#reportsMenuBtn").append('<option value="' + lableurl + '" >' + lablevalue + '</option>');
    }

}
