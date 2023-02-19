// ==UserScript==
// @name         0DiBi_Extended
// @namespace    http://github.com/potatosalad775
// @version      0.1
// @description  Extensive Add-on for 0db.co.kr
// @author       potatosalad775
// @match        https://www.0db.co.kr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0db.co.kr
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

let extendedVersion = "0.1";

// let resourceURL = 'http://127.0.0.1:8080/'; // resourceURL for debugging
let resourceURL = 'https://raw.githubusercontent.com/potatosalad775/0dibi_Extended/main/'

let extendedPlatform;

function AddExtendedMenu() {
    if(extendedPlatform == "Mobile") {
        document.getElementsByClassName("clearBoth foot_menu")[0].innerHTML = document.getElementsByClassName("clearBoth foot_menu")[0].innerHTML + '<li class="footer_li"><a href="#" id="extendedSetting" class="foot_first_a">Extended 설정</a></li>';
    }
    else {
        document.getElementsByClassName("clearBoth wrap_login")[0].innerHTML = document.getElementsByClassName("clearBoth wrap_login")[0].innerHTML + '<li><a href="#" id="extendedSetting" class="login_A">Extended 설정</a></li>';
    }
    $('body').on('click', '#extendedSetting', function() {
        document.getElementById("extendedLayer").style.display = 'block';
        $('html, body').scrollTop(0);
        DisableScroll();
    });
}

function EnableScroll() {
    window.onscroll = function() {};
}

function DisableScroll() {
    window.onscroll = function() {
        window.scrollTo(0, 0);
    };
}

function InitExtendedSettingPage() {
    GM_xmlhttpRequest({
        method: "GET",
        url: resourceURL + "extended_settings_" + extendedPlatform + ".html",
        onreadystatechange: function(response) {
            if (response.readyState == 4 && response.status == 200) {
                var html = response.responseText;

                AttachExtendedSettingPage(html);
                InitExtendedValue();
                LoadSettingPageEvent();
            }
        }
    });
}

function PrepareSettingPageCSS() {
    GM_addStyle(`
    .extendedDimmed { background-color: rgba(0,0,0,0.5); position: fixed; left: 0; top: 0; width: 100%; height: 100%; }
    .extendedLayerWrapper { position: absolute; width: auto; left: 50%; }
    .extendedOverlayLayer { position: absolute; }
    .extendedOverlaySection { float: none; position: relative; background-color: #fff; border-bottom: 0px !important;}
    .extendedDL { float: left; margin: 0px; }
    .extendedDL dt { float: left; width: 100px; clear: both; padding: 0px 0px 15px; }
    .extendedDL dd { float: left; padding: 0px 0px 15px; }
    `);
}

function AttachExtendedSettingPage(html) {
    var settings = document.createElement('div');
    settings.id = 'extendedLayer';
    settings.style.cssText = 'display: none; overflow-y: scroll; position: absolute; left: 0; top: 0; width: 100%; height: 100%;';
    document.body.appendChild(settings);
    document.getElementById('extendedLayer').innerHTML = html;
}

function InitExtendedValue() {
    //var selectedTheme = GetValue('extendedSelectedTheme', 'dark');
    //$('input:radio[name="extendedSelectedTheme"]:input[value=' + selectedTheme + ']').attr("checked", true);
    //ChangeTheme(selectedTheme);

    var fontName = GetValue('extendedFontName', 'Noto Sans KR');
    document.getElementById("extendedFontCustomName").value = fontName;
    document.getElementById("extendedFontCustomCSS").value = GetValue('extendedFontCSS', 'https://fonts.googleapis.com/earlyaccess/notosanskr.css');
    ChangeFont();

    if(fontName == 'Noto Sans KR') {
        document.getElementById("extendedFontNoto").checked = true;
    }
    else if(fontName == 'Nanum Gothic') {
        document.getElementById("extendedFontNanum").checked = true;
    }
    else if(fontName == 'Apple SD Gothic Neo') {
        document.getElementById("extendedFontApple").checked = true;
    }
    else {
        document.getElementById("extendedFontCustom").checked = true;
    }
}

function CloseSettingsPage() {
    document.getElementById("extendedLayer").style.display = 'none';
    EnableScroll();
}

function LoadSettingPageEvent() {
    $(document).on('click', '#extendedBtnOK', function() {
        SetValue('extendedFontName', document.getElementById("extendedFontCustomName").value);
        SetValue('extendedFontCSS', document.getElementById("extendedFontCustomCSS").value);
        ChangeFont();

        CloseSettingsPage();
    });
    /*
    $(document).on("change",'input[name="extendedUseSystemTheme"]',function(){
        if (document.getElementById("extendedSystemTheme").checked) {
            SetValue('extendedSystemTheme', 'true');
            var systemTheme = GetOSTheme();
            var currentTheme = SetValue('extendedSelectTheme', 'dark');
            if (systemTheme != currentTheme) {
                SetValue('extendedSelectTheme', systemTheme);
                ChangeTheme(systemTheme);
            }
        } else {
            SetValue('enhancedSystemTheme', 'false');
        }
    });
    */
    $(document).on('click', '#extendedFontNoto', function() {
        var fontName = "Noto Sans KR";
        var fontCSS = "https://fonts.googleapis.com/earlyaccess/notosanskr.css";
        document.getElementById("extendedFontCustomName").value = fontName;
        document.getElementById("extendedFontCustomCSS").value = fontCSS;
        SetValue('extendedFontName', fontName);
        SetValue('extendedFontCSS', fontCSS);
    });

    $(document).on('click', '#extendedFontNanum', function() {
        var fontName = "Nanum Gothic";
        var fontCSS = "https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap";
        document.getElementById("extendedFontCustomName").value = fontName;
        document.getElementById("extendedFontCustomCSS").value = fontCSS;
        SetValue('extendedFontName', fontName);
        SetValue('extendedFontCSS', fontCSS);
    });

    $(document).on('click', '#extendedFontApple', function() {
        var fontName = "Apple SD Gothic Neo', '애플 SD 산돌고딕 Neo";
        var fontCSS = "";
        document.getElementById("extendedFontCustomName").value = fontName;
        document.getElementById("extendedFontCustomCSS").value = fontCSS;
        SetValue('extendedFontName', fontName);
        SetValue('extendedFontCSS', fontCSS);
    });
}
    /*
function GetOSTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    } else {
        return 'light';
    }
}

function LoadDarkThemeCSS() {
    GM_xmlhttpRequest({
        method: "GET",
        url: resourceURL + "css/darktheme.css",
        onreadystatechange: function(response) {
            if (response.readyState == 4 && response.status == 200) {
                var darkcss = response.responseText;
                GM_addStyle(darkcss)
            }
        }
    });
}

function ChangeTheme(styleName) {
    if(styleName == 'dark') {
        LoadDarkThemeCSS();
    } else {
        $('style').remove(); // Remove Dark Theme CSS
        ChangeFont();
    }
}
    */
function ChangeFont() {
    GM_addStyle("body, table, input, textarea, select, button, .top_header, .login_PlayoutA, .title-1, .bd, .bd input, .bd textarea, .bd select, .bd button, .bd table, .bd .ngeb { font-family: '" + GetValue('extendedFontName', 'Noto Sans KR') + "' !important;}");
    GM_addStyle("@import url(" + GetValue('extendedFontCSS', 'https://fonts.googleapis.com/earlyaccess/notosanskr.css') + ");");
}

function GetValue(key, defaultValue) {
    var value = localStorage[key];
    if(value == "" || value == null) {
        SetValue(key, defaultValue);
        value = defaultValue;
    }
    return value;
}

function SetValue(key, value) {
    localStorage[key] = value;
    return value;
}

function FindPlatform() {
    if(document.querySelector('html').classList.contains('xe-mobilelayout')) {
        extendedPlatform = "Mobile";
    } else {
        extendedPlatform = "PC";
    }
}

(function() {
    FindPlatform();
    InitExtendedSettingPage();
    PrepareSettingPageCSS();
    AddExtendedMenu();
})();