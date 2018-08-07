<?php

/**
 * @file
 * the file contains functions of the module
 */

function create_table_node_member() {
    $table = array(
        'description' => 'Relations of users and nodes which users received',
        'fields' => array(
            'node_id' => array('type' => 'int', 'unsigned' => TRUE, 'not null' => TRUE),
            'uid' => array('type' => 'int', 'unsigned' => TRUE, 'not null' => TRUE),
            'amount' => array('type' => 'float', 'unsigned' => TRUE, 'not null' => TRUE),
            'status' => array('type' => 'varchar', 'length' => 60, 'not null' => TRUE, 'default' => 'processing'),
            'created' => array('type' => 'int', 'unsigned' => TRUE, 'not null' => TRUE),
            'updated' => array('type' => 'int', 'unsigned' => TRUE, 'not null' => TRUE)
        ),
    );
    db_create_table('node_member', $table);
}

function create_custom_user_menu() {
    $fields = array (
        'menu_name' => 'custom-user-menu',
        'title' => 'Custom user menu',
        'description' => 'The menu helps users can manage their account profile and settings'
    );
    db_insert('menu_custom')->fields($fields)->execute();
}

function payment_history() {
    $eaned_history = get_node_member("earned", array ('status' => 'closed'));
    $paid_history = get_node_member("paid", array ('status' => 'closed'));

    $variables = array (
        'earned_history_form' => drupal_get_form('earned_history_form'),
        'earned_load_more_form' => drupal_get_form('earned_load_more_form'),
        'earned_history' => $eaned_history,
        'total_earned_amount' => canculate_total_amount_of_payment_history($eaned_history),
        'paid_history_form' => drupal_get_form('paid_history_form'),
        'paid_load_more_form' => drupal_get_form('paid_load_more_form'),
        'paid_history' => $paid_history,
        'total_paid_amount' => canculate_total_amount_of_payment_history($paid_history),
    );

    return theme('payment_history', $variables);
}

function get_payment_history_commands($form_state, $is_load_more = false) {

    $conditions['status'] = 'closed';

    if ($form_state['values']['view_type'] == 'range') {
        $conditions['from_date'] = convert_date_to_int($form_state['values']['from_date']);
        $conditions['to_date'] = convert_date_to_int($form_state['values']['to_date']);
    }

    $payment_type = $form_state['values']['payment_type'];
    $page = isset($form_state['values']['page']) ? $form_state['values']['page'] : 0;
    $payment_history = get_node_member($payment_type, $conditions, $page);

    $commands[] = array (
        'command' => 'ajaxPaymentHistoryCallback',
        'payment_history' => drupal_json_encode($payment_history),
        'total_amount' => canculate_total_amount_of_payment_history($payment_history),
        'payment_type' => $payment_type,
        'is_load_more' => $is_load_more
    );

    return array ('#type' => 'ajax', '#commands' => $commands);
}

function get_node_member($payment_type = "earned", $conditions = array (), $page = 0) {
    global $user;

    $uid_field = $payment_type == "earned" ? "m.uid" : "n.uid";
    $offset = $page * 3;
    $conditions = create_query_and_params($conditions);

    $query = "SELECT n.title, n.nid, m.amount, m.created, m.updated, m.status  
              FROM {node_member} m
              INNER JOIN {node} n
              ON n.nid = m.node_id
              WHERE {$uid_field} = :uid
              {$conditions['query']}
              ORDER BY m.updated DESC 
              LIMIT {$offset},3";
    $params = $conditions['params'];
    $params[':uid'] = $user->uid;

    $node_member = db_query($query, $params)->fetchAll();
    return $node_member;
}

function create_query_and_params($conditions) {
    $query = "";
    $params = array ();

    foreach ($conditions as $field => $condition) {
        if($field == 'from_date') {
            $query .= " AND m.updated >= :" . $field;
        }
        else if ($field == 'to_date') {
            $query .= " AND m.updated <= :" . $field;
        }
        else {
            $query .= " AND m." . $field . " = :" . $field;
        }
        $params[':' . $field] = $condition;
    }

    return array ('query' => $query, 'params' => $params);
}

/**
 * convert d/m/y to int
 */
function convert_date_to_int($date) {
    $date = explode("/", $date);
    $date = $date[1]."/".$date[0]."/".$date[2];

    return strtotime($date);
}

function canculate_total_amount_of_payment_history($payment_history) {
    $total_amount = 0;

    foreach ($payment_history as $payment) {
        $total_amount += $payment->amount;
    }

    return $total_amount;
}