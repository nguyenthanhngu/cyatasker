<?php
global $base_url;

?>

<div class="row row-search">
    <div class="col-md-5">
        <h1 class="title search-title"><?php echo t('Browse tasks'); ?></h1>
    </div>
    <div class="col-md-7">
        <div class="search-advance">
            <?php print render($task_search_advance); ?>
        </div>
    </div>
</div>

<div class="row search-task-found">
    <?php if ($search_results) : ?>
    <?php
    if( IS_AJAX ){
        ob_get_clean();
        ob_end_clean();
        ob_start();
    }
    ?>
    <div class="col-md-5 search-task-list list-item-map" data-simplebar="">
        <div class="">
            <ul>
                <?php print $search_results; ?>
            </ul>
        </div>
    </div>
    <div class="col-md-7 search-task-map">
        <div class="content-search-map">
            <div id="map">

            </div>
        </div>
    </div>
    <div class="clearfix"></div>
    <div class="posts-pagination"><?php print $pager; ?></div>
    <?php
    if( IS_AJAX ){
        echo drupal_json_encode( send_response_json(['html' => ob_get_clean(), 'locations' => $locations], 201, t('Success')) );
        exit;
    }
    ?>
    <?php else: ?>
        <h2 class="tilte-not-found"><?php print t('Not found');?></h2>
        <?php
        if( IS_AJAX ){
            ob_get_clean();
            ob_end_clean();
            ob_start();
            echo drupal_json_encode( send_response_json(['html' => t('Not found')], 201, t('Not found')) );
            exit;
        }
        ?>
        <?php #print search_help('search#noresults', drupal_help_arg()); ?>
    <?php endif; ?>
</div>


