<?php
/**
 * @file
 * Page callbacks for adding, editing, deleting, and revisions management for content.
 */

/**
 * Menu callback; presents the node editing form.
 */
function myblock_page_edit($node) {
    #print_r( $node );exit;
  $type_name = node_type_get_name($node);
  drupal_set_title(t('<em>Edit @type</em> @title', array('@type' => $type_name, '@title' => $node->title)), PASS_THROUGH);
  return drupal_get_form('myblock_block_form', $node);
}

/**
 * Page callback: Displays add content links for available content types.
 *
 * Redirects to node/add/[type] if only one content type is available.
 *
 * @see node_menu()
 */
function myblock_add_page() {
  $item = menu_get_item();
  $content = system_admin_menu_block($item);
  // Bypass the node/add listing if only one content type is available.
  if (count($content) == 1) {
    $item = array_shift($content);
    drupal_goto($item['href']);
  }
  return theme('node_add_list', array('content' => $content));
}


/**
 * Form constructor for the node deletion confirmation form.
 *
 * @see myblock_delete_confirm_submit()
 */
function myblock_delete_confirm($form, &$form_state, $node) {
    $form['#node'] = $node;
    // Always provide entity id in the same form key as in the entity edit form.
    $form['nid'] = array('#type' => 'value', '#value' => $node->nid);
    return confirm_form($form,
        t('Are you sure you want to delete <strong>%title</strong> ?', array('%title' => $node->title)),
        MYPOST_SLUG.'/' . $node->nid.'/edit',
        t('This action cannot be undone.'),
        t('<span class="glyphicon glyphicon-trash"></span> Delete'),
        t('Cancel')
    );
}

/**
 * Executes node deletion.
 *
 * @see myblock_delete_confirm()
 */
function myblock_delete_confirm_submit($form, &$form_state) {
    if ($form_state['values']['confirm']) {
        $node = node_load($form_state['values']['nid']);
        node_delete($form_state['values']['nid']);
        cache_clear_all();
        watchdog('content', '@type: deleted %title.', array('@type' => $node->type, '%title' => $node->title));
        drupal_set_message(t('@type %title has been deleted.', array('@type' => node_type_get_name($node), '%title' => $node->title)));
    }

    $form_state['redirect'] = url(POSTLIST_SLUG);
}


/**
 * Form submission handler for node_form().
 *
 * Handles the 'Delete' button on the node form.
 *
 * @see myblock_form()
 * @see myblock_form_validate()
 */
function myblock_form_delete_submit($form, &$form_state) {
    $destination = array();
    if (isset($_GET['destination'])) {
        $destination = drupal_get_destination();
        unset($_GET['destination']);
    }
    $node = $form['#node'];
    $form_state['redirect'] = array( MYPOST_SLUG .'/' . $node->nid . '/delete', array('query' => $destination));
}


/**
 * Returns a node submission form.
 *
 * @param $type
 *   The node type for the submitted node.
 *
 * @return
 *   The themed form.
 */
function myblock_add() {
    global $user;
    $types = node_type_get_types();
    $node = (object) array('uid' => $user->uid, 'name' => (isset($user->name) ? $user->name : ''), 'type' => 'posts', 'language' => LANGUAGE_NONE);
    drupal_set_title(t('Create @name', array('@name' => $types['posts']->name)), PASS_THROUGH);
    $output = drupal_get_form('myblock_block_form', $node);

    return $output;
}

/**
 * Form constructor for the node add/edit form.
 *
 * @see myblock_form_validate()
 * @see myblock_form_submit()
 * @see myblock_form_delete_submit()
 * @ingroup forms
 */
function myblock_block_form($form, &$form_state, $node) {
    global $user;
    if( empty( $user ) || ( $node->uid != $user->uid && user_access('user_access') ) ){
        drupal_access_denied();
    }
    $myform = myblock_form();
    // During initial form build, add the node entity to the form state for use
    // during form building and processing. During a rebuild, use what is in the
    // form state.
    if (!isset($form_state['node'])) {
        if (!isset($node->title)) {
            $node->title = NULL;
        }
        node_object_prepare($node);
        $form_state['node'] = $node;
    }
    else {
        $node = $form_state['node'];
    }

    // Some special stuff when previewing a node.
    if (isset($form_state['node_preview'])) {
        $form['#prefix'] = $form_state['node_preview'];
        $node->in_preview = TRUE;
    }
    else {
        unset($node->in_preview);
    }

    // Identify this as a node edit form.
    // @todo D8: Remove. Modules can implement hook_form_BASE_FORM_ID_alter() now.
    $form['#myblock_edit_form'] = TRUE;

    $form['#attributes']['class'][] = 'myblock-form';
    if (!empty($node->type)) {
        $form['#attributes']['class'][] = 'myblock-' . $node->type . '-form';
    }

    // Basic node information.
    // These elements are just values so they are not even sent to the client.
    foreach (array('nid', 'vid', 'uid', 'created', 'type', 'language') as $key) {
        $form[$key] = array(
            '#type' => 'value',
            '#value' => isset($node->$key) ? $node->$key : NULL,
        );
    }

    // Changed must be sent to the client, for later overwrite error checking.
    $form['changed'] = array(
        '#type' => 'hidden',
        '#default_value' => isset($node->changed) ? $node->changed : NULL,
    );
    // Invoke hook_form() to get the node-specific bits. Can't use node_invoke(),
    // because hook_form() needs to be able to receive $form_state by reference.
    // @todo hook_form() implementations are unable to add #validate or #submit
    //   handlers to the form buttons below. Remove hook_form() entirely.
    $function = node_type_get_base($node) . '_form';
    if (function_exists($function) && ($extra = $function($node, $form_state))) {
        $form = array_merge_recursive($form, $extra);
    }
    // If the node type has a title, and the node type form defined no special
    // weight for it, we default to a weight of -5 for consistency.
    if (isset($form['title']) && !isset($form['title']['#weight'])) {
        $form['title']['#weight'] = -5;

    }
    $form['title']['#attributes'] = [
        'id' => 'title',
        'placeholder' => t('Title'),
    ];
    // @todo D8: Remove. Modules should access the node using $form_state['node'].
    $form['#node'] = $node;

    // Add the buttons.
    $form['actions'] = array('#type' => 'actions');
    $form['actions']['submit'] = array(
        '#type' => 'submit',
        '#value' => t('Save'),
        '#weight' => 5,
        '#submit' => array('myblock_form_submit_edit'),
    );
    if (!empty($node->nid) && node_access('delete', $node)) {
        $form['actions']['delete'] = array(
            '#type' => 'submit',
            '#value' => t('Delete'),
            '#weight' => 15,
            '#submit' => array('myblock_form_delete_submit'),
        );
    }
    // This form uses a button-level #submit handler for the form's main submit
    // action. node_form_submit() manually invokes all form-level #submit handlers
    // of the form. Without explicitly setting #submit, Form API would auto-detect
    // node_form_submit() as submit handler, but that is the button-level #submit
    // handler for the 'Save' action. To maintain backwards compatibility, a
    // #submit handler is auto-suggested for custom node type modules.
    $form['#validate'][] = 'myblock_form_validate';
    if (!isset($form['#submit']) && function_exists($node->type . '_node_form_submit')) {
        $form['#submit'][] = $node->type . '_node_form_submit';
    }
    $language = $node->language;

    $form_field = [];
    $form += array('#submit' => array());
    field_attach_form('node', $node, $form_field, $form_state, entity_language('node', $node));
    #echo "<pre>";print_r( $form_field );echo "</pre>";exit;
    $form['body'] = $form_field['body'];
    $form['body']['#weight'] = 0;
    if( isset($myform['price']) ){
        $form['price'] = $myform['price'];
        $form['price']['#weight'] = -4;
        $form['price']['#default_value'] = isset($node->price) ? $node->price : '';
    }

    $form['field_categories'] = $form_field['field_categories'];
    $form['field_categories']['#weight'] = -6;
    $form['field_categories']['#attributes'] = [
        'class' => ['item-selectpicker']
    ];
    $form['field_categories']['#requried'] = true;
    if( array_key_exists('#options', $form['field_categories'][$language]) &&
        array_key_exists('_none', $form['field_categories'][$language]['#options']) ){
        unset($form['field_categories'][$language]['#options']['_none']);
    }
    $node_body_array = field_get_items('node', $node, 'body');
    $node_body = !empty($node_body_array) ? reset($node_body_array) : ['value' => ''];
    $node_body = $node_body['value'];
    $form['body']['#default_value'] = $node_body;
    $form['group-maps'] = $myform['group-maps'];
    $form['group-maps']['address_maps']['#default_value'] = isset($node->address) ? $node->address : '';
    $form['group-maps']['latitude']['#default_value'] = isset($node->latitude) ? $node->latitude : '';
    $form['group-maps']['longitude']['#default_value'] = isset($node->longitude) ? $node->longitude : '';
    $field_media = isset($form_field['field_media']) ? $form_field['field_media'] : [];
    $process = [];
    if( array_key_exists($node->language, $field_media) && count($field_media[$node->language]) ){
        $process = $field_media[$node->language][0]['#process'];
    }
    if( !empty($process) ){
        if (($key = array_search('image_field_widget_process', $field_media[$node->language][0]['#process'])) !== false) {
            unset($field_media[$node->language][0]['#process'][$key]);
        }
        $field_media[$node->language][0]['#process'][] = 'myblock_image_field_widget_process';
    }
    $field_media['#weight'] = 10;
    $form['field_media'] = $field_media;


    $field_image = isset($form_field['field_image']) ? $form_field['field_image'] : [];
    $process = [];
    if( array_key_exists($node->language, $field_image) && count($field_image[$node->language]) ){
        $process = $field_image[$node->language][0]['#process'];
    }
    if( !empty($process) ){
        if (($key = array_search('image_field_widget_process', $field_image[$node->language][0]['#process'])) !== false) {
            unset($field_image[$node->language][0]['#process'][$key]);
        }
        $field_image[$node->language][0]['#process'][] = 'myblock_image_field_widget_process';
    }
    $field_image['#weight'] = 11;
    $form['field_image'] = $field_image;
    return $form;
}

/**
 * Updates the form state's node entity by processing this submission's values.
 *
 * This is the default builder function for the node form. It is called
 * during the "Save" and "Preview" submit handlers to retrieve the entity to
 * save or preview. This function can also be called by a "Next" button of a
 * wizard to update the form state's entity with the current step's values
 * before proceeding to the next step.
 *
 * @see myblock_form()
 */
function myblock_form_submit_build_node($form, &$form_state) {
    // @todo Legacy support for modules that extend the node form with form-level
    //   submit handlers that adjust $form_state['values'] prior to those values
    //   being used to update the entity. Module authors are encouraged to instead
    //   adjust the node directly within a hook_node_submit() implementation. For
    //   Drupal 8, evaluate whether the pattern of triggering form-level submit
    //   handlers during button-level submit processing is worth supporting
    //   properly, and if so, add a Form API function for doing so.
    unset($form_state['submit_handlers']);
    form_execute_handlers('submit', $form, $form_state);

    $node = $form_state['node'];
    entity_form_submit_build_entity('node', $node, $form, $form_state);

    node_submit($node);

    return $node;
}

/**
 * Form submission handler for node_form().
 *
 * @see myblock_form()
 * @see myblock_form_validate()
 */
function myblock_form_submit_edit($form, &$form_state) {
    global $user;
    $node = myblock_form_submit_build_node($form, $form_state);
    $insert = empty($node->nid);
    require_once LIBRARIES_PATH . '/includes/sanitize-string.php';
    if( !isset($node->path) ){
        $path = [
            'alias' => sanitize_string($node->title),
            'pid' => '',
            'source' => '',
            'language' => $node->language,
        ];
    }else{
        $path = $node->path;
    }
    $node->type = 'posts';
    // set node language
    $node->language = LANGUAGE_NONE;
    //(1 or 0): published or not
    /*$node->status = 1;
    //(1 or 0): promoted to front page
    $node->promote = 0;

    */
    // 0 = comments disabled, 1 = read only, 2 = read/write
    $node->comment = 2;
    $node->uid = $user->uid;

    $node->path = get_alias($path);
    $node->address = isset($form_state['values']['address_maps']) ? $form_state['values']['address_maps'] : '';
    #echo"<pre>";print_r($form_state['node']);echo"</pre>";exit;
    node_save($node);
    $node_link = l(t('view'), 'node/' . $node->nid);
    $watchdog_args = array('@type' => $node->type, '%title' => $node->title);
    $t_args = array('@type' => node_type_get_name($node), '%title' => $node->title);

    if ($insert) {
        watchdog('content', '@type: added %title.', $watchdog_args, WATCHDOG_NOTICE, $node_link);
        drupal_set_message(t('@type %title has been created.', $t_args));
    }
    else {
        watchdog('content', '@type: updated %title.', $watchdog_args, WATCHDOG_NOTICE, $node_link);
        drupal_set_message(t('@type %title has been updated.', $t_args));
    }
    if ($node->nid) {
        $form_state['values']['nid'] = $node->nid;
        $form_state['nid'] = $node->nid;
        $form_state['redirect'] = node_access('view', $node) ? MYPOST_SLUG.'/' . $node->nid . '/edit' : '<front>';
    }
    else {
        // In the unlikely case something went wrong on save, the node will be
        // rebuilt and node form redisplayed the same way as in preview.
        drupal_set_message(t('The post could not be saved.'), 'error');
        $form_state['rebuild'] = TRUE;
    }
    // Clear the page and block caches.
    cache_clear_all();
}

/**
 * An element #process callback for the image_image field type.
 *
 * Expands the image_image type to include the alt and title fields.
 */
function myblock_image_field_widget_process($element, &$form_state, $form) {
    $item = $element['#value'];
    $item['fid'] = $element['fid']['#value'];

    $instance = field_widget_instance($element, $form_state);

    $settings = $instance['settings'];
    $widget_settings = $instance['widget']['settings'];
    $element['#theme'] = 'image_widget';
    $element['#attached']['css'][] = drupal_get_path('module', 'image') . '/image.css';

    // Add the image preview.
    if ($element['#file'] && isset($widget_settings['preview_image_style']) && !empty($widget_settings['preview_image_style'])) {
        $variables = array(
            'style_name' => $widget_settings['preview_image_style'],
            'path' => $element['#file']->uri,
        );

        // Determine image dimensions.
        if (isset($element['#value']['width']) && isset($element['#value']['height'])) {
            $variables['width'] = $element['#value']['width'];
            $variables['height'] = $element['#value']['height'];
        }
        else {
            $info = image_get_info($element['#file']->uri);

            if (is_array($info)) {
                $variables['width'] = $info['width'];
                $variables['height'] = $info['height'];
            }
            else {
                $variables['width'] = $variables['height'] = NULL;
            }
        }

        $element['preview'] = array(
            '#type' => 'markup',
            '#markup' => theme('image_style', $variables),
        );

        // Store the dimensions in the form so the file doesn't have to be accessed
        // again. This is important for remote files.
        $element['width'] = array(
            '#type' => 'hidden',
            '#value' => $variables['width'],
        );
        $element['height'] = array(
            '#type' => 'hidden',
            '#value' => $variables['height'],
        );
    }


    return $element;
}
