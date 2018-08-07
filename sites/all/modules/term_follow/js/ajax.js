(function($, Drupal) {
    Drupal.ajax.prototype.commands.ajaxFollowingCallback = function(ajax, response, status) {
        location.reload();
    };
}(jQuery, Drupal));