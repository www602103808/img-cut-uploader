(function () {

    'use strict';

    if("undefined" == typeof $) {
        throw new Error ("JQuery is not defined!");
    }

    addJsOrCss("./../css/ddUtil.css");

    //用于生成uuid
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }

    function UUID() {
        return S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4();
    }

    function loadCurrentUrl(fileName) {
        var js = document.scripts;
        var jsPath;
        for(var i = js.length; i > 0;i --){
            if(js[i - 1].src.indexOf(fileName) > -1){
                jsPath = js[i - 1].src.substring(0,js[i-1].src.lastIndexOf("/") + 1);
            }
        }
        return jsPath;
    }
    function addJsOrCss(url) {
        if(!(url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//"))) {
            url = loadCurrentUrl("ddUtil.js") + url;
        }
        if(url.endsWith(".css")) {
            $("head").append('<link rel="stylesheet" href="' + url + '"/>');
        }else {
            $("head").append('<script type="application/javascript" src="' + url + '"></script>');
        }
    }

    function openLoading() {
        var index = UUID();
        var $loading = $("<div class='dd-loading' id='dd-loading_" + index + "'></div>");
        $("body").append($loading);
        return index;
    }

    function message(content, callback, timeOut) {
        var index = UUID();
        timeOut = timeOut || 2000;
        callback = callback || function() {};
        var $msg = $('<div class="dd-message" id="dd-open_' + index + '"><span class="dd-message-content">' + content + '</span></div>');
        $("body").append($msg);
        $msg.animate({ top: '60%'}, 'fast', function () {
            window.setTimeout(function () {
                $msg.remove();
            }, timeOut);
        });
        return index;
    }

    function close(index) {
        $("#dd-loading_" + index).remove();
    }

    function closeAll(index) {
        $(".dd-open").remove();
    }

    window['DDUtil'] = window['DDUtil'] || {};
    window['DDUtil']['UUID'] = UUID;
    window['DDUtil']['loadCurrentUrl'] = loadCurrentUrl;
    window['DDUtil']['addJsOrCss'] = addJsOrCss;


    window['DDUtil']['openLoading'] = openLoading;
    window['DDUtil']['message'] = message;
    window['DDUtil']['close'] = close;
    window['DDUtil']['closeAll'] = closeAll;
})();