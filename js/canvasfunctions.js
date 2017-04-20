/**
 * Created by kavyam on 4/17/2017.
 */
$(function() {

    //  Menu Slider for widgets
    $('.nav-expander').on('click', function(e) {
        e.preventDefault();
        $('body').toggleClass('nav-expanded');

    });

    //  Reports select urls
    $('#reportsMenuBtn').on('change', function () {
        var url = $(this).val(); // get selected value
        if (url) { // require a URL
            window.open(url,'_blank'); // redirect
        }
        return false;
    });
});