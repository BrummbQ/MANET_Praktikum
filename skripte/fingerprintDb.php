<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

class fingerprintDb 
{
  /*beispiel für fingerprintArray
  public $fp = array(
    'userAgent'=>'Testeingabe',
    'httpAccept'=>'abc',
    'httpAcceptLanguage'=>'lan',
    'httpAcceptEncoding'=>'enc',
    'httpAcceptCharset'=>'set',
    'cookies'=>0,
    'screenResolution'=>'300x700x899',
    'timezone'=>300,
    'domLocal'=>1,
    'domSession'=>0,
    'ieUserData'=>1,
    'plugins'=>array('Test','Zeugg','Anders'),
    'fonts'=>array('Arial','Times','Times New Roman')
  );*/
  
  private $connect = false;
  private $insertFingerprint = <<<ENDE_INSERT_FINGERPRINT
    insert into fingerprint (userAgent, httpAcceptHeadersId, cookies, screenResolution, timezone, supercookieID)
      select '%s', %d, %d,'%s',%d, id
      from supercookie
      where domLocal=%d and domSession=%d and ieUserData=%d
ENDE_INSERT_FINGERPRINT;

  private $selectOldPlugins = <<<ENDE_SELECT_OLD_PLUGIN
    select wert
    from plugin
    where wert in ('%s')
ENDE_SELECT_OLD_PLUGIN;

  private $insertPlugin = <<<ENDE_INSERT_PLUGIN
    insert into fingerprintPlugin (fingerprintId, pluginId) 
      select %d, id
      from plugin
      where wert in ('%s')
ENDE_INSERT_PLUGIN;

  private $insertFont = <<<ENDE_INSERT_FONT
    insert into fingerprintFont (fingerprintId, fontId) 
      select %d, id
      from font
      where wert in ('%s');
ENDE_INSERT_FONT;
  
  private $insertTime = "insert into fingerprintTime (fingerprintId, time) values (%d, '%s')";
  private $insertPlugins = "insert into plugin (wert) values ('%s')";
  private $insertFonts = "insert ignore into font (wert) values ('%s')";
  private $insertHttpAccept = "insert ignore into httpAccept (httpAccept,charset,language,encoding) values ('%s','%s','%s','%s')";
  
  private $selectFingerprint= <<<ENDE_SELECT_FINGERPRINT
    select userAgent, httpAccept, charset, language, encoding, cookies, screenResolution, timezone, domLocal, domSession, ieUserData
    from fingerprint join supercookie join httpAccept on (fingerprint.supercookieID=supercookie.id and fingerprint.httpAcceptHeadersId = httpAccept.id)
    where fingerprint.id=%d
ENDE_SELECT_FINGERPRINT;
  
  private $selectFingerprintId= <<<ENDE_SELECT_FINGERPRINT_ALL
    select fingerprint.id
    from fingerprint join supercookie join httpAccept on (fingerprint.supercookieID=supercookie.id and fingerprint.httpAcceptHeadersId = httpAccept.id)
    where userAgent='%s' and httpAccept='%s' and charset='%s' and language='%s' and encoding='%s' and cookies=%d and screenResolution='%s' and timezone=%d and domLocal=%d and domSession=%d and ieUserData=%d
ENDE_SELECT_FINGERPRINT_ALL;
  
  private $selectPlugins="select plugin.wert from fingerprintPlugin join plugin on fingerprintPlugin.pluginId=plugin.id where fingerprintId=%d order by plugin.wert";
  private $selectFonts="select font.wert from fingerprintFont join font on fingerprintFont.fontId=font.id where fingerprintId=%d order by font.wert";
  private $selectTime="select time from fingerprintTime where fingerprintId=%d";
  private $selectHttpAccept="select id from httpAccept where httpAccept='%s' and charset='%s' and language='%s' and encoding='%s'";
  
  public function __construct() {
    $dbname="fingerprints";
    $dbhost="localhost";
    $dbuser="fingerprintacc";
    $dbpass="fingerprint";
    if (mysql_connect($dbhost,$dbuser,$dbpass)) {$this->connect = true;mysql_select_db($dbname);}
    else {die("Keine Verbindung möglich: " . mysql_error());};    
  }
  
  public function __destruct() {
    mysql_close();
  }
    
  public function insertFingerprint($fp) {
    $keys = array_keys($fp);
    $arrayDiff = array_diff(array('userAgent','httpAccept','httpAcceptLanguage','httpAcceptEncoding','httpAcceptCharset','cookies','screenResolution','timezone','domLocal','domSession','ieUserData','plugins','fonts'),$keys);
    if ($this->connect and count($arrayDiff) == 0) {
      date_default_timezone_set('Europe/Berlin');
      $timestamp=date('Y-m-d H:i:s');
      //testen ob Fingerprint schon in db ist
      $testFpId = $this->getFingerprintId($fp);
      if ($testFpId > 0) {
	//Aufrufzeit eintragen
	mysql_query( sprintf($this->insertTime, $testFpId, $timestamp));
	return $testFpId;
      } else {
	//HTTPAccept eintragen
	mysql_query(sprintf($this->insertHttpAccept,$fp['httpAccept'],$fp['httpAcceptCharset'],$fp['httpAcceptLanguage'],$fp['httpAcceptEncoding']));
	//nötig, da wenn schon vorhanden die rückgabe-id 0 wäre
	$httpAcceptId = mysql_fetch_array(mysql_query(sprintf($this->selectHttpAccept,$fp['httpAccept'],$fp['httpAcceptCharset'],$fp['httpAcceptLanguage'],$fp['httpAcceptEncoding'])))[0];
	//Neuen Fingerprint einfügen
	mysql_query(sprintf($this->insertFingerprint,$fp['userAgent'],$httpAcceptId,$fp['cookies'],$fp['screenResolution'],$fp['timezone'],$fp['domLocal'],$fp['domSession'],$fp['ieUserData']));
	$fingerprintId = mysql_insert_id();
	//Aufrufzeit eintragen
	mysql_query( sprintf($this->insertTime, $fingerprintId, $timestamp));
	
	//Neue Plugins in die Plugin-Tabelle Einfügen
	$result = mysql_query(sprintf($this->selectOldPlugins, implode("','", $fp['plugins'])));
	$oldPlugins = array();
	while ($line = mysql_fetch_array($result)) {
	  $oldPlugins[] = $line['wert'];
	};
	$pluginsDiff = array_diff($fp['plugins'], $oldPlugins);
	if (count($pluginsDiff) > 0 ) {
	  mysql_query(sprintf($this->insertPlugins, implode("'),('",$pluginsDiff)));
	};

	//Neue Fonts in die Font-Tabelle einfügen
	mysql_query(sprintf($this->insertFonts, implode("'),('",$fp['fonts'])));

	//Verknüpfung für Font und Plugin anlegen
	mysql_query(sprintf($this->insertPlugin, $fingerprintId, implode("','", $fp['plugins'])));
	mysql_query(sprintf($this->insertFont, $fingerprintId, implode("','", $fp['fonts'])));
	mysql_free_result($result);
	return $fingerprintId;
      };
    };
  }
  
  public function getFingerprint($id) {
    if (!($this->connect)) return false;
    $result = mysql_query(sprintf($this->selectFingerprint,$id));
    $fp = array();
    while ($line = mysql_fetch_array($result)) {
      $fp['userAgent']=$line['userAgent'];
      $fp['httpAccept']=$line['httpAccept'];
      $fp['httpAcceptCharset']=$line['charset'];
      $fp['httpAcceptLanguage']=$line['language'];
      $fp['httpAcceptEncoding']=$line['encoding'];
      $fp['cookies']=$line['cookies'];
      $fp['screenResolution']=$line['screenResolution'];
      $fp['timezone']=$line['timezone'];
      $fp['domLocal']=$line['domLocal'];
      $fp['domSession']=$line['domSession'];
      $fp['ieUserData']=$line['ieUserData'];
    };
    mysql_free_result($result);
    
    $fp['plugins'] = $this->getPlugins($id);
    $fp['fonts']= $this->getFonts($id);
    
    return $fp;
  }
  
  public function getFingerprintId($fp) {
    if (!($this->connect)) return false;
    $keys = array_keys($fp);
    $arrayDiff = array_diff(array('userAgent','httpAccept','httpAcceptLanguage','httpAcceptEncoding','httpAcceptCharset','cookies','screenResolution','timezone','domLocal','domSession','ieUserData','plugins','fonts'),$keys);
    if (count($arrayDiff) > 0) return false;
    //alle ID' ermitteln, welche mit den Eigenschaften übereinstimmen
    $result = mysql_query(sprintf($this->selectFingerprintId,$fp['userAgent'],$fp['httpAccept'],$fp['httpAcceptCharset'],$fp['httpAcceptLanguage'],$fp['httpAcceptEncoding'],$fp['cookies'],$fp['screenResolution'],$fp['timezone'],$fp['domLocal'],$fp['domSession'],$fp['ieUserData']));
    while ($line = mysql_fetch_array($result)) {
      $plugins = $this->getPlugins($line[0]);
      $fonts = $this->getFonts($line[0]);
      $arrayPDiff = array_diff($fp['plugins'],$plugins);
      $arrayFDiff = array_diff($fp['fonts'],$fonts);
      if (count($arrayPDiff) == 0 and count($arrayFDiff) == 0) return $line[0];
    };
    mysql_free_result($result);    
    return -1;
  }
  
  private function getPlugins($fpId) {
    $result = mysql_query(sprintf($this->selectPlugins,$fpId));
    $plugins = array();
    while ($line = mysql_fetch_array($result)) {
      $plugins[] = $line['wert'];
    };
    mysql_free_result($result);
    return $plugins;
  }
  
  private function getFonts($fpId) {
    $result = mysql_query(sprintf($this->selectFonts,$fpId));
    $fonts = array();
    while ($line = mysql_fetch_array($result)) {
      $fonts[] = $line['wert'];
    };
    mysql_free_result($result);
    return $fonts;
  }
  
  private function getTimes($fpId) {
    if (!($this->connect)) return false;
    $result = mysql_query(sprintf($this->selectTime,$fpId));
    $times = array();
    while ($line = mysql_fetch_array($result)) {
      $times[] = $line[0];
    };
    mysql_free_result($result);
    return $times;
  }
  
  public function printTimes($fpId) {
    echo '<ol>';
    echo '<li>'.implode('<li>',$this->getTimes($fpId));
    echo '</ol>';
  }
  
  public function printFingerprint($fp) {
    $keys = array_keys($fp);
    $arrayDiff = array_diff(array('userAgent','httpAccept','httpAcceptLanguage','httpAcceptEncoding','httpAcceptCharset','cookies','screenResolution','timezone','domLocal','domSession','ieUserData','plugins','fonts'),$keys);
    if (count($arrayDiff) > 0) return false;
    //Ausgabe erfolgt als HTML-Tabelle
    echo '<table>';
    
    echo '<tr>';
    echo '<td>userAgent</td>';
    echo '<td>'.$fp['userAgent'].'</td>';
    echo '</tr>';
    echo '<tr>';
    echo '<td>httpAcceptHeaders</td>';
    echo '<td>'.$fp['httpAccept'].'; '.$fp['httpAcceptCharset'].'; '.$fp['httpAcceptLanguage'].'; '.$fp['httpAcceptEncoding'].'</td>';
    echo '</tr>';
    echo '<tr>';
    echo '<td>cookies</td>';
    echo '<td>'.$this->yesNo($fp['cookies']).'</td>';
    echo '</tr>';
    echo '<tr>';
    echo '<td>screenResolution</td>';
    echo '<td>'.$fp['screenResolution'].'</td>';
    echo '</tr>';
    echo '<tr>';
    echo '<td>timezone</td>';
    echo '<td>'.$fp['timezone'].'</td>';
    echo '</tr>';
    echo '<tr>';
    echo '<td>supercookies</td>';
    echo '<td>DOM localStorage: '.$this->yesNo($fp['domLocal']).', DOM sessionStorage: '.$this->yesNo($fp['domSession']).', IE userData: '.$this->yesNo($fp['ieUserData']).'</td>';
    echo '</tr>';
    echo '<tr>';
    echo '<td>Plugins</td>';
    echo '<td>'.implode("<br>",$fp['plugins']).'</td>';
    echo '</tr>';
    echo '<tr>';
    echo '<td>Fonts</td>';
    echo '<td>'.implode("<br>",$fp['fonts']).'</td>';
    echo '</tr>';
    echo '</table>';
  }
  
  private function yesNo($var) {
    return $var ? 'Yes': 'No';
  }

  
}

?>

 
