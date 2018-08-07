<div class="node-visibility">
    <?php if (!empty($set_visibility_form)) print render($set_visibility_form); ?>
    <?php if (!empty($add_users_form)) print render($add_users_form); ?>
    <h2><?php echo t('Members:'); ?></h2>
    <div class="row" id="list-member">
        <?php
        if (!empty($members)) {
            foreach ($members as $member) {
                ?>
                <div class="col-md-2">
                    <div>
                        <img src="<?php echo $member->picture; ?>">
                        <a href="#" class="remove-member" data-user-name="<?php echo $member->name; ?>" data-toggle="modal" data-target="#remove-member">X</a>
                    </div>
                    <div><?php echo $member->name; ?></div>
                </div>
                <?php
            }
        }
        ?>
    </div>
    <?php if (!empty($load_more_form)) print render($load_more_form); ?></div>
    <?php if (!empty($remove_member_theme)) print $remove_member_theme; ?></div>
</div>