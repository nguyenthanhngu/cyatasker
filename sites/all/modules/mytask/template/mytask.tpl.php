<?php global $base_url; ?>
<div class="my-tasks">
    <?php print render($filter_form); ?>
    <table id="table-my-task" class="table">
        <thead>
        <tr>
            <th><?php echo t("Title"); ?></th>
            <th><?php echo t("Amount"); ?></th>
            <th><?php echo t("Status"); ?></th>
            <th><?php echo t("Start date"); ?></th>
        </tr>
        </thead>
        <tbody>
        <?php
        if (!empty($my_tasks)) {
            foreach ($my_tasks as $task) {
                echo "<tr><td><a href='" . $base_url . "/task/" . $task->id . "' target='_blank'>" . $task->title . "</a></td><td>" .
                    $task->price . "</td><td>" . $task->status . "</td><td>" . date("d/m/Y", $task->created) .
                    "</td></tr>";
            }
        }
        ?>
        </tbody>
    </table>
    <div><?php print render($load_more_form); ?></div>
</div>