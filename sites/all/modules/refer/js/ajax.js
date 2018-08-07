(function($, Drupal) {
    var $input_page = $("#refer-load-more-form").find("input[name='page']");
    $input_page.val(1);

    Drupal.ajax.prototype.commands.ajaxReferedEmailsCallback = function(ajax, response, status) {
        var refered_emails = JSON.parse(response.refered_emails);
        var html = "";
        var baseurl = window.location.origin;

        $.each(refered_emails, function (i) {
            html += "<tr><td><a href='" + baseurl + "/user/" + refered_emails[i].uid + "'>" + refered_emails[i].name + "</a></td><td>"
                + refered_emails[i].email + "</td><td>" + convertDate(new Date(1000 * refered_emails[i].created)) + "</td></tr>";
        });

        $("#table-refered-emails tbody").append(html);
        $input_page.val(parseInt($input_page.val()) + 1);
    };

    // convert Date to format "d/m/Y"
    function convertDate(date) {
        return pad(date.getDate()) + "/" + pad(date.getMonth()+1) + "/" + date.getFullYear();
    }

    //convert number to 2-digit
    function pad(n) {return n < 10 ? "0"+n : n;}
}(jQuery, Drupal));