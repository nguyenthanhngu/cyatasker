(function($, Drupal)
{
    Drupal.ajax.prototype.commands.ajaxPaymentHistoryCallback = function(ajax, response, status)
    {
        var payment_history = JSON.parse(response.payment_history);
        var html = "";

        $.each(payment_history, function (i) {
            html += "<tr><td>" + payment_history[i].amount + "</td><td>" + convertDate(new Date(1000 * payment_history[i].updated)) + "</td></tr>";
        })

        var table_id = "#table-" + response.payment_type + "-history";
        var amount_id = "#" + response.payment_type + "-amount";
        var load_more_id = "#" + response.payment_type + "-load-more-form";
        var history_form_id = "#" + response.payment_type + "-history-form";

        if(response.is_load_more) {
            $(table_id + " tbody").append(html);

            var current_total_amount = parseFloat($(amount_id).html());
            $(amount_id).html(current_total_amount + response.total_amount);

            var $input_page = $(load_more_id).find("input[name='page']");
            $input_page.val(parseInt($input_page.val()) + 1);
        } else {
            $(table_id + " tbody").html(html);
            $(amount_id).html(response.total_amount);

            var view_type = $(history_form_id).find("select[name='view_type']").val();
            var from_date = $(history_form_id).find("input[name='from_date']").val();
            var to_date = $(history_form_id).find("input[name='to_date']").val();

            $(load_more_id).find("input[name='view_type']").val(view_type);
            $(load_more_id).find("input[name='from_date']").val(from_date);
            $(load_more_id).find("input[name='to_date']").val(to_date);
            $(load_more_id).find("input[name='page']").val(1);
        }
    };

    // convert Date to format "d/m/Y"
    function convertDate(date) {
        return pad(date.getDate()) + "/" + pad(date.getMonth()+1) + "/" + date.getFullYear();
    }

    // convert number to 2-digit
    function pad(n) {return n < 10 ? "0"+n : n;}

}(jQuery, Drupal));