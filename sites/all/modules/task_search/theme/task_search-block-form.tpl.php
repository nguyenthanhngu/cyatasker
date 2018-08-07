<?php

/**
 * @file
 * Displays the search form block.
 *
 * Available variables:
 * - $custom_search_form: The complete search form ready for print.
 * - $custom_search: Associative array of search elements. Can be used to print each
 *   form element separately.
 *
 * Default elements within $search:
 * - $custom_search['custom_search_block_form']: Text input area wrapped in a div.
 * - $custom_search['actions']: Rendered form buttons.
 * - $custom_search['hidden']: Hidden form elements. Used to validate forms when
 *   submitted.
 *
 * Modules can add to the search form, so it is recommended to check for their
 * existence before printing. The default keys will always exist. To check for
 * a module-provided field, use code like this:
 * @code
 *   <?php if (isset($custom_search['extra_field'])): ?>
 *     <div class="extra-field">
 *       <?php print $custom_search['extra_field']; ?>
 *     </div>
 *   <?php endif; ?>
 * @endcode
 *
 * @see template_preprocess_custom_search_block_form()
 */
?>
<div class="container-inline">
  <?php print $custom_search_form; ?>
</div>
