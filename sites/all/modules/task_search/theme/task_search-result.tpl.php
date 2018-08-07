<?php

/**
 * @file
 * Default theme implementation for displaying a single search result.
 *
 * This template renders a single search result and is collected into
 * search-results.tpl.php. This and the parent template are
 * dependent to one another sharing the markup for definition lists.
 *
 * Available variables:
 * - $url: URL of the result.
 * - $title: Title of the result.
 * - $snippet: A small preview of the result. Does not apply to user searches.
 * - $info: String of all the meta information ready for print. Does not apply
 *   to user searches.
 * - $info_split: Contains same data as $info, split into a keyed array.
 * - $module: The machine-readable name of the module (tab) being searched, such
 *   as "node" or "user".
 * - $title_prefix (array): An array containing additional output populated by
 *   modules, intended to be displayed in front of the main title tag that
 *   appears in the template.
 * - $title_suffix (array): An array containing additional output populated by
 *   modules, intended to be displayed after the main title tag that appears in
 *   the template.
 *
 * Default keys within $info_split:
 * - $info_split['type']: Node type (or item type string supplied by module).
 * - $info_split['user']: Author of the node linked to users profile. Depends
 *   on permission.
 * - $info_split['date']: Last update of the node. Short formatted.
 * - $info_split['comment']: Number of comments output as "% comments", %
 *   being the count. Depends on comment.module.
 * - $info_split['upload']: Number of attachments output as "% attachments", %
 *   being the count. Depends on upload.module.
 *
 * Other variables:
 * - $classes_array: Array of HTML class attribute values. It is flattened
 *   into a string within the variable $classes.
 * - $title_attributes_array: Array of HTML attributes for the title. It is
 *   flattened into a string within the variable $title_attributes.
 * - $content_attributes_array: Array of HTML attributes for the content. It is
 *   flattened into a string within the variable $content_attributes.
 *
 * Since $info_split is keyed, a direct print of the item is possible.
 * This array does not apply to user searches so it is recommended to check
 * for its existence before printing. The default keys of 'type', 'user' and
 * 'date' always exist for node searches. Modules may provide other data.
 * @code
 *   <?php if (isset($info_split['comment'])) : ?>
 *     <span class="info-comment">
 *       <?php print $info_split['comment']; ?>
 *     </span>
 *   <?php endif; ?>
 * @endcode
 *
 * To check for all available data within $info_split, use the code below.
 * @code
 *   <?php print '<pre>'. check_plain(print_r($info_split, 1)) .'</pre>'; ?>
 * @endcode
 *
 * @see template_preprocess()
 * @see template_preprocess_task_search_result()
 * @see template_process()
 */

/*print_r(getimagesize($image_url));
$ratio = 1.6;
$attributes_image = getimagesize($image_url);
if( !empty($attributes_image) ){
    $width = $attributes_image[0];
    $height = $attributes_image[1];
}*/#$image_url = '';
?>
<li id="post-<?php print $postID; ?>" class="post-item not-map hover-show-map post-<?php print $postID; ?> <?php print $classes; ?> clearfix" <?php print $attributes; ?>>
    <?php if(!empty($image_url)): ?>
        <div class="item-left">
            <div class="image" style="background-image: url(<?php print $image_url; ?>)">
            </div>
        </div>
    <?php endif; ?>
    <div class="item-right">
        <?php if(!empty($title)): ?>
        <h3 class="title"<?php print $title_attributes; ?>>
            <span class="post-price"><?php print !empty($price) ? '$' . $price : ''; ?></span>
            <a class="post-title" href="<?php print $url; ?>" title="<?php print $title; ?>"><?php print $title; ?></a>
        </h3>
        <address><i class="fas fa-map-marked-alt"></i> <?php print $address; ?></address>
        <div class="row post-right-content">
            <div class="col-md-8 pleft">
                <div class="post-created"><span class="glyphicon glyphicon-calendar"></span> <span><?php print $created; ?></span></div>
                <div class="post-author"><i class="fas fa-user-tie"></i> <?php print $user; ?></div>
                <div class="open-comment">
                    <span class="new-task-list-item__status">Open</span>
                    <span class="new-task-list-item__bids"><?php print $comment_count; ?> offers</span>
                </div>
            </div>
            <div class="col-md-4 pright">
                <a class="post-apply" href="<?php print $url; ?>" title="<?php print t('Apply'); ?>"><?php print t('Apply'); ?></a>
            </div>
        </div>

        <?php endif; ?>
    </div>
    <div class="clearfix"></div>
    <div class="line"></div>
</li>
