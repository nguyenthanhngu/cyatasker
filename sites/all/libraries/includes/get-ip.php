
<?php
/**
 * Created by PhpStorm.
 * User: richard
 * Date: 7/6/18
 * Time: 2:16 PM
 */

if( !function_exists('isValidIpAddress') ) {
    function isValidIpAddress($ip)
    {
        $flags = FILTER_FLAG_IPV4 |
            FILTER_FLAG_IPV6 |
            FILTER_FLAG_NO_PRIV_RANGE |
            FILTER_FLAG_NO_RES_RANGE;
        if (filter_var($ip, $flags) === false) {
            return false;
        }
        return true;
    }
}
if( !function_exists('get_real_ip') ) {
    function get_real_ip() {
        static $ipAddress;
        if( !empty($ipAddress) ) {
            // Check for shared internet/ISP IP
            if ( !empty($_SERVER['HTTP_CLIENT_IP']) && isValidIpAddress($_SERVER['HTTP_CLIENT_IP']) ) {
                $ipAddress = $_SERVER['HTTP_CLIENT_IP'];
                $_SERVER['REMOTE_ADDR'] = $ipAddress;
                return $ipAddress;
            }
            // Check for IPs passing through proxies
            if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                // Check if multiple IP addresses exist in var
                $iplist = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
                foreach ($iplist as $ip) {
                    if (isValidIpAddress($ip) ) {
                        $ipAddress = $ip;
                        $_SERVER['REMOTE_ADDR'] = $ipAddress;
                        return $ipAddress;
                    }
                }
            }
        }
        if (!empty($_SERVER['HTTP_X_FORWARDED']) && isValidIpAddress($_SERVER['HTTP_X_FORWARDED'])) {
            $ipAddress = $_SERVER['HTTP_X_FORWARDED'];
            $_SERVER['REMOTE_ADDR'] = $ipAddress;
            return $ipAddress;
        }
        if (!empty($_SERVER['HTTP_X_CLUSTER_CLIENT_IP']) && isValidIpAddress($_SERVER['HTTP_X_CLUSTER_CLIENT_IP'])) {
            $ipAddress = $_SERVER['HTTP_X_CLUSTER_CLIENT_IP'];
            $_SERVER['REMOTE_ADDR'] = $ipAddress;
            return $ipAddress;
        } else if (!empty($_SERVER['HTTP_FORWARDED_FOR']) && isValidIpAddress($_SERVER['HTTP_FORWARDED_FOR'])) {
            $ipAddress = $_SERVER['HTTP_FORWARDED_FOR'];
        } else if (!empty($_SERVER['HTTP_FORWARDED']) && isValidIpAddress($_SERVER['HTTP_FORWARDED'])) {
            $ipAddress = $_SERVER['HTTP_FORWARDED'];
        } else {
            // Return unreliable IP address since all else failed
            $ipAddress = $_SERVER['REMOTE_ADDR'];
        }
        $_SERVER['REMOTE_ADDR'] = $ipAddress;
        return $ipAddress;
    }
}
