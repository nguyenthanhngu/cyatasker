<div class="task-details">
    <h2><?php echo $task['node']->title; ?></h2>
    <div><?php echo t('Status') . ': ' . t($task['status'])?></div>
    <?php
        if(!empty($task['reason'])) {
            echo '<div>' . t('Reason') . ': ' . t($task['reason']) . '</div>';
        }

        if (!empty($task['images'])) {
            $images = drupal_json_decode($task['images']);

            foreach ($images as $image) {
                ?>
                <img src="<?php echo file_create_url($image); ?>"><br>
                <?php
            }
        }
    ?>
    <?php print render($update_task_status_form); ?>
</div>