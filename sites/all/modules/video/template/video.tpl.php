<div id="player" data-video-id="<?php echo $video_id; ?>"></div>
<div id="video-alert" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <?php echo t('Are you there ?') ?>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal" id="video-close">Close</button>
            </div>
        </div>
    </div>
</div>
<?php
drupal_add_js(drupal_get_path('module', 'video') . '/js/video.js'); ?>
