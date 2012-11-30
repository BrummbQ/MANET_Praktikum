<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Fingerprint</title>
		<script type="text/javascript" src="PluginDetect_All.js"></script>
	</head>
<body>
<?php
echo "<div id='USERAGENT'>" . $_SERVER['HTTP_USER_AGENT'] . "</div>";
echo "<div id='HTTPACCEPT'>" . $_SERVER['HTTP_ACCEPT'] . "</div>";
echo "<div id='HTTPCHARSET'>" . $_SERVER['HTTP_ACCEPT_CHARSET'] . "</div>";
echo "<div id='HTTPLANGUAGE'>" . $_SERVER['HTTP_ACCEPT_LANGUAGE'] . "</div>";
echo "<div id='HTTPENCODING'>" . $_SERVER['HTTP_ACCEPT_ENCODING'] . "</div>";

// check if cookies are enabled
setcookie('test', 1, time()+3600);
if(!isset($_GET['cookies'])){
    header('Location:' . $_SERVER['PHP_SELF'] . '?cookies=true');
}
if(count($_COOKIE) > 0){
    echo "Cookies enabled!<br>";
} else {
    echo "Cookies not enabled!<br>";
}
?>
<object type="application/x-java-applet;version=1.4.1" name="jsap" id="jsap" width="0" height="0">
	<param name="code" value="ListFonts.class">
	<param name="scriptable" value="false">
</object>

<div id="testajax"><b>No Ajax</b></div>

<script type="text/javascript">
function writeData(str)
{
if (str=="")
  {
  document.getElementById("testajax").innerHTML="";
  return;
  }

  xmlhttp=new XMLHttpRequest();

xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    document.getElementById("testajax").innerHTML=xmlhttp.responseText;
    }
  }
xmlhttp.open("GET","writeData.php?w="+str,true);
xmlhttp.send();
}

PluginDetect.getVersion(".");

var userAgent = document.getElementById("USERAGENT").innerHTML;
var httpAccept = document.getElementById("HTTPACCEPT").innerHTML;
var httpCharset = document.getElementById("HTTPCHARSET").innerHTML;
var httpLanguage = document.getElementById("HTTPLANGUAGE").innerHTML;
var httpEncoding = document.getElementById("HTTPENCODING").innerHTML;

var tzoffset = new Date().getTimezoneOffset();
var screenResolution = screen.width + "x" + screen.height;
var flash = "Flash: " + PluginDetect.getVersion("Flash");
var shockwave = "Shockwave: " + PluginDetect.getVersion("Shockwave");
var adobeReader = "AdobeReader: " + PluginDetect.getVersion("AdobeReader");
var windowsMediaPlayer = "WindowsMediaPlayer: " + PluginDetect.getVersion("WindowsMediaPlayer");
var vlc = "VLC: " + PluginDetect.getVersion("VLC");
var silverlight = "Silverlight: " + PluginDetect.getVersion("Silverlight");
var java = "Java: " + PluginDetect.getVersion("Java");
var devalvr = "DevalVR: " + PluginDetect.getVersion("DevalVR");
var fonts = document.jsap.getFonts();

document.write("Timezone: " + new Date().getTimezoneOffset() + "<br>");
document.write("Screen res: " + screenResolution + "<br>");
document.write(flash + "<br>");
document.write(shockwave + "<br>");
document.write(adobeReader + "<br>");
document.write(windowsMediaPlayer + "<br>");
document.write(vlc + "<br>");
document.write(silverlight + "<br>");
document.write(java + "<br>");
document.write(devalvr + "<br>");
document.write("Fonts: " + fonts + "<br>");

writeData("Jummy!");

</script>

</body></html>
