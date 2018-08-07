<?php
/**
 * Created by PhpStorm.
 * User: richard
 * Date: 7/6/18
 * Time: 2:35 PM
 */

require_once dirname(__DIR__ ) . '/vendor/autoload.php';
require_once dirname(__DIR__ ) . '/includes/get-ip.php';

function getErrorMessage($error){
    $arrMessage = [
        'missing-input-secret' => 'Captcha: The secret parameter is missing.',
        'invalid-input-secret' => 'Captcha: The secret parameter is invalid or malformed.',
        'missing-input-response'  => 'Captcha: The response parameter is missing.',
        'invalid-input-response'  => 'Captcha: The response parameter is invalid or malformed.',
        'bad-request'  => 'Captcha: The request is invalid or malformed.',
    ];
    if( array_key_exists($error, $arrMessage) ){
        return $arrMessage[$error];
    }else{
        return $arrMessage['bad-request'];
    }
}

/**
 * @param $secret
 * @param $response
 * @param $ip
 * @return array|bool
 */
function verification_captcha($secret, $response){
    $recaptcha = new \ReCaptcha\ReCaptcha($secret);
    $remoteIP = get_real_ip();
    $res = $recaptcha->verify($response, $remoteIP);
    if( !$res->isSuccess() ) {
        $error = $res->getErrorCodes();
        $error = array_shift($error);
        return getErrorMessage($error);
    }
    return true;
}