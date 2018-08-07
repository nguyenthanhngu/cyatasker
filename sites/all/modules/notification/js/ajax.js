(function($, Drupal) {
    var $input_page = $("#load-more-notifications-form").find("input[name='page']");
    $input_page.val(1);

    Drupal.ajax.prototype.commands.ajaxNotificationsCallback = function(ajax, response, status) {
        var notifications = JSON.parse(response.notifications);
        var html = "";

        $.each(notifications, function (i) {
            var class_name = (notifications[i].status == 0) ? "new" : "old";
            html += '<div class="' + class_name + '"><a href="' + notifications[i].link + '" target="_blank">' + notifications[i].content + '</div>';
        });

        $("#notifications").append(html);

        $input_page.val(parseInt($input_page.val()) + 1);
    };
}(jQuery, Drupal));