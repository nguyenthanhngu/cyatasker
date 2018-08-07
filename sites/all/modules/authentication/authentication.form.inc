<?php
/**
 * @file
 * form buider
 */

/**
 * builds active code form
 */
function authentication_active_code_form() {
    $form = array();

    $form['active_code'] = array(
        '#type' => 'textfield',
        '#title' => t('Active code'),
        '#description' => t('Please type a active code which was sent to your email.'),
        '#required' => TRUE,
    );

    $form['submit'] = array(
        '#type' => 'submit',
        '#value' => t('Submit')
    );

    return $form;
}

/**
* validate active code form
*/
function authentication_active_code_form_validate($form, &$form_state) {
    global $user;
    global $base_url;

    $code = drupal_json_decode($user->code);

    if (REQUEST_TIME - $code['time'] > LIMITED_TIME) {
        $edit = array (
            'code' => ''
        );
        user_save($user, $edit);
        drupal_goto($base_url . "/user/logout");
    }

    if(!flood_is_allowed('failed_login_attempt_ip', MAXINUM_TYPING_NUMBER, LIMITED_TIME)) {
        form_set_error('active_code', t('You typed more allowed times. Please come back after %number minutes', array("%number" => LIMITED_TIME/60)));
    }

    if ($code['value'] != $form_state['values']['active_code']) {
        flood_register_event('failed_login_attempt_ip', LIMITED_TIME);
        $code['number'] = $code['number'] - 1;
        $edit = array (
            'code' => drupal_json_encode($code),
        );
        user_save($user, $edit);
        form_set_error('active_code', t('You typed a wrong active code. You remain %number times to type active code.', array ('%number' => $code['number'])));
    }
}

/**
 * validate active code form
 */
function authentication_active_code_form_submit() {
    global $user;
    global $base_url;

    $edit = array (
        'code' => '',

    );
    user_save($user, $edit);
    flood_clear_event('failed_login_attempt_ip', $identifier = NULL);
    drupal_goto($base_url . "/account/my-tasks");
}
