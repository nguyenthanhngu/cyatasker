<?php if ($page['header']): ?>
  <?php print render($page['header']); ?>
<?php endif; ?>


<header class="navbar-top">

  <div class="b-fluid">
    <div class="row">
      <div class="col-md-2">
        <div class="side-nav-panel-left">
          <a href="<?php echo _FRONT_URL;?>" data-activates="slide-out-left" class="side-nav-left"><i class="fa fa-bars"></i></a>
          <a class="navbar-caption logo" href="<?php echo _FRONT_URL;?>">
            <img class="logo" src="<?php echo _THEME_URL; ?>/images/cyatasker-logo.png" width="100">
          </a>
        </div>
      </div>
      <div class="col-md-3">
        <div class="search">
            <?php print render($page['form_search']); ?>
        </div>
      </div>
      <div class="col-md-7">
          <div class="menu-top">
            <?php print render($page['header_menu']); ?>
            <?php if (user_is_logged_in()) { ?>

              <div class="dropdown region region-header-menu">
                <button class="dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img src="<?php print $user_picture; ?>" class="img-responsive picture-avatar" alt=""> My account
                </button>
                <div class="dropdown-menu block block-menu" aria-labelledby="dropdownMenuButton">
                  <li class="first leaf"><a href="/user/profile" title="">Profile</a></li>
                  <li class="last leaf"><a href="/user/logout" title="">Sign out</a></li>
                </div>
              </div>
            <?php
            }
            ?>

            <a class="btn brt post-a-task" href="<?php print _FRONT_URL; ?>/my-post">Post a task</a>
            <a class="btn brt bro" href="<?php print _FRONT_URL; ?>/search/task">Browse tasks</a>

            <?php if ($main_menu): ?>
              <?php print theme('links__system_main_menu', array(
                'links' => $main_menu,
                'attributes' => array(
                  'id' => 'exCollapsingNavbar',
                  'class' => array('links', 'nav-dropdown pull-xs-right nav navbar-nav navbar-toggleable-sm'),
                ),
              )); ?>
            <?php endif; ?>

          </div>
      </div>
    </div>
  </div>
</header>
