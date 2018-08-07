jQuery(function($){
    $.fn.taskSearch = function(options){
        this.each(function(){
            var task = $(this).data('dataTask');
            if( !task ){
                task = new taskSearch( this, options );
                $(this).data('dataTask', task);
            }
        });
    }

    function taskSearch(element, options){
        var dataSet = $(element).data() || {};
        this.options = $.extend({
            isGoogleMaps: true,
        }, dataSet, options || {});
        this.$element = $(element);
        this.element = element;
        this.init();
    }

    taskSearch.prototype = {
        init: function(){
            this.$main_content = $('.main-conte', this.$element);
            this.latitude = 0, this.longitude = 0;
            this.load_map();
            this.lazy_load();
            this.search_advance();
        },
        lazy_load: function(){
            var self = this;
            if($('body').hasClass('page-search') && $('body').find('.row-search').length ){
                //localStorage.latitude =
                function showPosition(position) {
                    localStorage.latitude = position.coords.latitude;
                    localStorage.longitude = position.coords.longitude;
                    //console.log(localStorage.latitude, localStorage.longitude);
                    //$('#lat', self.$element).val(self.latitude);
                    //$('#lng', self.$element).val(self.longitude);
                    $('#lat', self.$element).val(localStorage.latitude);
                    $('#lng', self.$element).val(localStorage.longitude);
                }
                function showError(error) {
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            console.log("User denied the request for Geolocation.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.log("Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            console.log("The request to get user location timed out.");
                            break;
                        case error.UNKNOWN_ERROR:
                            console.log("An unknown error occurred.");
                            break;
                    }
                    $('.form-item-km').hide();
                }
                function getLocation(){
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition( showPosition, showError);
                    }
                }
                getLocation.call();
                var $sidebarRight = $('.page-search .sidebar-right');
                self.$main_content.block();
                setTimeout(function(){
                    self.$main_content.unblock();
                }, 1000);
                self.resize_image_post();
            }
            self.action_paging();
        },
        resize_image_post: function(){
            var $task_search_items = $('.page-search-task #block-system-main .search-task-found .post-item');
            $.each($task_search_items, function(index, element){
                var $item_right = $(element).find('.item-right');
                var $item_left = $(element).find('.item-left');
                var height_right = 0;
                if( $item_left.length > 0 ){
                    height_right = $item_right.outerHeight();
                    $('.image', $item_left).css('height', height_right);
                }
            });
        },
        init_event_click_paging: function($element){
            var self = this;
            function callback_paging($this){
                var $task_search = $('.page-search-task #block-system-main .search-task-found');
                var options = {
                    url: $this.attr('href'),
                    type: 'post',
                    dataType: "json",
                    beforeSend: function(xhr, settings) {
                        //$response.addClass('hidden').removeClass('error').removeClass('success').html('');
                        self.$main_content.block();
                        return;
                    },
                    error: function(xhr, status, error) {
                        console.log(xhr, status, error);
                        return;
                    },
                    success: function(response, status, xhr) {
                        /*$response.removeClass('hidden').addClass('success').html("Lưu thành công");
                        location.reload();*/
                        //console.log(response, status, xhr);
                        if( $.isPlainObject(response) && 'html' in response ){
                            $task_search.html(response.html);
                            self.init_event_click_paging($($task_search).find('.posts-pagination a'));
                            self.resize_image_post();
                        }
                        if('locations' in response && response.locations != ''){
                            self.load_map(response.locations);
                        }
                        return;
                    },
                    complete: function(xhr, status) {
                        self.$main_content.unblock();
                        return;
                    }
                };
                $.ajax(options);
            }
            $element.off('click.paging').on('click.paging', function(ev){
                ev.preventDefault();
                var $this = $(this);
                callback_paging($this);
            });
        },
        action_paging: function(){
            var self = this;
            self.init_event_click_paging($('.posts-pagination a', self.$element));
        },
        load_map: function(locations = []){
            var marker_locations = [];
            if( locations.length ){
                marker_locations = locations;
            }else{
                var data = $('body').data();
                marker_locations = data.marker_locations;
            }
            if( marker_locations.length ) {
                var options = {
                    searchPolygon: true,
                    isProject: false,
                    isDetail: false,
                    locations: marker_locations,
                };
                self.map = $('#map').maps(options);
            }
        },
        search_advance: function(){
            var self = this;
            Drupal.ajax['edit-km'].options.beforeSubmit = function(form_values, element, options){
                self.km = $('select.circle-km', self.$element).val();
            };

            Drupal.ajax.prototype.commands.ajaxSearchAdvance = function(ajax, response, status){
                if( $.isPlainObject(response) && 'code' in response && response.code == 201 ){
                    var html = $.parseJSON(response.html);
                    var $task_search = $('.page-search-task #block-system-main .search-task-found');
                    $task_search.html(html);
                    //$task_search.find('.selectpicker').selectpicker();
                    self.init_event_click_paging($($task_search).find('.posts-pagination a'));
                    if('locations' in response && response.locations != ''){
                        var lat = $('#lat', self.$element).val();
                        var lng = $('#lng', self.$element).val();
                        var options = {
                            searchPolygon: true,
                            isProject: false,
                            isDetail: false,
                            searchPostCirle: true,
                            locations: response.locations,
                            lat: lat,
                            km: self.km,
                            lng: lng,
                        };
                        $('#map').maps(options);
                        self.resize_image_post();
                    }else{
                        $('.list-item-map', $task_search).remove();
                        $('.search-task-map', $task_search).remove();
                        var $div = $('<h2 class="tilte-not-found">Not found</h2>');
                        $div.insertBefore( '.page-search-task .posts-pagination' );
                    }
                }
            };
        },
    };
    $('.page-search').taskSearch();

});
