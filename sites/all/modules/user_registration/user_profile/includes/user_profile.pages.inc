<?php
/**
 * @file
 * Page callbacks for adding, editing, deleting, and revisions management for content.
 */
function page_user_profile_form(){
    #$form = drupal_get_form('user_profile_block_form');
    #echo"<pre>";var_dump(__LINE__, __FILE__);print_r( $form );echo"</pre>";
    #return $form;
    $form['name'] = array('#type' => 'textfield',
        '#title' => t('Username'),
        '#size' => 60,
        '#maxlength' => USERNAME_MAX_LENGTH,
        '#required' => TRUE,
    );

    $form['name']['#description'] = t('Enter your @s username.', array('@s' => variable_get('site_name', 'Drupal')));
    $form['pass'] = array('#type' => 'password',
        '#title' => t('Password'),
        '#description' => t('Enter the password that accompanies your username.'),
        '#required' => TRUE,
    );
    $form['#validate'] = user_login_default_validators();
    $form['actions'] = array('#type' => 'actions');
    $form['actions']['submit'] = array('#type' => 'submit', '#value' => t('Log in'));
    return $form;
}


function template_preprocess_profile_user_page(&$variables){
    #$variables['user_profile_form'] = drupal_get_form('user_profile_block_form');
    echo"<pre>";var_dump(__LINE__, __FILE__);print_r( $variables );echo"</pre>";
}