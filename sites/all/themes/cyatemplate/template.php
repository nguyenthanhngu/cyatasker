<?php
/**
 * @file
 * Contains theme preprocess functions
 */

define('MAP_KEY', 'AIzaSyDeZQsaYZ1oJhKZnSGZ8QmTYGNdElMmfKY');

 /**
  * Override or insert variables into the html template.
  */
function cyatemplate_preprocess_html(&$vars) {
  $theme_path=path_to_theme();
  // Add conditional CSS for IE6.

    #Add css
    drupal_add_css($theme_path . '/assets/css/simplebar.css', ['group' => CSS_SYSTEM], true);
    drupal_add_css($theme_path . '/assets/css/materialize.css', ['group' => CSS_SYSTEM], true);
    drupal_add_css($theme_path . '/assets/css/fontawesome-all.min.css', ['group' => CSS_SYSTEM], true);
    drupal_add_css($theme_path . '/assets/css/bootstrap.min.css', ['group' => CSS_SYSTEM], true);
    drupal_add_css($theme_path . '/assets/css/animate.min.css', ['group' => CSS_SYSTEM], true);

    drupal_add_css($theme_path . '/assets/css/normalize.css', ['group' => CSS_THEME], true);
    drupal_add_css($theme_path . '/assets/css/fakeLoader.css', ['group' => CSS_THEME], true);
    drupal_add_css($theme_path . '/assets/css/ei-slider.css', ['group' => CSS_THEME], true);
    drupal_add_css($theme_path . '/assets/css/main.css', ['group' => CSS_THEME], true);
    drupal_add_css($theme_path . '/style_mobile.css', ['group' => CSS_THEME], true);
    drupal_add_css($theme_path . '/style.css', ['group' => CSS_THEME], true);
    drupal_add_css($theme_path . '/assets/css/util.css', ['group' => CSS_THEME], true);
    drupal_add_css($theme_path . '/assets/css/main-login.css', ['group' => CSS_THEME], true);
    drupal_add_css($theme_path . '/assets/css/site-styles.css', ['group' => CSS_THEME], true);
    drupal_add_css($theme_path . '/ie6.css', array('group' => CSS_THEME, 'browsers' => array('IE' => 'lt IE 7', '!IE' => FALSE), 'preprocess' => FALSE));

  // Add js

  drupal_add_js($theme_path . "/assets/js/simplebar.js", ['group' => JS_LIBRARY, 'every_page' => TRUE, 'requires_jquery' => TRUE]);
  drupal_add_js($theme_path . "/assets/js/jquery.mousewheel.min.js", ['group' => JS_LIBRARY, 'every_page' => TRUE, 'requires_jquery' => TRUE]);
  #drupal_add_js($theme_path . "/assets/js/popper.min.js", ['group' => JS_LIBRARY, 'every_page' => TRUE, 'requires_jquery' => TRUE]);
  drupal_add_js($theme_path . "/assets/js/bootstrap.min.js", ['group' => JS_LIBRARY, 'every_page' => TRUE, 'requires_jquery' => TRUE]);
    drupal_add_js($theme_path . "/assets/js/jquery.blockui.min.js", ['group' => JS_LIBRARY, 'every_page' => TRUE, 'requires_jquery' => TRUE]);
    drupal_add_js($theme_path . "/assets/js/blockui.defaults.js", ['group' => JS_LIBRARY, 'every_page' => TRUE, 'requires_jquery' => TRUE]);
drupal_add_js($theme_path . '/assets/js/jquery.validate.min.js', array('group' => JS_LIBRARY, 'every_page' => TRUE, 'requires_jquery' => TRUE));
drupal_add_js($theme_path . '/assets/js/additional-methods.min.js', array('group' => JS_LIBRARY, 'every_page' => TRUE, 'requires_jquery' => TRUE));
drupal_add_js($theme_path . '/assets/js/bootstrap-select.min.js', array('group' => JS_DEFAULT, 'every_page' => TRUE, 'requires_jquery' => TRUE));

  drupal_add_js($theme_path . "/assets/js/materialize.min.js");
  drupal_add_js($theme_path . "/assets/js/fakeLoader.min.js");
  drupal_add_js($theme_path . "/assets/js/contact-form.js");
  drupal_add_js($theme_path . "/assets/js/jquery.eislideshow.js");
  drupal_add_js($theme_path . "/assets/js/jquery.easing.1.3.js");
  drupal_add_js('https://maps.googleapis.com/maps/api/js?key='.MAP_KEY.'&libraries=drawing,places,geometry&language=en');
  drupal_add_js($theme_path . "/assets/js/infobox.js");
  drupal_add_js($theme_path . "/assets/js/markerwithlabel.js");
  drupal_add_js($theme_path . "/assets/js/maps.js");
  drupal_add_js($theme_path . "/assets/js/main.js");
	$vars['scripts'] = drupal_get_js();

    #unset($vars['page']['#children']);
	#echo"<pre>";print_r( $vars );echo "</pre>";exit;
}

function cyatemplate_page_alter(&$page){
    #unset($page['content']);
    #]global $_front_page;
    #echo"<pre>";var_dump(__FILE__, __LINE__);print_r($page);echo"</pre>";exit;

}

/**
 * Format submitted by in articles
 */
function cyatemplate_preprocess_node(&$vars) {
    $node = $vars['node'];
    node_build_content($node, 'view');
    #$node_theme = node_show($node);
    $vars['date'] = format_date($node->created, 'custom', 'd M Y');

    if (variable_get('node_submitted_' . $node->type, TRUE)) {
    $vars['display_submitted'] = TRUE;
    $vars['submitted'] = t('By @username on !datetime', array('@username' => strip_tags(theme('username', array('account' => $node))), '!datetime' => $vars['date']));
    $vars['user_picture'] = theme_get_setting('toggle_node_user_picture') ? theme('user_picture', array('account' => $node)) : '';

    // Add a footer for post
    $account = user_load($vars['node']->uid);
    $vars['cyatemplate_postfooter'] = '';
    if (!empty($account->signature)) {
      $postfooter = "<div class='post-footer'>" . $vars['user_picture'] . "<h3>" . check_plain(format_username($account)) . "</h3>";
      $cleansignature = strip_tags($account->signature);
      $postfooter .= "<p>" . check_plain($cleansignature) . "</p>";
      $postfooter .= "</div>";
      $vars['cyatemplate_postfooter'] = $postfooter;
    }
    }
    else {
    $vars['display_submitted'] = FALSE;
    $vars['submitted'] = '';
    $vars['user_picture'] = '';
    }

    // Remove Add new comment from teasers on frontpage

    if ($vars['is_front']) {
        unset($vars['content']['links']['comment']['#links']['comment-add']);
        unset($vars['content']['links']['comment']['#links']['comment_forbidden']);
        /*if( isset($node_theme['nodes']) && isset($node_theme['nodes'][$node->nid]) && isset($node_theme['nodes'][$node->nid]['field_categories']) ) {
            $field_categories = $node_theme['nodes'][$node->nid]['field_categories'];
            $field_categories['#label_display'] = 'hidden';
            unset($field_categories['#title']);
            $vars['categories'] = $field_categories;
        }*/
        if( isset($node->field_image) && !empty( $node->field_image ) ) {
            $vars['image_url'] = file_create_url($node->field_image[LANGUAGE_NONE][0]['uri']);
        }
        $vars['postID'] = $node->nid;
        $vars['price'] = isset($node->price) ? $node->price : 0;
        $vars['user'] = theme('username', array('account' => $node));
        $results = db_query('SELECT nid, cid, last_comment_timestamp, last_comment_name, last_comment_uid, comment_count FROM {node_comment_statistics} WHERE nid IN (:nid)', array(':nid' => $node->nid));
        $vars['created'] = date('l, jS F Y', $node->created);
        $comment = $results->fetchAssoc();
        $vars['comment_count'] = $comment['comment_count'];

    }

}

/**
 * Format submitted by in comments
 */
function cyatemplate_preprocess_comment(&$vars) {
  $comment = $vars['elements']['#comment'];
  $node = $vars['elements']['#node'];
  $vars['created']   = format_date($comment->created, 'custom', 'd M Y');
  $vars['changed']   = format_date($comment->changed, 'custom', 'd M Y');
  $vars['submitted'] = t('By @username on !datetime at about @time.', array('@username' => strip_tags(theme('username', array('account' => $comment))), '!datetime' => $vars['created'], '@time' => format_date($comment->created, 'custom', 'H:i')));
}

/**
 * Change button to Post instead of Save
 */

function cyatemplate_form_comment_form_alter(&$form, &$form_state, &$form_id) {
 $form['actions']['submit']['#value'] = t('Post');
 $form['comment_body']['#after_build'][] = 'configure_comment_form';
}

function configure_comment_form(&$form) {
  $form['und'][0]['format']['#access'] = FALSE;
  return $form;
}

define('_THEME_PATH', path_to_theme());
define('_FRONT_URL', $GLOBALS['base_url']);
if( !defined('_THEME_URL') ){
    global $base_url;
    define('_THEME_URL', implode("/", [$base_url, _THEME_PATH]) );
}
if( !defined('LIBRARIES_PATH') ) {
    define('LIBRARIES_PATH', dirname(dirname(__DIR__)) . '/libraries');
}
if( !defined('IS_AJAX') ){
    define('IS_AJAX', !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
}
if( !defined('PICTURE_DEFAULT') ) {
    define("PICTURE_DEFAULT", _THEME_URL . "/assets/images/default_profile.png");
}

function cyatemplate_preprocess_page(&$vars) {
    $term_voca = taxonomy_vocabulary_machine_name_load('categories');
    if( !empty( $term_voca ) ) {
        $list_categories = '';
        $tree = taxonomy_get_tree($term_voca->vid);
        foreach ($tree as $key => $item){
            $list_categories .= "<li class=\"\"><a class=\"\" href=\"".url('search/task')."?cat={$item->tid}\">{$item->name}</a></li>";
        }
        $vars['list_categories'] = $list_categories;
    }
    if( user_is_logged_in() ) {
        global $user;
        $file_picture = file_load($user->picture);
        $picture_url = PICTURE_DEFAULT;
        if ($file_picture) {
            $file_uri = file_create_url($file_picture->uri);
            if (file_exists(drupal_realpath($file_picture->uri))) {
                $picture_url = $file_uri;
            }
        }
        $vars['user_picture'] = $picture_url;
    }
  if (isset($vars['node']->type)) {
    $vars['theme_hook_suggestions'][] = 'page__' . $vars['node']->type;
  }
}

/**
 * @author: Richard
 * Override render tag button
 * Returns HTML for a button form element.
 *
 * @param $variables
 *   An associative array containing:
 *   - element: An associative array containing the properties of the element.
 *     Properties used: #attributes, #button_type, #name, #value.
 *
 * @ingroup themeable
 */
function cyatemplate_button($variables) {
    $element = $variables['element'];
    $element['#attributes']['type'] = 'submit';
    element_set_attributes($element, array('id', 'name', 'value'));

    $element['#attributes']['class'][] = 'form-' . $element['#button_type'];
    if (!empty($element['#attributes']['disabled'])) {
        $element['#attributes']['class'][] = 'form-button-disabled';
    }
    return '<button' . drupal_attributes($element['#attributes']) . ' >'.$element['#value'].'</button>';
}


function cyatemplate_js_alter(&$js){
    if( isset($js['misc/jquery.js']) ){
        $js['misc/jquery.js']['version'] = '1.12.4';
        $js['misc/jquery.js']['data'] = _THEME_PATH . "/assets/js/jquery-1.12.4.min.js";
    }
    if( isset($js['misc/jquery.form.js']) ){
        $js['misc/jquery.form.js']['version'] = '4.2.1';
        $js['misc/jquery.form.js']['data'] = _THEME_PATH . "/assets/js/jquery.form.min.js";
    }
}


/*
function test(){
    require_once LIBRARIES_PATH . '/includes/get-ip.php';
    require_once LIBRARIES_PATH.'/test.php';
}*/
#test();
/*require_once LIBRARIES_PATH . '/includes/common.php';

function cyatemplate_ajax_render_alter($commands){
    #var_dump(__LINE__, __FILE__);print_r( $commands );exit;
    $command = [];
    if( count($commands) > 1 ){
        #unset($commands[0]);
        $command = $commands[1];
        if( isset($command['status_code']) ) unset($commands[1]);
    }elseif( count($commands) == 1 ){
        $command = $commands[0];
        if( isset($command['status_code']) ) unset($commands[0]);
    }else{

    }#print_r( headers_list() );
    if( array_key_exists( 'status_code', $command ) ) {
        $response = send_response_json($command, $command['status_code'], $command['message']);
        #print_r( headers_list() );
        $commands[1] = $response;
        return $commands;
    }

    return $commands;
}*/
require_once LIBRARIES_PATH . '/includes/common.php';
require_once _THEME_PATH . '/includes/pager.php';

if( isset($js['misc/jquery.form.js']) ){
    $js['misc/jquery.form.js']['data'] = path_to_theme() . "/assets/js/jquery.form.js";
}
