<h2><?php echo t('Applying Taskers:'); ?></h2>
<div class="row">
<?php
if (!empty($tasker_list)) {
    global $base_url;
    foreach ($tasker_list as $tasker) {
        $info = user_load($tasker['uid']);
        if (!empty($info->picture)) {
            $pictute_url = file_create_url($info->picture->uri);
        } else {
            $pictute_url = $base_url . "/themes/bartik/logo.png";
        }
        ?>
        <div class="col-md-2">
            <div><img src="<?php echo $pictute_url; ?>"></div>
            <div><?php echo $info->name; ?></div>
            <div><?php echo $tasker['price']; ?></div>
            <?php if ($is_poster && !$node_closed) { ?>
                <div>
                    <button class="btn btn-primary approve-task" data-uid="<?php echo $tasker['uid']; ?>"
                        data-price="<?php echo $tasker['price']; ?>" data-name="<?php echo $info->name; ?>" data-toggle="modal"
                        data-target="#approve-task"><?php echo t('Approve'); ?>
                    </button>
                </div>
            <?php } ?>
        </div>
    <?php
    }
}
else {
    echo t('No one applied this task.');
}
?>
<input type="hidden" id="original-price" value="<?php echo $original_price; ?>">
</div>