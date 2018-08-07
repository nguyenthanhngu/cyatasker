(function($, Drupal) {
    var elt = $('#tagsinput-typeahead');

    var users = new Bloodhound({
        limit: 10,
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: $.map([], function(item) {
            return {value: item};
        })
    });

    users.initialize();

    elt.tagsinput({
        typeaheadjs: {
            name: 'value',
            displayKey: 'value',
            valueKey: 'value',
            source: users.ttAdapter()
        }
    });

    Drupal.ajax.prototype.commands.ajaxVisibilityCallback = function(ajax, response, status) {
        var html = '';
        $.each(response.users, function( index, user ) {
            html += '<div class="tt-suggestion tt-selectable">' + user.name + '</div>';
        });

        $('.tt-menu').css('display', 'block');
        $('.tt-dataset').html(html);
    };

    $(document).off('keyup', '.tt-input').on('keyup', '.tt-input', function(e) {
        $('input[name="search"]').val($('.tt-input').val()).change();
    });

    $(document).off('click', '.tt-selectable').on('click', '.tt-selectable', function(e) {
        elt.tagsinput('add', $(this).text());
        $('.tt-dataset').html('');
        $('.tt-menu').css('display', 'none');
    });

    var $input_page = $("#node-visibility-load-more-form").find("input[name='page']");
    $input_page.val(1);

    Drupal.ajax.prototype.commands.ajaxLoadMoreMembersCallback = function(ajax, response, status) {
        var members = JSON.parse(response.members);
        var html = "";

        $.each(members, function (i) {
            html += '<div class="col-md-2"><div><img src="' + members[i].picture + '"><a href="#" class="remove-member"' +
                'data-user-name="' + members[i].name + '" data-toggle="modal" data-target="#remove-member">X</a></div><div>' + members[i].name + '</div></div>';
        });

        $("#list-member").append(html);

        $input_page.val(parseInt($input_page.val()) + 1);
    };

    $(document).off('click', '.remove-member').on('click', '.remove-member', function () {
        var $this = $(this);
        var user_name = $this.data("user-name");

        $("#remove-member").find("input[name='user_name']").val(user_name);
        $("#removed-name").html(user_name);
    });
}(jQuery, Drupal));