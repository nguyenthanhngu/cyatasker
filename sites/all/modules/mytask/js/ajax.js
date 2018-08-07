(function($, Drupal) {
    Drupal.ajax.prototype.commands.ajaxMyTasksCallback = function(ajax, response, status) {
        var my_tasks = JSON.parse(response.my_tasks);
        var html = "";
        var baseurl = window.location.origin;

        $.each(my_tasks, function (i) {
            html += "<tr><td><a href='" + baseurl + "/task/" + my_tasks[i].id + "' target='_blank'>" + my_tasks[i].title + "</a></td><td>"
                + my_tasks[i].price + "</td><td>" + my_tasks[i].status + "</td><td>" +
                convertDate(new Date(1000 * my_tasks[i].created)) + "</td></tr>";
        });

        var $input_page = $("#mytask-load-more-form").find("input[name='page']");
        if(response.is_load_more) {
            $("#table-my-task tbody").append(html);
            $input_page.val(parseInt($input_page.val()) + 1);
        } else {
            $("#table-my-task tbody").html(html);
            $input_page.find("input[name='page']").val(1);
        }
    };

    // convert Date to format "d/m/Y"
    function convertDate(date) {
        return pad(date.getDate()) + "/" + pad(date.getMonth()+1) + "/" + date.getFullYear();
    }

    //convert number to 2-digit
    function pad(n) {return n < 10 ? "0"+n : n;}
}(jQuery, Drupal));