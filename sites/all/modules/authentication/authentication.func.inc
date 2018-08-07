<?php
/**
 * @file
 * function container
 */

/**
 * implements page callback for page active code
 */
function authentication_active_code() {

    //Load form buider
    module_load_include('inc', 'authentication', 'authentication.form');

    return drupal_get_form('authentication_active_code_form');
}

/**
 * generate random string
 */
function generate_random_string($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $characters_length = strlen($characters);
    $random_string = '';

    for ($i = 0; $i < $length; $i++) {
        $random_string .= $characters[rand(0, $characters_length - 1)];
    }

    return $random_string;
}