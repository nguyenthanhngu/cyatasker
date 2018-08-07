<?php
/**
 * Created by PhpStorm.
 * User: richard
 * Date: 7/23/18
 * Time: 4:07 PM
 */

?>
<div id="user-profile-md" class="row user-profile-tyles">
    <div class="col-md-4">
        <div class="profile-sidebar">
            <!-- SIDEBAR USERPIC -->
            <div class="profile-userpic">
                <a href="javascript:;" class="user-picture-avatar" data-target="#modal-user-picture" data-toggle="modal">
                    <img src="<?php print $picture; ?>" class="img-responsive picture-avatar" alt="">
                    <span class="action-edit">
                        <span class="glyphicon glyphicon-camera icon-edit"></span><br>
                        <span class="text-edit"><?php print t('Update'); ?></span>
                    </span>
                </a>

            </div>
            <!-- END SIDEBAR USERPIC -->
            <!-- SIDEBAR USER TITLE -->
            <div class="profile-usertitle">
                <div class="profile-usertitle-name">
                    <?php print $full_name; ?>
                </div>
            </div>
            <!-- END SIDEBAR USER TITLE -->
            <!-- SIDEBAR BUTTONS -->
            <div class="profile-userbuttons">
                <button type="button" class="btn btn-success btn-sm">Follow</button>
                <button type="button" class="btn btn-danger btn-sm">Message</button>
            </div>
            <!-- END SIDEBAR BUTTONS -->
            <!-- SIDEBAR MENU -->
            <div class="profile-usermenu">
                <ul class="nav">
                    <li class="<?php echo current_path() == 'user/profile' ? "active" : "" ?>">
                        <a href="/user/profile">
                            <i class="glyphicon glyphicon-home"></i>
                            Overview </a>
                    </li>
                    <li class="<?php echo current_path() == 'user/change-password' ? "active" : "" ?>">
                        <a href="/user/change-password">
                            <i class="glyphicon glyphicon-user"></i>
                            Change password </a>
                    </li>
                    <li>
                        <a href="/account/my-tasks" target="">
                            <i class="glyphicon glyphicon-ok"></i>
                            Tasks </a>
                    </li>
                </ul>
            </div>
            <!-- END MENU -->
        </div>
    </div>
    <div class="col-md-8">
        <?php if(isset($user_profile_form) && !empty($user_profile_form)) {print $user_profile_form;} ?>
    </div>

</div>

<?php if( isset($user_picture_form) && !empty( $user_picture_form ) ): ?>
    <!-- Modal -->
    <div id="modal-user-picture" class="modal fade" role="dialog">
        <div class="modal-dialog modal-lg">

            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title"><?php print t('Change avatar'); ?></h4>
                </div>
                <div class="modal-body">
                    <div class="picture-content">
                        <div class="cropper-image">
                            <img id="image" src="" />
                        </div>
                        <div class="show-notification">

                        </div>
                        <?php print $user_picture_form; ?>
                    </div>
                </div>
            </div>

        </div>
    </div>
<?php endif; ?>
