function isset(e) {
    return typeof e != "undefined" && e !== null
}

function IsNonEmptyArray(e) {
    return typeof e == "object" && e && IsNum(e.length) && e.length > 0
}

function InstanceOf(e, t) {
    e = e.toLowerCase();
    var n = t && t.constructor ? t.constructor : "";
    return n.name ? n.name.toLowerCase() == e : n.toString().toLowerCase().indexOf(e) != -1
}

function IsArray(e) {
    return typeof e == "object" && InstanceOf("Array", e)
}

function IsNum(e) {
    switch (typeof e) {
        case "number":
            return !isNaN(e);
        case "string":
            return /^[\d\.]+$/.test(e)
    }
}

function IsFunc(e) {
    return typeof e == "function"
}

function ArgumentsToArray(e) {
    return Array.prototype.slice.call(e)
}

function IsIE() {
    return typeof ieSpecific != "undefined"
}

function IsIE6() {
    return typeof ieLt7 != "undefined"
}

function IsTheTag(e, t) {
    return typeof e == "object" && e && e.nodeType == 1 && (!t || e.tagName.toUpperCase() == t.toUpperCase())
}

function Random(e, t) {
    return e = parseInt(e), t = parseInt(t), Math.floor(Math.random() * (t - e + 1)) + e
}

function Microtime() {
    return (new Date).getTime()
}

function ShallowCopyOf(e) {
    if (IsArray(e)) return e.concat();
    var t = {};
    for (prop in e) t[prop] = e[prop];
    return t
}

function LocationPath() {
    return location.href.substr(0, location.href.lastIndexOf("/") + 1)
}

function IsValidEmail(e) {
    return e.match(/^[a-z0-9]([a-z0-9\-_\.]*[a-z0-9])?@[a-z0-9\-\.]+\.[a-z]{2,8}$/i) != null
}

function ucfirst(e) {
    return e.replace(/./, e[0].toUpperCase())
}

function lcfirst(e) {
    return e.replace(/./, e[0].toLowerCase())
}

function StrRepeat(e, t) {
    return (new Array(parseInt(t) + 1)).join(e)
}

function Trim(e) {
    return e.replace(/^[\0-\x20]+/g, "").replace(/[\0-\x20]+$/g, "")
}

function CancelPropagationOf(e) {
    e.cancelBubble = !0, e.stopPropagation && e.stopPropagation(), e.returnValue = !1, e.preventDefault && e.preventDefault()
}

function OriginalEventTargetOf(e) {
    return isset(e) && (e.srcElement || e.explicitOriginalTarget || e.originalTarget)
}

function IsCapsLockOnIn(e) {
    if (!e) return !1;
    var t = !1,
        n = e.which || e.keyCode || e.charCode,
        r = e.shiftKey || e.modifiers & 4,
        i = "a".charCodeAt(0),
        s = "z".charCodeAt(0),
        o = "A".charCodeAt(0),
        u = "Z".charCodeAt(0);
    r ? t = n >= i && n <= s : t = n >= o && n <= u;
    var a = n >= i && n <= s || n >= o && n <= u,
        f = !1,
        l = OriginalEventTargetOf(e);
    return IsTheTag(l) && l.id && (isset(previousCapsLockStates[l.id]) || (previousCapsLockStates[l.id] = t), f = previousCapsLockStates[l.id]), a || (t |= f), previousCapsLockStates[l.id] = t, t
}

function CancelDragOnMouseMove(e) {
    CancelPropagationOf(e);
    if (window.opera) {
        var t = $("_Dragged_Opera_Input_");
        IsTheTag(t) || (t = document.createElement("input"), t.id = "_Dragged_Opera_Input_", $hide(t), document.body.appendChild(t)), t.focus()
    }
}

function MousePosFrom(e) {
    return {
        x: e.pageX || e.clientX + GetScrollX(),
        y: e.pageY || e.clientY + GetScrollY()
    }
}

function AddChainFuncTo(e, t) {
    return function() {
        var n = ArgumentsToArray(arguments);
        t.apply(this, n), IsFunc(e) && e.apply(this, n)
    }
}

function RequestScript(url, data, onEvalException) {
    var request = CreateXHRequest();
    if (request) {
        var method = data ? "POST" : "GET";
        request.open(method, url, !0), request.onreadystatechange = function() {
            if (request.readyState == 4 && (request.status == 200 || request.status == 304)) try {
                eval.call(window, request.responseText)
            } catch (e) {
                if (!IsFunc(onEvalException)) throw e;
                onEvalException(e)
            }
        }, isset(data) && (request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), request.setRequestHeader("Content-Length", data.length)), request.send(data)
    } else {
        var span = document.createElement("SPAN");
        $hide(span), isset(data) && (url.indexOf("?") == -1 && (url += "?"), url += "&" + data), span.innerHTML = 'IE workaround. <script type="text/javascript" src="' + url + '">i-e</scri' + "pt>", document.body.appendChild(span)
    }
    return request
}

function CreateXHRequest() {
    var e;
    try {
        e = new XMLHttpRequest
    } catch (t) {
        var n = new Array("MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.5.0", "MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP");
        for (var r = 0; r < n.length && !e; r++) try {
            e = new ActiveXObject(n[r])
        } catch (t) {}
    }
    return e
}

function LoadCSS(e) {
    var t = document.createElement("link");
    t.rel = "stylesheet", t.type = "text/css", t.href = e, document.getElementsByTagName("head")[0].appendChild(t)
}

function LoadJS(e) {
    var t = document.createElement("script");
    t.type = "text/javascript", t.src = e, document.body.appendChild(t)
}

function HTMLToWrappedNodes(e, t) {
    if (e) {
        var n = document.createElement("div");
        return n.innerHTML = e.replace(/^\s+/, "").replace(/\s+$/, ""), n.childNodes.length == 1 ? n.firstChild : t ? n.childNodes : n
    }
    return null
}

function HTMLToNode(e) {
    return HTMLToWrappedNodes(e, !0)
}

function ModifyClassNameOf(e, t, n) {
    e = $(e);
    if (!IsTheTag(e)) return;
    !isset(n) || n ? HasClass(e, t) || (e.className += " " + t) : e.className = e.className.replace(ClassNameRegExpFor(t), " ")
}

function HasClass(e, t) {
    var n = ClassNameRegExpFor(t);
    return n.test($(e).className)
}

function ClassNameRegExpFor(e) {
    return new RegExp("(^|\\s)" + e + "(\\s|$)", "gi")
}

function EscapeForString(e) {
    return e.replace(/([\r\n'\\])/g, "\\$1")
}

function EscapeForRegExp(e) {
    var t = new RegExp("(\\" + ".*+?^$|()[]{}\\".split("").join("|\\") + ")", "g");
    return e.replace(t, "\\$1")
}

function EscapeForHTML(e, t) {
    t = isset(t) ? t : "";
    var n = {
            '"': "&quot;",
            "'": "&apos;",
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;"
        },
        r = "[<>&";
    return t.indexOf('"') && (r += '"'), t.indexOf("'") && (r += "'"), e.replace(new RegExp(r + "]", "g"), function(e) {
        return n[e]
    })
}

function EmulatePseudoclassesOn(e) {
    if (!e || !IsIE()) return;
    var t = e.onmousemove;
    e.onmousemove = function() {
        t && t(), ModifyClassNameOf(e, "hovered", !0)
    };
    var n = e.onmouseout;
    e.onmouseout = function() {
        n && n(), ModifyClassNameOf(e, "hovered", !1)
    };
    var r = e.onfocus;
    e.onfocus = function() {
        r && r(), ModifyClassNameOf(e, "focused", !0)
    };
    var i = e.onblur;
    e.onblur = function() {
        i && i(), ModifyClassNameOf(e, "focused", !1)
    }
}

function PlaceholderEditText(e, t, n) {
    e = $(e), IsTheTag(e) && (e.onfocus = function() {
        !n && e.value == t && (e.value = ""), ModifyClassNameOf(e, "filled")
    }, e.onblur = function() {
        if (e.value.replace(/^ +| +$/g, "") == "" || e.value == t) e.value = t, ModifyClassNameOf(e, "filled", !1)
    }, ModifyClassNameOf(e, "filled", e.value != t))
}

function AutosubmitTextarea(e, t) {
    e = $(e);
    var n = FindParentOf(e, "form", null);
    if (IsTheTag(e && n)) {
        var r = null;
        if (typeof t == "string" || IsTheTag(t)) r = $(t), t = 5;
        else if (IsNum(t) || !isset(t)) {
            r = FindChildOf(n, "button", null);
            if (!r) {
                var i, s = FindChildrenOf(n, "input", null);
                $each(s, function(e) {
                    if (e.type == "submit" || e.type == "image") return i = e
                }), r = i
            }
        }
        r && (r.disabled = !1), Event.AddTo(e, "keypress", function(e) {
            if (e.keyCode == 13 && e.ctrlKey && !e.altKey && (!r || !r.disabled)) {
                if (IsFunc(n.onsubmit)) {
                    var i = n.onsubmit();
                    if (isset(i) && !i) return
                }
                n.submit(), CancelPropagationOf(e), r && (r.disabled = !0, DisableSubmissionButton(r, (t || 5) * 1e3))
            }
        })
    }
}

function HighlightTextNodesOf(e, t) {
    e = $(e), IsNonEmptyArray(t) && ($each(t, function(e, n) {
        t[n] = EscapeForRegExp(e)
    }), t = new RegExp("\\b(" + t.join("|") + ".*?\\b)", "gi"));
    if (e && DebugAssert(typeof t == "object" && InstanceOf("RegExp", t)))
        if (e.nodeType == 3) {
            var n = e.nodeValue.replace(t, '<span class="highlighted-term">$1</span>');
            if (n != e.nodeValue) {
                var r = document.createElement("span");
                r.innerHTML = n, e.parentNode.replaceChild(r, e)
            }
        } else IsTheTag(e) && setTimeout(function() {
            $each(e.childNodes, function(e) {
                HighlightTextNodesOf(e, t)
            })
        }, 25)
}

function Bookmark(e, t) {
    if (IsTheTag(e) && e.href) {
        var n = e;
        e = n.href, t = n.title
    }
    try {
        window.external.AddFavorite(e, t)
    } catch (r) {}
}

function SetHomePage(e, t) {
    if (IsTheTag(e) && e.style) try {
        e.style.behavior = "url(#default#homepage)", t = isset(t) ? t : document.location.href, e.setHomePage(t)
    } catch (n) {}
}

function DebugRecord() {
    if (isset(window.console) && isset(window.console.firebug)) {
        var e = ArgumentsToArray(arguments);
        console.error("DebugRecord() invoked, args: " + e.join(", ")), console.trace()
    }
}

function DebugAssert(e) {
    if (!e) {
        var t = ArgumentsToArray(arguments);
        t.shift(), DebugRecord.apply(this, t)
    }
    return e
}

function Shuffle(e) {
    for (i = e.length - 1; i >= 0; i--) {
        var t = parseInt(Math.random() * i),
            n = e[i];
        e[i] = e[t], e[t] = n
    }
    return e
}

function $() {
    var e = [],
        t = window;
    for (var n = 0, r = arguments.length; n < r; n++) {
        var i = arguments[n];
        typeof arguments[n] == "string" && (i = document.getElementById(arguments[n])), e.push(i)
    }
    return !IsNonEmptyArray(e) || e.length > 1 ? e : e[0]
}

function $hide(e, t) {
    return t = t ? t : "none", $style(e, "display", t)
}

function $show(e, t) {
    return t = t ? t : "block", $hide(e, t)
}

function HeightOf(e, t) {
    e = $(e);
    if (IsNum(t)) return parseInt($style(e, "height", Math.round(t) + "px"));
    if (IsNum(e.offsetHeight)) {
        var n = parseInt($style(e, "borderTopWidth")) + parseInt($style(e, "borderBottomWidth"));
        return IsNum(n) ? e.offsetHeight - n : e.offsetHeight
    }
    return parseInt($style(e, "height"))
}

function WidthOf(e, t) {
    e = $(e);
    if (IsNum(t)) return parseInt($style(e, "width", Math.round(t) + "px"));
    if (IsNum(e.offsetWidth)) {
        var n = parseInt($style(e, "borderLeftWidth")) + parseInt($style(e, "borderRightWidth"));
        return IsNum(n) ? e.offsetWidth - n : e.offsetWidth
    }
    return parseInt($style(e, "width"))
}

function ExpandedHeightOf(e) {
    var t = $style(e, "height", "auto"),
        n = $style(e, "maxHeight", "none"),
        r = $style(e, "overflow", "visible"),
        i = $style(e, "display", "block"),
        s = HeightOf(e);
    return i != "block" && $style(e, "display", i), r != "visible" && $style(e, "overflow", r), /^(none)?$/i.test(n) || $style(e, "maxHeight", n), /^(auto)?$/i.test(t) || $style(e, "height", t), s
}

function $style(e, t, n) {
    e = $(e);
    if (!e) return;
    if (isset(n)) {
        var r = ArgumentsToArray(arguments);
        r.shift(), r.length % 2 != 0 && r.pop();
        var s = $style(e, t),
            o;
        return $each(r, function(t, n) {
            n % 2 == 0 ? o = t : (e.style[o] = t, DebugAssert(e.style[o] == t, o, "got " + e.style[o], "expected " + t))
        }), s
    }
    if (document.defaultView && document.defaultView.getComputedStyle) return t.match(/[A-Z]/) && (t = t.replace(/([A-Z])/g, "-$1").toLowerCase()), document.defaultView.getComputedStyle(e, "").getPropertyValue(t);
    if (e.currentStyle) {
        while ((i = t.indexOf("-")) != -1) t = t.substr(0, i) + t.substr(i + 1, 1).toUpperCase() + t.substr(i + 2);
        return e.currentStyle[t]
    }
    return ""
}

function ImmediateStyleOf(e, t) {
    e = $(e);
    if (DebugAssert(e)) return t = t.replace(/([A-Z])/g, "-$1").toLowerCase(), e.style.getPropertyValue(t)
}

function $each(e, t) {
    if (IsNonEmptyArray(e) || typeof e == "string") {
        for (var n = 0; n < e.length; n++)
            if (t.call(this, e[n], n)) break
    } else if (typeof e == "object")
        for (var r in e)
            if (t.call(this, e[r], r)) break
}

function GetAbsoluteXOf(e) {
    e = $(e);
    var t = 0;
    while (e) t += e.offsetLeft, e = e.offsetParent;
    return t
}

function GetAbsoluteYOf(e) {
    e = $(e);
    var t = 0;
    while (e) t += e.offsetTop, e = e.offsetParent;
    return t
}

function $opacity(e, t) {
    return t = Math.round(t), IsNum(t) ? ($style(e, "opacity", t / 100), $style(e, "filter", "alpha(opacity=" + t + ")")) : t = $style(e, "opacity") * 100, IsNum(t) ? parseFloat(t) : 100
}

function GetScrollX() {
    return self.pageXOffset || document.documentElement && document.documentElement.scrollLeft || document.body && document.body.scrollLeft
}

function GetScrollY() {
    return self.pageYOffset || document.documentElement && document.documentElement.scrollTop || document.body && document.body.scrollTop
}

function WindowWidth() {
    if (IsNum(window.innerWidth)) return window.innerWidth;
    if (document.documentElement && IsNum(document.documentElement.clientWidth)) return document.documentElement.clientWidth;
    if (document.body) return document.body.clientWidth
}

function WindowHeight() {
    if (IsNum(window.innerHeight)) return window.innerHeight;
    if (document.documentElement && IsNum(document.documentElement.clientHeight)) return document.documentElement.clientHeight;
    if (document.body) return document.body.clientHeight
}

function DocumentWidth() {
    return Math.max(Math.max(document.body.scrollWidth, document.documentElement.scrollWidth), Math.max(document.body.offsetWidth, document.documentElement.offsetWidth), Math.max(document.body.clientWidth, document.documentElement.clientWidth))
}

function DocumentHeight() {
    return Math.max(Math.max(document.body.scrollHeight, document.documentElement.scrollHeight), Math.max(document.body.offsetHeight, document.documentElement.offsetHeight), Math.max(document.body.clientHeight, document.documentElement.clientHeight))
}

function DisableSubmissionButton(e, t) {
    function n(t) {
        e.disabled = !t, ModifyClassNameOf(e, "under-submission", !t)
    }
    e = $(e);
    if (!DebugAssert(e)) return;
    setTimeout(function() {
        n(!1)
    }, 100), t = IsNum(t) ? t : 5e3, setTimeout(function() {
        n(!0)
    }, t)
}

function $get(e) {
    e = $(e);
    if (!DebugAssert(e)) return;
    switch (e.tagName) {
        case "INPUT":
        case "TEXTAREA":
        case "SELECT":
            return e.value;
        default:
            return e.innerHTML
    }
}

function $getRadio(name) {
    var checked = $$('input[name="'+name+'"]:checked');
    checked = checked && checked[0];

    return checked && checked.value;
}

function $set(e, t) {
    e = $(e);
    if (!DebugAssert(e)) return;
    switch (e.tagName) {
        case "INPUT":
        case "TEXTAREA":
        case "SELECT":
            prevValue = e.value, e.value = t;
            break;
        default:
            prevValue = e.innerHTML, e.innerHTML = t
    }
    return prevValue
}

function RemoveChildrenOf(e) {
    if (IsTheTag(e))
        while (e.children.length > 0) e.removeChild(e.children[0])
}

function FindParentOf(e, t, n) {
    e = $(e);
    var r = ClassNameRegExpFor(n);
    while (e && (!IsTheTag(e, t) || n && !e.className.match(r))) e = e.parentNode;
    return e
}

function FindChildrenOf(e, t, n) {
    arguments.length == 2 && (n = t, t = null);
    var r = [];
    e = $(e), e ? e = e.firstChild : null;
    var i = ClassNameRegExpFor(n);
    while (e) IsTheTag(e, t) && (!n || e.className.match(i)) && r.push(e), e = e.nextSibling;
    return r
}

function FindChildOf(e, t, n) {
    var r = ArgumentsToArray(arguments),
        i = FindChildrenOf.apply(this, r);
    return IsNonEmptyArray(i) ? i[0] : null
}

function FindChildByPath(e) {
    for (var t = 1; e && t < arguments.length; t++) {
        var n = IsNonEmptyArray(arguments[t]) ? arguments[t] : [arguments[t]];
        n.unshift(e), e = FindChildOf.apply(this, n)
    }
    return e
}

function AddOnLoad(e) {
    var t = window.addEventListener || window.attachEvent ? window : document.addEventListener ? document : null;
    t ? t.addEventListener ? t.addEventListener("load", e, !1) : t.attachEvent && t.attachEvent("onload", e) : window.onload = AddChainFuncTo(window.onload, e)
}

function RestartTimer(e, t, n) {
    return clearTimeout(e), setTimeout(t, n)
}

function SetPagebarHotkeys(e, t) {
    e || (e = "pagebarPrev"), t || (t = "pagebarNext"), document.onkeydown = AddChainFuncTo(document.onkeydown, function(n) {
        n || (n = window.event);
        var r = null;
        if (n.ctrlKey) switch (n.keyCode) {
            case 37:
                r = e;
                break;
            case 39:
                r = t
        }
        if (r = $(r)) location.href = r.href
    })
}

function GetCookie(e) {
    var t = document.cookie.indexOf(e + "="),
        n = t + e.length + 1;
    if (!t && e != document.cookie.substring(0, e.length)) return null;
    if (t == -1) return null;
    var r = document.cookie.indexOf(";", n);
    return r == -1 && (r = document.cookie.length), unescape(document.cookie.substring(n, r))
}

function SetCookie(e, t, n, r, i, s) {
    var o = new Date;
    o.setTime(o.getTime()), n && (n = n * 1e3 * 3600);
    var u = new Date(o.getTime() + n);
    typeof t == "boolean" && (t = t ? 1 : 0), document.cookie = e + "=" + escape(t) + (n ? ";expires=" + u.toGMTString() : "") + (r ? ";path=" + r : "") + (i ? ";domain=" + i : "") + (s ? ";secure" : "")
}

function DeleteCookie(e, t, n, r) {
    SetCookie(e, "", -720, t, n, r)
}
var previousCapsLockStates = [];
window.Event = {
    AddTo: function(e, t, n) {
        e.attachEvent ? (e["e" + t + n] = n, e[t + n] = function() {
            e["e" + t + n](window.event)
        }, e.attachEvent("on" + t, e[t + n])) : e.addEventListener(t, n, !1)
    },
    RemoveFrom: function(e, t, n) {
        e.detachEvent ? (e.detachEvent("on" + t, e[t + n]), e[t + n] = null) : e.removeEventListener(t, n, !1)
    }
};