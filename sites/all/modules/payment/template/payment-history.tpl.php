<?php
/**
 * @file
 * page payment history
 */
?>
<div class="payment-history">
    <ul class="nav nav-tabs">
        <li class="active show"><a data-toggle="tab" href="#earned"><?php echo t('Earned') ?></a></li>
        <li><a data-toggle="tab" href="#paid"><?php echo t('Paid') ?></a></li>
    </ul>
    <div class="tab-content">
        <div id="earned" class="tab-pane fade in active show">
            <div class="row">
                <div class="col-md-10"><?php print render($earned_history_form); ?></div>
                <div class="col-md-2">
                    <h3><?php echo t("Earned") ?></h3>
                    <div id="earned-amount"><?php echo $total_earned_amount; ?></div>
                </div>
            </div>
            <table id="table-earned-history" class="table">
                <thead>
                <tr>
                    <th><?php echo t("Amount"); ?></th>
                    <th><?php echo t("Done date"); ?></th>
                </tr>
                </thead>
                <tbody>
                <?php
                if (!empty($earned_history)) {
                    foreach ($earned_history as $earned) {
                        echo "<tr><td>" . $earned->amount . "</td><td>" . date("d/m/Y", $earned->updated) . "</td></tr>";
                    }
                }
                ?>
                </tbody>
            </table>
            <div><?php print render($earned_load_more_form); ?></div>
        </div>
        <div id="paid" class="tab-pane fade">
            <div class="row">
                <div class="col-md-10"><?php print render($paid_history_form); ?></div>
                <div class="col-md-2">
                    <h3><?php echo t("Paid") ?></h3>
                    <div id="paid-amount"><?php echo $total_paid_amount; ?></div>
                </div>
            </div>
            <table id="table-paid-history" class="table">
                <thead>
                <tr>
                    <th><?php echo t("Amount"); ?></th>
                    <th><?php echo t("Done date"); ?></th>
                </tr>
                </thead>
                <tbody>
                <?php
                if (!empty($paid_history)) {
                    foreach ($paid_history as $paid) {
                        echo "<tr><td>" . $paid->amount . "</td><td>" . date("d/m/Y", $paid->updated) . "</td></tr>";
                    }
                }
                ?>
                </tbody>
            </table>
            <div><?php print render($paid_load_more_form); ?></div>
        </div>
    </div>
</div>
<?php
drupal_add_js(drupal_get_path('module', 'payment').'/js/jquery.datetimepicker.full.js');
drupal_add_js(drupal_get_path('module', 'payment').'/js/payment.js');
?>