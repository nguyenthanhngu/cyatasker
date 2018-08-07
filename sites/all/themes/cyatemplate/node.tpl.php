<?php
/**
 * @file
 * Theme implementation to display a node.
 *
 * Available variables:
 * - $title: the (sanitized) title of the node.
 * - $content: Node body or teaser depending on $teaser flag.
 * - $picture: The authors picture of the node output from
 *   theme_user_picture().
 * - $date: Formatted creation date (use $created to reformat with
 *   format_date()).
 * - $links: Themed links like "Read more", "Add new comment", etc. output
 *   from theme_links().
 * - $name: Themed username of node author output from theme_username().
 * - $node_url: Direct url of the current node.
 * - $terms: the themed list of taxonomy term links output from theme_links().
 * - $submitted: themed submission information output from
 *   theme_node_submitted().
 *
 * Other variables:
 * - $node: Full node object. Contains data that may not be safe.
 * - $type: Node type, i.e. story, page, blog, etc.
 * - $comment_count: Number of comments attached to the node.
 * - $uid: User ID of the node author.
 * - $created: Time the node was published formatted in Unix timestamp.
 * - $zebra: Outputs either "even" or "odd". Useful for zebra striping in
 *   teaser listings.
 * - $id: Position of the node. Increments each time it's output.
 *
 * Node status variables:
 * - $teaser: Flag for the teaser state.
 * - $page: Flag for the full page state.
 * - $promote: Flag for front page promotion state.
 * - $sticky: Flags for sticky post setting.
 * - $status: Flag for published status.
 * - $comment: State of comment settings for the node.
 * - $readmore: Flags true if the teaser content of the node cannot hold the
 *   main body content.
 * - $is_front: Flags true when presented in the front page.
 * - $logged_in: Flags true when the current user is a logged-in member.
 * - $is_admin: Flags true when the current user is an administrator.
 *
 * @see template_preprocess()
 * @see template_preprocess_node()
 */

#echo"<pre>";var_dump(__FILE__, __LINE__);print_r($field_image);echo"</pre>";exit;
#print_r($node);
if( $is_front ):
?>

    <?php #print render($categories); ?>
    <article id="post-<?php print $postID; ?>" class="col-md-3 white-panel post-item not-map hover-show-map post-<?php print $postID; ?> <?php print $classes; ?> clearfix" <?php print $attributes; ?>>
        <?php if(!empty($image_url)): ?>
            <div class="thum">
                <img src="<?php print $image_url; ?>" alt="<?php print $title; ?>">

            </div>
        <?php endif; ?>
        <div class="item-right">
            <?php if(!empty($title)): ?>
                <h3 class="title"<?php print $title_attributes; ?>>
                    <span class="post-price"><?php print !empty($price) ? '$' . $price : ''; ?></span>
                    <a class="post-title" href="<?php print $node_url; ?>" title="<?php print $title; ?>"><?php print $title; ?></a>
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
                        <a class="post-apply" href="<?php print $node_url; ?>" title="<?php print t('Apply'); ?>"><?php print t('Apply'); ?></a>
                    </div>
                </div>

            <?php endif; ?>
        </div>
        <div class="clearfix"></div>
    </article>
<?php else: ?>

    <div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?>"<?php print $attributes; ?>>
        <?php print render($title_prefix); ?>
        <?php if (!$page): ?>
        <h2<?php print $title_attributes; ?>><a href="<?php print $node_url; ?>"><?php print $title; ?></a></h2>
        <?php endif; ?>
        <?php print render($title_suffix); ?>
        <?php if (!empty($suggest_price_button)) print $suggest_price_button; ?>
        <?php if ($display_submitted): ?>
        <span class="submitted">
        <?php print $submitted; ?>
        </span>
        <?php endif; ?>
        <div class="content clearfix"<?php print $content_attributes; ?>>
        <?php
          // We hide the comments and links now so that we can render them later.
          hide($content['comments']);
          hide($content['links']);
          print render($content);
        ?>
        </div>
        <?php if (!empty($tasker_list)) print $tasker_list; ?>
        <div class="clearfix">
        <?php if (!empty($content['links'])): ?>
            <div class="links"><?php print render($content['links']); ?></div>
        <?php endif; ?>


        <?php if ($page != 0): ?>
          <?php if ($submitted): ?>
              <?php //print $simpleclean_postfooter; ?>
          <?php endif; ?>
        <?php endif; ?>

        <?php if (!empty($content['comments'])):?>
          <?php
            if (isset($node->closed) && $node->closed == 1) {
                unset($content['comments']['comment_form']);
            }
            print render($content['comments']); ?>
        <?php endif; ?>
        </div>
    </div>

<?php endif; ?>
