<?php

class Curl
{
    protected static $userAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:38.0) Gecko/20100101 Firefox/38.0";

    public $params = [
        'error' => false,
        'cookie_file' => false,
        'user_agent' => null,
    ];

    public function __construct($params = [])
    {
        $this->params = (object)array_merge($this->params, $params);

        if (empty ($this->params->user_agent)) $this->params->user_agent = self::$userAgent;
    }

    public function get($url = null, $headers = [], $info = false)
    {
        $response = false;

        if (!empty($url)) {

            if (!$this->params->cookie_file) {
                $cookieFile = parse_url($url)['host'] . '.txt';
            } else {
                $cookieFile = $this->params->cookie_file;
            }

            $ch = curl_init($url);

            curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile);
            curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile);
            curl_setopt($ch, CURLOPT_REFERER, $url);

            curl_setopt($ch, CURLOPT_AUTOREFERER, true);
            curl_setopt($ch, CURLOPT_USERAGENT, $this->params->user_agent);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_ENCODING, "");
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

            $request = curl_exec($ch);

            if (!$info && !$this->params->error && $request !== false) {
                $response = $request;
            } elseif ($request === false && $this->params->error) {
                $response = [
                    'error' => curl_getinfo($ch),
                    'html' => '<h1 style="color: red;">?????? cURL</h1>'
                ];
            } elseif ($info) {
                $response = [
                    'html' => $request,
                    'info' => curl_getinfo($ch)
                ];
            }
        }
        return $response;
    }

    public function post($url = null, $arrData = [], $headers = [], $info = false)
    {
        $response = false;

        if (!empty ($url) && !empty ($arrData)) {
            if (!$this->params->cookie_file) {
                $cookieFile = parse_url($url)['host'] . '.txt';
            } else {
                $cookieFile = $this->params->cookie_file;
            }

            $ch = curl_init($url);

            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, is_array($arrData) ? http_build_query($arrData, '', '&') : $arrData);

            curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile);
            curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile);
            curl_setopt($ch, CURLOPT_REFERER, $url);
            curl_setopt($ch, CURLOPT_AUTOREFERER, true);
            curl_setopt($ch, CURLOPT_USERAGENT, $this->params->user_agent);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_ENCODING, "");
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

            $request = curl_exec($ch);

            if (!$info && !$this->params->error && $request !== false) {
                $response = $request;
            } elseif ($request === false && $this->params->error) {
                $response = [
                    'error' => curl_error($ch),
                    'html' => '<h1 style="color: red;"> Ошибка cURL</h1>',
                ];
            } elseif ($info) {
                $response = [
                    'html' => $request,
                    'info' => curl_getinfo($ch)
                ];
            }
        }
        return $response;
    }

    public function design($url = null, $html = null)
    {
        $response = false;

        if (!empty($html) && !empty($url)) {
            $response = preg_replace('/src="(.+)"/', 'src="http://' . parse_url($url)['host'] . '$1"', $html);
            $response = preg_replace('/rel="(.+)" href="(.+)"/', 'rel="$1" href="http://' . parse_url($url)['host'] . '$2"', $response);
            $response = preg_replace('/href="(.+)" rel="(.+)"/', 'href="http://' . parse_url($url)['host'] . '$1" rel="$2"', $response);
        }
        return $response;
    }


    public function getFile($url = null, $file = null)
    {
        if (!empty($url) && !empty($img)) {

            $c = dirname(__FILE__) . '/tmp/' . $file;
            $z = fopen($c, "w");

            $ch = curl_init($url);

            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_ENCODING, "");
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_VERBOSE, 1);
            curl_setopt($ch, CURLOPT_FILE, $z);
            $html = curl_exec($ch);

        }
    }


}
