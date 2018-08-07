<?php global $base_url; ?>
<div class="refered-emails">
    <table id="table-refered-emails" class="table">
        <thead>
        <tr>
            <th><?php echo t("Sender"); ?></th>
            <th><?php echo t("Refered Email"); ?></th>
            <th><?php echo t("Date"); ?></th>
        </tr>
        </thead>
        <tbody>
        <?php
        if (!empty($refered_emails)) {
            foreach ($refered_emails as $refered_email) {
                echo "<tr><td><a href='" . $base_url . "/user/" . $refered_email->uid . "' target='_blank'>" . $refered_email->name . "</a></td><td>" .
                    $refered_email->email . "</td><td>" . date("d/m/Y", $refered_email->created) . "</td></tr>";
            }
        }
        ?>
        </tbody>
    </table>
    <div><?php print render($load_more_form); ?></div>
</div>