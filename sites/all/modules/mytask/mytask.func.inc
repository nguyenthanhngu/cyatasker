<?php
/**
 * @file
 * This file contains functions of the module
*/
function render_my_tasks() {
    module_load_include('inc', 'payment', 'payment.func');

    $variables = array (
        'filter_form' => drupal_get_form('mytask_filter_form'),
        'load_more_form' => drupal_get_form('mytask_load_more_form'),
        'my_tasks' =>  get_node_member( 'earned')
    );

    return theme('my_tasks', $variables);
}

function render_task_details($id) {
    drupal_add_js(drupal_get_path('module', 'mytask') . '/js/task_details.js');

    global $user;

    $view_notification = drupal_get_query_parameters();

    if (isset($view_notification['view-notification'])) {
        module_load_include('inc', 'notification', 'notification.func');

        $values = array (
            'status' => NOTIFICATION_WAS_VIEWED,
            'updated' => REQUEST_TIME
        );
        update_notification($values, $view_notification['view-notification']);
    }

    $task = get_task_detail($id);

    if ($user->uid == $task['node']->uid) {
        $update_task_status_form = $task['status'] != 'closed' ? drupal_get_form('update_task_status_by_poster') : array();
    }
    else {
        $update_task_status_form = ($task['status'] == 'processing' || $task['status'] == "reopened") ?
            drupal_get_form('update_task_status_by_worker') : array ();
    }

    $variables = array (
        'task' => $task,
        'update_task_status_form' => $update_task_status_form
    );

    return theme('task_details', $variables);
}

function insert_task_notification($task, $sender) {
    module_load_include('inc', 'notification', 'notification.func');

    $receiver_id = ($sender == 'worker') ? $task['node']->uid : $task['uid'];

    $inserted_values = array (
        'uid' => $receiver_id,
        'content' => create_task_notification_content($task, $sender),
        'status' => NOTIFICATION_IS_NOT_VIEWED,
        'created' => REQUEST_TIME,
        'updated' => REQUEST_TIME,
    );
    $notification_id = insert_notification($inserted_values);

    global $base_url;
    $updated_values = array (
        'link' => $base_url . '/task/' . $task['node']->nid . '?view-notification=' . $notification_id
    );
    update_notification($updated_values, $notification_id);
}

function create_task_notification_content($task, $sender) {
    $sender_id = ($sender == 'worker') ? $task['uid'] : $task['node']->uid;
    $worker = user_load($sender_id);
    $content = t(":name has :status task :title", array ( ':name' => $worker->name, ':status' => $task['status'], ':title' => $task['node']->title));

    return $content;
}

function get_task_detail($task_id) {
    $task = db_select('task', 't')
        ->fields('t', array ('id', 'node_id' ,'uid', 'price', 'status', 'reason', 'images'))
        ->condition('id', $task_id, '=')
        ->execute()
        ->fetchAssoc();

    $node = node_load($task['node_id']);
    $task['node'] = $node;

    return $task;
}

function update_stask ($task_id, $updated_fields) {
    db_update('task')
        ->fields($updated_fields)
        ->condition('id', $task_id, '=')
        ->execute();
}

function get_my_tasks_commands($form_state, $is_load_more = FALSE) {
    $conditions = array();

    if($form_state['values']['status'] != 'all') {
        $conditions['status'] = $form_state['values']['status'];
    }

    $page = isset($form_state['values']['page']) ? $form_state['values']['page'] : 0;

    module_load_include('inc', 'payment', 'payment.func');
    $my_tasks = get_task('earned', $conditions, $page);

    $commands[] = array (
        'command' => 'ajaxMyTasksCallback',
        'my_tasks' => drupal_json_encode($my_tasks),
        'is_load_more' => $is_load_more
    );

    return array ('#type' => 'ajax', '#commands' => $commands);
}