function isset(e){return"undefined"!=typeof e&&null!==e}function IsNonEmptyArray(e){return"object"==typeof e&&e&&IsNum(e.length)&&e.length>0}function InstanceOf(e,t){e=e.toLowerCase()
    var n=t&&t.constructor?t.constructor:""
    return n.name?n.name.toLowerCase()==e:-1!=n.toString().toLowerCase().indexOf(e)}function IsArray(e){return"object"==typeof e&&InstanceOf("Array",e)}function IsNum(e){switch(typeof e){case"number":return!isNaN(e)
    case"string":return/^[\d\.]+$/.test(e)}}function IsFunc(e){return"function"==typeof e}function ArgumentsToArray(e){return Array.prototype.slice.call(e)}function IsIE(){return"undefined"!=typeof ieSpecific}function IsIE6(){return"undefined"!=typeof ieLt7}function IsTheTag(e,t){return"object"==typeof e&&e&&1==e.nodeType&&(!t||e.tagName.toUpperCase()==t.toUpperCase())}function Random(e,t){return e=parseInt(e),t=parseInt(t),Math.floor(Math.random()*(t-e+1))+e}function Microtime(){return(new Date).getTime()}function ShallowCopyOf(e){if(IsArray(e))return e.concat()
    var t={}
    for(prop in e)t[prop]=e[prop]
    return t}function LocationPath(){return location.href.substr(0,location.href.lastIndexOf("/")+1)}function IsValidEmail(e){return null!=e.match(/^[a-z0-9]([a-z0-9\-_\.]*[a-z0-9])?@[a-z0-9\-\.]+\.[a-z]{2,8}$/i)}function ucfirst(e){return e.replace(/./,e[0].toUpperCase())}function lcfirst(e){return e.replace(/./,e[0].toLowerCase())}function StrRepeat(e,t){return new Array(parseInt(t)+1).join(e)}function Trim(e){return e.replace(/^[\0-\x20]+/g,"").replace(/[\0-\x20]+$/g,"")}function CancelPropagationOf(e){e.cancelBubble=!0,e.stopPropagation&&e.stopPropagation(),e.returnValue=!1,e.preventDefault&&e.preventDefault()}function OriginalEventTargetOf(e){return isset(e)&&(e.srcElement||e.explicitOriginalTarget||e.originalTarget)}function IsCapsLockOnIn(e){if(!e)return!1
    var t=!1,n=e.which||e.keyCode||e.charCode,o=e.shiftKey||4&e.modifiers,r="a".charCodeAt(0),i="z".charCodeAt(0),a="A".charCodeAt(0),u="Z".charCodeAt(0)
    t=o?n>=r&&i>=n:n>=a&&u>=n
    var s=n>=r&&i>=n||n>=a&&u>=n,c=!1,l=OriginalEventTargetOf(e)
    return IsTheTag(l)&&l.id&&(isset(previousCapsLockStates[l.id])||(previousCapsLockStates[l.id]=t),c=previousCapsLockStates[l.id]),s||(t|=c),previousCapsLockStates[l.id]=t,t}function CancelDragOnMouseMove(e){if(CancelPropagationOf(e),window.opera){var t=$("_Dragged_Opera_Input_")
    IsTheTag(t)||(t=document.createElement("input"),t.id="_Dragged_Opera_Input_",$hide(t),document.body.appendChild(t)),t.focus()}}function MousePosFrom(e){return{x:e.pageX||e.clientX+GetScrollX(),y:e.pageY||e.clientY+GetScrollY()}}function AddChainFuncTo(e,t){return function(){var n=ArgumentsToArray(arguments)
    t.apply(this,n),IsFunc(e)&&e.apply(this,n)}}function RequestScript(e,t,n){var o=CreateXHRequest()
    if(o){var r=t?"POST":"GET"
        o.open(r,e,!0),o.onreadystatechange=function(){if(4==o.readyState&&(200==o.status||304==o.status))try{eval.call(window,o.responseText)}catch(e){if(!IsFunc(n))throw e
            n(e)}},isset(t)&&(o.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),o.setRequestHeader("Content-Length",t.length)),o.send(t)}else{var i=document.createElement("SPAN")
        $hide(i),isset(t)&&(-1==e.indexOf("?")&&(e+="?"),e+="&"+t),i.innerHTML='IE workaround. <script type="text/javascript" src="'+e+'">i-e</script>',document.body.appendChild(i)}return o}function CreateXHRequest(){var e
    try{e=new XMLHttpRequest}catch(t){for(var n=new Array("MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.5.0","MSXML2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"),o=0;o<n.length&&!e;o++)try{e=new ActiveXObject(n[o])}catch(t){}}return e}function LoadCSS(e){var t=document.createElement("link")
    t.rel="stylesheet",t.type="text/css",t.href=e,document.getElementsByTagName("head")[0].appendChild(t)}function LoadJS(e){var t=document.createElement("script")
    t.type="text/javascript",t.src=e,document.body.appendChild(t)}function HTMLToWrappedNodes(e,t){if(e){var n=document.createElement("div")
    return n.innerHTML=e.replace(/^\s+/,"").replace(/\s+$/,""),1==n.childNodes.length?n.firstChild:t?n.childNodes:n}return null}function HTMLToNode(e){return HTMLToWrappedNodes(e,!0)}function ModifyClassNameOf(e,t,n){e=$(e),IsTheTag(e)&&(!isset(n)||n?HasClass(e,t)||(e.className+=" "+t):e.className=e.className.replace(ClassNameRegExpFor(t)," "))}function HasClass(e,t){var n=ClassNameRegExpFor(t)
    return n.test($(e).className)}function ClassNameRegExpFor(e){return new RegExp("(^|\\s)"+e+"(\\s|$)","gi")}function EscapeForString(e){return e.replace(/([\r\n'\\])/g,"\\$1")}function EscapeForRegExp(e){var t=new RegExp("(\\"+".*+?^$|()[]{}\\".split("").join("|\\")+")","g")
    return e.replace(t,"\\$1")}function EscapeForHTML(e,t){t=isset(t)?t:""
    var n={'"':"&quot;","'":"&apos;","<":"&lt;",">":"&gt;","&":"&amp;"},o="[<>&"
    return t.indexOf('"')&&(o+='"'),t.indexOf("'")&&(o+="'"),e.replace(new RegExp(o+"]","g"),function(e){return n[e]})}function EmulatePseudoclassesOn(e){if(e&&IsIE()){var t=e.onmousemove
    e.onmousemove=function(){t&&t(),ModifyClassNameOf(e,"hovered",!0)}
    var n=e.onmouseout
    e.onmouseout=function(){n&&n(),ModifyClassNameOf(e,"hovered",!1)}
    var o=e.onfocus
    e.onfocus=function(){o&&o(),ModifyClassNameOf(e,"focused",!0)}
    var r=e.onblur
    e.onblur=function(){r&&r(),ModifyClassNameOf(e,"focused",!1)}}}function PlaceholderEditText(e,t,n){e=$(e),IsTheTag(e)&&(e.onfocus=function(){!n&&e.value==t&&(e.value=""),ModifyClassNameOf(e,"filled")},e.onblur=function(){(""==e.value.replace(/^ +| +$/g,"")||e.value==t)&&(e.value=t,ModifyClassNameOf(e,"filled",!1))},ModifyClassNameOf(e,"filled",e.value!=t))}function AutosubmitTextarea(e,t){e=$(e)
    var n=FindParentOf(e,"form",null)
    if(IsTheTag(e&&n)){var o=null
        if("string"==typeof t||IsTheTag(t))o=$(t),t=5
        else if((IsNum(t)||!isset(t))&&(o=FindChildOf(n,"button",null),!o)){var r,i=FindChildrenOf(n,"input",null)
            $each(i,function(e){return"submit"==e.type||"image"==e.type?r=e:void 0}),o=r}o&&(o.disabled=!1),Event.AddTo(e,"keypress",function(e){if(13==e.keyCode&&e.ctrlKey&&!e.altKey&&(!o||!o.disabled)){if(IsFunc(n.onsubmit)){var r=n.onsubmit()
            if(isset(r)&&!r)return}n.submit(),CancelPropagationOf(e),o&&(o.disabled=!0,DisableSubmissionButton(o,1e3*(t||5)))}})}}function HighlightTextNodesOf(e,t){if(e=$(e),IsNonEmptyArray(t)&&($each(t,function(e,n){t[n]=EscapeForRegExp(e)}),t=new RegExp("\\b("+t.join("|")+".*?\\b)","gi")),e&&DebugAssert("object"==typeof t&&InstanceOf("RegExp",t)))if(3==e.nodeType){var n=e.nodeValue.replace(t,'<span class="highlighted-term">$1</span>')
    if(n!=e.nodeValue){var o=document.createElement("span")
        o.innerHTML=n,e.parentNode.replaceChild(o,e)}}else IsTheTag(e)&&setTimeout(function(){$each(e.childNodes,function(e){HighlightTextNodesOf(e,t)})},25)}function Bookmark(e,t){if(IsTheTag(e)&&e.href){var n=e
    e=n.href,t=n.title}try{window.external.AddFavorite(e,t)}catch(o){}}function SetHomePage(e,t){if(IsTheTag(e)&&e.style)try{e.style.behavior="url(#default#homepage)",t=isset(t)?t:document.location.href,e.setHomePage(t)}catch(n){}}function DebugRecord(){if(isset(window.console)&&isset(window.console.firebug)){var e=ArgumentsToArray(arguments)
    console.error("DebugRecord() invoked, args: "+e.join(", ")),console.trace()}}function DebugAssert(e){if(!e){var t=ArgumentsToArray(arguments)
    t.shift(),DebugRecord.apply(this,t)}return e}function Shuffle(e){for(i=e.length-1;i>=0;i--){var t=parseInt(Math.random()*i),n=e[i]
    e[i]=e[t],e[t]=n}return e}function $(){for(var e=[],t=window,n=0,o=arguments.length;o>n;n++){var r=arguments[n]
    "string"==typeof arguments[n]&&(r=document.getElementById(arguments[n])),e.push(r)}return!IsNonEmptyArray(e)||e.length>1?e:e[0]}function $hide(e,t){return t=t?t:"none",$style(e,"display",t)}function $show(e,t){return t=t?t:"block",$hide(e,t)}function HeightOf(e,t){if(e=$(e),IsNum(t))return parseInt($style(e,"height",Math.round(t)+"px"))
    if(IsNum(e.offsetHeight)){var n=parseInt($style(e,"borderTopWidth"))+parseInt($style(e,"borderBottomWidth"))
        return IsNum(n)?e.offsetHeight-n:e.offsetHeight}return parseInt($style(e,"height"))}function WidthOf(e,t){if(e=$(e),IsNum(t))return parseInt($style(e,"width",Math.round(t)+"px"))
    if(IsNum(e.offsetWidth)){var n=parseInt($style(e,"borderLeftWidth"))+parseInt($style(e,"borderRightWidth"))
        return IsNum(n)?e.offsetWidth-n:e.offsetWidth}return parseInt($style(e,"width"))}function ExpandedHeightOf(e){var t=$style(e,"height","auto"),n=$style(e,"maxHeight","none"),o=$style(e,"overflow","visible"),r=$style(e,"display","block"),i=HeightOf(e)
    return"block"!=r&&$style(e,"display",r),"visible"!=o&&$style(e,"overflow",o),/^(none)?$/i.test(n)||$style(e,"maxHeight",n),/^(auto)?$/i.test(t)||$style(e,"height",t),i}function $style(e,t,n){if(e=$(e),e){if(isset(n)){var o=ArgumentsToArray(arguments)
    o.shift(),o.length%2!=0&&o.pop()
    var r=$style(e,t),a
    return $each(o,function(t,n){n%2==0?a=t:(e.style[a]=t,DebugAssert(e.style[a]==t,a,"got "+e.style[a],"expected "+t))}),r}if(document.defaultView&&document.defaultView.getComputedStyle)return t.match(/[A-Z]/)&&(t=t.replace(/([A-Z])/g,"-$1").toLowerCase()),document.defaultView.getComputedStyle(e,"").getPropertyValue(t)
    if(e.currentStyle){for(;-1!=(i=t.indexOf("-"));)t=t.substr(0,i)+t.substr(i+1,1).toUpperCase()+t.substr(i+2)
        return e.currentStyle[t]}return""}}function ImmediateStyleOf(e,t){return e=$(e),DebugAssert(e)?(t=t.replace(/([A-Z])/g,"-$1").toLowerCase(),e.style.getPropertyValue(t)):void 0}function $each(e,t){if(IsNonEmptyArray(e)||"string"==typeof e)for(var n=0;n<e.length&&!t.call(this,e[n],n);n++);else if("object"==typeof e)for(var o in e)if(t.call(this,e[o],o))break}function GetAbsoluteXOf(e){e=$(e)
    for(var t=0;e;)t+=e.offsetLeft,e=e.offsetParent
    return t}function GetAbsoluteYOf(e){e=$(e)
    for(var t=0;e;)t+=e.offsetTop,e=e.offsetParent
    return t}function $opacity(e,t){return t=Math.round(t),IsNum(t)?($style(e,"opacity",t/100),$style(e,"filter","alpha(opacity="+t+")")):t=100*$style(e,"opacity"),IsNum(t)?parseFloat(t):100}function GetScrollX(){return self.pageXOffset||document.documentElement&&document.documentElement.scrollLeft||document.body&&document.body.scrollLeft}function GetScrollY(){return self.pageYOffset||document.documentElement&&document.documentElement.scrollTop||document.body&&document.body.scrollTop}function WindowWidth(){return IsNum(window.innerWidth)?window.innerWidth:document.documentElement&&IsNum(document.documentElement.clientWidth)?document.documentElement.clientWidth:document.body?document.body.clientWidth:void 0}function WindowHeight(){return IsNum(window.innerHeight)?window.innerHeight:document.documentElement&&IsNum(document.documentElement.clientHeight)?document.documentElement.clientHeight:document.body?document.body.clientHeight:void 0}function DocumentWidth(){return Math.max(Math.max(document.body.scrollWidth,document.documentElement.scrollWidth),Math.max(document.body.offsetWidth,document.documentElement.offsetWidth),Math.max(document.body.clientWidth,document.documentElement.clientWidth))}function DocumentHeight(){return Math.max(Math.max(document.body.scrollHeight,document.documentElement.scrollHeight),Math.max(document.body.offsetHeight,document.documentElement.offsetHeight),Math.max(document.body.clientHeight,document.documentElement.clientHeight))}function DisableSubmissionButton(e,t){function n(t){e.disabled=!t,ModifyClassNameOf(e,"under-submission",!t)}e=$(e),DebugAssert(e)&&(setTimeout(function(){n(!1)},100),t=IsNum(t)?t:5e3,setTimeout(function(){n(!0)},t))}function $get(e){if(e=$(e),DebugAssert(e))switch(e.tagName){case"INPUT":case"TEXTAREA":case"SELECT":return e.value
    default:return e.innerHTML}}function $getRadio(e){var t=$$('input[name="'+e+'"]:checked')
    return t=t&&t[0],t&&t.value}function $set(e,t){if(e=$(e),DebugAssert(e)){switch(e.tagName){case"INPUT":case"TEXTAREA":case"SELECT":prevValue=e.value,e.value=t
    break
    default:prevValue=e.innerHTML,e.innerHTML=t}return prevValue}}function RemoveChildrenOf(e){if(IsTheTag(e))for(;e.children.length>0;)e.removeChild(e.children[0])}function FindParentOf(e,t,n){e=$(e)
    for(var o=ClassNameRegExpFor(n);e&&(!IsTheTag(e,t)||n&&!e.className.match(o));)e=e.parentNode
    return e}function FindChildrenOf(e,t,n){2==arguments.length&&(n=t,t=null)
    var o=[]
    e=$(e),e?e=e.firstChild:null
    for(var r=ClassNameRegExpFor(n);e;)IsTheTag(e,t)&&(!n||e.className.match(r))&&o.push(e),e=e.nextSibling
    return o}function FindChildOf(e,t,n){var o=ArgumentsToArray(arguments),r=FindChildrenOf.apply(this,o)
    return IsNonEmptyArray(r)?r[0]:null}function FindChildByPath(e){for(var t=1;e&&t<arguments.length;t++){var n=IsNonEmptyArray(arguments[t])?arguments[t]:[arguments[t]]
    n.unshift(e),e=FindChildOf.apply(this,n)}return e}function AddOnLoad(e){var t=window.addEventListener||window.attachEvent?window:document.addEventListener?document:null
    t?t.addEventListener?t.addEventListener("load",e,!1):t.attachEvent&&t.attachEvent("onload",e):window.onload=AddChainFuncTo(window.onload,e)}function RestartTimer(e,t,n){return clearTimeout(e),setTimeout(t,n)}function SetPagebarHotkeys(e,t){e||(e="pagebarPrev"),t||(t="pagebarNext"),document.onkeydown=AddChainFuncTo(document.onkeydown,function(n){n||(n=window.event)
    var o=null
    if(n.ctrlKey)switch(n.keyCode){case 37:o=e
        break
        case 39:o=t}(o=$(o))&&(location.href=o.href)})}function GetCookie(e){var t=document.cookie.indexOf(e+"="),n=t+e.length+1
    if(!t&&e!=document.cookie.substring(0,e.length))return null
    if(-1==t)return null
    var o=document.cookie.indexOf(";",n)
    return-1==o&&(o=document.cookie.length),unescape(document.cookie.substring(n,o))}function SetCookie(e,t,n,o,r,i){var a=new Date
    a.setTime(a.getTime()),n&&(n=1e3*n*3600)
    var u=new Date(a.getTime()+n)
    "boolean"==typeof t&&(t=t?1:0),document.cookie=e+"="+escape(t)+(n?";expires="+u.toGMTString():"")+(o?";path="+o:"")+(r?";domain="+r:"")+(i?";secure":"")}function DeleteCookie(e,t,n,o){SetCookie(e,"",-720,t,n,o)}var previousCapsLockStates=[]
window.Event={AddTo:function(e,t,n){e.attachEvent?(e["e"+t+n]=n,e[t+n]=function(){e["e"+t+n](window.event)},e.attachEvent("on"+t,e[t+n])):e.addEventListener(t,n,!1)},RemoveFrom:function(e,t,n){e.detachEvent?(e.detachEvent("on"+t,e[t+n]),e[t+n]=null):e.removeEventListener(t,n,!1)}}
