jQuery(function($){
    var globalLat =  10.769481,
        globalLng =  106.70196199999998;
    $.fn.maps = function(options){
        this.each(function(){
            //var plugin_name = $(this).data('plugin_name');
            var news = $(this).data('maps');
            if(!news){
                news = new Maps(this, options);
                //$(this).data('plugin_name', plugin_name);
                $(this).data('maps', news);
            }
        });
        return this;
    }
    var Maps = function(element, options){
        var dataSet = $(element).data() || {};
        this.options = $.extend({
            showDefault: true,
            searchPolygon: false,
            searchPostCirle: false,
            locations: [],
            count_post: 0
        }, dataSet, options || {});
        var self = this;
        self.$element = $(element);
        if( this.options.searchPostCirle ){
            self.searchPostByKmAroundPolygon();
        }else {
            self.initShowDefault();
        }
    }
    Maps.prototype = {
        initElement: function(){
            var self = this;
            if (!globalLat || !globalLng) return;
            self.mapMarker = {}, self.mapCurrent = {};
            self.$elementIdMap = $('#map');
            self.$elementDelShape = $('.delshape');
            self.$elementBeginDraw = $('.begindraw');
            self.$elementSlide = $('.icon-slide');
            self.$elementCoverNearBy = $(".news-nearby");
            self.$elementDirectionsLi = $(".news-nearby .directions li");
            self.$elementTrafficType = $(".news-nearby .traffic-type");
            self.$elementNearByPlaces = $('.news-nearby ul.nearby-places');
            self.$elementDirections = $(".news-nearby .directions");
            self.$elementLocation = $(".icon-left-nearby .location");
            self.$elementSelectKilometer = $('.select-kilometer');
            self.radius = 2;
            self.$elementCountResult = $('.count-result');
            self.$elementListPost = $('.ajax-pagination.post-list-ajax');
            self.$listCloneData = null;
            self.$listCloneDataCountResult = null;
            self.NamePage = self.options.isProject ? 'There are %s project' : 'There are %s news';
            self.NotFound = 'No results found';
            self.markers = [];
            self.mapCurrent.center = new google.maps.LatLng(globalLat, globalLng);
            self.nearBySearch =
                [
                    {
                        name: 'Trường học',
                        type: ['school'],
                        icon: url_school,
                        active: true,
                        places: [],
                        width: 32,
                        height: 50
                    },
                    {
                        name: 'Cơ sở y tế',
                        type: ['hospital'],
                        icon: url_hospital,
                        active: true,
                        places: [],
                        width: 32,
                        height: 50
                    },
                    {
                        name: 'Ngân hàng',
                        type: ['bank'],
                        icon: url_bank,
                        active: true,
                        places: [],
                        width: 32,
                        height: 50
                    },
                    {
                        name: 'Nhà hàng',
                        type: ['restaurant'],
                        active: true,
                        places: [],
                        icon: url_restaurant,
                        width: 32,
                        height: 50
                    },
                    {
                        name: 'Chợ',
                        type: ['shoe_store', 'shopping_mall', 'store'],
                        icon: url_store,
                        active: true,
                        places: [],
                        width: 32,
                        height: 50
                    }
                ];
            self.direction = [
                {name: "Chợ Bến Thành", value: new google.maps.LatLng(10.772054, 106.698324), lock: true, distance: 0},
                {name: "Sân bay Tân Sơn Nhất", value: new google.maps.LatLng(10.8184684, 106.6566358), lock: true, distance: 0}
            ];
            self.trafficType = [{
                name: "Xe bus",
                icon: "bus",
                value: "TRANSIT"
            }, {
                name: "Ô tô",
                icon: "car",
                value: "DRIVING"
            }, {
                name: "Đi bộ",
                icon: "by-foot",
                value: "WALKING"
            }];
            self.directionOption = {
                type: "DRIVING",
                start: self.mapCurrent.center,
                end: null
            };
            self.mapPlaceType = {};
            self.nearBySearch.forEach(function (place) {
                place.type.forEach(function (type) {
                    self.mapPlaceType[type] = place;
                });
            });
            self.loadingHtml = {
                message: '<img width="40" src="' + url_map_loading + '">',
                css: {border: '1px solid #ccc', padding: 'none', width: '40px', height: '40px'}
            };
            self.mapPolygon = null;
            self.zoomMap = self.options.isDetail ? 14 : 12;
            self.listLatLong = new Array();
            self.markers = new Array();
            self.markersProject = new Array();
            return self;
        },

        renderMap: function( center ){
            var self = this;
            if( center === null || center === '' || center === undefined )
                center = self.mapCurrent.center;
            var map = new google.maps.Map(document.getElementById(self.$element.context.id), {
                center: center,
                zoom: parseInt(self.zoomMap),
                zoomControl: true,
                scrollwheel: true,
                draggable: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: true,
                fullscreenControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_CENTER
                }
            });
            map.addListener( 'zoom_changed', function(e) {
                self.zoomMap = map.getZoom();
            });
            //autocompleteService = new google.maps.places.AutocompleteService();
            //service = new google.maps.places.PlacesService(map);
            return map;
        },
        /**
         *
         * @param lat
         * @param lng
         * @param charCode
         * @constructor
         */
        NearbyProperty: function(lat, lng, charCode) {
            lat = lat || 0;
            lng = lng || 0;
            if (lat && lng) {
                var marker = new MarkerWithLabel({
                    labelContent: String.fromCharCode(charCode), // content
                    position: new google.maps.LatLng(lat, lng),
                    icon: {
                        url: url_marker_normal,
                        scaledSize: new google.maps.Size(30, 50)
                    },
                    labelClass: "gmap-label top",
                    zIndex: google.maps.Marker.MAX_ZINDEX + charCode
                });
                marker.addListener('mouseover', function () {
                    marker.set("labelClass", "listings-map-box active");
                    this.setZIndex(this.getZIndex() + 1000);
                });
                marker.addListener('mouseout', function () {
                    marker.set("labelClass", "listings-map-box");
                    this.setZIndex(this.getZIndex() - 1000);
                });
            } else {
                marker = null;
            }
        },
        getListNearbyProperty: function () {
            var self = this;
            var propEle = $(".compare-house .article");
            var props = [];
            var charCodeStart = "A".charCodeAt(0);
            for (var i = 0; i < propEle.length; i++) {
                var ele = $(propEle[i]);
                //var url = ele.find("a").attr("href");
                var lat = globalLat;
                var lng = globalLng;
                //var title = ele.find("header h2").text();
                var nearbyProperty = new self.NearbyProperty(lat, lng, charCodeStart++);
                if (nearbyProperty.marker) {
                    self.addMarker(nearbyProperty.marker);
                }
                props.push(nearbyProperty);
            }
            return props;
        },
        resetItemAppend: function(){
            $(".news-nearby .traffic-type").html('');
            $('.news-nearby ul.nearby-places').html('');
            //$(".news-nearby .directions").html('');
        },
        initTraffic: function(){
            var self = this;
            self.resetItemAppend();
            //Directions Service
            //document : https://developers.google.com/maps/documentation/javascript/directions
            self.directionsService = new google.maps.DirectionsService();
            self.directionsDisplay = new google.maps.DirectionsRenderer;
            self.directionsDisplay.setMap(self.map);
            self.trafficType.forEach( function(type) {
                var $listTrafficType = $(".news-nearby .traffic-type");
                var $traficType = $('<a class="' + type.icon + '" href="#" title="' + type.name + '" data-type="' + type.value + '"></a>');
                $traficType.click(function(e){
                    e.preventDefault();
                    $($listTrafficType, 'a').removeClass('active'); //find tag a and remove class active
                    $traficType.addClass( 'active' );
                    self.startDirection( type.value );
                });
                $listTrafficType.append( $traficType );
            });
            $(".news-nearby .traffic-type a").removeClass("active");
            $('.news-nearby .traffic-type a[data-type=' + self.directionOption.type + ']').addClass("active");
            self.direction.forEach(function (direction){
                //Calculate the distance between 2 points
                direction.distance = self.getDistanceFromLatLon( direction.value, self.mapCurrent.center )
                self.showDirection(direction);
            });
        },
        resetDirection: function (init) {
            var self = this;
            var map = init ? self.map : null;
            self.directionsDisplay.setMap(map);
            if (!map) {
                $(".news-nearby .directions li.active").removeClass("active");
            }
        },
        /**
         *
         * @param trafficType
         * @param directionToLatlng
         */
        startDirection: function( trafficType, directionToLatlng ){
            var self = this;
            self.resetNearbyPlaceAction();
            self.resetDirection(true);
            trafficType = trafficType || self.directionOption.type;
            directionToLatlng = directionToLatlng || self.directionOption.end;
            self.directionOption.type = trafficType
            self.directionOption.end = directionToLatlng;
            $(".news-nearby .traffic-type a").removeClass("active");
            $('.news-nearby .traffic-type a[data-type=' + self.directionOption.type + ']').addClass("active");
            if (!self.directionOption.end) {
                var $lstDirection = $(".news-nearby .directions li");
                if ($lstDirection[0]) {
                    var dirVal = ($($lstDirection[0]).attr("data-value") || '').split("@");
                    self.directionOption.end = new google.maps.LatLng(parseFloat(dirVal[0]), parseFloat(dirVal[1]));
                }
            }
            if (!self.directionOption.type || !self.directionOption.end) {
                return;
            }
            var value = self.directionOption.end.lat() + '@' + self.directionOption.end.lng();
            $(".news-nearby .directions li.active").removeClass("active");
            $(".news-nearby .directions li[data-value='" + value.toString() + "']").addClass("active");
            //DirectionsService.route() to initiate a request to the Directions service
            // document : https://developers.google.com/maps/documentation/javascript/directions
            self.directionsService.route({
                origin: self.mapCurrent.center,
                destination: self.directionOption.end,
                travelMode: self.directionOption.type
            }, function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    //Displaying the DirectionsResult
                    //document: https://developers.google.com/maps/documentation/javascript/examples/directions-complex
                    // or document: https://developers.google.com/maps/documentation/javascript/directions
                    self.directionsDisplay.setDirections(response);
                    self.nearByAreaLocation.setMap(null);
                    //self.map.setZoom(self.zoomMap);
                } else {
                }
            });
        },
        showDirection: function(direction){
            var self = this;
            var value = direction.value.lat() + '@' + direction.value.lng();
            var $direction = $('<li data-value="'+ value +'">' +
                '<p class="left">' + direction.name + '</p>' +
                '<p class="right">' + direction.distance + '</p>' +
                '</li>');
            if( !direction.lock ){
                var $removeAction = $('<a href="#"><span class="iconremove"></span></a>');
                $removeAction.click(function (e) {
                    e.preventDefault();
                    var idx = self.direction.indexOf(direction);
                    if (idx >= 0 && self.direction.length > idx) {
                        self.direction.splice(idx, 1);
                    }
                    $direction.remove();
                });
                $direction.append($removeAction);
            }
            $direction.click(function (e) {
                e.preventDefault();
                $direction.addClass("active");
                self.startDirection(null, direction.value);
            });
            $(".news-nearby .directions").append($direction);
        },
        /**
         *
         * @param point1
         * @param point2
         * @returns {string}
         */
        getDistanceFromLatLon: function( point1, point2, printKM ){
            var R = 6371; //Radius of earth in kilometers
            var dLat = ( point2.lat() - point1.lat() ) * (Math.PI / 180);
            var dLng = ( point2.lng() - point1.lng() ) * (Math.PI / 180);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(point1.lat() * (Math.PI / 180)) * Math.cos(point2.lat() * (Math.PI / 180)) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
            //Math.atan2 calculate the angle in radians between self point and the positive X axis as follows
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            var output = parseFloat(d).toFixed(2);
            if( printKM == undefined )
                output += ' km';
            return output;
        },
        /**
         *
         * @param init
         */
        resetNearbyPlaceAction: function (init) {
            var self = this;
            var map = init ? self.map : null;
            self.nearByAreaLocation.setMap(map);
            self.map.setZoom( self.zoomMap );
            self.map.setCenter(self.mapCurrent.center);
            self.nearBySearch.forEach(function (place) {
                var $ele = $(".news-nearby .nearby-places input#" + place.id);
                place.active = map ? $ele.is(":checked") : false;
                $ele.attr("checked", place.active);
                place.places.forEach(function (item) {
                    item.setMap(place.active ? map : null);
                });
            });
            var nearbyProp = self.getListNearbyProperty();
            nearbyProp.forEach(function (prop) {
                prop.marker.setMap(map);
            });
            self.currentMarker.setMap(map);
            map ? google.maps.event.trigger(self.map, 'resize') : null;
        },
        /**
         *
         * @param element
         * @param content
         */
        showInfoWindow: function(element, content) {
            var self = this;
            var infowindow = new google.maps.InfoWindow({
                content: content,
                maxWidth: 250
            });
            element.timeout = 1;
            element.addListener('mouseover', function (e) {
                if( element.timeout ) {
                    $('#'+element.id).addClass('post-item-hover');
                    infowindow.open(self.map, element);
                }
            });
            element.addListener('mouseout', function(e){
                $('#'+element.id).removeClass('post-item-hover');
                //console.log(infowindow);
                if(e === undefined){
                    infowindow.close();
                }else{
                    element.timeout = setTimeout(function() {
                    infowindow.close();
                }, 2000);
                }
            });
        },
        /**
         *
         * @param places
         */
        createMarker: function ( places ) {
            var self = this;
            var marker = new MarkerWithLabel({
                position: places.geometry.location,
                icon: {
                    url: url_current_location,
                    scaledSize: new google.maps.Size(30, 33),
                    zIndex: ''
                }
            });
            //console.log( 'createMarker', places );
            ( places.types || [] ).forEach(function (type) {
                var placeTypes = self.mapPlaceType[type];
                // placeType.places is undefined
                if (placeTypes && placeTypes.places.indexOf(marker) <= 0) {
                    placeTypes.places.push(marker);
                    marker.setIcon({
                        url: placeTypes.icon,
                        scaledSize: new google.maps.Size(placeTypes.width, placeTypes.height)
                    });
                    marker.info = places;
                }
            });

        },

        showLocationNearPlace: function (show)  {
            var self = this;
            var $ulPlaces = $('.nearby-places');
            $ulPlaces.html('');
            var count = 0;
            if( show === undefined )
                show = true;
            self.nearBySearch.forEach(function (place) {
                count++;
                var length = place.places.length;
                //console.log( place, place.places.length );
                var countItems = 0;
                var idInput = 'place-type-'+count;
                place.id = idInput;
                if (length) {
                    var $liPlaces = $('<li></li>');
                    var checked = (place.active && show) ? 'checked' : null;
                    var $inputPlaces = $('<span class="checkbox-custom"><input type="checkbox" ' + checked + ' id = "'+idInput+'" /><label for="'+idInput+'">' + place.name + '( '+ length +' )</label></span>')
                    var $dropDown = $('<a href="#"><span class="icondropdown"><i class="fa fa-chevron-down fa-chevron-up" aria-hidden="true"></i></span></a>');
                    $liPlaces.append( $dropDown );
                    $liPlaces.append( $inputPlaces );
                    var $ulPlacesSub = $('<ul class="sub-content"></ul>');
                    place.places.forEach(function (item) {
                        countItems++;
                        self.markers.push(item);
                        var $liPlacesSub = $('<li><span>'+ (countItems) + '. ' + item.info.name + '</span></li>');
                        $ulPlacesSub.append( $liPlacesSub );
                        var addMap = (place.active && show) ? self.map : null;
                        var content = '<p><label><b>Tên: </b></label> ' + item.info.name + '</p><p><label><b>Địa chỉ: </b></label> ' + item.info.vicinity + '</p>'
                        self.showInfoWindow( item, content );
                        item.setMap(addMap);
                    });
                    $dropDown.click(function(e){
                        $ulPlacesSub.toggleClass("open");
                        $dropDown.find("i").toggleClass("fa-chevron-down");
                        e.preventDefault();
                    });
                    $inputPlaces.find('input').change(function(){
                        //self.resetNearbyPlaceAction(true);
                        //self.resetDirection();
                        var val = $(this).is(':checked');
                        var addMap = val ? self.map : null;
                        place.places.forEach(function (item) {
                            self.markers.push(item);
                            var content = '<p><label><b>Tên: </b></label> ' + item.info.name + '</p><p><label><b>Địa chỉ: </b></label> ' + item.info.vicinity + '</p>'
                            self.showInfoWindow( item, content );

                            item.setMap(addMap);
                        });
                    });
                    $liPlaces.append( $ulPlacesSub );
                    $ulPlaces.append( $liPlaces );
                }
            });

        },
        showHideMarker: function(){
            var self = this;
            $('#see-utilities-around').click( function(e){
                var $input = $('.nearby-places .checkbox-custom input[type=checkbox]');
                var checked = $input.prop('checked');
                if( $(this).hasClass('hiden') ){
                    $(this).text( 'See gadgets around' );
                    $(this).removeClass('hiden');
                    $input.prop('checked', true);
                    self.showLocationNearPlace();
                }else{
                    $input.prop('checked', false);
                    $(this).text( 'Off gadgets around' );
                    self.showLocationNearPlace(false);
                    $(this).addClass('hiden');
                }
                return false;
            });
        },

        callback: function (results, status) {
            var self = this;
            if (status === 'OK') {
                ( results || [] ).forEach(function (place) {
                    self.createMarker(place);
                });
                self.showLocationNearPlace();
            }
        },
        /**
         *
         * @param marker
         */
        addMarker: function (marker) {
            var self = this;
            if (marker) {
                var center = marker.position;
                var markerKey = center.lat() + '@' + center.lng();
                if (!self.mapMarker[markerKey]) {
                    self.mapMarker[markerKey] = [];
                }
                self.mapMarker[markerKey].push(marker);
            }
        },
        callBackDrawEvent: function(maxLat, minLat, maxLng, minLng, lstPoint){
            //call ajax get real
            var self = this;
            var url_get_near = '', type = '';
            if( !self.options.isProject ){
                url_get_near = url_news_bynear;
                type = '&tstype='+type_news;
            }else{
                url_get_near = url_project_bynear;
            }
            //var data = {minlat: minLat, maxlat: maxLat, minlng: minLng, maxlng: maxLng, listPoint: lstPoint};

            $.ajax({
                url: url_get_near,
                data: 'data='+ lstPoint+type,
                type: 'get',
                dataType: 'html',
                beforeSend: function(xhr){
                    self.$elementIdMap.block( self.loadingHtml );
                },
                success: function(response, status, xhr){
                    self.$elementListPost.html(response);
                    var data = $.data( document.body );
                    self.showResponse( data, response, false );
                },
                error: function(xhr, status, errThrown){
                    console.log( 'ERROR', xhr, status, errThrown );
                },
                complete: function(xhr, status){
                    self.$elementIdMap.unblock( self.loadingHtml );
                }
            });
        },
        /**
         *
         * @param a
         * @param b
         */
        findPoint: function (a, isPolygon) {
            var self = this;
            self.clearPoint();
            if( isPolygon === undefined ) {
                var path = a.getPath().getArray();
                var maxLat = 0, minLat = 100000, maxLng = 0, minLng = 100000;
                var lstPoint = '';
                for (var i = 0; i < path.length; i++) {
                    var lat = path[i].lat();
                    var lng = path[i].lng();

                    if (lstPoint.length > 0)
                        lstPoint += ',';
                    lstPoint += lat + ':' + lng;

                    if (maxLat < lat)
                        maxLat = lat;
                    if (minLat > lat)
                        minLat = lat;
                    if (minLng > lng)
                        minLng = lng;
                    if (maxLng < lng)
                        maxLng = lng;
                }
            }

            var rings = self.getAllPointPolygonByDraw(a, true);
            var listPoint = rings.join(',');
            self.callBackDrawEvent(maxLat, minLat, maxLng, minLng, listPoint);
        },
        getAllPointPolygonByDraw: function(obj, isString){
            var rings = [];
            for (var i = 0; i < obj.getPaths().length; i += 1) { // For each polygon (ring)...
                var tmp = obj.getPaths().getAt(i);
                var verts = [];
                for (var j = 0; j < obj.getPaths().getAt(i).length; j += 1) { // For each vertex...
                    verts.push({
                        x: tmp.getAt(j).lng(),
                        y: tmp.getAt(j).lat()
                    });

                }
                if (!tmp.getAt(tmp.length - 1).equals(tmp.getAt(0))) {
                    if (i % 2 !== 0) { // In inner rings, coordinates are reversed...
                        verts.unshift({ // Add the first coordinate again for closure
                            x: tmp.getAt(tmp.length - 1).lng(),
                            y: tmp.getAt(tmp.length - 1).lat()
                        });

                    } else {
                        verts.push({ // Add the first coordinate again for closure
                            x: tmp.getAt(0).lng(),
                            y: tmp.getAt(0).lat()
                        });

                    }

                }

                if (obj.getPaths().length > 1 && i > 0) {
                    // If this and the last ring have the same signs...
                    if (Math.sign(obj.getPaths().getAt(i)) > 0 &&
                        Math.sign(obj.getPaths().getAt(i - 1)) > 0 ||
                        Math.sign(obj.getPaths().getAt(i)) < 0 &&
                        Math.sign(obj.getPaths().getAt(i - 1)) < 0) {
                        // ...They must both be inner rings (or both be outer rings, in a multipolygon)
                        verts = [verts]; // Wrap multipolygons once more (collection)
                    }

                }

                //TODO This makes mistakes when a second polygon has holes; it sees them all as individual polygons
                if (i % 2 !== 0) { // In inner rings, coordinates are reversed...
                    verts.reverse();
                }
                rings.push(verts);
            }
            rings = rings.shift();
            if( isString ){
                var temp = [];
                rings.forEach( function(v){
                    temp.push( v.x+' '+v.y );
                } );
                rings = temp;
            }
            return rings;
        },
        /**
         *
         * @param a
         */
        endDraw: function (a) {
            var self = this;
            if (self.listLatLong != null) {
                //this.beginDrawButton.hide();
                //this.deleteShapeButton.show();
                var b = new Array();
                if (a == undefined) {
                    var c = 5;
                    var x;
                    x = Math.round(self.listLatLong.length / 50);
                    if (self.listLatLong.length < 30) {
                        c = 1;
                        x = 2
                    }
                    for (var i = 0; i < self.listLatLong.length; i++) {
                        if (i % 2 == 0) {
                            b.push(self.listLatLong[i])
                        }
                    }
                } else {
                    b = self.listLatLong
                }

                self.polyline = new google.maps.Polygon({
                    path: b,
                    strokeColor: '#585858',
                    strokeWeight: 3,
                    editable: true,
                    fillColor: "#ccc",
                    fillOpacity: 0.5
                });

                self.polyline.setMap(self.map);
                self.findPoint(self.polyline);
                //self.btnUpdateMapIdleResult.hide();
                google.maps.event.clearListeners(self.map, 'set_at');
                google.maps.event.clearListeners(self.map, 'insert_at');
                var set_at = google.maps.event.addListener(self.polyline.getPath(), 'set_at', function (index, obj) {
                    //self.polyline.setPath( obj );
                    self.polyline.setMap(self.map);
                    self.findPoint(self.polyline);
                    // console.log("SET", self.polyline.getPath(), self.polyline, index, obj );

                });
                google.maps.event.addListener(self.polyline.getPath(), 'remove_at', function(){
                    self.findPoint(self.polyline);
                });
                var insert_at = google.maps.event.addListener(self.polyline.getPath(), 'insert_at', function (index) {
                    self.findPoint(self.polyline);
                    //console.log("insert_at", self.polyline.getPaths(), index);
                });

            }
            self.listLatLong = null;
        },
        clearPoint: function () {
            var self = this;
            if (self.markers != undefined) {
                for (var t = 0; t < self.markers.length; t++) {
                    self.markers[t].setMap(null);
                }
                self.markers = [];
            }
            if (self.markersProject != undefined) {
                for (var t = 0; t < self.markersProject.length; t++) {
                    self.markersProject[t].setMap(null);
                }
                self.markersProject = [];
            }

            if (self.markerCluster != null) {
                self.markerCluster.clearMarkers();
            }

        },
        /**
         *
         * @param a
         * @param b
         */
        showPoint: function (a, b) {
            var self = this;
            self.clearPoint();
            for (var j = 0; j < a.length; j++) {
                var c = a[j];
                var d = null;
                /*if (!device.ipad() && !device.tablet() && !device.ipod() && !device.iphone() && !device.androidTablet() && !device.blackberryTablet() && !device.android()) {*/
                if (c.vip == 0) d = google.maps.Animation.DROP;
                var f = '<div class="infowindow-product-preview">';
                f += '<div class="infowindow-product-preview-detail">';
                f += '<span class="infowindow-product-preview-title infowindow-title-vip' + c.vip + '">' + c.title + '</span><br/>';
                if (c.avatar.length > 0 && c.avatar.indexOf('no-photo.jpg') < 0) {
                    f += '<div class="infowindow-product-preview-avatar">';
                    f += '<img src="' + c.avatar + '" alt="" />';
                    f += '</div>'
                }
                f += '<strong>Giá: </strong>' + c.price + '<br/>';
                f += '<strong>Diện tích: </strong>' + c.area;
                f += '</div>';
                f += '</div>'
                //}
                self.markers.push(new google.maps.Marker({
                    position: new google.maps.LatLng(c.lat, c.lon),
                    map: self.map,
                    tooltip: f,
                    icon: {
                        url: url_marker,
                        size: new google.maps.Size(23, 26)
                    },
                    animation: d,
                    zIndex: (6 - c.vip)
                }));
                self.markers[self.markers.length - 1].id = c.id
            }
            for (var i = 0; i < $thismap.markers.length; i++) {
                self.markers[i].addListener('click', function () {
                    self.showInfoWindow(this.id, '')
                });
                self.markers[i].addListener('mouseover', function () {
                    if (this.id != self.currentPID) {
                        self.setIcon({
                            url: url_marker_hover,
                            size: new google.maps.Size(23, 26)
                        });
                        self.tooltip.addTip(this);
                        self.tooltip.getPos2(this.getPosition())
                    }
                });
                self.markers[i].addListener('mouseout', function () {
                    if (this.id != self.currentPID) {
                        self.setIcon({
                            url: url_marker,
                            size: new google.maps.Size(23, 26)
                        })
                    }
                    self.tooltip.removeTip()
                })
            }
            if (b !== undefined && b) {
                if (self.polyline != undefined && self.polyline != null) {
                    var g = new google.maps.LatLngBounds();
                    self.polyline.getPath().forEach(function (e) {
                        g.extend(e)
                    });
                    self.map.fitBounds(g)
                }
            }
        },
        isInPolyline: function (lat, lng) {
            var self = this;
            if (self.polyline != undefined && self.polyline != null) {
                return google.maps.geometry.poly.containsLocation(new google.maps.LatLng(lat, lng), self.polyline);
            }
            return true
        },
        /**
         *
         * @param a
         * @param b
         * @returns {Array}
         */
        showMap: function(a, b){
            var self = this;
            this.data = [];
            for (var i = 0; i < a.length; i++) {
                if (this.isInPolyline(a[i].lat, a[i].lon)) {
                    if (a[i].avatar == null || a[i].avatar == '') a[i].avatar = '';
                    this.data.push(a[i])
                }
            }
            this.showPoint(this.data, b);
            return this.data;
        },
        setMapOnAll: function(map) {
            var self = this;
            for (var i = 0; i < self.markers.length; i++) {
                self.markers[i].setMap(map);
            }
        },
        //remove marker in map
        clearMarkers: function() {
            var self = this;
            self.setMapOnAll(null);
        },
        //reset self.markers and remove marker in map
        deleteMarkers: function () {
            var self = this;
            self.clearMarkers();
            self.markers = [];
        },
        /**
         *
         * @param point
         * @param radiusOutside
         * @param dir
         * @param radiusInside
         * @returns {Array}
         * @constructor
         */
        PolygonNearByArea: function (point, radiusOutside, dir, radiusInside) {
            var self = this;
            var bounds = new google.maps.LatLngBounds();
            var d2r = Math.PI / 180; // degrees to radians
            var r2d = 180 / Math.PI; // radians to degrees
            var earthsradius = Math.ceil( 6371/radiusInside); // 3185 is the radius of the earth in miles
            var points = 9000;
            // find the raidus in lat/lon
            var rlat = ( radiusOutside/ earthsradius) * r2d;
            var rlng = rlat / Math.cos(point.lat() * d2r);
            var extp = new Array();
            var start = 0;
            var end = points + 1;
            if (dir !== 1) {
                start = points + 1;
                var end = 0;
            }
            for (var i = start;
                 (dir === 1 ? i < end : i > end); i = i + dir) {
                var theta = Math.PI * (i / (points / 2));
                var ey = point.lng() + (rlng * Math.cos(theta)); // center a + radius x * cos(theta)
                var ex = point.lat() + (rlat * Math.sin(theta)); // center b + radius y * sin(theta)
                extp.push(new google.maps.LatLng(ex, ey));
                bounds.extend(extp[extp.length - 1]);
            }
            return extp;
        },
        /**
         *
         * @param point
         * @param radiusOutside
         * @param dir
         * @param radiusInside
         * @returns {{minlat: number, maxlat: number, minlng: number, maxlng: number}}
         */
        minMaxPolygonDefault: function (point, dir, radiusInside) {
            var self = this;
            var maxLat = 0, minLat = 100000, maxLng = 0, minLng = 100000;
            var wrong_number_lat_max = 0.0016133866708916145;
            var wrong_number_lat_min = 0.0011149837821111674;
            var wrong_number_lng_min = 0.001642312856390049;
            var d2r = Math.PI / 180; // degrees to radians
            var r2d = 180 / Math.PI; // radians to degrees

            var earthsradius = Math.ceil( 6371/radiusInside); // 3185 is the radius of the earth in miles
            var points = 1000;
            // find the raidus in lat/lon
            var rlat = ( 1 / earthsradius) * r2d;
            var rlng = rlat / Math.cos(point.lat() * d2r);
            var start = 0;
            var end = points + 1;
            if (dir !== 1) {
                start = points + 1;
                var end = 0;
            }
            for (var i = start;
                 (dir === 1 ? i < end : i > end); i = i + dir) {
                var theta = Math.PI * (i / (points / 2));
                var ey = point.lng() + (rlng * Math.cos(theta)); // center a + radius x * cos(theta)
                var ex = point.lat() + (rlat * Math.sin(theta)); // center b + radius y * sin(theta)
                if (maxLat < ex) {
                    maxLat = ex;
                }
                if (minLat > ex) {
                    minLat = ex;
                }
                if (minLng > ey) {
                    minLng = ey;// + wrong_number_lng_min
                }
                if (maxLng < ey) {
                    maxLng = ey;
                }
            }
            maxLat -= wrong_number_lat_max;
            minLat -= wrong_number_lat_min;
            minLng += wrong_number_lng_min;
            var mmLL = {minlat: minLat, maxlat: maxLat, minlng: minLng, maxlng: maxLng};
            return mmLL;
        },
        getPointNearProject: function (point, dir, radiusInside) {
            var self = this;
            var bounds = new google.maps.LatLngBounds();
            var extp = new Array();
            var d2r = Math.PI / 180; // degrees to radians
            var r2d = 180 / Math.PI; // radians to degrees

            var earthsradius = Math.ceil( 6371/radiusInside); // 3185 is the radius of the earth in miles
            var points = 1000;
            // find the raidus in lat/lon
            var rlat = ( 1 / earthsradius) * r2d;
            var rlng = rlat / Math.cos(point.lat() * d2r);
            var start = 0;
            var end = points + 1;
            if (dir !== 1) {
                start = points + 1;
                var end = 0;
            }
            for (var i = start;
                 (dir === 1 ? i < end : i > end); i = i + dir) {
                var theta = Math.PI * (i / (points / 2));
                var ey = point.lng() + (rlng * Math.cos(theta)); // center a + radius x * cos(theta)
                var ex = point.lat() + (rlat * Math.sin(theta)); // center b + radius y * sin(theta)
                extp.push(new google.maps.LatLng(ex, ey));
                bounds.extend(extp[extp.length - 1]);
            }
            return bounds;
        },
        nearAreaLocationByKM: function(km, radiusOutside = 100){
            var self = this;
            if(self.nearByAreaLocation) {
                self.nearByAreaLocation.setMap(null);
            }
            if( km == undefined ){
                km = self.radius;
            }
            self.nearByAreaLocation = new google.maps.Polygon({
                paths: [self.PolygonNearByArea(self.mapCurrent.center, radiusOutside , 1, km),
                    self.PolygonNearByArea(self.mapCurrent.center, 1, -1, km)
                ],
                strokeColor: "#00bdff",
                strokeOpacity: 0.4,
                strokeWeight: 2,
                fillColor: "#00bdff",
                fillOpacity: 0.15,
                map: self.map
            });
        },
        PlaceService: function (){
            var self = this;
            var typePlaces = self.getTypePlaces();
            self.nearAreaLocationByKM();
            var request = {
                location: {lat: globalLat, lng: globalLng},
                radius: self.radius * 1000,
                icon: url_current_location,
                types: typePlaces
            }
            //showNearbyProperty();
            //nearbyProp = self.getListNearbyProperty();
            var service = new google.maps.places.PlacesService(self.map);
            service.nearbySearch(request, self.callback.bind(self));
        },
        getTypePlaces: function() {
            var self = this;
            var typePlaces = [];
            self.nearBySearch.forEach(function (value) {
                typePlaces = typePlaces.concat(value.type);
            });
            return typePlaces;
        },
        showCityDistrictByNews: function(){
            var $textDistrict = $('.text-district');
            $.each( $textDistrict, function(index, value){
                var $_this = $(value);
                var data = $_this.data('address');
                var cityCode = data.city, disCode = data.district;
                var ct = CITYLIST.filter(function(item){
                    return item.code == cityCode;
                });

                var distr = ct.length ? ct[0].district.filter(function(dis) {
                    return dis.id == parseInt(disCode);
                }) : [];
                $_this.text( distr.length ? distr[0].name : '' );
            });
        },
        initEventUtilities: function(){
            var self = this;
            self.$elementSelectKilometer.change( function(e){
                e.preventDefault();
                if( parseInt( $(this).val() ) ){
                    self.radius = parseInt( $(this).val() );
                    self.nearByAreaLocation.setMap(null);
                    self.nearBySearch.forEach( function(value) {
                        value.places = [];
                    });
                    //self.markers = null;self.marker.setMap(null);
                    self.deleteMarkers();
                    //self.initTraffic();
                    self.PlaceService();
                }else{
                    console.log( 'error' );
                }
            });
            self.$elementLocation.click(function (event) {
                self.map.setCenter(self.mapCurrent.center);
                event.preventDefault();
            });
        },
        renderHmtlOnMap: function(item){
            var title = ( item.title != '' && item.title != undefined ) ? item.title : '';
            var created = ( item.created != '' && item.created != undefined ) ? item.created : '';
            var address = ( item.address != '' && item.address != undefined ) ? item.address : '';
            var price = ( item.price != '' && item.price != undefined ) ? '<span class="post-price">$'+item.price+'</span>' : '';
            var $div = $('<div></div>');
            var $tag_a_title = $('<h4 class="title">' + price + '<a class="post-title" href="'+item.href+'" title="'+ title +'">'+ title +'</a></h4>');
            var $address = $('<address><i class="fas fa-map-marked-alt"></i> ' + address + '</address>');
            var $created = $('<div class="post-created"><span class="glyphicon glyphicon-calendar"></span> <span>' + created + '</span></div>');
            var $apply = $('<a class="post-apply" href="'+item.href+'" title="Apply">Apply</a>');
            $div.append( $tag_a_title );
            $div.append( $address );
            $div.append( $created );
            $div.append( $apply );
            var content = '<div class="item-post-maps post-item infobox">'+ $div.html() +'</div>';
            return content;
        },
        addMarkerBySearch: function(item){
            var self = this;
            var marker = new MarkerWithLabel({
                position: {lat: parseFloat(item.latitude), lng: parseFloat(item.longitude)},
                id: item.id,
                icon: {
                    url: url_current_location,
                    scaledSize: new google.maps.Size(30, 33),
                },
                //map: self.map
            });

            self.showInfoWindow( marker, self.renderHmtlOnMap(item) );
            self.markers.push(marker);
        },
        eventHoverItemShowInfoMap: function(){
            var self = this;
            //mouseout
            $('.hover-show-map', $('.list-item-map')).off('mouseover.show.info').on('mouseover.show.info', function(ev){
                var id = $(this).attr('id');
                self.markers.forEach(marker => {
                    if(marker.id == id){
                        var item = self.options.locations.filter(post => {
                            return post.id == id;
                        });
                        google.maps.event.trigger(marker, 'mouseover');
                    }
                });
            });
            $('.hover-show-map', $('.list-item-map')).off('mouseout.hide.info').on('mouseout.hide.info', function(ev){
                var id = $(this).attr('id');
                self.markers.forEach(marker => {
                    if(marker.id == id){
                        var item = self.options.locations.filter(post => {
                            return post.id == id;
                        });
                        google.maps.event.trigger(marker, 'mouseout');
                    }
                });
            });

        },
        /**
         *
         * @param data
         * @param html
         * @param byKm
         */
        showResponse: function(dataResponse, html, byKm){
            var self = this;
            var count = 0;
            var data, count_post;
            if( dataResponse.marker_locations !== undefined ){
                data = dataResponse.marker_locations;
                count_post = dataResponse.count_post;
            }else{
                data = dataResponse;
                count_post = 0;
            }

            self.deleteMarkers();
            if( data.length > 0 ){
                self.map.setCenter(new google.maps.LatLng( data[0].latitude, data[0].longitude) );
                data.forEach( function(item) {
                    var lat = parseFloat(item.latitude);
                    var long = parseFloat(item.longitude );
                    //check point in polygon
                    var flag;
                    if( byKm ){
                        flag = google.maps.geometry.poly.containsLocation( new google.maps.LatLng( lat, long ), that.nearByAreaLocation );
                    }else{
                        flag = false;//!self.isInPolyline( lat, long );
                    }
                    if( !flag ){
                        self.addMarkerBySearch( item );
                        //delete market;
                        //self.$elementListPost.append(item.html);
                        count ++;
                    }
                });
                self.setMapOnAll(self.map);
                //self.currentMarker.setMap(null);
                //self.showCityDistrictByNews();

                self.$elementCountResult.html(self.NamePage);
                self.calculateHeightTitle();
            }else{
                self.$elementCountResult.html(self.NotFound);
                self.$elementListPost.html('');
            }
        },
        initViewProject: function(){
            var self = this;
            var $btnViewProject = $('.btn-view-project');
            $btnViewProject.unbind('click.projectNearLocation').bind( 'click.projectNearLocation', this, function(e) {
                e.preventDefault();
                var $btnAround = $('#see-utilities-around');
                if( $(this).hasClass( 'isshow' ) ){
                    $(this).removeClass('isshow');
                    self.deleteMarkers();
                    $btnAround.removeClass('hidden');
                    $(this).text( 'See project around' );
                    $btnAround.trigger('click');
                }else {

                    var lat = self.mapCurrent.center.lat();
                    var lng = self.mapCurrent.center.lng();
                    var radius = self.radius;
                    var data_send = "lat=" + lat + "&lng=" + lng + "&radius=" + radius;//{lat: lat, lng: lng, radius: radius}
                    $.ajax({
                        url: project_near_location,
                        data: data_send,//'data=' + JSON.stringify(data_send) ,
                        dataType: 'json',
                        type: 'get',
                        beforeSend: function (xhr) {
                            self.$elementIdMap.block(self.loadingHtml);
                        },
                        success: function (response, status, xhr) {
                            var data = response;
                            var $input = $('.nearby-places .checkbox-custom input[type=checkbox]');
                            $input.prop('checked', false);
                            $(this).addClass('isshow');
                            $(this).text( 'Off project around' );
                            self.showLocationNearPlace(false);
                            $btnAround.addClass('hiden');
                            self.showResponse(data, true, '');
                            self.$elementIdMap.unblock(self.loadingHtml);
                            //console.log( data, status, xhr );
                        },
                        error: function (xhr, status, errThrown) {
                            console.log(xhr, status, errThrown);
                        },
                        complete: function (xhr, status) {
                            self.$elementIdMap.unblock(self.loadingHtml);
                        }
                    });
                }
                return false;
            });

        },

        getPointForMaxDistance: function(locations, midPoint){
            var self = this;
            if( locations.length < 0 )
                return;
            var maxDistance = 0;
            var pointMax = {}, output = {};
            var arrStartPoint = locations[0];
            var startPoint = new google.maps.LatLng( arrStartPoint.latitude, arrStartPoint.longitude );
            locations.forEach(function(location){
                if( location.latitude !== '' && location.longitude !== '') {
                    var currentPoint = new google.maps.LatLng(location.latitude, location.longitude);
                    var distance = self.getDistanceFromLatLon(startPoint, currentPoint, true);
                    distance = parseFloat(distance);
                    if (distance >= maxDistance) {
                        maxDistance = distance;
                        pointMax = currentPoint;
                    }
                }
            });
            if( midPoint ){
                var x = ( pointMax.lat() + startPoint.lat() ) / 2;
                var y = ( pointMax.lng() + startPoint.lng() ) / 2;
                var zoom = self.zoomMap;
                if(maxDistance >= 5000){
                    zoom = 1;
                }else if(maxDistance >= 4000 && maxDistance < 5000){
                    zoom = 2;
                }else if(maxDistance >= 3000 && maxDistance < 4000){
                    zoom = 3;
                }else if(maxDistance >= 2000 && maxDistance < 3000){
                    zoom = 4;
                }else if( maxDistance >= 1000 && maxDistance < 2000 ){
                    zoom = 5;
                }else if( maxDistance < 1000 && maxDistance >= 500 ){
                    zoom = 7;
                }else if( maxDistance < 500 && maxDistance > 200 ||  maxDistance <= 200 && maxDistance > 100 || maxDistance <= 100 && maxDistance > 20){
                    zoom = 10;
                }else{
                    zoom = 12;
                }
                pointMax = new google.maps.LatLng( x, y );
                output = { zoom: zoom };
            }
            output.point = pointMax;
            return output;
        },

        setZoomMap: function(locations, map){
            var self = this;
            if( locations.length < 1 )
                return false;
            var output = self.getPointForMaxDistance(locations, true);
            var pointCenter = output.point;
            map.setCenter( pointCenter );
            map.setZoom( output.zoom );

        },
        initSearchNotDraw: function(locations, map){
            var self = this;
            if( !map ){
                map = self.map;
            }
            self.setZoomMap(locations, map);
            //if( self.options.isDetail ) return false;
            self.deleteMarkers();
            locations.forEach(function(item){
                self.addMarkerBySearch( item );
                //marker.setMap();
            });
            self.$elementCountResult.html( self.NamePage );
            self.setMapOnAll(self.map);
        },
        initMaps: function(){
            var self = this;
            self.$elementIdMap.block(self.loadingHtml);
            self.currentMarker = new MarkerWithLabel({
                position: self.mapCurrent.center,
                map: self.map
                //labelClass: "gmap-label top",
                //zIndex: google.maps.Marker.MAX_ZINDEX + 1000
            });
            if( self.options.isDetail ){
                var $openPlaces = $('.btnOpen .open_search-places-adv');
                $openPlaces.click(function(e){
                    e.preventDefault();
                    $(".googlemap-extend").toggleClass("cover-nearby-off");
                    $(this).find('i').toggleClass("fa-angle-double-right");
                });
            }
            self.getTypePlaces();
            self.initTraffic();
            self.PlaceService();
            self.showCityDistrictByNews();
            self.initEventUtilities();
            self.$elementIdMap.unblock(self.loadingHtml);
        },
        initSearchProductInMap: function(){
            var self = this;
            //check opti
            // on searchPolygon
            if( !self.options.searchPolygon ) return false;
            self.$elementBeginDraw.unbind('click.begindraw').bind('click.begindraw', this, function(b){
                self.$listCloneData = self.$elementListPost.clone();
                self.$listCloneDataCountResult = self.$elementCountResult.clone();
                //self.map = self.renderMap();
                //self.map.setZoom(15);
                self.mapPolygon = new google.maps.Polyline({strokeColor: '#585858', strokeOpacity: 1, map: self.map});
                self.map.setOptions({draggableCursor: "crosshair", draggable: false});
                self.$elementBeginDraw.hide();
                self.$elementDelShape.show();
                function _beginDrawEvent(a) {
                    return function () {
                        self.listLatLong = new Array();
                        function _mouseMoveEvent(j) {
                            self.mapPolygon.getPath().push(j.latLng);
                            self.listLatLong.push(j.latLng)
                        }

                        google.maps.event.addListener(self.map, "mousemove", function (j) {
                            _mouseMoveEvent(j);
                        })
                    }
                };
                google.maps.event.addListener( self.map, 'click', function(e) {
                    //console.log( e.latLng.lat(), e.latLng.lng() );
                });
                google.maps.event.addListener(self.map, "mousedown", _beginDrawEvent(self.map));
                function _endDrawEvent(a) {
                    return function () {
                        // console.log( a, self.listLatLong, self.mapPolygon);
                        self.map = self.renderMap();
                        self.$elementIdMap.unbind('touchend.maps');
                        self.$elementIdMap.unbind('mouseup.maps');

                        if (self.mapPolygon != undefined) {
                            self.map.setOptions({draggableCursor: "openhand", draggable: true});
                            google.maps.event.clearListeners(self.map, 'mousedown');
                            google.maps.event.clearListeners(self.map, 'mousemove');
                            self.mapPolygon.setMap(undefined);
                            self.endDraw();
                        }

                    }
                };
                self.$elementIdMap.bind('mouseup.maps', this, _endDrawEvent(this.data));
                //$('body').bind('touchend', this, _endDrawEvent(b.data))

            });

            self.$elementDelShape.unbind('click.delshape').bind('click.delshape', this, function (evt) {
                self.$elementBeginDraw.show();
                self.$elementDelShape.hide();
                if (self.polyline != undefined) {
                    self.polyline.setMap(undefined);
                    self.polyline = null;
                }
                self.clearPoint();
                self.$elementListPost.html( self.$listCloneData ); //return post default
                self.showCityDistrictByNews(); // get city and district real
                self.initSearchNotDraw(self.options.locations);
                self.$elementCountResult.html( self.$listCloneDataCountResult.html() ); //remove count result
                // this.callBackClearPointEvent();

                //self.init();
            });
        },
        initShowDefault: function (){
            var self = this;
            self.initElement();
            self.map = self.renderMap();
            self.$elementIdMap.block( self.loadingHtml );
            //self.showCityDistrictByNews();

            if( !self.options.searchPolygon ){
                //self.initMaps();
            }else{
                //self.initSearchProductInMap();
            }
            if( !self.options.isDetail ){
                self.initSearchNotDraw( self.options.locations );
            }
            self.showHideMarker();
            self.initViewProject();
            self.eventHoverItemShowInfoMap();
            self.$elementIdMap.unblock( self.loadingHtml );
        },
        setZoomMapByKM: function(km){
            var self = this, zoom = self.zoomMap;
            if( km >= 10 && km <= 15 ){
                zoom = 12;
            }else if( km > 15 && km <= 20 ){
                zoom = 11;
            }
            else if(km > 20 && km <= 50){
                zoom = 10;
            }else if( km > 50 && km <= 99 ){
                zoom = 9;
            }else if( km == 100){
                zoom = 8
            }else if( km == 500 ){
                zoom = 6;
            }else if(km > 500){
                zoom = 5;
            }
            self.map.setZoom(zoom);
        },
        setMapCurrentCenter: function(lat, lng){
            this.mapCurrent.center = new google.maps.LatLng(lat, lng);
        },
        setRadius: function(r){
           this.radius = parseInt(r);
        },
        searchPostByKmAroundPolygon: function(){
            var self = this;
            var km = ('km' in self.options) ? self.options.km : 0;
            var lat = ('lat' in self.options) ? self.options.lat : undefined;
            var lng = ('lng' in self.options) ? self.options.lng : undefined;
            self.initElement();
            if(lat != undefined && lng != undefined) {
                self.setMapCurrentCenter(lat, lng);
                self.map = self.renderMap();
                self.map.setCenter(self.mapCurrent.center);
            }
            self.initSearchNotDraw( self.options.locations );
            function getRadiusOutsideByKM(km){
                var radius;
                if( km <= 100 ){
                    radius = 100;
                }else{
                    radius = 10;
                }
                return radius;
            }
            var radiusOutside = getRadiusOutsideByKM(km);
            self.nearAreaLocationByKM(km, radiusOutside);
            self.setZoomMapByKM(km);

        },
        getminMaxPolygonByKM:function(km, lat, lng){
            if(lat != undefined && lng != undefined) {
                this.setMapCurrentCenter(lat, lng);
            }
            return this.minMaxPolygonDefault(this.mapCurrent.center, 1, km);
        }

    }
});
