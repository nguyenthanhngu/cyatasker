<?php
/**
 * @file
 * This file contains functions of the module
 */

function create_table_user_notifications() {
    $table = array (
        'description' => 'Contains all notifications of users',
        'fields' => array (
            'id' => array ('type' => 'serial', 'unsigned' => TRUE, 'not null' => TRUE),
            'uid' => array ('type' => 'int', 'unsigned' => TRUE, 'not null' => TRUE),
            'content' => array ('type' => 'text', 'not null' => TRUE),
            'link' => array ('type' => 'text'),
            'status' => array ('type' => 'int', 'length' => 2, 'not null' => TRUE, 'default' => 0),
            'created' => array ('type' => 'int', 'unsigned' => TRUE, 'not null' => TRUE),
            'updated' => array ('type' => 'int', 'unsigned' => TRUE, 'not null' => TRUE)
        ),
        'primary key' => array('id'),
    );
    db_create_table('user_notifications', $table);
}

function render_notifications_page() {
    drupal_add_css(drupal_get_path('module', 'notification') . '/css/notification.css');
    global $user;

    $variables = array (
        'notifications' =>  get_notifications($user->uid, 0,3),
        'load_more_form' => drupal_get_form('load_more_notifications_form')
    );

    return theme('notifications', $variables);
}

function get_notifications_commands($form_state) {
    global $user;

    $page = isset($form_state['values']['page']) ? $form_state['values']['page'] : 0;
    $offset = $page * 3;
    $notifications = get_notifications($user->uid, $offset, 3);

    $commands[] = array (
        'command' => 'ajaxNotificationsCallback',
        'notifications' => drupal_json_encode($notifications),
    );

    return array ('#type' => 'ajax', '#commands' => $commands);
}

function insert_notification($values) {
    $notification = db_insert('user_notifications')
        ->fields($values)
        ->execute();

    return $notification;
}

function update_notification($values, $id) {
    db_update('user_notifications')
        ->fields($values)
        ->condition('id', $id, '=')
        ->execute();
}

function count_new_notifications() {
    global $user;

    $count = db_select('user_notifications', 'n')
        ->fields('n')
        ->condition('uid', $user->uid, '=')
        ->condition('status', NOTIFICATION_IS_NOT_VIEWED, '=')
        ->execute()
        ->rowCount();

    return $count;
}

function get_notifications($uid, $offset, $limit) {
    $notifications = db_select('user_notifications', 'n')
        ->fields('n')
        ->condition('uid', $uid, '=')
        ->orderBy('updated', 'DESC')
        ->range($offset, $limit)
        ->execute()
        ->fetchAll();

    return $notifications;
}



