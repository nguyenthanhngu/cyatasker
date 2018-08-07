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
<section>
		<!-- slider -->
		<div id="ei-slider" class="ei-slider"><div class="ei-slider-loading" style="display: none;">Loading</div>
				<ul class="ei-slider-large">
                        <li style="opacity: 1; z-index: 10;">
								<img src="<?php echo _THEME_PATH; ?>/images/1.jpg" alt="image01" style="width: 100%; height: auto; margin-left: 0px; margin-top: -55.875px;">
								<div class="ei-title">
										<h2 style="opacity: 1; display: block; margin-right: 0px;">Get more jobs done</h2>
										<h3 style="opacity: 1; display: block; margin-right: 0px;">to earn more money</h3>
										<h3 style="opacity: 1; display: block; margin-right: 0px;"><a class="btn_sli" href="<?php print _FRONT_URL; ?>/search/task">Get Started Now</a></h3>
								</div>

						</li>
						<li style="opacity: 0; z-index: 1;">
								<img src="<?php echo _THEME_PATH;?>/images/2.jpg" alt="image02" style="width: 100%; height: auto; margin-left: 0px; margin-top: -57.5625px;">
								<div class="ei-title">
									<h2 style="opacity: 0; margin-right: 0px; display: block;">Get more jobs done</h2>
									<h3 style="opacity: 0; margin-right: 0px; display: block;">to earn more money</h3>
									<h3 style="opacity: 0; margin-right: 0px; display: block;"><a class="btn_sli" href="<?php print _FRONT_URL; ?>/search/task">Get Started Now</a></h3>
								</div>

						</li>
						<li style="opacity: 0; z-index: 1;">
								<img src="<?php echo _THEME_PATH;?>/images/3.jpg" alt="image03" style="width: 100%; height: auto; margin-left: 0px; margin-top: -52.5px;">
								<div class="ei-title">
									<h2 style="opacity: 0; margin-right: 0px; display: block;">Get more jobs done</h2>
									<h3 style="opacity: 0; margin-right: 0px; display: block;">to earn more money</h3>
									<h3 style="opacity: 0; margin-right: 0px; display: block;"><a class="btn_sli" href="#/">Get Started Now</a></h3>
								</div>

						</li>
						<li style="opacity: 0; z-index: 1;">
								<img src="<?php echo _THEME_PATH;?>/images/4.jpg" alt="image04" style="width: 100%; height: auto; margin-left: 0px; margin-top: -99.1875px;">
								<div class="ei-title">
									<h2 style="opacity: 0; margin-right: 0px; display: block;">Get more jobs done</h2>
									<h3 style="opacity: 0; margin-right: 0px; display: block;">to earn more money</h3>
									<h3 style="opacity: 0; margin-right: 0px; display: block;"><a class="btn_sli" href="#/">Get Started Now</a></h3>
								</div>

						</li>

				</ul><!-- ei-slider-large -->
				<ul class="ei-slider-thumbs" style="max-width: 600px; display: block;">
						<li class="ei-slider-element" style="max-width: 150px; width: 25%; left: 0px;">Current</li>
						<li style="max-width: 150px; width: 25%;"><a href="#">Slide 1</a><img src="<?php echo _THEME_PATH;?>/images/thumbs/1.jpg" alt="thumb01"></li>
						<li style="max-width: 150px; width: 25%;"><a href="#">Slide 2</a><img src="<?php echo _THEME_PATH;?>/images/thumbs/2.jpg" alt="thumb02"></li>
						<li style="max-width: 150px; width: 25%;"><a href="#">Slide 3</a><img src="<?php echo _THEME_PATH;?>/images/thumbs/3.jpg" alt="thumb03"></li>
						<li style="max-width: 150px; width: 25%;"><a href="#">Slide 4</a><img src="<?php echo _THEME_PATH;?>/images/thumbs/4.jpg" alt="thumb04"></li>
				</ul><!-- ei-slider-thumbs -->
		</div><!-- ei-slider -->

		<!-- end slider -->
		<!-- post -->
		<div class="bcontent post">
			<div class="container-fluid">
				<div class="row">
						<h3 class="section-title center wow fadeInUp " data-wow-duration="500ms" data-wow-delay="100ms" style="visibility: visible; animation-duration: 500ms; animation-delay: 100ms; animation-name: fadeInUp;">
							See what others are getting done
							<br>
							<small class="mbr-section-subtitle">-----</small>
						</h3>

				</div>
				<div class="section-head">

					<div class="tab-content" id="myTabContent">
					  <div class="tab-pane show active" id="week" role="tabpanel" aria-labelledby="in-week-tab">
							<section id="pinBoot" style="height: 835px;">
                                <?php print render($page['content']); ?>
					        </section>
						</div>

					</div>

					<a class="nav-link btn-transparent signbuttons btn btn-primary" href="<?php print url('search/task') ?>" style="display: block;font-size: 15px; color:#fff !important;width: 186px;margin: 0 auto;text-align: center;border: 1px solid #fff;">See more tasks</a>


				</div>

			</div>
		</div>
		<!-- end post -->
	</section>

<?php include $directory . '/views/master-layout/footer.tpl.inc'; ?>
