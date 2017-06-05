/**
 * Created by kavyam on 4/10/2017.
 */
require([ "dojo/dom", "dojo/_base/xhr", "dojo/domReady!" ], function(dom, xhr) {

    var url1 = require.toUrl("./widgets/widgetAccordianContent.htm");
    //var url5 = require.toUrl("./widgets/valv.htm");

    //widgets sidnav
    xhr.get({
        url : url1,
        load : function(html) {
            dom.byId("widgetPanelDiv").innerHTML = html;
        }
    });

    //valv and hydrant buttons
    // xhr.get({
    // url : url2,
    // load : function(html) {
    // dom.byId("-----------").innerHTML = html;
    // }
    // });
});

