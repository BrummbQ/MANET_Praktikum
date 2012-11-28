<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Fingerprint</title>
		<script type="text/javascript" src="PluginDetect_All.js"></script>
	</head>
<body>
<?php
print $_SERVER['HTTP_USER_AGENT']."<br>";
print $_SERVER['HTTP_ACCEPT']."<br>";
print $_SERVER['HTTP_ACCEPT_CHARSET']."<br>";
print $_SERVER['HTTP_ACCEPT_LANGUAGE']."<br>";
print $_SERVER['HTTP_ACCEPT_ENCODING']."<br>";

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

// get screen resolution, timezone
session_start();
if(isset($_SESSION['screen_width']) AND isset($_SESSION['screen_height']) AND isset($_SESSION['timezone'])){
    echo 'User resolution: ' . $_SESSION['screen_width'] . 'x' . $_SESSION['screen_height'] . "<br>";
    echo 'Timezone Offset: ' . $_SESSION['timezone'] . "<br>";
} else if(isset($_REQUEST['width']) AND isset($_REQUEST['height']) AND isset($_REQUEST['timezone'])) {
    $_SESSION['screen_width'] = $_REQUEST['width'];
    $_SESSION['screen_height'] = $_REQUEST['height'];
    $_SESSION['timezone'] = $_REQUEST['timezone'];
    header('Location: ' . $_SERVER['PHP_SELF']);
} else {
    echo '<script type="text/javascript">window.location = "' . $_SERVER['PHP_SELF'] . '?width="+screen.width+"&height="+screen.height+"&timezone="+new Date().getTimezoneOffset();</script>';
}
?>
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
document.write("Flash: " + PluginDetect.getVersion("Flash") + "<br>");
document.write("Shockwave: " + PluginDetect.getVersion("Shockwave") + "<br>");
document.write("AdobeReader: " + PluginDetect.getVersion("AdobeReader") + "<br>");
document.write("WindowsMediaPlayer: " + PluginDetect.getVersion("WindowsMediaPlayer") + "<br>");
document.write("VLC: " + PluginDetect.getVersion("VLC") + "<br>");
document.write("Silverlight: " + PluginDetect.getVersion("Silverlight") + "<br>");
document.write("Java: " + PluginDetect.getVersion("Java") + "<br>");
document.write("DevalVR: " + PluginDetect.getVersion("DevalVR") + "<br>");

writeData("Jummy!");
</script>

<div id="testajax"><b>No Ajax</b></div>
</body></html>
