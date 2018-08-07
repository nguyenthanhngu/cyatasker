(function($){
    $.validator.addMethod('validatePhone', function (value, element) {
        return this.optional(element) || /^([0])([0-9]){9,11}$/.test(value) || /^([\+84])([0-9]){10,12}$/.test(value);
    });
    var $form = $('#user-register-form');
    if($form.length) {
        var $required = $form.find('.required');
        var validationRules = {
            rules: {},
            messages: {},
            errorPlacement: function (error, $element) {
                // Add the `help-block` class to the error element
                error.addClass("help-block");
                if ('$label' in $element[0]) {
                    error.insertBefore($element[0].$label);
                } else if ($element.prop("type") === "checkbox") {
                    error.insertBefore($element.parent("label"));
                } else {
                    error.insertBefore($element);
                }
                return;
            }
        };

        $required.each(function (idx, elem) {
            var name = $(elem).context.name;
            var field = $(elem).attr('placeholder');
            if (field == '' || field == undefined) {
                var $label = $form.find('label[for="' + elem.id + '"]');
                $label.find('span').remove();
                field = $label.text();
            }
            validationRules.rules[name] = {required: true,};
            validationRules.messages[name] = {
                required: 'Please input value for <strong>' + field + '</strong>',
            }
            if (name == 'pass') {
                validationRules.rules[name].minlength = 8;
            } else if (name == 'mail') {
                validationRules.rules[name].email = true;
            } else if (name == 'phone_number') {
                validationRules.rules[name].validatePhone = true;
                validationRules.messages[name].validatePhone = 'Please enter a valid phone number.';
            }

        });
        validationRules.rules['confirm_pass'] = {equalTo: '#edit-pass'};
        validationRules.messages['confirm_pass'] = {equalTo: 'Those passwords didn\'t match. Try again.'};
        $form.validate(validationRules);
    }

    var $formResetPass = $('#user-pass');
    if( $formResetPass.length ) {
        $formResetPass.validate({
            rules: {
                name: {
                    email: true,
                    required: true,
                }
            },
            messages: {
                name: {
                    required: 'Please input value for <strong>email address</strong>'
                }
            }
        });
    }


    var Defaults = {
        sitekey: '',
        cssResponse: '.response_captcha',
        cssSendInbox: '.btn-captcha'
    };

    function ReCaptcha(element, options) {
        var self = this, $element = $(element);
        options = $.extend({}, Defaults, $element.data() || {}, options || {});
        this.options = options;
        self.$element = $element;
        self.$responseCaptcha = $(options.cssResponse);
        self.$sendInbox = $(options.cssSendInbox);
        self.$sendInbox.attr('disabled', true);
        (function() {
            if( (typeof(grecaptcha) !== 'undefined') && ('render' in grecaptcha) ) {
                grecaptcha.render('recaptcha', {
                    'sitekey': options.sitekey,
                    'callback': function (response) {
                        self.$responseCaptcha.val(response);
                        self.$sendInbox.attr('disabled', false);
                        self.$element.trigger('recaptcha.response', response);
                    }
                });
            } else {
                setTimeout(arguments.callee, 100);
            }
        })();
        return this;
    }

    $.fn.reCaptcha = function (options) {
        $(this).each(function () {
            var data = $(this).data('reCaptcha');
            if (!data) {
                $(this).data('reCaptcha', new ReCaptcha(this, options));
            }
        });
    };
    $('#recaptcha').reCaptcha();
})(jQuery);