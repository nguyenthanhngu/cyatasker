jQuery(function($){
	'use-strict';



	/*// slider
	$(".slider").slider({full_width: true});

	// testimonial
	$("#owl-testimonial").owlCarousel({

		slideSpeed : 300,
		paginationSpeed : 400,
		singleItem : true,

	})

	// loader
    $("#fakeLoader").fakeLoader({

      zIndex: 999,
      spinner: 'spinner1',
      bgColor: '#ffffff'

    });

    $('.collapsible').collapsible({
		accordion: false
	});*/

	$.fn.cyaTasker = function(options){
		this.each(function(){
			var cya = $(this).data('cyaData');
			if( !cya ){
				var cya = new cyaTasker(this, options);
				$(this).data('cyaData', cya);
			}
		});
	};
	function cyaTasker(element, options){
		var data =  $(element).data();
		var options = $.extend(options, data,{});
		this.$element = $(element);
		this.element = element;
		this.init();

	}
	cyaTasker.prototype = {
		init: function(){

		}
	};



});
