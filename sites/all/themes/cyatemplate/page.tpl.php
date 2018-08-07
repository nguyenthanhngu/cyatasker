<?php
/**
 * @file
 * Theme implementation to display a single page.
 *
 * Regions:
 * - $page['header']: Items for the header region.
 * - $page['featured']: Items for the featured region.
 * - $page['highlighted']: Items for the highlighted content region.
 * - $page['help']: Dynamic help text, mostly for admin pages.
 * - $page['content']: The main content of the current page.
 * - $page['sidebar_first']: Items for the first sidebar.
 * - $page['footer']: Items for the footer region.
 *
 * @see template_preprocess()
 * @see template_preprocess_page()
 */
?>
<?php include $directory . '/views/master-layout/header.tpl.inc'; ?>
<section class="main-conte">
  <div class="bcontent post">
    <!-- drupal message error -->
    <div class="clear"></div>
    <div class="container">
      <div class="row">

      </div>
    </div>
    <!-- end drupal message error -->

    <div class="clear"></div>

    <div class="">
      <div class="row">
          <?php
            if(!user_is_logged_in()){
                $classmd2 = "displaynone";
                $classmd10 = "width100";
            }else{
                $classmd2 = "";
                $classmd10 = "";
            }
          ?>
        <div class="col-md-2 <?php echo $classmd2; ?>">
          <?php
          //var_dump($page['sidebar_left']);die;
          print render($page['sidebar_left']); ?>
        </div>
        <div class="col-md-10 sidebar-right <?php echo $classmd10; ?>">
            <?php
            $debug = isset($_REQUEST['debug']) ? $_REQUEST['debug'] : [];
            if($debug) {
                ?>
                <?php if ($show_messages): ?>
                    <?php print $messages; ?>
                <?php endif; ?>
            <?php } ?>
            <?php if ($messages): ?>
                <div id="messages"><div class="section clearfix">
                        <?php print $messages; ?>
                    </div></div> <!-- /.section, /#messages -->
            <?php endif; ?>
          <?php print render($title_prefix); ?>
          <?php if ($title): ?>
            <h1 class="node-title"><?php print $title; ?></h1>
          <?php endif; ?>
          <?php print render($title_suffix); ?>

          <?php if ($action_links): ?>
            <ul class="action-links">
              <?php print render($action_links); ?>
            </ul>
          <?php endif; ?>

          <?php print render($page['content']); ?>
        </div>


      </div>
    </div>

    <div class="clear"></div>

  </div>
</section>

<?php include $directory . '/views/master-layout/footer.tpl.inc'; ?>
