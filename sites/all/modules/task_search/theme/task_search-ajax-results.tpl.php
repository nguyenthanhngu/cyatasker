<?php
global $base_url;

?>
<?php if ($search_results) : ?>

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

<?php else: ?>
    <h2><?php print t('Not found');?></h2>
    <?php #print search_help('search#noresults', drupal_help_arg()); ?>
<?php endif; ?>
