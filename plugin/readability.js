
(function (){

  function readability(operation) {
    var window = content.window, document = content.document;
    // read !wget -O - http://www.readability.com/bookmarklet/read.js 2>/dev/null
    window.rdb=typeof window.rdb!=="object"?{}:window.rdb;var JSON;JSON||(JSON={}),function(){function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i&&typeof i=="object"&&typeof i.toJSON=="function"&&(i=i.toJSON(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g;return e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)typeof rep[c]=="string"&&(d=rep[c],e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g;return e}}function quote(a){escapable.lastIndex=0;return escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function f(a){return a<10?"0"+a:a}"use strict",typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(b&&typeof b!="function"&&(typeof b!="object"||typeof b.length!="number"))throw new Error("JSON.stringify");return str("",{"":a})}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver=="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")})}()
    window.rdb.bookmarklet=(function(){var baseUrl='https://www.readability.com',action=operation,optedOut=('false'==='true'),keepOffGrass=('false'==='true'),savePost=('false'==='true'),referredArticleUrl='',referredArticleId='',readPostUrl=baseUrl+'/articles/queue',savePostUrl=baseUrl+'/articles/queue',sendToKindleUrl=baseUrl+'/kindle/queue',kindleSetupUrl=baseUrl+'/kindle/setup',readbarUrl=baseUrl+'/read',failUrl=baseUrl+'/articles/fail',fromEmbed=(typeof window.rdbEmbed!=="undefined"),articlePreviouslyValidated=false,docHtml='',token,extensionType,extensionVersion,legacyBookmarklet,readUrl,charset,frameId,kindleFrameId,formId,messageCallbacks;function isQuirks(){if(typeof document.documentMode!=="undefined"&&document.documentMode<7){return true;}
    return false;}
    function getUrl(){var url,dummyLink;if(typeof window.readabilityUrl!=="undefined"&&window.readabilityUrl.length>0){url=window.readabilityUrl.toString();}else{url=window.location.href;}
    dummyLink=document.createElement('a');dummyLink.href=url;return dummyLink.href;}
    function getHost(url){var dummyLink=document.createElement('a');dummyLink.href=url;return dummyLink.hostname;}
    function urlIsParsable(url){var i,il,netloc;try{netloc=url.match(/^https?:\/\/([^\/]*)/)[1];}catch(e){return false;}
    if(keepOffGrass){return false;}
    return true;}
    function urlIsLocal(url){return url.indexOf(baseUrl)===0;}
    function listen(evnt,elem,func){if(elem.addEventListener){ elem.addEventListener(evnt,func,false);}else if(elem.attachEvent){ elem.attachEvent("on"+evnt,func);}else{return false;}
    return true;}
    function unlisten(evnt,elem,func,useCapture){if(elem.removeEventListener){elem.removeEventListener(evnt,func,useCapture);return true;}else if(elem.detachEvent){var r=elem.detachEvent("on"+evnt,func);return r;}else{return false;}}
    function loadingBox(){if(document.getElementById('rdb-ext-LoadingBox')){return document.getElementById('rdb-ext-LoadingBox');}
    var d=document.createElement('div'),cssPosition=isQuirks()?'absolute':'fixed',img;switch(action){ case'save':img='iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAARZJREFUeNrsmDEKwjAUhtMOgiDUEwgeoOA96uglnJycXIVOgjdw8AxewTN4BkGoCF3jX1CI0ITSNk0i/4NvadMkX15eCYmklCLkiCjguUAGcpA6nOMTTNsI7MHOg0VuJbABR092iVFAVAI13OVv5Jp2tkiUsQtTW10G1IcXsBx41RNQNMlA3KCzueMibvUXktb2rL5/9bsxKLsUsWsBtQ0FKEABClCAAhSgAAUoQAEKUIACNgRiYTcm4AQOYGRlBM2FUZf4XkSl4KY8v4KZof9CMwfjxZYtgTUoa949QNangI0a6Kt2nBUxBShAAQr8h0Cj+FuB1+cc472A7jB3FoGELgPVyXELVmAR4hYSoWeAAkPFW4ABAAMiHbjvzPGMAAAAAElFTkSuQmCC';break; case'send-to-kindle':img='iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4FJREFUeNrsWktIG1EUvSYx2KAYIkLAHwUlIBSJipCNUQQ/iGBxEalEiwjdGLIQCV0GSigSSoWC+EFCgyvR6s6FG3FRyCal+FtEqUWUEAjih0gkpPdOUdDq5CXOzEuoBw6TSd7L3PPefXfevTN5yWQSRPAS6USakKUgH6LIENKHDKTTMU9EQBlyG1kMyuIdcoa1sUrkNxsH4wkfkGopBJQBH5CrGqQQ8AL4gfnaGtaG19fXcHFxIbml+fn5UFhYmHF/JgFnZ2dQX18v23Cvr69DZWUlqFSqtPsy9Tg+PpbVXy4vLyEajWbUl0lAIpGQ3enJRWVzIR6orq5+9LdQKJTeDGQzngX8twIKCgqgtbU1NwWQ8bOzs9DQ0JB7Am6Mt1gskvyfRmnj5+fnoampKffWgBzGKyZALuMVcSEy3ufzQWNjY+6FUVbj9/f3IRaLZdcM6HQ6wW3EjK+trRXcitodHByAwWAAq9UKR0dHtHf/zU0Ai/GE5uZmgTdAw2FjYwN2dna+4el35BTSr6gLsRr/EMrLy2FgYAAWFxeJFtyRfsWvJxQVYDKZBNd4KsxmMywvL0N3d/c4nn5WTEAwGASbzQaRSESS2fR6vVBXV0fFtXHFotDu7i709fXdSTweAonc2tqC09NT0aR/cnKSItrEQ9UK2cIo5dH9/f0QCDxeKVxaWoLe3l5oaWkRMrC2tjbB2MPDw3/WRk9PD318o+h9gEZ2eHgY1tbWRNstLCzA5uamsPipMtHR0fHL5XLB+fn5bZv29nY6vFZ8K3F1dQWjo6Pg9/tTtq2qqgKHwwF7e3tWnJ2PnZ2dt25Iixph4baZc7vd4PF40unyPhwOO+x2u+BSer0eioqKqORYzC0fIBdxOp3plFC+4EIfoz5U2kEBcF8A8514dXVVEhFzc3MwNDQE09PTwjlFqxT4hJHq1crKyluKSAgt14xsZGQEKioqhAh1cnICpaVMz02maFNIm8P7oZRLYWtwcFDwa9zzQFdXF0uXAN5bzCggCH+f5PAVcBNxiGngB0Y0HR5juVwXimUURjUa+SdKq9XKl5HRosv0AiyDYzQaoaSkRL6MjHaFNTU1EI/HJS21q9XqJw+MRolplhPPxd1sFhDnaFdcCgERTsZTrI9KIYCykAQHATOYnbHPPr3sIUI78mdSGWwj3UhtCpvuMC/F6zZZjz8CDAA/xry7UQNcuAAAAABJRU5ErkJggg==';break; default:img='iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnxJREFUeNrsmkFIVEEYx98aCMLCwoIgdAgjCBZWDMHoZJfAsKOnDiIIhZ5EL4GhCIanopNhEEVRFIGgbCQGoigePAmCGEWRJAqRIC0JC/L6f/h/OA1vxX37Rlf4Pvjhk3k7M7+Z+WZgZxO+73sRoguMgAL4TFaJPO94JxSJEgVawShoBBsgRez4RZE1sGJIbp6WQAY8pMAuGAIv+FxPoazx91KRenYpskK5QOy7K4E0l8od/v8U3OcSOceOyjtJdmSD7yUtqSY+Vxdpp2AtwWUwW65AJ3jMJfIJ9HKkakEdl4O5JK6xk0HZPPgaMpOBVCB4PqTtD+BWuQI50AbegLsgb5VnObJpjtiiUXYZtLO8QJlZjq4dtayrmflVkoAnAkXI+YfxBzwHLSHvVYN28BK85XPaKK8D3eAj2AIToA9krXpSRnu5I/r1H8cVMOMbGAb1IZ+Rzt4D62AODICM1UkRfM9B+Q0mQc1JCpghnewEyZDPt3DWpKM/wBhoY2eDmVtgPanTEjCX2GtwI6SeJCXn+O5f0Gq1EVmgKqbzRLbN22AG/ATDxlmQ55lxnedHDRM/lqhycLrLtjgIvoAlniEpY7+PNVwIeNbZMA7GXDXgWsB5qIAKqIAKqIAKqIAKqIAKqIAKqIAKqIAKqEDsAh3gCdg/qwJyjdQDGsD0WV5Cchl3k6w57It8b7rsMgdkFq6Afu/gtjHu2ANXwQXv4DLRSRLLKD0CFx3mh9x0TrnehSomP8rdRsvNj1dguxLOgWnORk+J+fGOyzFfCQfZPvPiqPyQO+dnIckbPZeOe5kWgQzvhn1eADppJxHx5zalhPxARG7sH7io/J8AAwBqlY+jtamg0AAAAABJRU5ErkJggg==';break;}
    d.setAttribute('id','rdb-ext-LoadingBox');d.style.cssText=['display: block;','height: 107px;','left: 50%;','margin-left: -95px;','padding: 22px 0 0;','position: '+cssPosition+';','top: 20%;','width: 189px;','z-index: 500000;','background-color: #232323;','-moz-border-radius: 10px;','-webkit-border-radius: 10px;','border-radius: 10px;','border-width: 1px 0 0 1px;','border-style: solid;','border-color: #000;','filter: alpha(opacity=85);','-moz-opacity: .85;','opacity: .85;','text-align: center;'].join('');d.innerHTML=['<img id="rdb-ext-LoadingImage" height="48" width="48" style="display: inline-block; float: none; margin: 0; padding: 0; border: none; visibility: visible; opacity: 1;" src="data:image/png;base64,',img,'" />','<div id="rdb-ext-LoadingText" style="display:block; margin-left:0; padding-top: 10px; color: #FFFFFF; font: bold 18px Georgia; text-align: center;"><span id="rdb-ext-LoadingInnerText">Saving</span></div>'].join('');document.body.appendChild(d);return d;}
    function showLoading(text,loading){loadingBox();var loadTxt=document.getElementById('rdb-ext-LoadingText'),loadDiv=(loading)?document.getElementById('rdb-ext-LoadingInnerText'):document.getElementById('rdb-ext-LoadingText'),ellipse=document.getElementById('rdb-ext-ellipses-loader')||document.createElement('span');loadTxt.style.marginLeft='0px';if(text){loadDiv.innerHTML=text;}
    if(loading){loadTxt.style.marginLeft='20px';ellipse.setAttribute('id','rdb-ext-ellipses-loader');ellipse.style.cssText=['display: inline-block;','width: 22px;','text-align: left;'].join('');loadTxt.appendChild(ellipse);window.setInterval(function(){ellipse.innerHTML=(ellipse.innerHTML.length<3)?ellipse.innerHTML+'.':'';},500);}}
    function hideLoading(){var loadBox=document.getElementById('rdb-ext-LoadingBox');if(loadBox){loadBox.parentNode.removeChild(loadBox);}}
    function showKindleSetup(){var kindleSetupFrame=document.getElementById(kindleFrameId),windowHeight=window.innerHeight||document.documentElement.clientHeight,windowWidth=window.innerWidth||document.documentElement.clientWidth,cssWidth=738,cssHeight=564,cssTop=Math.max(10,(windowHeight-cssHeight)/5),cssPosition=(isQuirks()||windowWidth-150<cssWidth||windowHeight-150<cssHeight)?'absolute':'fixed';if(kindleSetupFrame===null){try{kindleSetupFrame=document.createElement('<iframe name="'+kindleFrameId+'">');}catch(ex){kindleSetupFrame=document.createElement('iframe');}
    document.body.appendChild(kindleSetupFrame);}
    kindleSetupFrame.setAttribute('id',kindleFrameId);kindleSetupFrame.setAttribute('name',kindleFrameId);kindleSetupFrame.setAttribute('src',kindleSetupUrl);kindleSetupFrame.setAttribute('allowTransparency','true');kindleSetupFrame.style.cssText=['background: url('+baseUrl+'/static/images/bg_login_modal.png);','padding: 6px;','border:none;','display: none;','z-index: 50000;','position: '+cssPosition+';','width: '+cssWidth+'px;','height: '+cssHeight+'px;','left: 50%;','margin-left: -'+(cssWidth/2)+'px;','top: '+cssTop+'px'].join(' ');function setupFrameLoaded(){kindleSetupFrame.style.display='block';hideLoading();unlisten('load',kindleSetupFrame,setupFrameLoaded);}
    listen('load',kindleSetupFrame,setupFrameLoaded);}
    function hideKindleSetup(){document.getElementById(kindleFrameId).style.display='none';}
    messageCallbacks={"queue_success":function(args){showLoading('Saved');window.setTimeout(function(){hideLoading();},1000);},"send_to_kindle_success":function(args){showLoading('Sent');window.setTimeout(function(){hideLoading();},1000);},"send_to_kindle_failure":function(args){alert("Sorry, we were unable to send this article to your Kindle. "+"Support has been contacted automatically to resolve this issue.");hideLoading();},"show_kindle_setup":function(args){showKindleSetup();},"kindle_setup_success":function(args){hideLoading();hideKindleSetup();if(args.sendArticle!==false){sendToKindle();}},"kindle_setup_cancelled":function(args){hideLoading();hideKindleSetup();}};function receiveMessage(event){var eventObject,eventName,eventArgs;try{eventObject=JSON.parse(event.data);}catch(e){return false;}
    if(typeof eventObject!=="object"){return false;}
    eventName=eventObject.event;eventArgs=eventObject.args;if(typeof messageCallbacks[eventName]!=="undefined"){return messageCallbacks[eventName](eventObject.args);}}
    function minify(doc_node){var i,il,html,preTags=doc_node.getElementsByTagName('pre');for(i=0;i<preTags.length;i++){preTags[i].innerHTML=preTags[i].innerHTML.replace(/ /g,'&nbsp;').replace(/\t/g,'&nbsp;&nbsp;&nbsp;&nbsp;').replace(/\n/g,'--rdb-newline--');}
    html="<html>"+doc_node.innerHTML+"</html>";html=html.replace(/[\s\t\r\n]+/g,' ');html=html.replace(/<!--.*?-->/g,'');html=html.replace(/--rdb-newline--/g,"\n");for(i=0;i<preTags.length;i++){preTags[i].innerHTML=preTags[i].innerHTML.replace(/--rdb-newline--/g,"\n")}
    html=html.replace(/<script\b[^>]*>(.*?)<\/script\s*>/gi,'');return html;}
    function getFrame(){var f;try{f=document.createElement('<iframe name="'+frameId+'">');}catch(ex){f=document.createElement('iframe');}
    f.setAttribute('id',frameId);f.setAttribute('name',frameId);f.setAttribute('allowTransparency','true');f.style.cssText='display: none;';return f;}
    function getForm(url){var f=document.createElement('form');f.setAttribute('id',formId);f.setAttribute('action',url);f.setAttribute('accept-charset',charset);f.setAttribute('enctype','application/x-www-form-urlencoded');f.setAttribute('method','post');return f;}
    function submitForm(postUrl,postToFrame,extraInputs){var inputKey,formInputs,newInput,postFrame,postForm=getForm(postUrl);if(postToFrame){postFrame=getFrame();document.body.appendChild(postFrame);postForm.setAttribute('target',postFrame.getAttribute('name'));}
    document.body.appendChild(postForm);formInputs={"token":token,"extensionType":extensionType,"extensionVersion":extensionVersion,"extensionBrowser":extensionBrowser,"fromEmbed":fromEmbed?1:0,"legacyBookmarklet":legacyBookmarklet,"url":readUrl,"doc":docHtml,"charset":charset};for(input in extraInputs){if(extraInputs.hasOwnProperty(input)){formInputs[input]=extraInputs[input];}}
    for(inputKey in formInputs){if(formInputs.hasOwnProperty(inputKey)&& typeof formInputs[inputKey]!=='undefined'){newInput=document.createElement('input');newInput.setAttribute('type','hidden');newInput.setAttribute('name',inputKey);newInput.setAttribute('value',formInputs[inputKey]);postForm.appendChild(newInput);}}
    window.setTimeout(function(){postForm.submit();},50);}
    function read(){showLoading('Converting',true);submitForm(readPostUrl,false,{"read":1});}
    function save(){showLoading('Saving',true);submitForm(savePostUrl,true,{"read":0});return;}
    function sendToKindle(){showLoading('Sending',true);submitForm(sendToKindleUrl,true,{});}
    function print(){showLoading('Converting',true);submitForm(readPostUrl,false,{"read":1,"print":1});}
    function init(){token=typeof window.readabilityToken==="undefined"?"":window.readabilityToken;extensionType=typeof window.readabilityExtensionType==="undefined"||window.readabilityExtensionType===""?'bookmarklet':window.readabilityExtensionType;extensionVersion=typeof window.readabilityExtensionVersion==="undefined"||window.readabilityExtensionVersion===""?"1":window.readabilityExtensionVersion; extensionBrowser=window.readabilityExtensionBrowser;legacyBookmarklet=typeof window.readStyle!=="undefined"?1:0;readUrl=getUrl();charset=document.characterSet||document.charset;formId='readability-form-'+(new Date()).getTime();frameId='readability-frame-'+(new Date()).getTime();kindleFrameId='readability-kindle-frame-'+(new Date()).getTime();articlePreviouslyValidated=(readUrl===referredArticleUrl&&referredArticleId!=='');listen("message",window,receiveMessage);listen("unload",window,hideLoading);if(!urlIsParsable(readUrl)){return false;}
    if(urlIsLocal(readUrl)){if(action==="send-to-kindle"&&document.getElementById('article-url')){readUrl=document.getElementById('article-url').getAttribute('href');}else{return false;}}
    if(!articlePreviouslyValidated&&readUrl===window.location.href){try{docHtml=minify(document.documentElement);}catch(e){docHtml='';}}
    if(docHtml.length>5242880){window.location=(failUrl+'?url='+encodeURIComponent(window.location.href)+'&reason=too-large');return false;}
    if(!savePost&&action==="save"){docHtml='';}
    switch(action){case'save':save();break;case'send-to-kindle':if(typeof window.readabilityKindleAction!=="undefined"&&window.readabilityKindleAction==="showSetup"){showLoading('Loading',true);showKindleSetup();}else{sendToKindle();}
    break;case'print':print();break;default:if(document.location.hostname!=getHost(readUrl)){showLoading('Loading',true);document.location=readbarUrl+'?url='+encodeURIComponent(readUrl);return false;}
    read();break;}}
    return{"init":init};}());window.rdb.bookmarklet.init();
  }

  mappings.addUserMap(
    [modes.NORMAL],
    [',rr'],
    'read now with readability',
    function() {
	readability('read');
  });

  mappings.addUserMap(
    [modes.NORMAL],
    [',rs'],
    'save for later with readability',
    function() {
	readability('save');
  });
  
  mappings.addUserMap(
    [modes.NORMAL],
    [',rt'],
    'transfer to kindle with readability',
    function() {
	readability('send-to-kindle');
  });
  

})();

// vim: ft=javascript sw=2 foldmethod=marker foldlevel=0
