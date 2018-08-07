jQuery(function($){
    var $userPictureModal = $('#modal-user-picture');
    var $showNotification = $('.show-notification');
    var $body = $('body');
    var $image = $('.cropper-image img#image');
    var options = {
        aspectRatio: 1/1,
        minContainerWidth: 400,
        minContainerHeight: 400,
        //preview: '.img-preview',
    };
    // Import image
    var $inputImage = $('#picture-upload');
    var URL = window.URL || window.webkitURL;
    var blobURL;
    var file_default;
    $image.on().cropper(options);
    if (URL) {
        $inputImage.change(function () {
            var files = this.files;
            var file;

            if (!$image.data('cropper')) {
                return;
            }

            if (files && files.length) {
                file = files[0];
                file_default = file;
                if (/^image\/\w+$/.test(file.type)) {
                    blobURL = URL.createObjectURL(file);
                    $image.one('built.cropper', function () {

                        // Revoke when load complete
                        URL.revokeObjectURL(blobURL);
                    }).cropper('reset').cropper('replace', blobURL);
                    $inputImage.val('');
                    $showNotification.find('.notification').remove();
                } else {
                    window.alert('Please choose an image file.');
                }
            }
        });
    } else {
        $inputImage.prop('disabled', true).parent().addClass('disabled');
    }

    $userPictureModal.off('hidden.bs.modal').on('hidden.bs.modal', function(ev){
        $image.cropper('destroy').cropper('replace', '');
        $image.data('cropper').options.aspectRatio = 1/1;
        $image.data('cropper').options.minContainerWidth = 400;
        $image.data('cropper').options.minContainerHeight = 400;
    });

    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }

    if($body.find('#user-profile-md').length) {

        Drupal.ajax['btn-save-picture'].options.beforeSubmit = function (form_values, element, options) {
            $showNotification.find('.notification').remove();
            var result = $image.cropper('getCroppedCanvas');
            if (typeof result.toDataURL == 'function') {
                var img_b64 = result.toDataURL('image/png');
                form_values[0].value = dataURLtoFile(img_b64, file_default.name);
            } else {
                var $error = $('<div class="notification error"></div>');
                $error.text('Please choose picture');
                $showNotification.html($error);
                return false;
            }

        }
        Drupal.ajax.prototype.commands.changeAvatar = function (ajax, response, status) {
            if ($.isPlainObject(response) && 'picture' in response) {
                $('img.picture-avatar').attr('src', response.picture);

            }
            if ('fail' in response && response.fail && 'message' in response) {
                var $error = $('<div class="notification error"></div>');
                $error.text(response.message);
                $showNotification.html($error);
            } else {
                $userPictureModal.modal("hide");
            }
        }
    }


    /* change password */
    var $userChangePass = $('#user-change-password-page');
    if( $userChangePass.length ) {
        var $required = $userChangePass.find('.required');
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
            var name = $(elem).context.id;
            var field = $(elem).attr('placeholder');
            if (field == '' || field == undefined) {
                var $label = self.$form.find('label[for="' + elem.id + '"]');
                $label.find('span').remove();
                field = $label.text();
            }
            validationRules.rules[name] = {required: true,};
            validationRules.messages[name] = {
                required: 'Please input value for <strong>' + field + '</strong>',
            }
        });
        validationRules.rules['new_pass'].minlength = 8;
        validationRules.rules['confirm_pass'].equalTo = '#new_pass';
        validationRules.messages['confirm_pass'].equalTo = 'Those passwords didn\'t match. Try again.';
        $userChangePass.validate(validationRules);
    }
});