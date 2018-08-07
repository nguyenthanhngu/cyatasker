<?php
define('TASKSEARCH_DIR', drupal_get_path('module', 'task_search'));
/**
 * @file
 * User page callbacks for the search module.
 */

/**
 * Menu callback; presents the search form and/or search results.
 *
 * @param $module
 *   Search module to use for the search.
 * @param $keys
 *   Keywords to use for the search.
 */
function task_search_view($module = NULL, $keys = '') {
    $info = FALSE;
    $keys = trim($keys);
    // Also try to pull search keywords out of the $_REQUEST variable to
    // support old GET format of searches for existing links.
    $params = ['keys' => $keys];
    if (!$keys && !empty($_REQUEST['keys'])) {
        $keys = trim($_REQUEST['keys']);
        $params['keys'] = $keys;
    }

    if (!empty($module)) {
        $active_module_info = search_get_info();
        if (isset($active_module_info[$module])) {
            $info = $active_module_info[$module];
        }
    }
    #echo "<pre>"; var_dump(__LINE__, __FILE__, func_get_args(), $active_module_info );echo "</pre>";exit;
    if (empty($info)) {
        // No path or invalid path: find the default module. Note that if there
        // are no enabled search modules, this function should never be called,
        // since hook_menu() would not have defined any search paths.
        $info = search_get_default_module_info();
        // Redirect from bare /search or an invalid path to the default search path.
        $path = 'search/' . $info['path'];
        if ($keys) {
            $path .= '/' . $keys;
        }
        drupal_goto($path);
    }

    // Default results output is an empty string.
    $results = array('#markup' => '');
    // Process the search form. Note that if there is $_POST data,
    // search_form_submit() will cause a redirect to search/[module path]/[keys],
    // which will get us back to this page callback. In other words, the search
    // form submits with POST but redirects to GET. This way we can keep
    // the search query URL clean as a whistle.
    if (empty($_POST['form_id']) || ($_POST['form_id'] != 'search_form' && $_POST['form_id'] != 'search_block_form')) {
        $conditions =  NULL;
        if (isset($info['conditions_callback']) && function_exists($info['conditions_callback'])) {
            // Build an optional array of more search conditions.
            $conditions = call_user_func($info['conditions_callback'], $keys);
        }
        $variables = ['%keys' => $keys, '%type' => $info['title']];
        $link = 'search/' . $info['path'] . '/?keys=' . $keys;
        foreach (['price', 'cat', 'km', 'latitude', 'longitude'] as $item){
            if( isset($_REQUEST[$item]) ){
                $value = trim($_REQUEST[$item]);
                $params[$item] = $value;
                $variables[$item] = $value;
                $link .= "&{$item}=".$value;
            }
        }
        // Only search if there are keywords or non-empty conditions.
        #if ($keys || !empty($conditions)) {
            if (variable_get('search_logging', TRUE)) {
                // Log the search keys.
                #watchdog($type, $message, $variables = array(), $severity = WATCHDOG_NOTICE, $link = NULL)
                watchdog('search', 'Searched %type for %keys.', $variables, WATCHDOG_NOTICE, l(t('results'), $link));
            }
            // Collect the search results.

            $results = search_data($params, $info['module'], $conditions);
            #echo "<pre>";var_dump(__LINE__, __FILE__, $results); echo "</pre>";exit;
        #}

    }

    // The form may be altered based on whether the search was run.
    #$build['search_form'] = drupal_get_form('search_form', NULL, $keys, $info['module']);
    $build['search_results'] = $results;
    #echo "<pre>";print_r($results);echo "</pre>";exit;
    return $build;
}


/**
 * Process variables for task_search-results.tpl.php.
 *
 * The $variables array contains the following arguments:
 * - $results: Search results array.
 * - $module: Module the search results came from (module implementing
 *   hook_search_info()).
 *
 * @see task_search-results.tpl.php
 */
function template_preprocess_task_search_results(&$variables) {
    $variables['search_results'] = '';
    if (!empty($variables['module'])) {
        $variables['module'] = check_plain($variables['module']);
    }
    #echo "<pre>";var_dump(__LINE__, __FILE__, $variables['results']['locations']);echo "</pre>";exit;
    if( isset($variables['results']['locations']) ){
        $variables['locations'] = $variables['results']['locations'];
    }
    $results = $variables['results'];
    if( isset($variables['results']['results']) ){
        $results = $variables['results']['results'];
    }
    foreach ($results as $result) {
        $variables['search_results'] .= theme('task_search_result', array('result' => $result, 'module' => $variables['module']));
    }
    #module_load_include("inc", "task_search", 'includes/ajax_form');
    #require_once TASKSEARCH_DIR . '/includes/ajax_form.inc';
    $variables['task_search_advance'] = drupal_get_form('search_advance_form');
    #echo "<pre>";var_dump(__LINE__, __FILE__);print_r($variables['task_search_advance']['search_advance']);echo "</pre>";exit;
    $variables['pager'] = theme('pager', array('tags' => NULL));
    drupal_add_js('jQuery(document.body).data("marker_locations", '.json_encode($variables['locations']).');', 'inline');
    $variables['theme_hook_suggestions'][] = 'search_results__' . $variables['module'];
}


/**
 * Process variables for task_search-result.tpl.php.
 *
 * The $variables array contains the following arguments:
 * - $result
 * - $module
 *
 * @see task_search-result.tpl.php
 */
function template_preprocess_task_search_result(&$variables) {
    global $language;

    $result = $variables['result'];
    $variables['url'] = check_url($result['link']);
    $variables['title'] = check_plain($result['title']);
    $variables['user'] = $result['user'];
    $variables['comment_count'] = $result['comment_count'];
    if (isset($result['language']) && $result['language'] != $language->language && $result['language'] != LANGUAGE_NONE) {
        $variables['title_attributes_array']['xml:lang'] = $result['language'];
        $variables['content_attributes_array']['xml:lang'] = $result['language'];
    }

    $info = array();
    if (!empty($result['module'])) {
        $info['module'] = check_plain($result['module']);
    }
    if (!empty($result['user'])) {
        $info['user'] = $result['user'];
    }
    if (!empty($result['date'])) {
        $info['date'] = format_date($result['date'], 'short');
    }
    if (isset($result['extra']) && is_array($result['extra'])) {
        $info = array_merge($info, $result['extra']);
    }

    foreach (['latitude', 'longtitude', 'price', 'image_url', 'address', 'created'] as $key){
        if( array_key_exists($key, $result) ){
            $variables[$key] = $result[$key];
        }
    }
    // Check for existence. User search does not include snippets.
    $variables['snippet'] = isset($result['snippet']) ? $result['snippet'] : '';
    // Provide separated and grouped meta information..
    $variables['info_split'] = $info;
    $variables['postID'] = $result['id'];
    $variables['info'] = implode(' - ', $info);
    $variables['theme_hook_suggestions'][] = 'search_result__' . $variables['module'];
    #echo "<pre>";var_dump(__LINE__, __FILE__);print_r( $variables['result']);echo "</pre>";exit;
}

/**
 * As the search form collates keys from other modules hooked in via
 * hook_form_alter, the validation takes place in _submit.
 * search_form_validate() is used solely to set the 'processed_keys' form
 * value for the basic search form.
 */
function task_search_form_validate($form, &$form_state) {
    form_set_value($form['basic']['processed_keys'], trim($form_state['values']['keys']), $form_state);
}


function template_preprocess_task_search_ajax_results(&$variables) {
    $variables['search_results'] = '';
    if (!empty($variables['module'])) {
        $variables['module'] = check_plain($variables['module']);
    }
    #echo "<pre>";var_dump(__LINE__, __FILE__, $variables['results']);echo "</pre>";exit;
    if( isset($variables['results']['locations']) ){
        $variables['locations'] = $variables['results']['locations'];
    }
    $results = $variables['results'];
    if( isset($variables['results']['results']) ){
        $results = $variables['results']['results'];
    }
    foreach ($results as $result) {
        $variables['search_results'] .= theme('task_search_result', array('result' => $result, 'module' => $variables['module']));
    }
    $url = [
        'url' => '/search/task',
        'keys' => $variables['keys'],
    ];
    foreach (['price', 'cat', 'km', 'latitude', 'longitude'] as $item){
        $url[$item] = $variables[$item];
    }
    $variables['pager'] = theme('pager', array('tags' => NULL, 'parameters' => $url));
    drupal_add_js('jQuery(document.body).data("marker_locations", '.json_encode($variables['locations']).');', 'inline');
    $variables['theme_hook_suggestions'][] = 'search_results__' . $variables['module'];
}
