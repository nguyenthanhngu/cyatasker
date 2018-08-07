(function($){
    $.fn.myblock = function(options) {
        this.each(function(){
            var myblock = $(this).data('myBlock');
            if( !myblock ) {
                myblock = new myBlock(this, options);
                $(this).data('myBlock', myblock );
            }
        });
        return this;
    };
    var myBlock = function(element, options){
        var dataSet = $(element).data() || {};
        this.options = $.extend({
            isGoogleMaps: true,
        }, dataSet, options || {});
        var self = this;
        self.$element = $(element);
        self.element = element;
        self.$form = $(element);
        self.init();
    };
    myBlock.prototype = {
        initElement: function(){
            var self = this;
            self.idInput = "address_maps";
            self.$addressInput = $('#'+self.idInput);
            self.$btnSearchMap = $('#btn-get-address');
            self.$latitude = $('#latitude');
            self.$longitude = $('#longitude');
            self.globalLat = parseFloat(self.$latitude.val()) || 10.772054;
            self.globalLng = parseFloat(self.$longitude.val()) || 106.698324;
            self.idMap = "node-map"
        },
        init: function(){
            var self = this;
            self.initElement();
            if( self.options.isGoogleMaps ) {
                self.initGoogleMaps();
            }
            self.initSelectpicker();
            self.formValidate();
            return self;
        },
        initSelectpicker: function(){
          var self = this;
          $('.item-selectpicker select', self.$element).selectpicker();
        },
        moveMarker: function(place, placeName, latlng){
            var self =this;
            //marker.setIcon(image);
            var arr_address = [];
            var address_components = place.address_components;
            var lat = place.geometry.location.lat(),
                lng = place.geometry.location.lng();
            self.$latitude.val( lat );
            self.$longitude.val ( lng );
            $("#"+self.idInput).val(place.formatted_address);
            self.infowindow.close();
            self.marker.setPosition(latlng);
            self.infowindow.setContent(placeName);
            self.infowindow.open(self.map, self.marker);
            return self;
        },
        markerDragEnd: function(e) {
            this.geocodeLatLng(e.latLng);
            return this;
        },
        mapSearch: function(){
            var self = this;
            var firstResult = $(".pac-container .pac-item:first").text();
            if( firstResult == '' ){
                var textErr = 'Address not found';
                if( self.$addressInput.prev().hasClass('err-not-found-map') ){
                    self.$addressInput.prev().html(textErr);
                }else{
                    $('<label class="err-not-found-map">'+textErr+'</label>').insertBefore(self.$addressInput);
                }
                self.$latitude.val('');
                self.$longitude.val('');
            }else{
                if( self.$addressInput.prev().hasClass('err-not-found-map') ){
                    $('.err-not-found-map').remove();
                }
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({"address": firstResult}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        self.renderMapBySearch(results[0]);
                        var lat = results[0].geometry.location.lat(),
                            lng = results[0].geometry.location.lng(),
                            latlng = new google.maps.LatLng(lat, lng);
                        var address = results[0].formatted_address;
                        self.moveMarker(results[0], address, latlng);
                    }
                });
            }
            return self;
        },
        geocodeLatLng: function(latlng) {
            var self = this;
            var geocoder = new google.maps.Geocoder;
            geocoder.geocode({'location': latlng}, function(results, status) {
                if (status === 'OK') {
                    if (results[0]) {
                        var formatted_address = results[0].formatted_address;
                        self.moveMarker(results[0], formatted_address, latlng);
                        //self.$addressInput.val( formatted_address );
                        /*infowindow.setContent(formatted_address);
                        infowindow.open(map, marker);*/
                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
            return self;
        },
        renderMaps: function() {
            var self = this;
            var map = new google.maps.Map(document.getElementById(self.idMap), {
                center: {lat: self.globalLat, lng: self.globalLng},
                zoom: 15
            });
            return map;
        },
        initGoogleMaps: function(){
            var self = this;

            self.map = self.renderMaps();
            var input = document.getElementById(self.idInput);
            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo('bounds', self.map);
            self.infowindow = new google.maps.InfoWindow();
            self.marker = new google.maps.Marker({
                map: self.map,
                draggable:false,
                animation: google.maps.Animation.DROP
                //anchorPoint: new google.maps.Point(0, -29)
            });

            //var proxyEvent = self.markerDragEnd.bind(self);
            //self.marker.addListener('dragend', proxyEvent);

            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                if( self.$addressInput.prev().hasClass('err-not-found-map') ){
                    $('.err-not-found-map').remove();
                }
                var place = autocomplete.getPlace();
                if( typeof place.geometry !== 'undefined' ) {
                    self.renderMapBySearch(place);
                    var lat = place.geometry.location.lat();
                    var lng = place.geometry.location.lng();
                    var address = '';
                    if (place.address_components) {
                        address = [
                            (place.address_components[0] && place.address_components[0].short_name || ''),
                            (place.address_components[1] && place.address_components[1].short_name || ''),
                            (place.address_components[2] && place.address_components[2].short_name || '')
                        ].join(' ');
                    }
                    self.moveMarker(place , place.name, place.geometry.location);

                    self.$latitude.val(lat);
                    self.$longitude.val(lng);
                }
            });

            self.$addressInput.on('keypress',function(e){
                if( e.keyCode == 13 ){
                    e.preventDefault();
                    self.mapSearch();
                }
            });

            if( self.globalLat != 10.772054 && self.globalLng != 106.698324) {
                var latlng = { lat: self.globalLat, lng: self.globalLng };
                self.geocodeLatLng( latlng );
            }

            self.$btnSearchMap.click(function(e) {
                e.preventDefault();
                self.mapSearch();
            });
            return self;
        },
        renderMapBySearch: function(place){
            var self = this;
            if (place.geometry.viewport) {
                self.map.fitBounds(place.geometry.viewport);
            } else {
                self.map.setCenter(place.geometry.location);
                self.map.setZoom(15);
            }
            return self;
        },
        formValidate: function(){
            var self = this;
            var $required = self.$form.find('.required');
            var validationRules = {
                rules:{},
                messages: {},
                errorPlacement: function ( error, $element ) {
                    // Add the `help-block` class to the error element
                    error.addClass( "help-block" );
                    if('$label' in $element[0]) {
                        error.insertBefore( $element[0].$label );
                    } else if ( $element.prop( "type" ) === "checkbox" ) {
                        error.insertBefore( $element.parent( "label" ) );
                    } else {
                        error.insertBefore( $element );
                    }
                    return;
                }
            };

            $required.each(function(idx, elem) {
                var name = $(elem).context.id;
                var field = $(elem).attr('placeholder');
                if( field == '' || field == undefined ){
                    var $label = self.$form.find('label[for="'+elem.id+'"]');
                    $label.find('span').remove();
                    field = $label.text();
                }
                validationRules.rules[name] = { required: true, };
                validationRules.messages[name] = {
                    required: 'Please input value for <strong>' + field + '</strong>',
                }
                if( name == 'price' ){
                    validationRules.rules[name].number = true;
                }
            });
            self.$form.validate(validationRules);
            return;
        },
    };
    $('#myblock-block-form').myblock();
})(jQuery);