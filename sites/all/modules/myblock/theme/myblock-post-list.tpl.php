<?php
/**
 * Created by PhpStorm.
 * User: richard
 * Date: 6/30/18
 * Time: 10:06 AM
 */

?>

    <div id="myblock-more-tables">
        <table class="col-md-12 table-bordered table-striped table-condensed cf">
                <?php
                $output = '';
                if (count($header)) {
                    $ts = tablesort_init($header);
                    // HTML requires that the thead tag has tr tags in it followed by tbody
                    // tags. Using ternary operator to check and see if we have any rows.
                    $output .= (count($rows) ? ' <thead class="cf"><tr>' : ' <tr>');
                    foreach ($header as $cell) {
                        $cell = tablesort_header($cell, $header, $ts);
                        $output .= _theme_table_cell($cell, TRUE);
                    }
                    // Using ternary operator to close the tags based on whether or not there are rows
                    $output .= (count($rows) ? " </tr></thead>\n" : "</tr>\n");
                }
                // Format the table rows:
                if (count($rows)) {
                    $output .= "<tbody>\n";
                    $flip = array('even' => 'odd', 'odd' => 'even');
                    $class = 'even';
                    foreach ($rows as $number => $row) {
                        // Check if we're dealing with a simple or complex row
                        if (isset($row['data'])) {
                            $cells = $row['data'];
                            $no_striping = isset($row['no_striping']) ? $row['no_striping'] : FALSE;

                            // Set the attributes array and exclude 'data' and 'no_striping'.
                            $attributes = $row;
                            unset($attributes['data']);
                            unset($attributes['no_striping']);
                        }
                        else {
                            $cells = $row;
                            $attributes = array();
                            $no_striping = FALSE;
                        }
                        if (count($cells)) {
                            // Add odd/even class
                            if (!$no_striping) {
                                $class = $flip[$class];
                                $attributes['class'][] = $class;
                            }

                            // Build row
                            $output .= ' <tr' . drupal_attributes($attributes) . '>';
                            $i = 0;
                            foreach ($cells as $cell) {
                                $array_cell['data-title'] = $header[$i]['data'];
                                $cell = tablesort_cell($cell, $header, $ts, $i++);
                                $array_cell['data'] = $cell;
                                $array_cell['class'] = 'column-'.($number + $i);
                                $output .= _theme_table_cell($array_cell);
                            }
                            $output .= " </tr>\n";
                        }
                    }
                    $output .= "</tbody>\n";
                }
                echo $output;
                ?>
        </table>
    </div>
<div class="clearfix"></div>
<div class="pagination-post-list">
<?php print $pager; ?>
</div>
