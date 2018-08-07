<div class="notifications">
    <div id="notifications">
    <?php
    if (!empty($notifications)) {
        foreach ($notifications as $notification) {
            ?>
            <div class="<?php echo ($notification->status == 0) ? "new" : "old"; ?>">
                <a href="<?php echo $notification->link; ?>" target="_blank"><?php echo $notification->content; ?></a>
            </div>
            <?php
        }
    }
    ?>
    </div>
    <div><?php print render($load_more_form); ?></div>
</div>