<?php
/**
 * Created by PhpStorm.
 * User: richard
 * Date: 7/6/18
 * Time: 3:57 PM
 */

require_once LIBRARIES_PATH.'/vendor/autoload.php';
$giCity = geoip_open("/Users/richard/Documents/BF/cyatasker/sites/all/libraries/GeoLiteCity.dat", GEOIP_STANDARD);
#print_r($giCity);
$ip ="203.205.32.208";
#echo "<pre>";print_r( $_SERVER );echo"</pre>";
#$ip ="127.0.0.1";
$record = geoip_record_by_addr($giCity, $ip);
#list($countrycode, $region) = geoip_region_by_addr($giCity, $ip);

#echo "<pre>";print_r( $region );echo"</pre>";
echo "Getting Country and City detail by IP Address <br /><br />";
echo "IP: " . $ip . "<br /><br />";

echo "Country Code: " . $record->country_code .  "<br />" .
    "Country Code3: " . $record->country_code . "<br />" .
    "Country Name: " . $record->country_name . "<br />" .
    "Region Code: " . $record->region . "<br />" .
    "Region Name: " . $GEOIP_REGION_NAME[$record->country_code][$record->region] . "<br />" .
    "City: " . $record->city . "<br />" .
    "Postal Code: " . $record->postal_code . "<br />" .
    "Latitude: " . $record->latitude . "<`enter code here`br />" .
    "Longitude: " . $record->longitude . "<br />" .
    "Metro Code: " . $record->metro_code . "<br />" .
    "Area Code: " . $record->area_code . "<br />" ;
#exit;

#require_once LIBRARIES_PATH.'/vendor/autoload.php';
use GeoIp2\Database\Reader;

// This creates the Reader object, which should be reused across
// lookups.
$reader = new Reader('/Users/richard/Documents/BF/cyatasker/sites/all/libraries/GeoLite2-City.mmdb');
#$reader = new Reader('/Users/richard/Documents/BF/cyatasker/sites/all/libraries/GeoLite2-Country.mmdb');

// Use the ->enterprise method to do a lookup in the Enterprise database
$record = $reader->city('203.205.32.208');#192.168.1.29
#echo "<pre>";print_r( $record );echo"</pre>";
print($record->country->isoCode . "\n"); // 'US'
print($record->country->name . "\n"); // 'United States'
print($record->country->names['zh-CN'] . "\n"); // '美国'

print($record->mostSpecificSubdivision->name . "\n"); // 'Minnesota'
print($record->mostSpecificSubdivision->isoCode . "\n"); // 'MN'

print($record->city->name . "\n"); // 'Minneapolis'

print($record->postal->code . "\n"); // '55455'
print($record->location->latitude . "\n"); // 44.9733
print($record->location->longitude . "\n"); // -93.2323
exit;