<?php
/**
 * @file
 * This file contains forms which the module build
 */

function create_payment_history_form() {
    $form = array();

    $form['payment_history'] = array (
        '#type' => 'container',
        '#attributes' => array (
            'class' => array ('row'),
        ),
    );

    $form['payment_history']['view_type'] = array (
        '#type' => 'select',
        '#options' => array (
            'all' => t('All'),
            'range' => t('Range'),
        ),
        '#prefix' => '<div class="col-md-2 col-sm-12">',
        '#suffix' => '</div>',
        '#ajax' => array (
            'callback' => 'ajax_payment_history_callback',
            'event' => 'change',
        ),
    );

    $form['payment_history']['from_date'] = array (
        '#type' => 'textfield',
        '#title' => t('From'),
        '#prefix' => '<div class="col-md-5 col-sm-12 payment-date hide">',
        '#suffix' => '</div>',
    );

    $form['payment_history']['to_date'] = array (
        '#type' => 'textfield',
        '#title' => t('To'),
        '#prefix' => '<div class="col-md-5 col-sm-12 payment-date hide">',
        '#suffix' => '</div>',
        '#ajax' => array (
            'callback' => 'ajax_payment_history_callback',
            'event' => 'change',
        ),

    );

    $form['#attached']['js'] = array (
        array (
            'type'  => 'file',
            'data' => drupal_get_path('module', 'payment') . '/js/ajax.js',
        ),
    );

    return $form;
}

function create_load_more_form() {
    $form['load_more'] = array (
        '#type' => 'button',
        '#value' => t('Load more'),
        '#ajax' => array (
            'callback' => 'ajax_load_more_callback',
        ),
    );

    $form['page'] = array (
        '#type' => 'hidden',
        '#default_value' => 1
    );

    $form['view_type'] = array (
        '#type' => 'hidden',
        '#default_value' => 'all'
    );

    $form['from_date'] = array (
        '#type' => 'hidden',
    );

    $form['to_date'] = array (
        '#type' => 'hidden',
    );

    $form['#attached']['js'] = array (
        array (
            'type'  => 'file',
            'data' => drupal_get_path('module', 'payment') . '/js/ajax.js',
        ),
    );

    return $form;
}

