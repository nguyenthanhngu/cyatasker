(function($)
{
    $("select[name='view_type']").val("all");
    reset_load_more_form('#earned-load-more-form');
    reset_load_more_form('#paid-load-more-form');

    $("select[name='view_type']").off('change.selectTypeView').on('change.selectTypeView', function () {
        var $payment_date = $(this).parent().parent().parent().find(".payment-date");
        console.log($payment_date);
        if($(this).val() == "all") {
            $payment_date.addClass('hide');
        }  else {
            $payment_date.removeClass('hide');
        }
    });

    var currentTime = Date.now();
    // Default value of from date will be 30 days  ago (2592000000 = 30 * 24 * 60 * 60)
    var defaultFromDate = new Date(currentTime - 2592000000);
    defaultFromDate = convertDate(defaultFromDate);
    var defaultToDate = new Date();
    defaultToDate = convertDate(defaultToDate);

    timePicker($("input[name='from_date']"), defaultFromDate);
    timePicker($("input[name='to_date']"), defaultToDate);

    // convert Date to format "d/m/Y"
    function convertDate(date) {
        return pad(date.getDate()) + "/" + pad(date.getMonth()+1) + "/" + date.getFullYear();
    }

    // convert number to 2-digit
    function pad(n) {
        return n < 10 ? "0"+n : n;
    }

    function timePicker(obj, defaultValue) {
        obj.datetimepicker({
            format: "d/m/Y",
            timepicker: false,
            value: defaultValue,
            maxDate: new Date,
        });
    }

    function reset_load_more_form(id) {
        $(id).find("input[name='view_type']").val("all");
        $(id).find("input[name='from_date']").val("");
        $(id).find("input[name='to_date']").val("");
        $(id).find("input[name='page']").val(1);
    }
}(jQuery));