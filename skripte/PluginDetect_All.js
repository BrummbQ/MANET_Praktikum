/*
PluginDetect v0.7.9
www.pinlady.net/PluginDetect/license/
[ beforeInstantiate getInfo getVersion isMinVersion onDetectionDone onWindowLoaded ]
[ AdobeReader DevalVR Flash Java(OTF & NOTF) PDFreader(OTF & NOTF) QuickTime RealPlayer Shockwave Silverlight VLC WMP ]
*/
var PluginDetect={version:"0.7.9",name:"PluginDetect",handler:function(c,b,a){return function(){c(b,a)
}
},openTag:"<",isDefined:function(b){return typeof b!="undefined"
},isArray:function(b){return(/array/i).test(Object.prototype.toString.call(b))
},isFunc:function(b){return typeof b=="function"
},isString:function(b){return typeof b=="string"
},isNum:function(b){return typeof b=="number"
},isStrNum:function(b){return(typeof b=="string"&&(/\d/).test(b))
},getNumRegx:/[\d][\d\.\_,-]*/,splitNumRegx:/[\.\_,-]/g,getNum:function(b,c){var d=this,a=d.isStrNum(b)?(d.isDefined(c)?new RegExp(c):d.getNumRegx).exec(b):null;
return a?a[0]:null
},compareNums:function(h,f,d){var e=this,c,b,a,g=parseInt;
if(e.isStrNum(h)&&e.isStrNum(f)){if(e.isDefined(d)&&d.compareNums){return d.compareNums(h,f)
}c=h.split(e.splitNumRegx);
b=f.split(e.splitNumRegx);
for(a=0;
a<Math.min(c.length,b.length);
a++){if(g(c[a],10)>g(b[a],10)){return 1
}if(g(c[a],10)<g(b[a],10)){return -1
}}}return 0
},formatNum:function(b,c){var d=this,a,e;
if(!d.isStrNum(b)){return null
}if(!d.isNum(c)){c=4
}c--;
e=b.replace(/\s/g,"").split(d.splitNumRegx).concat(["0","0","0","0"]);
for(a=0;
a<4;
a++){if(/^(0+)(.+)$/.test(e[a])){e[a]=RegExp.$2
}if(a>c||!(/\d/).test(e[a])){e[a]="0"
}}return e.slice(0,4).join(",")
},$$hasMimeType:function(a){return function(c){if(!a.isIE&&c){var f,e,b,d=a.isArray(c)?c:(a.isString(c)?[c]:[]);
for(b=0;
b<d.length;
b++){if(a.isString(d[b])&&/[^\s]/.test(d[b])){f=navigator.mimeTypes[d[b]];
e=f?f.enabledPlugin:0;
if(e&&(e.name||e.description)){return f
}}}}return null
}
},findNavPlugin:function(l,e,c){var j=this,h=new RegExp(l,"i"),d=(!j.isDefined(e)||e)?/\d/:0,k=c?new RegExp(c,"i"):0,a=navigator.plugins,g="",f,b,m;
for(f=0;
f<a.length;
f++){m=a[f].description||g;
b=a[f].name||g;
if((h.test(m)&&(!d||d.test(RegExp.leftContext+RegExp.rightContext)))||(h.test(b)&&(!d||d.test(RegExp.leftContext+RegExp.rightContext)))){if(!k||!(k.test(m)||k.test(b))){return a[f]
}}}return null
},getMimeEnabledPlugin:function(k,m,c){var e=this,f,b=new RegExp(m,"i"),h="",g=c?new RegExp(c,"i"):0,a,l,d,j=e.isString(k)?[k]:k;
for(d=0;
d<j.length;
d++){if((f=e.hasMimeType(j[d]))&&(f=f.enabledPlugin)){l=f.description||h;
a=f.name||h;
if(b.test(l)||b.test(a)){if(!g||!(g.test(l)||g.test(a))){return f
}}}}return 0
},getPluginFileVersion:function(f,b){var h=this,e,d,g,a,c=-1;
if(h.OS>2||!f||!f.version||!(e=h.getNum(f.version))){return b
}if(!b){return e
}e=h.formatNum(e);
b=h.formatNum(b);
d=b.split(h.splitNumRegx);
g=e.split(h.splitNumRegx);
for(a=0;
a<d.length;
a++){if(c>-1&&a>c&&d[a]!="0"){return b
}if(g[a]!=d[a]){if(c==-1){c=a
}if(d[a]!="0"){return b
}}}return e
},AXO:window.ActiveXObject,getAXO:function(a){var f=null,d,b=this,c={};
try{f=new b.AXO(a)}catch(d){}return f
},convertFuncs:function(f){var a,g,d,b=/^[\$][\$]/,c=this;
for(a in f){if(b.test(a)){try{g=a.slice(2);
if(g.length>0&&!f[g]){f[g]=f[a](f);
delete f[a]
}}catch(d){}}}},initObj:function(e,b,d){var a,c;
if(e){if(e[b[0]]==1||d){for(a=0;
a<b.length;
a=a+2){e[b[a]]=b[a+1]
}}for(a in e){c=e[a];
if(c&&c[b[0]]==1){this.initObj(c,b)
}}}},initScript:function(){var d=this,a=navigator,h,i=document,l=a.userAgent||"",j=a.vendor||"",b=a.platform||"",k=a.product||"";
d.initObj(d,["$",d]);
for(h in d.Plugins){if(d.Plugins[h]){d.initObj(d.Plugins[h],["$",d,"$$",d.Plugins[h]],1)
}}d.convertFuncs(d);
d.OS=100;
if(b){var g=["Win",1,"Mac",2,"Linux",3,"FreeBSD",4,"iPhone",21.1,"iPod",21.2,"iPad",21.3,"Win.*CE",22.1,"Win.*Mobile",22.2,"Pocket\\s*PC",22.3,"",100];
for(h=g.length-2;
h>=0;
h=h-2){if(g[h]&&new RegExp(g[h],"i").test(b)){d.OS=g[h+1];
break
}}};
d.head=i.getElementsByTagName("head")[0]||i.getElementsByTagName("body")[0]||i.body||null;
d.isIE=new Function("return/*@cc_on!@*/!1")();
d.verIE=d.isIE&&(/MSIE\s*(\d+\.?\d*)/i).test(l)?parseFloat(RegExp.$1,10):null;
d.ActiveXEnabled=false;
if(d.isIE){var h,m=["Msxml2.XMLHTTP","Msxml2.DOMDocument","Microsoft.XMLDOM","ShockwaveFlash.ShockwaveFlash","TDCCtl.TDCCtl","Shell.UIHelper","Scripting.Dictionary","wmplayer.ocx"];
for(h=0;
h<m.length;
h++){if(d.getAXO(m[h])){d.ActiveXEnabled=true;
break
}}};
d.isGecko=(/Gecko/i).test(k)&&(/Gecko\s*\/\s*\d/i).test(l);
d.verGecko=d.isGecko?d.formatNum((/rv\s*\:\s*([\.\,\d]+)/i).test(l)?RegExp.$1:"0.9"):null;
d.isChrome=(/Chrome\s*\/\s*(\d[\d\.]*)/i).test(l);
d.verChrome=d.isChrome?d.formatNum(RegExp.$1):null;
d.isSafari=((/Apple/i).test(j)||(!j&&!d.isChrome))&&(/Safari\s*\/\s*(\d[\d\.]*)/i).test(l);
d.verSafari=d.isSafari&&(/Version\s*\/\s*(\d[\d\.]*)/i).test(l)?d.formatNum(RegExp.$1):null;
d.isOpera=(/Opera\s*[\/]?\s*(\d+\.?\d*)/i).test(l);
d.verOpera=d.isOpera&&((/Version\s*\/\s*(\d+\.?\d*)/i).test(l)||1)?parseFloat(RegExp.$1,10):null;
d.addWinEvent("load",d.handler(d.runWLfuncs,d))},init:function(d){var c=this,b,d,a={status:-3,plugin:0};
if(!c.isString(d)){
return a
}if(d.length==1){c.getVersionDelimiter=d;
return a
}d=d.toLowerCase().replace(/\s/g,"");
b=c.Plugins[d];
if(!b||!b.getVersion){
return a
}a.plugin=b;
if(!c.isDefined(b.installed)){b.installed=null;
b.version=null;
b.version0=null;
b.getVersionDone=null;
b.pluginName=d
}c.garbage=false;
if(c.isIE&&!c.ActiveXEnabled&&d!=="java"){a.status=-2;
return a
}a.status=1;
return a
},fPush:function(b,a){var c=this;
if(c.isArray(a)&&(c.isFunc(b)||(c.isArray(b)&&b.length>0&&c.isFunc(b[0])))){a.push(b)
}},callArray:function(b){var c=this,a;
if(c.isArray(b)){for(a=0;
a<b.length;
a++){if(b[a]===null){return
}c.call(b[a]);
b[a]=null
}}},call:function(c){var b=this,a=b.isArray(c)?c.length:-1;
if(a>0&&b.isFunc(c[0])){
c[0](b,a>1?c[1]:0,a>2?c[2]:0,a>3?c[3]:0)
}else{if(b.isFunc(c)){
c(b)
}}},$$isMinVersion:function(a){return function(h,g,d,c){var e=a.init(h),f,b=-1,j={};
if(e.status<0){return e.status
}f=e.plugin;
g=a.formatNum(a.isNum(g)?g.toString():(a.isStrNum(g)?a.getNum(g):"0"));
if(f.getVersionDone!=1){f.getVersion(g,d,c);
if(f.getVersionDone===null){f.getVersionDone=1
}}a.cleanup();
if(f.installed!==null){b=f.installed<=0.5?f.installed:(f.installed==0.7?1:(f.version===null?0:(a.compareNums(f.version,g,f)>=0?1:-0.1)))
};
return b
}
},getVersionDelimiter:",",$$getVersion:function(a){return function(g,d,c){var e=a.init(g),f,b,h={};
if(e.status<0){return null
};
f=e.plugin;
if(f.getVersionDone!=1){f.getVersion(null,d,c);
if(f.getVersionDone===null){f.getVersionDone=1
}}a.cleanup();
b=(f.version||f.version0);
b=b?b.replace(a.splitNumRegx,a.getVersionDelimiter):b;
return b
}
},$$getInfo:function(a){return function(g,d,c){var b={},e=a.init(g),f,h={};
if(e.status<0){return b
};
f=e.plugin;
if(f.getInfo){if(f.getVersionDone===null){a.isMinVersion?a.isMinVersion(g,"0",d,c):a.getVersion(g,d,c)
}b=f.getInfo()
};
return b
}
},cleanup:function(){
var a=this;
if(a.garbage&&a.isDefined(window.CollectGarbage)){window.CollectGarbage()
}
},isActiveXObject:function(d,b){var f=this,a=false,g,c='<object width="1" height="1" style="display:none" '+d.getCodeBaseVersion(b)+">"+d.HTML+f.openTag+"/object>";
if(!f.head){return a
}f.head.insertBefore(document.createElement("object"),f.head.firstChild);
f.head.firstChild.outerHTML=c;
try{f.head.firstChild.classid=d.classID
}catch(g){}try{if(f.head.firstChild.object){a=true
}}catch(g){}try{if(a&&f.head.firstChild.readyState<4){f.garbage=true
}}catch(g){}f.head.removeChild(f.head.firstChild);
return a
},codebaseSearch:function(f,b){var c=this;
if(!c.ActiveXEnabled||!f){return null
}if(f.BIfuncs&&f.BIfuncs.length&&f.BIfuncs[f.BIfuncs.length-1]!==null){
c.callArray(f.BIfuncs)}var d,o=f.SEARCH,k={};
if(c.isStrNum(b)){if(o.match&&o.min&&c.compareNums(b,o.min)<=0){return true
}if(o.match&&o.max&&c.compareNums(b,o.max)>=0){return false
}d=c.isActiveXObject(f,b);
if(d&&(!o.min||c.compareNums(b,o.min)>0)){o.min=b
}if(!d&&(!o.max||c.compareNums(b,o.max)<0)){o.max=b
}return d
};
var e=[0,0,0,0],l=[].concat(o.digits),a=o.min?1:0,j,i,h,g,m,n=function(p,r){var q=[].concat(e);
q[p]=r;
return c.isActiveXObject(f,q.join(","))
};
if(o.max){g=o.max.split(c.splitNumRegx);
for(j=0;
j<g.length;
j++){g[j]=parseInt(g[j],10)
}if(g[0]<l[0]){l[0]=g[0]
}}if(o.min){m=o.min.split(c.splitNumRegx);
for(j=0;
j<m.length;
j++){m[j]=parseInt(m[j],10)
}if(m[0]>e[0]){e[0]=m[0]
}}if(m&&g){for(j=1;
j<m.length;
j++){if(m[j-1]!=g[j-1]){break
}if(g[j]<l[j]){l[j]=g[j]
}if(m[j]>e[j]){e[j]=m[j]
}}}if(o.max){for(j=1;
j<l.length;
j++){if(g[j]>0&&l[j]==0&&l[j-1]<o.digits[j-1]){l[j-1]+=1;
break
}}};
for(j=0;
j<l.length;
j++){h={};
for(i=0;
i<20;
i++){if(l[j]-e[j]<1){break
}d=Math.round((l[j]+e[j])/2);
if(h["a"+d]){break
}h["a"+d]=1;
if(n(j,d)){e[j]=d;
a=1
}else{l[j]=d
}}l[j]=e[j];
if(!a&&n(j,e[j])){a=1
};
if(!a){break
}};
return a?e.join(","):null
},addWinEvent:function(d,c){var e=this,a=window,b;
if(e.isFunc(c)){if(a.addEventListener){a.addEventListener(d,c,false)
}else{if(a.attachEvent){a.attachEvent("on"+d,c)
}else{b=a["on"+d];
a["on"+d]=e.winHandler(c,b)
}}}},winHandler:function(d,c){return function(){d();
if(typeof c=="function"){c()
}}
},WLfuncs0:[],WLfuncs:[],runWLfuncs:function(a){var b={};
a.winLoaded=true;
a.callArray(a.WLfuncs0);
a.callArray(a.WLfuncs);
if(a.onDoneEmptyDiv){a.onDoneEmptyDiv()
}},winLoaded:false,$$onWindowLoaded:function(a){return function(b){
if(a.winLoaded){
a.call(b)}else{a.fPush(b,a.WLfuncs)
}}
},$$beforeInstantiate:function(a){return function(e,d){var b=a.init(e),c=b.plugin;
if(b.status==-3){return
};
if(!a.isArray(c.BIfuncs)){c.BIfuncs=[]
}a.fPush(d,c.BIfuncs)
}
},$$onDetectionDone:function(a){return function(h,g,c,b){var d=a.init(h),k,e,j={};
if(d.status==-3){return -1
}e=d.plugin;
if(!a.isArray(e.funcs)){e.funcs=[]
}if(e.getVersionDone!=1){k=a.isMinVersion?a.isMinVersion(h,"0",c,b):a.getVersion(h,c,b)
}if(e.installed!=-0.5&&e.installed!=0.5){
a.call(g);
return 1
}if(e.NOTF){a.fPush(g,e.funcs);
return 0
}return 1
}
},div:null,divID:"plugindetect",divWidth:50,pluginSize:1,emptyDiv:function(){var d=this,b,h,c,a,f,g;
if(d.div&&d.div.childNodes){for(b=d.div.childNodes.length-1;
b>=0;
b--){c=d.div.childNodes[b];
if(c&&c.childNodes){for(h=c.childNodes.length-1;
h>=0;
h--){g=c.childNodes[h];
try{c.removeChild(g)
}catch(f){}}}if(c){
try{d.div.removeChild(c)
}catch(f){}}}}if(!d.div){a=document.getElementById(d.divID);
if(a){d.div=a
}}if(d.div&&d.div.parentNode){
try{d.div.parentNode.removeChild(d.div)
}catch(f){}d.div=null
}},DONEfuncs:[],onDoneEmptyDiv:function(){var c=this,a,b;
if(!c.winLoaded){return
}if(c.WLfuncs&&c.WLfuncs.length&&c.WLfuncs[c.WLfuncs.length-1]!==null){return
}for(a in c){b=c[a];
if(b&&b.funcs){if(b.OTF==3){return
}if(b.funcs.length&&b.funcs[b.funcs.length-1]!==null){return
}}}for(a=0;
a<c.DONEfuncs.length;
a++){c.callArray(c.DONEfuncs)
}c.emptyDiv()
},getWidth:function(c){if(c){var a=c.scrollWidth||c.offsetWidth,b=this;
if(b.isNum(a)){return a
}}return -1
},getTagStatus:function(m,g,a,b){var c=this,f,k=m.span,l=c.getWidth(k),h=a.span,j=c.getWidth(h),d=g.span,i=c.getWidth(d);
if(!k||!h||!d||!c.getDOMobj(m)){return -2
}if(j<i||l<0||j<0||i<0||i<=c.pluginSize||c.pluginSize<1){return 0
}if(l>=i){return -1
}try{if(l==c.pluginSize&&(!c.isIE||c.getDOMobj(m).readyState==4)){if(!m.winLoaded&&c.winLoaded){return 1
}if(m.winLoaded&&c.isNum(b)){if(!c.isNum(m.count)){m.count=b
}if(b-m.count>=10){return 1
}}}}catch(f){}return 0
},getDOMobj:function(g,a){var f,d=this,c=g?g.span:0,b=c&&c.firstChild?1:0;
try{if(b&&a){d.div.focus()
}}catch(f){}return b?c.firstChild:null
},setStyle:function(b,g){var f=b.style,a,d,c=this;
if(f&&g){for(a=0;
a<g.length;
a=a+2){try{f[g[a]]=g[a+1]
}catch(d){}}}},insertDivInBody:function(i,g){var f,c=this,h="pd33993399",b=null,d=g?window.top.document:window.document,a=d.getElementsByTagName("body")[0]||d.body;
if(!a){try{d.write('<div id="'+h+'">.'+c.openTag+"/div>");
b=d.getElementById(h)
}catch(f){}}a=d.getElementsByTagName("body")[0]||d.body;
if(a){a.insertBefore(i,a.firstChild);
if(b){a.removeChild(b)
}}},insertHTML:function(f,b,g,a,k){var l,m=document,j=this,p,o=m.createElement("span"),n,i;
var c=["outlineStyle","none","borderStyle","none","padding","0px","margin","0px","visibility","visible"];
var h="outline-style:none;border-style:none;padding:0px;margin:0px;visibility:visible;";
if(!j.isDefined(a)){a=""
}if(j.isString(f)&&(/[^\s]/).test(f)){f=f.toLowerCase().replace(/\s/g,"");
p=j.openTag+f+' width="'+j.pluginSize+'" height="'+j.pluginSize+'" ';
p+='style="'+h+'display:inline;" ';
for(n=0;
n<b.length;
n=n+2){if(/[^\s]/.test(b[n+1])){p+=b[n]+'="'+b[n+1]+'" '
}}p+=">";
for(n=0;
n<g.length;
n=n+2){if(/[^\s]/.test(g[n+1])){p+=j.openTag+'param name="'+g[n]+'" value="'+g[n+1]+'" />'
}}p+=a+j.openTag+"/"+f+">"
}else{p=a
}if(!j.div){i=m.getElementById(j.divID);
if(i){j.div=i
}else{j.div=m.createElement("div");
j.div.id=j.divID
}j.setStyle(j.div,c.concat(["width",j.divWidth+"px","height",(j.pluginSize+3)+"px","fontSize",(j.pluginSize+3)+"px","lineHeight",(j.pluginSize+3)+"px","verticalAlign","baseline","display","block"]));
if(!i){j.setStyle(j.div,["position","absolute","right","0px","top","0px"]);
j.insertDivInBody(j.div)
}}if(j.div&&j.div.parentNode){
if(k&&k.BIfuncs&&k.BIfuncs.length&&k.BIfuncs[k.BIfuncs.length-1]!==null){
j.callArray(k.BIfuncs)};
j.setStyle(o,c.concat(["fontSize",(j.pluginSize+3)+"px","lineHeight",(j.pluginSize+3)+"px","verticalAlign","baseline","display","inline"]));
try{o.innerHTML=p
}catch(l){};
try{j.div.appendChild(o)
}catch(l){};
return{span:o,winLoaded:j.winLoaded,tagName:f,outerHTML:p}
}return{span:null,winLoaded:j.winLoaded,tagName:"",outerHTML:p}
},file:{$:1,any:"fileStorageAny999",valid:"fileStorageValid999",save:function(d,f,c){var b=this,e=b.$,a;
if(d&&e.isDefined(c)){if(!d[b.any]){d[b.any]=[]
}if(!d[b.valid]){d[b.valid]=[]
}d[b.any].push(c);
a=b.split(f,c);
if(a){d[b.valid].push(a)
}}},getValidLength:function(a){return a&&a[this.valid]?a[this.valid].length:0
},getAnyLength:function(a){return a&&a[this.any]?a[this.any].length:0
},getValid:function(c,a){var b=this;
return c&&c[b.valid]?b.get(c[b.valid],a):null
},getAny:function(c,a){var b=this;
return c&&c[b.any]?b.get(c[b.any],a):null
},get:function(d,a){var c=d.length-1,b=this.$.isNum(a)?a:c;
return(b<0||b>c)?null:d[b]
},split:function(g,c){var b=this,e=b.$,f=null,a,d;
g=g?g.replace(".","\\."):"";
d=new RegExp("^(.*[^\\/])("+g+"\\s*)$");
if(e.isString(c)&&d.test(c)){a=(RegExp.$1).split("/");
f={name:a[a.length-1],ext:RegExp.$2,full:c};
a[a.length-1]="";
f.path=a.join("/")
}return f
},z:0},Plugins:{quicktime:{mimeType:["video/quicktime","application/x-quicktimeplayer","image/x-macpaint","image/x-quicktime"],progID:"QuickTimeCheckObject.QuickTimeCheck.1",progID0:"QuickTime.QuickTime",classID:"clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B",minIEver:7,HTML:'<param name="src" value="" /><param name="controller" value="false" />',getCodeBaseVersion:function(a){return'codebase="#version='+a+'"'
},SEARCH:{min:0,max:0,match:0,digits:[16,128,128,0]},getVersion:function(c){var f=this,d=f.$,a=null,e=null,b;
if(!d.isIE){if(d.hasMimeType(f.mimeType)){e=d.OS!=3?d.findNavPlugin("QuickTime.*Plug-?in",0):null;
if(e&&e.name){a=d.getNum(e.name)
}}}else{if(d.isStrNum(c)){b=c.split(d.splitNumRegx);
if(b.length>3&&parseInt(b[3],10)>0){b[3]="9999"
}c=b.join(",")
}if(d.isStrNum(c)&&d.verIE>=f.minIEver&&f.canUseIsMin()>0){f.installed=f.isMin(c);
f.getVersionDone=0;
return
}f.getVersionDone=1;
if(!a&&d.verIE>=f.minIEver){a=f.CDBASE2VER(d.codebaseSearch(f))
}if(!a){e=d.getAXO(f.progID);
if(e&&e.QuickTimeVersion){a=e.QuickTimeVersion.toString(16);
a=parseInt(a.charAt(0),16)+"."+parseInt(a.charAt(1),16)+"."+parseInt(a.charAt(2),16)
}}}f.installed=a?1:(e?0:-1);
f.version=d.formatNum(a,3)
},cdbaseUpper:["7,60,0,0","0,0,0,0"],cdbaseLower:["7,50,0,0",null],cdbase2ver:[function(c,b){var a=b.split(c.$.splitNumRegx);
return[a[0],a[1].charAt(0),a[1].charAt(1),a[2]].join(",")
},null],CDBASE2VER:function(f){var e=this,c=e.$,b,a=e.cdbaseUpper,d=e.cdbaseLower;
if(f){f=c.formatNum(f);
for(b=0;
b<a.length;
b++){if(a[b]&&c.compareNums(f,a[b])<0&&d[b]&&c.compareNums(f,d[b])>=0&&e.cdbase2ver[b]){return e.cdbase2ver[b](e,f)
}}}return f
},canUseIsMin:function(){var f=this,d=f.$,b,c=f.canUseIsMin,a=f.cdbaseUpper,e=f.cdbaseLower;
if(!c.value){c.value=-1;
for(b=0;
b<a.length;
b++){if(a[b]&&d.codebaseSearch(f,a[b])){c.value=1;
break
}if(e[b]&&d.codebaseSearch(f,e[b])){c.value=-1;
break
}}}f.SEARCH.match=c.value==1?1:0;
return c.value
},isMin:function(c){var b=this,a=b.$;
return a.codebaseSearch(b,c)?0.7:-1
}},java:{mimeType:["application/x-java-applet","application/x-java-vm","application/x-java-bean"],classID:"clsid:8AD9C840-044E-11D1-B3E9-00805F499D93",navigator:{a:window.navigator.javaEnabled(),javaEnabled:function(){return this.a
},mimeObj:0,pluginObj:0},OTF:null,minIEver:7,debug:0,debugEnable:function(){var a=this,b=a.$;
a.debug=1
},isDisabled:{$:1,DTK:function(){var a=this,c=a.$,b=a.$$;
if((c.isGecko&&c.compareNums(c.verGecko,c.formatNum("1.6"))<=0)||(c.isSafari&&c.OS==1&&(!c.verSafari||c.compareNums(c.verSafari,"5,1,0,0")<0))||c.isChrome||(c.isIE&&!c.ActiveXEnabled)){return 1
}return 0
},AXO:function(){var a=this,c=a.$,b=a.$$;
return(!c.isIE||!c.ActiveXEnabled||(!b.debug&&b.DTK.query().status!==0))
},navMime:function(){var b=this,d=b.$,c=b.$$,a=c.navigator;
if(d.isIE||!a.mimeObj||!a.pluginObj){return 1
}return 0
},navPlugin:function(){var b=this,d=b.$,c=b.$$,a=c.navigator;
if(d.isIE||!a.mimeObj||!a.pluginObj){return 1
}return 0
},windowDotJava:function(){var a=this,c=a.$,b=a.$$;
if(!window.java){return 1
}if(c.OS==2&&c.verOpera&&c.verOpera<9.2&&c.verOpera>=9){return 1
}return 0
},allApplets:function(){var b=this,d=b.$,c=b.$$,a=c.navigator;
if(d.OS>=20){return 0
}if(d.verOpera&&d.verOpera<11&&!a.javaEnabled()&&!c.lang.System.getProperty()[0]){return 1
}if((d.verGecko&&d.compareNums(d.verGecko,d.formatNum("2"))<0)&&!a.mimeObj&&!c.lang.System.getProperty()[0]){return 1
}return 0
},AppletTag:function(){var b=this,d=b.$,c=b.$$,a=c.navigator;
return d.isIE?!a.javaEnabled():0
},ObjectTag:function(){var a=this,c=a.$,b=a.$$;
return c.isIE?!c.ActiveXEnabled:0
},z:0},getVerifyTagsDefault:function(){var a=this,c=a.$,b=[1,0,1];
if(c.OS>=20){return b
}if((c.isIE&&(c.verIE<9||!c.ActiveXEnabled))||(c.verGecko&&c.compareNums(c.verGecko,c.formatNum("2"))<0)||(c.isSafari&&(!c.verSafari||c.compareNums(c.verSafari,c.formatNum("4"))<0))||(c.verOpera&&c.verOpera<10)){b=[1,1,1]
}return b
},info:{$:1,Plugin2Status:0,setPlugin2Status:function(a){if(this.$.isNum(a)){this.Plugin2Status=a
}},getPlugin2Status:function(){var c=this,d=c.$,b=c.$$,i=b.navigator,f,g,k,h,j,a;
if(c.Plugin2Status===0){if(d.isIE&&d.OS==1){if((/Sun|Oracle/i).test(b.vendor||"")&&b.installed!==null&&b.installed>=0&&b.version){if(c.isMinJre4Plugin2(b.version)){c.setPlugin2Status(1)}else{c.setPlugin2Status(-1)}}}else{if(!d.isIE&&i.pluginObj){k=/Next.*Generation.*Java.*Plug-?in|Java.*Plug-?in\s*2\s/i;
h=/Classic.*Java.*Plug-in/i;
j=i.pluginObj.description||"";
a=i.pluginObj.name||"";
if(k.test(j)||k.test(a)){c.setPlugin2Status(1)}else{if(h.test(j)||h.test(a)){c.setPlugin2Status(-1)}}}}}return c.Plugin2Status
},isMinJre4Plugin2:function(b){var f=this,e=f.$,d=f.$$,c=e.formatNum(e.getNum(b)),a="";
if(e.OS==1){a="1,6,0,10"
}else{if(e.OS==2){a="1,6,0,12"
}else{if(e.OS==3){a="1,6,0,10"
}else{a="1,6,0,10"
}}}return c?(e.compareNums(c,a)>=0):false
},BrowserForbidsPlugin2:function(){var a=this.$;
if(a.OS>=20){return 0
}if(a.isIE){if(a.verIE<6){return 1
}}else{if(a.isGecko&&a.compareNums(a.verGecko,"1,9,0,0")<0){return 1
}else{if(a.isOpera&&a.verOpera&&a.verOpera<10.5){return 1
}}}return 0
},BrowserRequiresPlugin2:function(){var a=this.$;
if(a.OS>=20){return 0
}if(a.isGecko&&a.compareNums(a.verGecko,"1,9,2,0")>=0){return 1
}if(a.isChrome){return 1
}if(a.OS==1&&a.verOpera&&a.verOpera>=10.6){return 1
}return 0
},VENDORS:["Sun Microsystems Inc.","Apple Computer, Inc.","Oracle Corporation"],OracleOrSun:function(a){var c=this,b=c.$;
return c.VENDORS[b.compareNums(b.formatNum(a),b.formatNum("1,7"))<0?0:2]
},getVendor:function(){var c=this,b=c.$,a=c.$$;
if(a.vendor){return a.vendor
}if(b.OS==1&&a.DTK.query().version){return c.OracleOrSun(a.DTK.version)
}if(b.isIE&&a.AXO.query().version){return c.OracleOrSun(a.AXO.version)
}if(b.isNum(a.installed)&&a.installed>=-0.2&&a.version){if(b.OS==2){return c.VENDORS[1]
}if(!b.isIE&&b.OS==1){return c.OracleOrSun(a.version)
}if(b.OS==3){return c.OracleOrSun(a.version)
}}return""
},isPlugin2InstalledEnabled:function(){var b=this,d=b.$,a=b.$$,i=-1,f=a.installed,g=b.getPlugin2Status(),h=b.BrowserRequiresPlugin2(),e=b.BrowserForbidsPlugin2(),c=b.isMinJre4Plugin2(a.version);
if(f==1||f==0){if(g>=3){i=1
}else{if(g<=-3){}else{if(g==2){i=1
}else{if(g==-2){}else{if(h&&g>=0&&c){i=1
}else{if(e&&g<=0&&!c){}else{if(h){i=1
}else{if(e){}else{if(g>0){i=1
}else{if(g<0){}else{if(!c){}else{i=0
}}}}}}}}}}}}return i
}},getInfo:function(){var b=this,d=b.$,a=b.applet,h,j=b.installed,g=b.DTK.query(),f=a.results,k={All_versions:[],DeployTK_versions:[].concat(d.isArray(g.VERSIONS)?g.VERSIONS:[]),DeploymentToolkitPlugin:(g.status==0?null:d.getDOMobj(g.HTML)),vendor:b.info.getVendor(),isPlugin2:b.info.isPlugin2InstalledEnabled(),OTF:(b.OTF<3?0:(b.OTF==3?1:2)),PLUGIN:null,name:"",description:""};
k.All_versions=[].concat((k.DeployTK_versions.length?k.DeployTK_versions:(b.AXO.VERSIONS.length?b.AXO.VERSIONS:(d.isString(b.version)?[b.version]:[]))));
var c=k.All_versions;
for(h=0;
h<c.length;
h++){c[h]=d.formatNum(d.getNum(c[h]))
}for(h=0;
h<f.length;
h++){if(f[h][0]){k.PLUGIN=d.getDOMobj(a.HTML[h]);
break
}}var e=[null,null,null];
for(h=0;
h<f.length;
h++){if(f[h][0]){e[h]=1
}else{if(a.active[h]==1){e[h]=0
}else{if(a.allowed[h]>=1&&b.OTF!=3){if(a.isDisabled(h)||j==-0.2||j==-1||a.active[h]<0||(h==2&&(!d.isIE||(/Microsoft/i).test(k.vendor)))){e[h]=-1
}}}}}k.objectTag=e[0];
k.appletTag=e[1];
k.objectTagActiveX=e[2];
var i=0;
if(!d.isIE){if(b.navMime.query().pluginObj){i=b.navMime.pluginObj
}else{if(b.navigator.pluginObj){i=b.navigator.pluginObj
}}if(i){k.name=i.name||"";
k.description=i.description||""
}}return k
},getVersion:function(j,g,i){var b=this,d=b.$,e,a=b.applet,h=b.verify,k=b.navigator,f=null,l=null,c=null;
if(b.getVersionDone===null){b.OTF=0;
k.mimeObj=d.hasMimeType(b.mimeType);
if(k.mimeObj){k.pluginObj=k.mimeObj.enabledPlugin
}if(h){h.begin()
}}a.setVerifyTagsArray(i);
d.file.save(b,".jar",g);
if(b.getVersionDone===0){if(a.should_Insert_Query_Any()){e=a.insert_Query_Any();
b.setPluginStatus(e[0],e[1],f)
}return
}if((!f||b.debug)&&b.DTK.query().version){f=b.DTK.version
}if((!f||b.debug)&&b.navMime.query().version){f=b.navMime.version
}if((!f||b.debug)&&b.navPlugin.query().version){f=b.navPlugin.version
}if((!f||b.debug)&&b.AXO.query().version){f=b.AXO.version
}if(b.nonAppletDetectionOk(f)){c=f
}if(!c||b.debug||a.VerifyTagsHas(2.2)||a.VerifyTagsHas(2.5)){e=b.lang.System.getProperty();
if(e[0]){f=e[0];
c=e[0];
l=e[1]
}}b.setPluginStatus(c,l,f);
if(a.should_Insert_Query_Any()){e=a.insert_Query_Any();
if(e[0]){c=e[0];
l=e[1]
}}b.setPluginStatus(c,l,f)
},nonAppletDetectionOk:function(b){var d=this,e=d.$,a=d.navigator,c=1;
if(!b||(!a.javaEnabled()&&!d.lang.System.getPropertyHas(b))||(!e.isIE&&!a.mimeObj&&!d.lang.System.getPropertyHas(b))||(e.isIE&&!e.ActiveXEnabled)){c=0
}else{if(e.OS>=20){}else{if(d.info&&d.info.getPlugin2Status()<0&&d.info.BrowserRequiresPlugin2()){c=0
}}}return c
},setPluginStatus:function(d,f,a){var c=this,e=c.$,b;
a=a||c.version0;
if(c.OTF>0){d=d||c.lang.System.getProperty()[0]
}if(c.OTF<3){b=d?1:(a?-0.2:-1);
if(c.installed===null||b>c.installed){c.installed=b
}}if(c.OTF==2&&c.NOTF&&!c.applet.getResult()[0]&&!c.lang.System.getProperty()[0]){c.installed=a?-0.2:-1
};
if(c.OTF==3&&c.installed!=-0.5&&c.installed!=0.5){c.installed=(c.NOTF.isJavaActive(1)==1||c.lang.System.getProperty()[0])?0.5:-0.5
}if(c.OTF==4&&(c.installed==-0.5||c.installed==0.5)){if(d){c.installed=1
}else{if(c.NOTF.isJavaActive(1)==1){if(a){c.installed=1;
d=a
}else{c.installed=0
}}else{if(a){c.installed=-0.2
}else{c.installed=-1
}}}};
if(a){c.version0=e.formatNum(e.getNum(a))
}if(d){c.version=e.formatNum(e.getNum(d))
}if(f&&e.isString(f)){c.vendor=f
}if(!c.vendor){c.vendor=""
}if(c.verify&&c.verify.isEnabled()){c.getVersionDone=0
}else{if(c.getVersionDone!=1){if(c.OTF<2){c.getVersionDone=0
}else{c.getVersionDone=c.applet.can_Insert_Query_Any()?0:1
}}}},DTK:{$:1,hasRun:0,status:null,VERSIONS:[],version:"",HTML:null,Plugin2Status:null,classID:["clsid:CAFEEFAC-DEC7-0000-0001-ABCDEFFEDCBA","clsid:CAFEEFAC-DEC7-0000-0000-ABCDEFFEDCBA"],mimeType:["application/java-deployment-toolkit","application/npruntime-scriptable-plugin;DeploymentToolkit"],disabled:function(){return this.$$.isDisabled.DTK()
},query:function(){var k=this,g=k.$,d=k.$$,j,l,h,m={},f={},a,c=null,i=null,b=(k.hasRun||k.disabled());
k.hasRun=1;
if(b){return k
}k.status=0;
if(g.isIE&&g.verIE>=6){for(l=0;
l<k.classID.length;
l++){k.HTML=g.insertHTML("object",["classid",k.classID[l]],[]);
c=g.getDOMobj(k.HTML);
try{if(c&&c.jvms){break
}}catch(j){}}}else{if(!g.isIE&&(h=g.hasMimeType(k.mimeType))&&h.type){k.HTML=g.insertHTML("object",["type",h.type],[]);
c=g.getDOMobj(k.HTML)
}}if(c){
try{if(Math.abs(d.info.getPlugin2Status())<2){k.Plugin2Status=c.isPlugin2()
}}catch(j){}if(k.Plugin2Status!==null){if(k.Plugin2Status){d.info.setPlugin2Status(2)
}else{if(g.isIE||d.info.getPlugin2Status()<=0){d.info.setPlugin2Status(-2)
}}};
try{a=c.jvms;
if(a){i=a.getLength();
if(g.isNum(i)){k.status=i>0?1:-1;
for(l=0;
l<i;
l++){h=g.getNum(a.get(i-1-l).version);
if(h){k.VERSIONS.push(h);
f["a"+g.formatNum(h)]=1
}}}}}catch(j){}}h=0;
for(l in f){h++
}if(h&&h!==k.VERSIONS.length){
k.VERSIONS=[]
}if(k.VERSIONS.length){k.version=g.formatNum(k.VERSIONS[0])
};
return k
}},AXO:{$:1,hasRun:0,VERSIONS:[],version:"",disabled:function(){return this.$$.isDisabled.AXO()
},JavaVersions:[[1,9,1,40],[1,8,1,40],[1,7,1,40],[1,6,0,40],[1,5,0,30],[1,4,2,30],[1,3,1,30]],query:function(){var a=this,e=a.$,b=a.$$,c=(a.hasRun||a.disabled());
a.hasRun=1;
if(c){return a
}var i=[],k=[1,5,0,14],j=[1,6,0,2],h=[1,3,1,0],g=[1,4,2,0],f=[1,5,0,7],d=b.getInfo?true:false,l={};
if(e.verIE>=b.minIEver){i=a.search(j,j,d);
if(i.length>0&&d){i=a.search(k,k,d)
}}else{if(d){i=a.search(f,f,true)
}if(i.length==0){i=a.search(h,g,false)
}}if(i.length){a.version=i[0];
a.VERSIONS=[].concat(i)
};
return a
},search:function(a,j,p){var h,d,f=this,e=f.$,k=f.$$,n,c,l,q,b,o,r,i=[];
if(e.compareNums(a.join(","),j.join(","))>0){j=a
}j=e.formatNum(j.join(","));
var m,s="1,4,2,0",g="JavaPlugin."+a[0]+""+a[1]+""+a[2]+""+(a[3]>0?("_"+(a[3]<10?"0":"")+a[3]):"");
for(h=0;
h<f.JavaVersions.length;
h++){d=f.JavaVersions[h];
n="JavaPlugin."+d[0]+""+d[1];
b=d[0]+"."+d[1]+".";
for(l=d[2];
l>=0;
l--){r="JavaWebStart.isInstalled."+b+l+".0";
if(e.compareNums(d[0]+","+d[1]+","+l+",0",j)>=0&&!e.getAXO(r)){continue
}m=e.compareNums(d[0]+","+d[1]+","+l+",0",s)<0?true:false;
for(q=d[3];
q>=0;
q--){c=l+"_"+(q<10?"0"+q:q);
o=n+c;
if(e.getAXO(o)&&(m||e.getAXO(r))){i.push(b+c);
if(!p){return i
}}if(o==g){return i
}}if(e.getAXO(n+l)&&(m||e.getAXO(r))){i.push(b+l);
if(!p){return i
}}if(n+l==g){return i
}}}return i
}},navMime:{$:1,hasRun:0,mimetype:"",version:"",length:0,mimeObj:0,pluginObj:0,disabled:function(){return this.$$.isDisabled.navMime()
},query:function(){var i=this,f=i.$,a=i.$$,b=(i.hasRun||i.disabled());
i.hasRun=1;
if(b){return i
};
var n=/^\s*application\/x-java-applet;jpi-version\s*=\s*(\d.*)$/i,g,l,j,d="",h="a",o,m,k={},c=f.formatNum("0");
for(l=0;
l<navigator.mimeTypes.length;
l++){o=navigator.mimeTypes[l];
m=o?o.enabledPlugin:0;
g=o&&n.test(o.type||d)?f.formatNum(f.getNum(RegExp.$1)):0;
if(g&&m&&(m.description||m.name)){if(!k[h+g]){i.length++
}k[h+g]=o.type;
if(f.compareNums(g,c)>0){c=g
}}}g=k[h+c];
if(g){o=f.hasMimeType(g);
i.mimeObj=o;
i.pluginObj=o?o.enabledPlugin:0;
i.mimetype=g;
i.version=c};
return i
}},navPlugin:{$:1,hasRun:0,version:"",disabled:function(){return this.$$.isDisabled.navPlugin()
},query:function(){var m=this,e=m.$,c=m.$$,h=c.navigator,j,l,k,g,d,a,i,f=0,b=(m.hasRun||m.disabled());
m.hasRun=1;
if(b){return m
};
a=h.pluginObj.name||"";
i=h.pluginObj.description||"";
if(!f||c.debug){g=/Java.*TM.*Platform[^\d]*(\d+)(?:[\.,_](\d*))?(?:\s*[Update]+\s*(\d*))?/i;
if((g.test(a)||g.test(i))&&parseInt(RegExp.$1,10)>=5){f="1,"+RegExp.$1+","+(RegExp.$2?RegExp.$2:"0")+","+(RegExp.$3?RegExp.$3:"0")}}if(!f||c.debug){g=/Java[^\d]*Plug-in/i;
l=g.test(i)?e.formatNum(e.getNum(i)):0;
k=g.test(a)?e.formatNum(e.getNum(a)):0;
if(l&&(e.compareNums(l,e.formatNum("1,3"))<0||e.compareNums(l,e.formatNum("2"))>=0)){l=0
}if(k&&(e.compareNums(k,e.formatNum("1,3"))<0||e.compareNums(k,e.formatNum("2"))>=0)){k=0
}d=l&&k?(e.compareNums(l,k)>0?l:k):(l||k);
if(d){f=d}}if(!f&&e.isSafari&&e.OS==2){j=e.findNavPlugin("Java.*\\d.*Plug-in.*Cocoa",0);
if(j){l=e.getNum(j.description);
if(l){f=l
}}};
if(f){m.version=e.formatNum(f)
};
return m
}},lang:{$:1,System:{$:1,hasRun:0,result:[null,null],disabled:function(){return this.$$.isDisabled.windowDotJava()
},getPropertyHas:function(a){var b=this,d=b.$,c=b.getProperty()[0];
return(a&&c&&d.compareNums(d.formatNum(a),d.formatNum(c))===0)?1:0
},getProperty:function(){var f=this,g=f.$,d=f.$$,i,h={},b=f.hasRun||f.disabled();
f.hasRun=1;
if(!b){
var a="java_qqq990";
g[a]=null;
try{var c=document.createElement("script");
c.type="text/javascript";
c.appendChild(document.createTextNode('(function(){var e,a;try{a=[window.java.lang.System.getProperty("java.version")+" ",window.java.lang.System.getProperty("java.vendor")+" "]}catch(e){};'+g.name+"."+a+"=a||0})();"));
g.head.insertBefore(c,g.head.firstChild);
g.head.removeChild(c)
}catch(i){}if(g[a]&&g.isArray(g[a])){f.result=[].concat(g[a])
}}return f.result
}}},applet:{$:1,results:[[null,null],[null,null],[null,null]],getResult:function(){var c=this.results,a,b=[];
for(a=0;
a<c.length;
a++){b=c[a];
if(b[0]){break
}}return[].concat(b)
},HTML:[0,0,0],active:[0,0,0],DummyObjTagHTML:0,DummySpanTagHTML:0,allowed:[1,1,1],VerifyTagsHas:function(c){var d=this,b;
for(b=0;
b<d.allowed.length;
b++){if(d.allowed[b]===c){return 1
}}return 0
},saveAsVerifyTagsArray:function(c){var b=this,d=b.$,a;
if(d.isArray(c)){for(a=0;
a<b.allowed.length;
a++){if(d.isNum(c[a])){if(c[a]<0){c[a]=0
}if(c[a]>3){c[a]=3
}b.allowed[a]=c[a]}}}},setVerifyTagsArray:function(d){var b=this,c=b.$,a=b.$$;
if(a.getVersionDone===null){b.saveAsVerifyTagsArray(a.getVerifyTagsDefault())
}if(a.debug||(a.verify&&a.verify.isEnabled())){b.saveAsVerifyTagsArray([3,3,3])
}else{if(d){b.saveAsVerifyTagsArray(d)
}}},allDisabled:function(){return this.$$.isDisabled.allApplets()
},isDisabled:function(d){var b=this,c=b.$,a=b.$$;
if(d==2&&!c.isIE){return 1
}if(d===0||d==2){return a.isDisabled.ObjectTag()
}if(d==1){return a.isDisabled.AppletTag()
}},can_Insert_Query:function(b){var a=this;
if(a.HTML[b]){return 0
}return !a.isDisabled(b)
},can_Insert_Query_Any:function(){var b=this,a;
for(a=0;
a<b.results.length;
a++){if(b.can_Insert_Query(a)){return 1
}}return 0
},should_Insert_Query:function(d){var b=this,e=b.allowed,c=b.$,a=b.$$;
if(!b.can_Insert_Query(d)){return 0
}if(e[d]==3){return 1
}if(e[d]==2.8&&!b.getResult()[0]){return 1
}if(e[d]==2.5&&!a.lang.System.getProperty()[0]){return 1
}if(e[d]==2.2&&!a.lang.System.getProperty()[0]&&!b.getResult()[0]){return 1
}if(!a.nonAppletDetectionOk(a.version0)){if(e[d]==2){return 1
}if(e[d]==1&&!b.getResult()[0]){return 1
}}return 0
},should_Insert_Query_Any:function(){var b=this,a;
for(a=0;
a<b.allowed.length;
a++){if(b.should_Insert_Query(a)){return 1
}}return 0
},query:function(f){var h,a=this,g=a.$,d=a.$$,i=null,j=null,b=a.results,c;
if((b[f][0]&&b[f][1])||(d.debug&&d.OTF<3)){return
}c=g.getDOMobj(a.HTML[f],true);
if(c){
try{i=g.getNum(c.getVersion()+" ");
j=c.getVendor()+" ";
c.statusbar(g.winLoaded?" ":" ")
}catch(h){}if(i&&g.isStrNum(i)){b[f]=[i,j]}else{};
if(i&&g.isStrNum(i)&&Math.abs(d.info.getPlugin2Status())<3){d.info.setPlugin2Status(-3);
try{if(c.Packages.java.applet){d.info.setPlugin2Status(3)
}}catch(h){}};
try{if(g.isIE&&i&&c.readyState!=4){g.garbage=true;
c.parentNode.removeChild(c)
}}catch(h){}}},insert_Query_Any:function(){var d=this,i=d.$,e=d.$$,l=d.results,p=d.HTML,a="&nbsp;&nbsp;&nbsp;&nbsp;",g="A.class",m=i.file.getValid(e);
if(!m){return d.getResult()
}if(e.OTF<1){e.OTF=1
}if(d.allDisabled()){
return d.getResult()
}if(e.OTF<1.5){e.OTF=1.5
}var j=m.name+m.ext,h=m.path;
var f=["archive",j,"code",g],c=["mayscript","true"],o=["scriptable","true"].concat(c),n=e.navigator,b=!i.isIE&&n.mimeObj&&n.mimeObj.type?n.mimeObj.type:e.mimeType[0];
if(d.should_Insert_Query(0)){if(e.OTF<2){e.OTF=2
};
p[0]=i.isIE?i.insertHTML("object",["type",b],["codebase",h].concat(f).concat(o),a,e):i.insertHTML("object",["type",b],["codebase",h].concat(f).concat(o),a,e);
l[0]=[0,0];
d.query(0)
}if(d.should_Insert_Query(1)){if(e.OTF<2){e.OTF=2
};
p[1]=i.isIE?i.insertHTML("applet",["alt",a].concat(c).concat(f),["codebase",h].concat(c),a,e):i.insertHTML("applet",["codebase",h,"alt",a].concat(c).concat(f),[].concat(c),a,e);
l[1]=[0,0];
d.query(1)
}if(d.should_Insert_Query(2)){if(e.OTF<2){e.OTF=2
};
p[2]=i.isIE?i.insertHTML("object",["classid",e.classID],["codebase",h].concat(f).concat(o),a,e):i.insertHTML();
l[2]=[0,0];
d.query(2)
}if(!d.DummyObjTagHTML&&!e.isDisabled.ObjectTag()){d.DummyObjTagHTML=i.insertHTML("object",[],[],a)
}if(!d.DummySpanTagHTML){d.DummySpanTagHTML=i.insertHTML("",[],[],a)
};
var k=e.NOTF;
if(e.OTF<3&&k.shouldContinueQuery()){e.OTF=3;
k.onIntervalQuery=i.handler(k.$$onIntervalQuery,k);
if(!i.winLoaded){i.WLfuncs0.push([k.winOnLoadQuery,k])
}setTimeout(k.onIntervalQuery,k.intervalLength)};
return d.getResult()
}},NOTF:{$:1,count:0,countMax:25,intervalLength:250,shouldContinueQuery:function(){var e=this,d=e.$,c=e.$$,b=c.applet,a;
for(a=0;
a<b.results.length;
a++){if(b.HTML[a]&&!b.results[a][0]&&(b.allowed[a]>=2||(b.allowed[a]==1&&!b.getResult()[0]))&&e.isAppletActive(a)>=0){return 1
}}return 0
},isJavaActive:function(d){var f=this,c=f.$$,a,b,e=-9;
for(a=0;
a<c.applet.HTML.length;
a++){b=f.isAppletActive(a,d);
if(b>e){e=b
}}return e
},isAppletActive:function(c,a){var d=this,b=d.$$.applet.active;
if(!a){b[c]=d.isAppletActive_(c)
}return b[c]
},isAppletActive_:function(d){var g=this,f=g.$,b=g.$$,l=b.navigator,a=b.applet,h=a.HTML[d],i,k,c=0,j=f.getTagStatus(h,a.DummySpanTagHTML,a.DummyObjTagHTML,g.count);
if(j==-2){return -2
}try{if(f.isIE&&f.verIE>=b.minIEver&&f.getDOMobj(h).object){return 1
}}catch(i){}for(k=0;
k<a.active.length;
k++){if(a.active[k]>0){c=1
}}if(j==1&&(f.isIE||((b.version0&&l.javaEnabled()&&l.mimeObj&&(h.tagName=="object"||c))||b.lang.System.getProperty()[0]))){return 1
}if(j<0){return -1
}return 0
},winOnLoadQuery:function(c,d){var b=d.$$,a;
if(b.OTF==3){a=d.queryAllApplets();
d.queryCompleted(a[1],a[2])
}},$$onIntervalQuery:function(d){var c=d.$,b=d.$$,a;
if(b.OTF==3){a=d.queryAllApplets();
if(!d.shouldContinueQuery()||(c.winLoaded&&d.count>d.countMax)){d.queryCompleted(a[1],a[2])
}}d.count++;
if(b.OTF==3){setTimeout(d.onIntervalQuery,d.intervalLength)
}},queryAllApplets:function(){var g=this,f=g.$,e=g.$$,d=e.applet,b,a,c;
for(b=0;
b<d.results.length;
b++){d.query(b)
}a=d.getResult();
c=a[0]?true:false;
return[c,a[0],a[1]]
},queryCompleted:function(c,f){var e=this,d=e.$,b=e.$$;
if(b.OTF>=4){return
}b.OTF=4;
var a=e.isJavaActive();
b.setPluginStatus(c,f,0);
if(b.funcs){
d.callArray(b.funcs)}if(d.onDoneEmptyDiv){d.onDoneEmptyDiv()
}}},zz:0},devalvr:{mimeType:"application/x-devalvrx",progID:"DevalVRXCtrl.DevalVRXCtrl.1",classID:"clsid:5D2CF9D0-113A-476B-986F-288B54571614",getVersion:function(){var h=this,a=null,f,b=h.$,d;
if(!b.isIE){f=b.findNavPlugin("DevalVR");
if(f&&f.name&&b.hasMimeType(h.mimeType)){a=f.description.split(" ")[3]
}h.installed=a?1:-1
}else{var g,c;
g=b.getAXO(h.progID);
if(g){c=b.getDOMobj(b.insertHTML("object",["classid",h.classID],["src",""],"",h));
if(c){try{if(c.pluginversion){a="00000000"+c.pluginversion.toString(16);
a=a.substr(a.length-8,8);
a=parseInt(a.substr(0,2),16)+","+parseInt(a.substr(2,2),16)+","+parseInt(a.substr(4,2),16)+","+parseInt(a.substr(6,2),16)
}}catch(d){}}}h.installed=a?1:(g?0:-1)
}h.version=b.formatNum(a)
}},flash:{mimeType:"application/x-shockwave-flash",progID:"ShockwaveFlash.ShockwaveFlash",classID:"clsid:D27CDB6E-AE6D-11CF-96B8-444553540000",getVersion:function(){var b=function(i){if(!i){return null
}var e=/[\d][\d\,\.\s]*[rRdD]{0,1}[\d\,]*/.exec(i);
return e?e[0].replace(/[rRdD\.]/g,",").replace(/\s/g,""):null
};
var j=this,g=j.$,k,h,l=null,c=null,a=null,f,m,d;
if(!g.isIE){m=g.hasMimeType(j.mimeType);
if(m){f=g.getDOMobj(g.insertHTML("object",["type",j.mimeType],[],"",j));
try{l=g.getNum(f.GetVariable("$version"))
}catch(k){}}if(!l){d=m?m.enabledPlugin:null;
if(d&&d.description){l=b(d.description)
}if(l){l=g.getPluginFileVersion(d,l)
}}}else{for(h=15;
h>2;
h--){c=g.getAXO(j.progID+"."+h);
if(c){a=h.toString();
break
}}if(!c){c=g.getAXO(j.progID)
}if(a=="6"){try{c.AllowScriptAccess="always"
}catch(k){return"6,0,21,0"
}}try{l=b(c.GetVariable("$version"))
}catch(k){}if(!l&&a){l=a
}}j.installed=l?1:-1;
j.version=g.formatNum(l);
return true
}},shockwave:{mimeType:"application/x-director",progID:"SWCtl.SWCtl",classID:"clsid:166B1BCA-3F9C-11CF-8075-444553540000",getVersion:function(){var a=null,b=null,g,f,d=this,c=d.$;
if(!c.isIE){f=c.findNavPlugin("Shockwave\\s*for\\s*Director");
if(f&&f.description&&c.hasMimeType(d.mimeType)){a=c.getNum(f.description)
}if(a){a=c.getPluginFileVersion(f,a)
}}else{try{b=c.getAXO(d.progID).ShockwaveVersion("")
}catch(g){}if(c.isString(b)&&b.length>0){a=c.getNum(b)
}else{if(c.getAXO(d.progID+".8")){a="8"
}else{if(c.getAXO(d.progID+".7")){a="7"
}else{if(c.getAXO(d.progID+".1")){a="6"
}}}}}d.installed=a?1:-1;
d.version=c.formatNum(a)
}},windowsmediaplayer:{mimeType:["application/x-mplayer2","application/asx","application/x-ms-wmp"],navPluginObj:null,progID:"wmplayer.ocx",classID:"clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6",INSTALLED:{dfault:null,inputMime:{}},getVersion:function(i,g){var c=this,f=c.$,l,e=null,h=null,j=c.mimeType,k="Totem|VLC",b,d,a;
c.installed=-1;
if(f.isString(g)){g=g.replace(/\s/g,"");
if(g){j=g
}}else{g=null
}if(g){d=c.INSTALLED.inputMime[g];
if(f.isDefined(d)){c.installed=d;
return
}}else{d=c.INSTALLED.dfault;
if(d!==null){c.installed=d;
return
}}if(!f.isIE){if(f.OS<20&&f.OS>=3){c.installed=-1;
return
}a={wmp:"Windows\\s*Media\\s*Player.*Plug-?in|Flip4Mac.*Windows\\s*Media.*Plug-?in",wmpFirefox:"Windows\\s*Media\\s*Player.*Firefox.*Plug-?in",avoidPlayers:"Totem|VLC|RealPlayer"};
if(c.getVersionDone!==0){c.getVersionDone=0;
e=f.getMimeEnabledPlugin(c.mimeType,a.wmp,a.avoidPlayers);
if(!g){l=e
}if(!e&&f.hasMimeType(c.mimeType)){e=f.findNavPlugin(a.wmp,0,a.avoidPlayers)
}if(e){c.navPluginObj=e;
b=(f.isGecko&&f.compareNums(f.verGecko,f.formatNum("1.8"))<0);
b=b||(f.isOpera&&f.verOpera<10);
b=b||f.isChrome;
if(!b&&f.getMimeEnabledPlugin(c.mimeType[2],a.wmpFirefox,a.avoidPlayers)){d=f.getDOMobj(f.insertHTML("object",["type",c.mimeType[2],"data",""],["src",""],"",c));
if(d){h=d.versionInfo
}}}}else{h=c.version
}if(!f.isDefined(l)){l=f.getMimeEnabledPlugin(j,a.wmp,a.avoidPlayers)
}c.installed=l&&h?1:(l?0:(c.navPluginObj?-0.2:-1))
}else{e=f.getAXO(c.progID);
if(e){h=e.versionInfo
}c.installed=e&&h?1:(e?0:-1)
}if(!c.version){c.version=f.formatNum(h)
}if(g){c.INSTALLED.inputMime[g]=c.installed
}else{c.INSTALLED.dfault=c.installed
}}},silverlight:{mimeType:"application/x-silverlight",progID:"AgControl.AgControl",digits:[20,20,9,12,31],getVersion:function(){var e=this,c=e.$,k=document,i=null,b=null,f=null,h=true,a=[1,0,1,1,1],r=[1,0,1,1,1],j=function(d){return(d<10?"0":"")+d.toString()
},n=function(s,d,u,v,t){return(s+"."+d+"."+u+j(v)+j(t)+".0")
},o=function(s,d,t){return q(s,(d==0?t:r[0]),(d==1?t:r[1]),(d==2?t:r[2]),(d==3?t:r[3]),(d==4?t:r[4]))
},q=function(v,t,s,x,w,u){var u;
try{return v.IsVersionSupported(n(t,s,x,w,u))
}catch(u){}return false
};
if(!c.isIE){var g;
if(c.hasMimeType(e.mimeType)){g=c.isGecko&&c.compareNums(c.verGecko,c.formatNum("1.6"))<=0;
if(c.isGecko&&g){h=false
}f=c.findNavPlugin("Silverlight.*Plug-?in",0);
if(f&&f.description){i=c.formatNum(f.description)
}if(i){r=i.split(c.splitNumRegx);
if(parseInt(r[2],10)>=30226&&parseInt(r[0],10)<2){r[0]="2"
}i=r.join(",")
}}e.installed=f&&h&&i?1:(f&&h?0:(f?-0.2:-1))
}else{b=c.getAXO(e.progID);
var m,l,p;
if(b&&q(b,a[0],a[1],a[2],a[3],a[4])){for(m=0;
m<e.digits.length;
m++){p=r[m];
for(l=p+(m==0?0:1);
l<=e.digits[m];
l++){if(o(b,m,l)){h=true;
r[m]=l
}else{break
}}if(!h){break
}}if(h){i=n(r[0],r[1],r[2],r[3],r[4])
}}e.installed=b&&h&&i?1:(b&&h?0:(b?-0.2:-1))
}e.version=c.formatNum(i)
}},vlc:{mimeType:"application/x-vlc-plugin",progID:"VideoLAN.VLCPlugin",classID:"clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921",compareNums:function(e,d){var c=this.$,k=e.split(c.splitNumRegx),i=d.split(c.splitNumRegx),h,b,a,g,f,j;
for(h=0;
h<Math.min(k.length,i.length);
h++){j=/([\d]+)([a-z]?)/.test(k[h]);
b=parseInt(RegExp.$1,10);
g=(h==2&&RegExp.$2.length>0)?RegExp.$2.charCodeAt(0):-1;
j=/([\d]+)([a-z]?)/.test(i[h]);
a=parseInt(RegExp.$1,10);
f=(h==2&&RegExp.$2.length>0)?RegExp.$2.charCodeAt(0):-1;
if(b!=a){return(b>a?1:-1)
}if(h==2&&g!=f){return(g>f?1:-1)
}}return 0
},getVersion:function(){var c=this,b=c.$,f,a=null,d;
if(!b.isIE){if(b.hasMimeType(c.mimeType)){f=b.findNavPlugin("VLC.*Plug-?in",0,"Totem");
if(f&&f.description){a=b.getNum(f.description,"[\\d][\\d\\.]*[a-z]*")
}}c.installed=a?1:-1
}else{f=b.getAXO(c.progID);
if(f){try{a=b.getNum(f.VersionInfo,"[\\d][\\d\\.]*[a-z]*")
}catch(d){}}c.installed=a?1:(f?0:-1)
}c.version=b.formatNum(a)
}},adobereader:{mimeType:"application/pdf",navPluginObj:null,progID:["AcroPDF.PDF","PDF.PdfCtrl"],classID:"clsid:CA8A9780-280D-11CF-A24D-444553540000",INSTALLED:{},pluginHasMimeType:function(d,c,f){var b=this,e=b.$,a;
for(a in d){if(d[a]&&d[a].type&&d[a].type==c){return 1
}}if(e.getMimeEnabledPlugin(c,f)){return 1
}return 0
},getVersion:function(l,j){var g=this,d=g.$,i,f,m,n,b=null,h=null,k=g.mimeType,a,c;
if(d.isString(j)){j=j.replace(/\s/g,"");
if(j){k=j
}}else{j=null
}if(d.isDefined(g.INSTALLED[k])){g.installed=g.INSTALLED[k];
return
}if(!d.isIE){a="Adobe.*PDF.*Plug-?in|Adobe.*Acrobat.*Plug-?in|Adobe.*Reader.*Plug-?in";
if(g.getVersionDone!==0){g.getVersionDone=0;
b=d.getMimeEnabledPlugin(g.mimeType,a);
if(!j){n=b
}if(!b&&d.hasMimeType(g.mimeType)){b=d.findNavPlugin(a,0)
}if(b){g.navPluginObj=b;
h=d.getNum(b.description)||d.getNum(b.name);
h=d.getPluginFileVersion(b,h);
if(!h&&d.OS==1){if(g.pluginHasMimeType(b,"application/vnd.adobe.pdfxml",a)){h="9"
}else{if(g.pluginHasMimeType(b,"application/vnd.adobe.x-mars",a)){h="8"
}}}}}else{h=g.version
}if(!d.isDefined(n)){n=d.getMimeEnabledPlugin(k,a)
}g.installed=n&&h?1:(n?0:(g.navPluginObj?-0.2:-1))
}else{b=d.getAXO(g.progID[0])||d.getAXO(g.progID[1]);
c=/=\s*([\d\.]+)/g;
try{f=(b||d.getDOMobj(d.insertHTML("object",["classid",g.classID],["src",""],"",g))).GetVersions();
for(m=0;
m<5;
m++){if(c.test(f)&&(!h||RegExp.$1>h)){h=RegExp.$1
}}}catch(i){}g.installed=h?1:(b?0:-1)
}if(!g.version){g.version=d.formatNum(h)
}g.INSTALLED[k]=g.installed
}},pdfreader:{mimeType:"application/pdf",progID:["AcroPDF.PDF","PDF.PdfCtrl"],classID:"clsid:CA8A9780-280D-11CF-A24D-444553540000",OTF:null,fileUsed:0,fileEnabled:1,setPluginStatus:function(c,b){var a=this,d=a.$;
a.version=null;
if(a.installed!==0&&a.installed!=1){if(b==3){a.installed=-0.5
}else{a.installed=c?0:(d.isIE?-1.5:-1)
}}if(a.verify&&a.verify.isEnabled()){a.getVersionDone=0
}else{if(a.getVersionDone!=1){a.getVersionDone=b<2&&a.fileEnabled&&a.installed<=-1?0:1
}}},getVersion:function(l,f,b){var g=this,c=g.$,i=false,d,a,j,h=g.NOTF,m=g.doc,k=g.verify;
if(b!==true){b=false
}if(g.getVersionDone===null){g.OTF=0;
if(k){k.begin()
}}if(((c.isGecko&&c.compareNums(c.verGecko,"2,0,0,0")<=0&&c.OS<=4)||(c.isOpera&&c.verOpera<=11&&c.OS<=4)||(c.isChrome&&c.compareNums(c.verChrome,"10,0,0,0")<0&&c.OS<=4)||0)&&!b){g.fileEnabled=0
}c.file.save(g,".pdf",f);
if(g.getVersionDone===0){if(g.OTF<2&&(g.installed<0||b)){if(m.insertHTMLQuery(b)>0){i=true
}g.setPluginStatus(i,g.OTF)
}return
}if(!b){if(!c.isIE){if(c.hasMimeType(g.mimeType)){i=true
}}else{try{if((c.getAXO(g.progID[0])||c.getAXO(g.progID[1])).GetVersions()){i=true
}}catch(j){}}}if(g.OTF<2&&(!i||b)){if(m.insertHTMLQuery(b)>0){i=true
}}g.setPluginStatus(i,g.OTF)
},doc:{$:1,HTML:0,DummyObjTagHTML:0,DummySpanTagHTML:0,queryObject:function(c){var g=this,d=g.$,b=g.$$,a;
if(d.isIE){a=-1;
try{if(d.getDOMobj(g.HTML).GetVersions()){a=1
}}catch(f){}}else{a=d.getTagStatus(g.HTML,g.DummySpanTagHTML,g.DummyObjTagHTML,c)
};
return a
},insertHTMLQuery:function(c){var h=this,d=h.$,f=h.$$,i,b=f.pdf,e=d.file.getValid(f),a="&nbsp;&nbsp;&nbsp;&nbsp;";
if(e){e=e.full
}if(d.isIE){if(c&&(!e||!f.fileEnabled)){return 0
}if(!h.HTML){h.HTML=d.insertHTML("object",["classid",f.classID],["src",c&&e?e:""],a,f)
}if(c){f.fileUsed=1
}}else{if(!e||!f.fileEnabled){return 0
}if(!h.HTML){h.HTML=d.insertHTML("object",["type",f.mimeType,"data",e],["src",e],a,f)
}f.fileUsed=1
}if(f.OTF<2){f.OTF=2
}if(!h.DummyObjTagHTML){h.DummyObjTagHTML=d.insertHTML("object",[],[],a)
}if(!h.DummySpanTagHTML){h.DummySpanTagHTML=d.insertHTML("",[],[],a)
}i=h.queryObject();
if(i!==0){return i
};
var g=f.NOTF;
if(f.OTF<3&&h.HTML&&g){f.OTF=3;
g.onIntervalQuery=d.handler(g.$$onIntervalQuery,g);
if(!d.winLoaded){d.WLfuncs0.push([g.winOnLoadQuery,g])
}setTimeout(g.onIntervalQuery,g.intervalLength)};
return i
}},NOTF:{$:1,count:0,countMax:25,intervalLength:250,$$onIntervalQuery:function(e){var c=e.$,b=e.$$,d=b.doc,a;
if(b.OTF==3){a=d.queryObject(e.count);
if(a>0||a<0||(c.winLoaded&&e.count>e.countMax)){e.queryCompleted(a)
}}e.count++;
if(b.OTF==3){setTimeout(e.onIntervalQuery,e.intervalLength)
}},winOnLoadQuery:function(c,e){var b=e.$$,d=b.doc,a;
if(b.OTF==3){a=d.queryObject(e.count);
e.queryCompleted(a)
}},queryCompleted:function(b){var d=this,c=d.$,a=d.$$;
if(a.OTF==4){return
}a.OTF=4;
a.setPluginStatus(b>0?true:false,a.OTF);
if(a.funcs){
c.callArray(a.funcs)}if(c.onDoneEmptyDiv){c.onDoneEmptyDiv()
}}},getInfo:function(){var b=this,c=b.$,a={OTF:(b.OTF<3?0:(b.OTF==3?1:2)),DummyPDFused:(b.fileUsed?true:false)};
return a
},zz:0},realplayer:{mimeType:["audio/x-pn-realaudio-plugin"],progID:["rmocx.RealPlayer G2 Control","rmocx.RealPlayer G2 Control.1","RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)","RealVideo.RealVideo(tm) ActiveX Control (32-bit)","RealPlayer"],classID:"clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA",INSTALLED:{},q1:[[11,0,0],[999],[663],[663],[663],[660],[468],[468],[468],[468],[468],[468],[431],[431],[431],[372],[180],[180],[172],[172],[167],[114],[0]],q3:[[6,0],[12,99],[12,69],[12,69],[12,69],[12,69],[12,69],[12,69],[12,69],[12,69],[12,69],[12,69],[12,46],[12,46],[12,46],[11,3006],[11,2806],[11,2806],[11,2804],[11,2804],[11,2799],[11,2749],[11,2700]],compare:function(g,f){var e,d=g.length,i=f.length,c,h;
for(e=0;
e<Math.max(d,i);
e++){c=e<d?g[e]:0;
h=e<i?f[e]:0;
if(c>h){return 1
}if(c<h){return -1
}}return 0
},convertNum:function(a,f,e){var g=this,c=g.$,d,b,h,i=null;
if(!a||!(d=c.formatNum(a))){return i
}d=d.split(c.splitNumRegx);
for(h=0;
h<d.length;
h++){d[h]=parseInt(d[h],10)
}if(g.compare(d.slice(0,Math.min(f[0].length,d.length)),f[0])!=0){return i
}b=d.length>f[0].length?d.slice(f[0].length):[];
if(g.compare(b,f[1])>0||g.compare(b,f[f.length-1])<0){return i
}for(h=f.length-1;
h>=1;
h--){if(h==1){break
}if(g.compare(f[h],b)==0&&g.compare(f[h],f[h-1])==0){break
}if(g.compare(b,f[h])>=0&&g.compare(b,f[h-1])<0){break
}}return e[0].join(".")+"."+e[h].join(".")
},getVersion:function(m,n){var j=this,k=null,c=0,g=0,d=j.$,q,i,s,a=j.mimeType[0];
if(d.isString(n)){n=n.replace(/\s/g,"");
if(n){a=n
}}else{n=null
}if(d.isDefined(j.INSTALLED[a])){j.installed=j.INSTALLED[a];
return
}if(!d.isIE){var l="RealPlayer.*Plug-?in",h=d.hasMimeType(j.mimeType),o=d.findNavPlugin(l,0);
if(h&&o){c=1;
if(n){if(d.getMimeEnabledPlugin(n,l)){g=1
}else{g=0
}}else{g=1
}}if(j.getVersionDone!==0){j.getVersionDone=0;
if(h){var p=1,b=null,r=null;
s=d.hasMimeType("application/vnd.rn-realplayer-javascript");
if(s){b=d.formatNum(d.getNum(s.enabledPlugin.description))
}if(d.OS==1&&b){var f=b.split(d.splitNumRegx);
r=true;
if(j.compare(f,[6,0,12,200])<0){r=false
}else{if(j.compare(f,[6,0,12,1739])<=0&&j.compare(f,[6,0,12,857])>=0){r=false
}}}if(r===false){p=0
}if(d.OS<=2){if(d.isGecko&&d.compareNums(d.verGecko,d.formatNum("1,8"))<0){p=0
}if(d.isChrome){p=0
}if(d.isOpera&&d.verOpera<10){p=0
}}else{p=0
}if(p){s=d.insertHTML("object",["type",j.mimeType[0]],["src","","autostart","false","imagestatus","false","controls","stopbutton"],"",j);
s=d.getDOMobj(s);
try{k=d.getNum(s.GetVersionInfo())
}catch(q){}d.setStyle(s,["display","none"])
}if(!k&&b&&r===false){s=j.convertNum(b,j.q3,j.q1);
k=s?s:b
}}}else{k=j.version
}j.installed=c&&g&&k?1:(c&&g?0:(c?-0.2:-1))
}else{s=null;
for(i=0;
i<j.progID.length;
i++){s=d.getAXO(j.progID[i]);
if(s){try{k=d.getNum(s.GetVersionInfo());
break
}catch(q){}}}j.installed=k?1:-1
}if(!j.version){j.version=d.formatNum(k)
}j.INSTALLED[a]=j.installed
}},zz:0}};
PluginDetect.initScript();
