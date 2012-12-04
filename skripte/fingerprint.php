<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Fingerprint</title>
		<script type="text/javascript" src="PluginDetect_All.js"></script>
	</head>
<body>
<div id="fpresult"><b>Kein Javascript, zum Ausführen der Seite aktivieren Sie bitte Javascript.</b></div>
<?php
echo "<div id='USERAGENT' style='visibility:hidden'>" . $_SERVER['HTTP_USER_AGENT'] . "</div>";
echo "<div id='HTTPACCEPT' style='visibility:hidden'>" . $_SERVER['HTTP_ACCEPT'] . "</div>";
echo "<div id='HTTPCHARSET' style='visibility:hidden'>" . $_SERVER['HTTP_ACCEPT_CHARSET'] . "</div>";
echo "<div id='HTTPLANGUAGE' style='visibility:hidden'>" . $_SERVER['HTTP_ACCEPT_LANGUAGE'] . "</div>";
echo "<div id='HTTPENCODING' style='visibility:hidden'>" . $_SERVER['HTTP_ACCEPT_ENCODING'] . "</div>";

// check if cookies are enabled
setcookie('test', 1, time()+3600);
if(!isset($_GET['cookies'])){
    header('Location:' . $_SERVER['PHP_SELF'] . '?cookies=true');
}
if(count($_COOKIE) > 0){
    echo "<div id='COOKIES'  style='visibility:hidden'>1</div>";
} else {
    echo "<div id='COOKIES'  style='visibility:hidden'>0</div>";
}
?>

<object type="application/x-java-applet;version=1.4.1" name="jsap" id="jsap" width="0" height="0">
	<param name="code" value="ListFonts.class">
	<param name="scriptable" value="false">
</object>

<script type="text/javascript">
function writeData(str)
{

  if (str=="")
  {
    return;
  }
  var xmlhttp;
  if (window.XMLHttpRequest)
  {
    xmlhttp = new XMLHttpRequest();
  }
  else if (window.ActiveXObject) {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.onreadystatechange=function()
  {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
      document.getElementById("fpresult").innerHTML=xmlhttp.responseText;
    }
  }

  xmlhttp.open("GET","fingerprintDb.php?"+str,true);
  xmlhttp.send();
}

PluginDetect.getVersion(".");

var userAgent = document.getElementById("USERAGENT").innerHTML;
var httpAccept = document.getElementById("HTTPACCEPT").innerHTML;
var httpCharset = document.getElementById("HTTPCHARSET").innerHTML;
var httpLanguage = document.getElementById("HTTPLANGUAGE").innerHTML;
var httpEncoding = document.getElementById("HTTPENCODING").innerHTML;
var cookies = document.getElementById("COOKIES").innerHTML;

var tzoffset = new Date().getTimezoneOffset();
var screenResolution = screen.width + "x" + screen.height + "x"+screen.colorDepth;

var pluginsList = new Array("Flash", "Shockwave", "AdobeReader", "WindowsMediaPlayer", "VLC", "Silverlight", "Java", "DevalVR");
var activePlugins = "";
for (var i=0; i< pluginsList.length; i++) {
    var version = PluginDetect.getVersion(pluginsList[i]);
    if (version != null) {
      activePlugins = activePlugins + (activePlugins.length > 0 ? ", " : "") + pluginsList[i] + " " + version;
    }
}

var javaActiv = PluginDetect.getVersion("Java") ? true : false;
//nur ausführen, wenn Java aktiv ist
var fonts = "";
if (javaActiv) {
  var fonts = document.jsap.getFonts();
}

var localStorageActive = 0;
var sessionStorageActive = 0;
var ieUserData = 0;
//supercookies
try {
    localStorage.setItem("fingerprint", "test");
    sessionStorage.setItem("fingerprint", "test");
} catch (ex) { }

try {
  if (localStorage.getItem("fingerprint") == "test") {
    localStorageActive = 1;
  }
} catch (ex) {  }

try {
  if (sessionStorage.getItem("fingerprint") == "test") {
    sessionStorageActive = 1;
  }
} catch (ex) { }


try {
  oPersistDiv.setAttribute("remember", "remember this value");
  oPersistDiv.save("oXMLStore");
  oPersistDiv.setAttribute("remember", "overwritten!");
  oPersistDiv.load("oXMLStore");
  if ("remember this value" == (oPersistDiv.getAttribute("remember"))) {
    ieUserData = 1;
  }
} catch (ex) { }


writeData("userAgent=" + escape(userAgent)
  + "&httpAccept=" + escape(httpAccept)
  + "&httpCharset=" + escape(httpCharset)
  + "&httpLanguage=" + escape(httpLanguage)
  + "&httpEncoding=" + escape(httpEncoding)
  + "&timezone=" + escape(tzoffset)
  + "&screenResolution=" + escape(screenResolution)
  + "&cookies=" + escape(cookies)
  + "&plugins=" + escape("["+activePlugins+"]")
  + "&fonts=" + escape(fonts)
  + "&domLocal=" + escape(localStorageActive)
  + "&domSession=" + escape(sessionStorageActive)
  + "&ieUserData=" + escape(ieUserData));

</script>

</body></html>
