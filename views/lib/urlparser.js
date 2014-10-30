(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*
	Copyright (c) 2014 Petka Antonov

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
	*/
	function Url() {
	    //For more efficient internal representation and laziness.
	    //The non-underscore versions of these properties are accessor functions
	    //defined on the prototype.
	    this._protocol = null;
	    this._href = "";
	    this._port = -1;
	    this._query = null;

	    this.auth = null;
	    this.slashes = null;
	    this.host = null;
	    this.hostname = null;
	    this.hash = null;
	    this.search = null;
	    this.pathname = null;

	    this._prependSlash = false;
	}

	var querystring = __webpack_require__(1);
	Url.prototype.parse =
	function Url$parse(str, parseQueryString, hostDenotesSlash) {
	    if (typeof str !== "string") {
	        throw new TypeError("Parameter 'url' must be a string, not " +
	            typeof str);
	    }
	    var start = 0;
	    var end = str.length - 1;

	    //Trim leading and trailing ws
	    while (str.charCodeAt(start) <= 0x20 /*' '*/) start++;
	    while (str.charCodeAt(end) <= 0x20 /*' '*/) end--;

	    start = this._parseProtocol(str, start, end);

	    //Javascript doesn't have host
	    if (this._protocol !== "javascript") {
	        start = this._parseHost(str, start, end, hostDenotesSlash);
	        var proto = this._protocol;
	        if (!this.hostname &&
	            (this.slashes || (proto && !slashProtocols[proto]))) {
	            this.hostname = this.host = "";
	        }
	    }

	    if (start <= end) {
	        var ch = str.charCodeAt(start);

	        if (ch === 0x2F /*'/'*/) {
	            this._parsePath(str, start, end);
	        }
	        else if (ch === 0x3F /*'?'*/) {
	            this._parseQuery(str, start, end);
	        }
	        else if (ch === 0x23 /*'#'*/) {
	            this._parseHash(str, start, end);
	        }
	        else if (this._protocol !== "javascript") {
	            this._parsePath(str, start, end);
	        }
	        else { //For javascript the pathname is just the rest of it
	            this.pathname = str.slice(start, end + 1 );
	        }

	    }

	    if (!this.pathname && this.hostname &&
	        this._slashProtocols[this._protocol]) {
	        this.pathname = "/";
	    }

	    if (parseQueryString) {
	        var search = this.search;
	        if (search == null) {
	            search = this.search = "";
	        }
	        if (search.charCodeAt(0) === 0x3F /*'?'*/) {
	            search = search.slice(1);
	        }
	        //This calls a setter function, there is no .query data property
	        this.query = querystring.parse(search);
	    }
	};

	Url.prototype.resolve = function Url$resolve(relative) {
	    return this.resolveObject(Url.parse(relative, false, true)).format();
	};

	Url.prototype.format = function Url$format() {
	    var auth = this.auth || "";

	    if (auth) {
	        auth = encodeURIComponent(auth);
	        auth = auth.replace(/%3A/i, ":");
	        auth += "@";
	    }

	    var protocol = this.protocol || "";
	    var pathname = this.pathname || "";
	    var hash = this.hash || "";
	    var search = this.search || "";
	    var query = "";
	    var hostname = this.hostname || "";
	    var port = this.port || "";
	    var host = false;
	    var scheme = "";

	    //Cache the result of the getter function
	    var q = this.query;
	    if (q && typeof q === "object") {
	        query = querystring.stringify(q);
	    }

	    if (!search) {
	        search = query ? "?" + query : "";
	    }

	    if (protocol && protocol.charCodeAt(protocol.length - 1) !== 0x3A /*':'*/)
	        protocol += ":";

	    if (this.host) {
	        host = auth + this.host;
	    }
	    else if (hostname) {
	        var ip6 = hostname.indexOf(":") > -1;
	        if (ip6) hostname = "[" + hostname + "]";
	        host = auth + hostname + (port ? ":" + port : "");
	    }

	    var slashes = this.slashes ||
	        ((!protocol ||
	        slashProtocols[protocol]) && host !== false);


	    if (protocol) scheme = protocol + (slashes ? "//" : "");
	    else if (slashes) scheme = "//";

	    if (slashes && pathname && pathname.charCodeAt(0) !== 0x2F /*'/'*/) {
	        pathname = "/" + pathname;
	    }
	    else if (!slashes && pathname === "/") {
	        pathname = "";
	    }
	    if (search && search.charCodeAt(0) !== 0x3F /*'?'*/)
	        search = "?" + search;
	    if (hash && hash.charCodeAt(0) !== 0x23 /*'#'*/)
	        hash = "#" + hash;

	    pathname = escapePathName(pathname);
	    search = escapeSearch(search);

	    return scheme + (host === false ? "" : host) + pathname + search + hash;
	};

	Url.prototype.resolveObject = function Url$resolveObject(relative) {
	    if (typeof relative === "string")
	        relative = Url.parse(relative, false, true);

	    var result = this._clone();

	    // hash is always overridden, no matter what.
	    // even href="" will remove it.
	    result.hash = relative.hash;

	    // if the relative url is empty, then there"s nothing left to do here.
	    if (!relative.href) {
	        result._href = "";
	        return result;
	    }

	    // hrefs like //foo/bar always cut to the protocol.
	    if (relative.slashes && !relative._protocol) {
	        relative._copyPropsTo(result, true);

	        if (slashProtocols[result._protocol] &&
	            result.hostname && !result.pathname) {
	            result.pathname = "/";
	        }
	        result._href = "";
	        return result;
	    }

	    if (relative._protocol && relative._protocol !== result._protocol) {
	        // if it"s a known url protocol, then changing
	        // the protocol does weird things
	        // first, if it"s not file:, then we MUST have a host,
	        // and if there was a path
	        // to begin with, then we MUST have a path.
	        // if it is file:, then the host is dropped,
	        // because that"s known to be hostless.
	        // anything else is assumed to be absolute.
	        if (!slashProtocols[relative._protocol]) {
	            relative._copyPropsTo(result, false);
	            result._href = "";
	            return result;
	        }

	        result._protocol = relative._protocol;
	        if (!relative.host && relative._protocol !== "javascript") {
	            var relPath = (relative.pathname || "").split("/");
	            while (relPath.length && !(relative.host = relPath.shift()));
	            if (!relative.host) relative.host = "";
	            if (!relative.hostname) relative.hostname = "";
	            if (relPath[0] !== "") relPath.unshift("");
	            if (relPath.length < 2) relPath.unshift("");
	            result.pathname = relPath.join("/");
	        } else {
	            result.pathname = relative.pathname;
	        }

	        result.search = relative.search;
	        result.host = relative.host || "";
	        result.auth = relative.auth;
	        result.hostname = relative.hostname || relative.host;
	        result._port = relative._port;
	        result.slashes = result.slashes || relative.slashes;
	        result._href = "";
	        return result;
	    }

	    var isSourceAbs =
	        (result.pathname && result.pathname.charCodeAt(0) === 0x2F /*'/'*/);
	    var isRelAbs = (
	            relative.host ||
	            (relative.pathname &&
	            relative.pathname.charCodeAt(0) === 0x2F /*'/'*/)
	        );
	    var mustEndAbs = (isRelAbs || isSourceAbs ||
	                        (result.host && relative.pathname));

	    var removeAllDots = mustEndAbs;

	    var srcPath = result.pathname && result.pathname.split("/") || [];
	    var relPath = relative.pathname && relative.pathname.split("/") || [];
	    var psychotic = result._protocol && !slashProtocols[result._protocol];

	    // if the url is a non-slashed url, then relative
	    // links like ../.. should be able
	    // to crawl up to the hostname, as well.  This is strange.
	    // result.protocol has already been set by now.
	    // Later on, put the first path part into the host field.
	    if (psychotic) {
	        result.hostname = "";
	        result._port = -1;
	        if (result.host) {
	            if (srcPath[0] === "") srcPath[0] = result.host;
	            else srcPath.unshift(result.host);
	        }
	        result.host = "";
	        if (relative._protocol) {
	            relative.hostname = "";
	            relative._port = -1;
	            if (relative.host) {
	                if (relPath[0] === "") relPath[0] = relative.host;
	                else relPath.unshift(relative.host);
	            }
	            relative.host = "";
	        }
	        mustEndAbs = mustEndAbs && (relPath[0] === "" || srcPath[0] === "");
	    }

	    if (isRelAbs) {
	        // it"s absolute.
	        result.host = relative.host ?
	            relative.host : result.host;
	        result.hostname = relative.hostname ?
	            relative.hostname : result.hostname;
	        result.search = relative.search;
	        srcPath = relPath;
	        // fall through to the dot-handling below.
	    } else if (relPath.length) {
	        // it"s relative
	        // throw away the existing file, and take the new path instead.
	        if (!srcPath) srcPath = [];
	        srcPath.pop();
	        srcPath = srcPath.concat(relPath);
	        result.search = relative.search;
	    } else if (relative.search) {
	        // just pull out the search.
	        // like href="?foo".
	        // Put this after the other two cases because it simplifies the booleans
	        if (psychotic) {
	            result.hostname = result.host = srcPath.shift();
	            //occationaly the auth can get stuck only in host
	            //this especialy happens in cases like
	            //url.resolveObject("mailto:local1@domain1", "local2@domain2")
	            var authInHost = result.host && result.host.indexOf("@") > 0 ?
	                result.host.split("@") : false;
	            if (authInHost) {
	                result.auth = authInHost.shift();
	                result.host = result.hostname = authInHost.shift();
	            }
	        }
	        result.search = relative.search;
	        result._href = "";
	        return result;
	    }

	    if (!srcPath.length) {
	        // no path at all.  easy.
	        // we"ve already handled the other stuff above.
	        result.pathname = null;
	        result._href = "";
	        return result;
	    }

	    // if a url ENDs in . or .., then it must get a trailing slash.
	    // however, if it ends in anything else non-slashy,
	    // then it must NOT get a trailing slash.
	    var last = srcPath.slice(-1)[0];
	    var hasTrailingSlash = (
	        (result.host || relative.host) && (last === "." || last === "..") ||
	        last === "");

	    // strip single dots, resolve double dots to parent dir
	    // if the path tries to go above the root, `up` ends up > 0
	    var up = 0;
	    for (var i = srcPath.length; i >= 0; i--) {
	        last = srcPath[i];
	        if (last == ".") {
	            srcPath.splice(i, 1);
	        } else if (last === "..") {
	            srcPath.splice(i, 1);
	            up++;
	        } else if (up) {
	            srcPath.splice(i, 1);
	            up--;
	        }
	    }

	    // if the path is allowed to go above the root, restore leading ..s
	    if (!mustEndAbs && !removeAllDots) {
	        for (; up--; up) {
	            srcPath.unshift("..");
	        }
	    }

	    if (mustEndAbs && srcPath[0] !== "" &&
	        (!srcPath[0] || srcPath[0].charCodeAt(0) !== 0x2F /*'/'*/)) {
	        srcPath.unshift("");
	    }

	    if (hasTrailingSlash && (srcPath.join("/").substr(-1) !== "/")) {
	        srcPath.push("");
	    }

	    var isAbsolute = srcPath[0] === "" ||
	        (srcPath[0] && srcPath[0].charCodeAt(0) === 0x2F /*'/'*/);

	    // put the host back
	    if (psychotic) {
	        result.hostname = result.host = isAbsolute ? "" :
	            srcPath.length ? srcPath.shift() : "";
	        //occationaly the auth can get stuck only in host
	        //this especialy happens in cases like
	        //url.resolveObject("mailto:local1@domain1", "local2@domain2")
	        var authInHost = result.host && result.host.indexOf("@") > 0 ?
	            result.host.split("@") : false;
	        if (authInHost) {
	            result.auth = authInHost.shift();
	            result.host = result.hostname = authInHost.shift();
	        }
	    }

	    mustEndAbs = mustEndAbs || (result.host && srcPath.length);

	    if (mustEndAbs && !isAbsolute) {
	        srcPath.unshift("");
	    }

	    result.pathname = srcPath.length === 0 ? null : srcPath.join("/");
	    result.auth = relative.auth || result.auth;
	    result.slashes = result.slashes || relative.slashes;
	    result._href = "";
	    return result;
	};

	var punycode = __webpack_require__(2);
	Url.prototype._hostIdna = function Url$_hostIdna(hostname) {
	    // IDNA Support: Returns a punycoded representation of "domain".
	    // It only converts parts of the domain name that
	    // have non-ASCII characters, i.e. it doesn't matter if
	    // you call it with a domain that already is ASCII-only.
	    return punycode.toASCII(hostname);
	};

	var escapePathName = Url.prototype._escapePathName =
	function Url$_escapePathName(pathname) {
	    if (!containsCharacter2(pathname, 0x23 /*'#'*/, 0x3F /*'?'*/)) {
	        return pathname;
	    }
	    //Avoid closure creation to keep this inlinable
	    return _escapePath(pathname);
	};

	var escapeSearch = Url.prototype._escapeSearch =
	function Url$_escapeSearch(search) {
	    if (!containsCharacter2(search, 0x23 /*'#'*/, -1)) return search;
	    //Avoid closure creation to keep this inlinable
	    return _escapeSearch(search);
	};

	Url.prototype._parseProtocol = function Url$_parseProtocol(str, start, end) {
	    var doLowerCase = false;
	    var protocolCharacters = this._protocolCharacters;

	    for (var i = start; i <= end; ++i) {
	        var ch = str.charCodeAt(i);

	        if (ch === 0x3A /*':'*/) {
	            var protocol = str.slice(start, i);
	            if (doLowerCase) protocol = protocol.toLowerCase();
	            this._protocol = protocol;
	            return i + 1;
	        }
	        else if (protocolCharacters[ch] === 1) {
	            if (ch < 0x61 /*'a'*/)
	                doLowerCase = true;
	        }
	        else {
	            return start;
	        }

	    }
	    return start;
	};

	Url.prototype._parseAuth = function Url$_parseAuth(str, start, end, decode) {
	    var auth = str.slice(start, end + 1);
	    if (decode) {
	        auth = decodeURIComponent(auth);
	    }
	    this.auth = auth;
	};

	Url.prototype._parsePort = function Url$_parsePort(str, start, end) {
	    //Internal format is integer for more efficient parsing
	    //and for efficient trimming of leading zeros
	    var port = 0;
	    //Distinguish between :0 and : (no port number at all)
	    var hadChars = false;

	    for (var i = start; i <= end; ++i) {
	        var ch = str.charCodeAt(i);

	        if (0x30 /*'0'*/ <= ch && ch <= 0x39 /*'9'*/) {
	            port = (10 * port) + (ch - 0x30 /*'0'*/);
	            hadChars = true;
	        }
	        else break;

	    }
	    if (port === 0 && !hadChars) {
	        return 0;
	    }

	    this._port = port;
	    return i - start;
	};

	Url.prototype._parseHost =
	function Url$_parseHost(str, start, end, slashesDenoteHost) {
	    var hostEndingCharacters = this._hostEndingCharacters;
	    if (str.charCodeAt(start) === 0x2F /*'/'*/ &&
	        str.charCodeAt(start + 1) === 0x2F /*'/'*/) {
	        this.slashes = true;

	        //The string starts with //
	        if (start === 0) {
	            //The string is just "//"
	            if (end < 2) return start;
	            //If slashes do not denote host and there is no auth,
	            //there is no host when the string starts with //
	            var hasAuth =
	                containsCharacter(str, 0x40 /*'@'*/, 2, hostEndingCharacters);
	            if (!hasAuth && !slashesDenoteHost) {
	                this.slashes = null;
	                return start;
	            }
	        }
	        //There is a host that starts after the //
	        start += 2;
	    }
	    //If there is no slashes, there is no hostname if
	    //1. there was no protocol at all
	    else if (!this._protocol ||
	        //2. there was a protocol that requires slashes
	        //e.g. in 'http:asd' 'asd' is not a hostname
	        slashProtocols[this._protocol]
	    ) {
	        return start;
	    }

	    var doLowerCase = false;
	    var idna = false;
	    var hostNameStart = start;
	    var hostNameEnd = end;
	    var lastCh = -1;
	    var portLength = 0;
	    var charsAfterDot = 0;
	    var authNeedsDecoding = false;

	    var j = -1;

	    //Find the last occurrence of an @-sign until hostending character is met
	    //also mark if decoding is needed for the auth portion
	    for (var i = start; i <= end; ++i) {
	        var ch = str.charCodeAt(i);

	        if (ch === 0x40 /*'@'*/) {
	            j = i;
	        }
	        //This check is very, very cheap. Unneeded decodeURIComponent is very
	        //very expensive
	        else if (ch === 0x25 /*'%'*/) {
	            authNeedsDecoding = true;
	        }
	        else if (hostEndingCharacters[ch] === 1) {
	            break;
	        }
	    }

	    //@-sign was found at index j, everything to the left from it
	    //is auth part
	    if (j > -1) {
	        this._parseAuth(str, start, j - 1, authNeedsDecoding);
	        //hostname starts after the last @-sign
	        start = hostNameStart = j + 1;
	    }

	    //Host name is starting with a [
	    if (str.charCodeAt(start) === 0x5B /*'['*/) {
	        for (var i = start + 1; i <= end; ++i) {
	            var ch = str.charCodeAt(i);

	            //Assume valid IP6 is between the brackets
	            if (ch === 0x5D /*']'*/) {
	                if (str.charCodeAt(i + 1) === 0x3A /*':'*/) {
	                    portLength = this._parsePort(str, i + 2, end) + 1;
	                }
	                var hostname = str.slice(start + 1, i).toLowerCase();
	                this.hostname = hostname;
	                this.host = this._port > 0
	                    ? "[" + hostname + "]:" + this._port
	                    : "[" + hostname + "]";
	                this.pathname = "/";
	                return i + portLength + 1;
	            }
	        }
	        //Empty hostname, [ starts a path
	        return start;
	    }

	    for (var i = start; i <= end; ++i) {
	        if (charsAfterDot > 62) {
	            this.hostname = this.host = str.slice(start, i);
	            return i;
	        }
	        var ch = str.charCodeAt(i);

	        if (ch === 0x3A /*':'*/) {
	            portLength = this._parsePort(str, i + 1, end) + 1;
	            hostNameEnd = i - 1;
	            break;
	        }
	        else if (ch < 0x61 /*'a'*/) {
	            if (ch === 0x2E /*'.'*/) {
	                //Node.js ignores this error
	                /*
	                if (lastCh === DOT || lastCh === -1) {
	                    this.hostname = this.host = "";
	                    return start;
	                }
	                */
	                charsAfterDot = -1;
	            }
	            else if (0x41 /*'A'*/ <= ch && ch <= 0x5A /*'Z'*/) {
	                doLowerCase = true;
	            }
	            else if (!(ch === 0x2D /*'-'*/ || ch === 0x5F /*'_'*/ ||
	                (0x30 /*'0'*/ <= ch && ch <= 0x39 /*'9'*/))) {
	                if (hostEndingCharacters[ch] === 0 &&
	                    this._noPrependSlashHostEnders[ch] === 0) {
	                    this._prependSlash = true;
	                }
	                hostNameEnd = i - 1;
	                break;
	            }
	        }
	        else if (ch >= 0x7B /*'{'*/) {
	            if (ch <= 0x7E /*'~'*/) {
	                if (this._noPrependSlashHostEnders[ch] === 0) {
	                    this._prependSlash = true;
	                }
	                hostNameEnd = i - 1;
	                break;
	            }
	            idna = true;
	        }
	        lastCh = ch;
	        charsAfterDot++;
	    }

	    //Node.js ignores this error
	    /*
	    if (lastCh === DOT) {
	        hostNameEnd--;
	    }
	    */

	    if (hostNameEnd + 1 !== start &&
	        hostNameEnd - hostNameStart <= 256) {
	        var hostname = str.slice(hostNameStart, hostNameEnd + 1);
	        if (doLowerCase) hostname = hostname.toLowerCase();
	        if (idna) hostname = this._hostIdna(hostname);
	        this.hostname = hostname;
	        this.host = this._port > 0 ? hostname + ":" + this._port : hostname;
	    }

	    return hostNameEnd + 1 + portLength;

	};

	Url.prototype._copyPropsTo = function Url$_copyPropsTo(input, noProtocol) {
	    if (!noProtocol) {
	        input._protocol = this._protocol;
	    }
	    input._href = this._href;
	    input._port = this._port;
	    input._prependSlash = this._prependSlash;
	    input.auth = this.auth;
	    input.slashes = this.slashes;
	    input.host = this.host;
	    input.hostname = this.hostname;
	    input.hash = this.hash;
	    input.search = this.search;
	    input.pathname = this.pathname;
	};

	Url.prototype._clone = function Url$_clone() {
	    var ret = new Url();
	    ret._protocol = this._protocol;
	    ret._href = this._href;
	    ret._port = this._port;
	    ret._prependSlash = this._prependSlash;
	    ret.auth = this.auth;
	    ret.slashes = this.slashes;
	    ret.host = this.host;
	    ret.hostname = this.hostname;
	    ret.hash = this.hash;
	    ret.search = this.search;
	    ret.pathname = this.pathname;
	    return ret;
	};

	Url.prototype._getComponentEscaped =
	function Url$_getComponentEscaped(str, start, end) {
	    var cur = start;
	    var i = start;
	    var ret = "";
	    var autoEscapeMap = this._autoEscapeMap;
	    for (; i <= end; ++i) {
	        var ch = str.charCodeAt(i);
	        var escaped = autoEscapeMap[ch];

	        if (escaped !== "") {
	            if (cur < i) ret += str.slice(cur, i);
	            ret += escaped;
	            cur = i + 1;
	        }
	    }
	    if (cur < i + 1) ret += str.slice(cur, i);
	    return ret;
	};

	Url.prototype._parsePath =
	function Url$_parsePath(str, start, end) {
	    var pathStart = start;
	    var pathEnd = end;
	    var escape = false;
	    var autoEscapeCharacters = this._autoEscapeCharacters;

	    for (var i = start; i <= end; ++i) {
	        var ch = str.charCodeAt(i);
	        if (ch === 0x23 /*'#'*/) {
	            this._parseHash(str, i, end);
	            pathEnd = i - 1;
	            break;
	        }
	        else if (ch === 0x3F /*'?'*/) {
	            this._parseQuery(str, i, end);
	            pathEnd = i - 1;
	            break;
	        }
	        else if (!escape && autoEscapeCharacters[ch] === 1) {
	            escape = true;
	        }
	    }

	    if (pathStart > pathEnd) {
	        this.pathname = "/";
	        return;
	    }

	    var path;
	    if (escape) {
	        path = this._getComponentEscaped(str, pathStart, pathEnd);
	    }
	    else {
	        path = str.slice(pathStart, pathEnd + 1);
	    }
	    this.pathname = this._prependSlash ? "/" + path : path;
	};

	Url.prototype._parseQuery = function Url$_parseQuery(str, start, end) {
	    var queryStart = start;
	    var queryEnd = end;
	    var escape = false;
	    var autoEscapeCharacters = this._autoEscapeCharacters;

	    for (var i = start; i <= end; ++i) {
	        var ch = str.charCodeAt(i);

	        if (ch === 0x23 /*'#'*/) {
	            this._parseHash(str, i, end);
	            queryEnd = i - 1;
	            break;
	        }
	        else if (!escape && autoEscapeCharacters[ch] === 1) {
	            escape = true;
	        }
	    }

	    if (queryStart > queryEnd) {
	        this.search = "";
	        return;
	    }

	    var query;
	    if (escape) {
	        query = this._getComponentEscaped(str, queryStart, queryEnd);
	    }
	    else {
	        query = str.slice(queryStart, queryEnd + 1);
	    }
	    this.search = query;
	};

	Url.prototype._parseHash = function Url$_parseHash(str, start, end) {
	    if (start > end) {
	        this.hash = "";
	        return;
	    }
	    this.hash = this._getComponentEscaped(str, start, end);
	};

	Object.defineProperty(Url.prototype, "port", {
	    get: function() {
	        if (this._port >= 0) {
	            return ("" + this._port);
	        }
	        return null;
	    },
	    set: function(v) {
	        if (v == null) {
	            this._port = -1;
	        }
	        else {
	            this._port = parseInt(v, 10);
	        }
	    }
	});

	Object.defineProperty(Url.prototype, "query", {
	    get: function() {
	        var query = this._query;
	        if (query != null) {
	            return query;
	        }
	        var search = this.search;

	        if (search) {
	            if (search.charCodeAt(0) === 0x3F /*'?'*/) {
	                search = search.slice(1);
	            }
	            if (search !== "") {
	                this._query = search;
	                return search;
	            }
	        }
	        return search;
	    },
	    set: function(v) {
	        this._query = v;
	    }
	});

	Object.defineProperty(Url.prototype, "path", {
	    get: function() {
	        var p = this.pathname || "";
	        var s = this.search || "";
	        if (p || s) {
	            return p + s;
	        }
	        return (p == null && s) ? ("/" + s) : null;
	    },
	    set: function() {}
	});

	Object.defineProperty(Url.prototype, "protocol", {
	    get: function() {
	        var proto = this._protocol;
	        return proto ? proto + ":" : proto;
	    },
	    set: function(v) {
	        if (typeof v === "string") {
	            var end = v.length - 1;
	            if (v.charCodeAt(end) === 0x3A /*':'*/) {
	                this._protocol = v.slice(0, end);
	            }
	            else {
	                this._protocol = v;
	            }
	        }
	        else if (v == null) {
	            this._protocol = null;
	        }
	    }
	});

	Object.defineProperty(Url.prototype, "href", {
	    get: function() {
	        var href = this._href;
	        if (!href) {
	            href = this._href = this.format();
	        }
	        return href;
	    },
	    set: function(v) {
	        this._href = v;
	    }
	});

	Url.parse = function Url$Parse(str, parseQueryString, hostDenotesSlash) {
	    if (str instanceof Url) return str;
	    var ret = new Url();
	    ret.parse(str, !!parseQueryString, !!hostDenotesSlash);
	    return ret;
	};

	Url.format = function Url$Format(obj) {
	    if (typeof obj === "string") {
	        obj = Url.parse(obj);
	    }
	    if (!(obj instanceof Url)) {
	        return Url.prototype.format.call(obj);
	    }
	    return obj.format();
	};

	Url.resolve = function Url$Resolve(source, relative) {
	    return Url.parse(source, false, true).resolve(relative);
	};

	Url.resolveObject = function Url$ResolveObject(source, relative) {
	    if (!source) return relative;
	    return Url.parse(source, false, true).resolveObject(relative);
	};

	function _escapePath(pathname) {
	    return pathname.replace(/[?#]/g, function(match) {
	        return encodeURIComponent(match);
	    });
	}

	function _escapeSearch(search) {
	    return search.replace(/#/g, function(match) {
	        return encodeURIComponent(match);
	    });
	}

	//Search `char1` (integer code for a character) in `string`
	//starting from `fromIndex` and ending at `string.length - 1`
	//or when a stop character is found
	function containsCharacter(string, char1, fromIndex, stopCharacterTable) {
	    var len = string.length;
	    for (var i = fromIndex; i < len; ++i) {
	        var ch = string.charCodeAt(i);

	        if (ch === char1) {
	            return true;
	        }
	        else if (stopCharacterTable[ch] === 1) {
	            return false;
	        }
	    }
	    return false;
	}

	//See if `char1` or `char2` (integer codes for characters)
	//is contained in `string`
	function containsCharacter2(string, char1, char2) {
	    for (var i = 0, len = string.length; i < len; ++i) {
	        var ch = string.charCodeAt(i);
	        if (ch === char1 || ch === char2) return true;
	    }
	    return false;
	}

	//Makes an array of 128 uint8's which represent boolean values.
	//Spec is an array of ascii code points or ascii code point ranges
	//ranges are expressed as [start, end]

	//Create a table with the characters 0x30-0x39 (decimals '0' - '9') and
	//0x7A (lowercaseletter 'z') as `true`:
	//
	//var a = makeAsciiTable([[0x30, 0x39], 0x7A]);
	//a[0x30]; //1
	//a[0x15]; //0
	//a[0x35]; //1
	function makeAsciiTable(spec) {
	    var ret = new Uint8Array(128);
	    spec.forEach(function(item){
	        if (typeof item === "number") {
	            ret[item] = 1;
	        }
	        else {
	            var start = item[0];
	            var end = item[1];
	            for (var j = start; j <= end; ++j) {
	                ret[j] = 1;
	            }
	        }
	    });

	    return ret;
	}


	var autoEscape = ["<", ">", "\"", "`", " ", "\r", "\n",
	    "\t", "{", "}", "|", "\\", "^", "`", "'"];

	var autoEscapeMap = new Array(128);



	for (var i = 0, len = autoEscapeMap.length; i < len; ++i) {
	    autoEscapeMap[i] = "";
	}

	for (var i = 0, len = autoEscape.length; i < len; ++i) {
	    var c = autoEscape[i];
	    var esc = encodeURIComponent(c);
	    if (esc === c) {
	        esc = escape(c);
	    }
	    autoEscapeMap[c.charCodeAt(0)] = esc;
	}


	var slashProtocols = Url.prototype._slashProtocols = {
	    http: true,
	    https: true,
	    gopher: true,
	    file: true,
	    ftp: true,

	    "http:": true,
	    "https:": true,
	    "gopher:": true,
	    "file:": true,
	    "ftp:": true
	};

	//Optimize back from normalized object caused by non-identifier keys
	function f(){}
	f.prototype = slashProtocols;

	Url.prototype._protocolCharacters = makeAsciiTable([
	    [0x61 /*'a'*/, 0x7A /*'z'*/],
	    [0x41 /*'A'*/, 0x5A /*'Z'*/],
	    0x2E /*'.'*/, 0x2B /*'+'*/, 0x2D /*'-'*/
	]);

	Url.prototype._hostEndingCharacters = makeAsciiTable([
	    0x23 /*'#'*/, 0x3F /*'?'*/, 0x2F /*'/'*/
	]);

	Url.prototype._autoEscapeCharacters = makeAsciiTable(
	    autoEscape.map(function(v) {
	        return v.charCodeAt(0);
	    })
	);

	//If these characters end a host name, the path will not be prepended a /
	Url.prototype._noPrependSlashHostEnders = makeAsciiTable(
	    [
	        "<", ">", "'", "`", " ", "\r",
	        "\n", "\t", "{", "}", "|", "\\",
	        "^", "`", "\"", "%", ";"
	    ].map(function(v) {
	        return v.charCodeAt(0);
	    })
	);

	Url.prototype._autoEscapeMap = autoEscapeMap;

	module.exports = Url;

	Url.replace = function Url$Replace() {
	    __webpack_require__.c["url"] = {
	        exports: Url
	    };
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.decode = exports.parse = __webpack_require__(3);
	exports.encode = exports.stringify = __webpack_require__(4);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.3.2 by @mathias */
	;(function(root) {

		/** Detect free variables */
		var freeExports = typeof exports == 'object' && exports &&
			!exports.nodeType && exports;
		var freeModule = typeof module == 'object' && module &&
			!module.nodeType && module;
		var freeGlobal = typeof global == 'object' && global;
		if (
			freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal
		) {
			root = freeGlobal;
		}

		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,

		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'

		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},

		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,

		/** Temporary variable */
		key;

		/*--------------------------------------------------------------------------*/

		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw RangeError(errors[type]);
		}

		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}

		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings or email
		 * addresses.
		 * @private
		 * @param {String} domain The domain name or email address.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}

		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		/**
		 * Creates a string based on an array of numeric code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of numeric code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}

		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic numeric code point value.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}

		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if `flag` is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}

		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * http://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}

		/**
		 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
		 * symbols.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII-only symbols.
		 * @returns {String} The resulting string of Unicode symbols.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    /** Cached calculation results */
			    baseMinusT;

			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.

			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}

			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}

			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.

			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

					if (index >= inputLength) {
						error('invalid-input');
					}

					digit = basicToDigit(input.charCodeAt(index++));

					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}

					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

					if (digit < t) {
						break;
					}

					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}

					w *= baseMinusT;

				}

				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);

				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}

				n += floor(i / out);
				i %= out;

				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);

			}

			return ucs2encode(output);
		}

		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode symbols.
		 * @returns {String} The resulting Punycode string of ASCII-only symbols.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;

			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);

			// Cache the length
			inputLength = input.length;

			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;

			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}

			handledCPCount = basicLength = output.length;

			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.

			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}

			// Main encoding loop:
			while (handledCPCount < inputLength) {

				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}

				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}

				delta += (m - n) * handledCPCountPlusOne;
				n = m;

				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];

					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}

					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}

						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}

				++delta;
				++n;

			}
			return output.join('');
		}

		/**
		 * Converts a Punycode string representing a domain name or an email address
		 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		 * it doesn't matter if you call it on a string that has already been
		 * converted to Unicode.
		 * @memberOf punycode
		 * @param {String} input The Punycoded domain name or email address to
		 * convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}

		/**
		 * Converts a Unicode string representing a domain name or an email address to
		 * Punycode. Only the non-ASCII parts of the domain name will be converted,
		 * i.e. it doesn't matter if you call it with a domain that's already in
		 * ASCII.
		 * @memberOf punycode
		 * @param {String} input The domain name or email address to convert, as a
		 * Unicode string.
		 * @returns {String} The Punycode representation of the given domain name or
		 * email address.
		 */
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}

		/*--------------------------------------------------------------------------*/

		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.3.2',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to Unicode code points, and back.
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};

		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return punycode;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else { // in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.punycode = punycode;
		}

	}(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)(module), (function() { return this; }())))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};

	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }

	  var regexp = /\+/g;
	  qs = qs.split(sep);

	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }

	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }

	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;

	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }

	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);

	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }

	  return obj;
	};

	var isArray = Array.isArray || function (xs) {
	  return Object.prototype.toString.call(xs) === '[object Array]';
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;

	    case 'boolean':
	      return v ? 'true' : 'false';

	    case 'number':
	      return isFinite(v) ? v : '';

	    default:
	      return '';
	  }
	};

	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }

	  if (typeof obj === 'object') {
	    return map(objectKeys(obj), function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (isArray(obj[k])) {
	        return map(obj[k], function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);

	  }

	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};

	var isArray = Array.isArray || function (xs) {
	  return Object.prototype.toString.call(xs) === '[object Array]';
	};

	function map (xs, f) {
	  if (xs.map) return xs.map(f);
	  var res = [];
	  for (var i = 0; i < xs.length; i++) {
	    res.push(f(xs[i], i));
	  }
	  return res;
	}

	var objectKeys = Object.keys || function (obj) {
	  var res = [];
	  for (var key in obj) {
	    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
	  }
	  return res;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }
/******/ ])))