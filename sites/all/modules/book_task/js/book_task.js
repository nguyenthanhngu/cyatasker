(function($) {
    $(".approve-task").off('click.approveTask').on('click.approveTask', function () {
        var $this = $(this);
        var uid = $this.data("uid");
        var price = $this.data("price");
        var name = $this.data("name");

        if(price == "") {
            price = $("#original-price").val();
        }

        var $approve_task = $("#approve-task");
        $approve_task.find("input[name='uid']").val(uid);
        $approve_task.find("input[name='showed_price']").val(price);
        $approve_task.find("input[name='price']").val(price);
        $approve_task.find("input[name='name']").val(name);
    });
}(jQuery));