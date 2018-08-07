<footer>
  <div class="fcont">

    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <h3>Company</h3>
          <ul class="">
            <li class="">
              <a class="" href="#/">About Us</a>
            </li>
            <li class="">
              <a class="" href="#/">Careers</a>
            </li>
            <li class="">
              <a class="" href="#/">Terms & conditions</a>
            </li>
            <li class="">
              <a class="" href="#/">Blog</a>
            </li>
            <li class="">
              <a class="" href="#/">Contact Us</a>
            </li>
            <li class="">
              <a class="" href="#/">Privacy policy</a>
            </li>
          </ul>
        </div>
        <div class="col-md-3">
          <h3>Membership</h3>
          <ul class="">
            <li class="">
              <a class="" href="#/">Post a task</a>
            </li>
            <li class="">
              <a class="" href="#/">Browse tasks </a>
            </li>
            <li class="">
              <a class="" href="#/">Login</a>
            </li>
            <li class="">
              <a class="" href="#/">Support</a>
            </li>
            <li class="">
              <a class="" href="#/">Merchandise</a>
            </li>
          </ul>
        </div>
        <div class="col-md-3">
          <h3>Categories</h3>
            <?php if(isset($list_categories) && !empty($list_categories)): ?>
              <ul class="">
                <?php print $list_categories; ?>
              </ul>
            <?php endif; ?>
        </div>
        <div class="col-md-3">
          <div class="newsletter">
            <h2>Newsletter</h2>

              <p>Subscribe to our weekly Newsletter and stay tuned.</p>

              <form action="" method="post">
                  <div class="input-prepend"><span class="add-on"><i class="icon-envelope"></i></span>
                      <input type="text" id="" name="" placeholder="your@email.com">
                      <input type="submit" value="Subscribe Now!" class="btn btn-large" />
                  </div>

            </form>
          </div>
          <div class="social-links-blog">
            <a target="_blank" href="https://www.facebook.com/viber/" class="s-link facebook-link"><i class="fab fa-facebook-f"></i></a>
            <a target="_blank" href="https://twitter.com/Viber" class="s-link twitter-link"><i class="fab fa-twitter"></i></a>
            <a target="_blank" href="https://www.instagram.com/viber/" class="s-link instagram-link"><i class="fab fa-instagram"></i></a>
            <a target="_blank" href="https://chats.viber.com/viber" class="s-link viber-link"><i class="fab fa-viber"></i></a>
            <a target="_blank" href="https://www.linkedin.com/company/rakuten-viber" class="s-link linkedin-link"><i class="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>

    </div>
  </div>
  <div class="fe">
    <?php if ($page['footer']): ?>
      <div class="container">
        <div class="row">
          <?php print render($page['footer']); ?>
        </div>
      </div>
    <?php endif; ?>
    
  </div>
</footer>

<!-- MOBILE MENU side nav left-->
<div class="side-nav-panel-left">
  <ul id="slide-out-left" class="side-nav side-nav-panel collapsible">
    <li><a href="">LOGO</a></li>
    <li class="li-top"><a href="#"><i class="fa fa-home"></i>Home</a></li>
    <li><a href="#"><i class="fa fa-tasks"></i>Task</a></li>
    <li><a href="#"><i class="fa fa-product-hunt"></i>Project</a></li>
    <li><a href="#"><i class="fa fa-user"></i>People</a></li>
    <li><a href="#"><i class="fa fa-search"></i>Search</a></li>
  </ul>
</div>
<!-- MOBILE MENU end side nav left-->
