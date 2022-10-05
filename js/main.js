var destTable;
var dropzone;
var destinations = {};
var locale = 'de';
var swissLocales = ["de","fr","it","rm"];
var l10n = {};
var domLoaded=false;
var jsonLoaded=false;
var localising=false;
var locale_results;
var locale_departure;
var locale_arrival;
const initialLocale = function() {
    for (var i=0; i<navigator.languages.length; i++) {
        var first = navigator.languages[i].substring(0,2);
        if (swissLocales.indexOf(first)!==-1) {
            locale = first;
            break;
        }
    }
    var paramString = window.location.href.split('?')[1];
    try{
        if (paramString.length>0) {
            var queryString = new URLSearchParams(paramString);
            var lang = queryString.get("lang");
            if (swissLocales.indexOf(lang)!==-1) {
                locale = lang;
            }
        }
    }
    catch(e){}
}
initialLocale();
document.addEventListener('DOMContentLoaded',() => {
    document.body.classList.add(locale);
    destTable = $("#destinations");
    dropzone = $("#dropzone");
    inputLanguage();
    $("#submit").click(checkAddress);
    $("#addDest").click(checkDest);
    document.getElementById("destDateInput").lang = locale;
    document.getElementById("destTimeInput").lang = locale;
});
const cyrb53 = (str, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
class Destination {
    constructor(addr, date, time) {
        this.addr = addr;
        this.date = date;
        this.time = time;
        this.hash = cyrb53(addr+date+time);
    }
}
const sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function checkAddress() {
    dropzone.removeClass();
    dropzone.addClass("busy");
    var srcAddr = dropzone.text();
    dropzone.prop("contenteditable",false);
    $("#srcAddr").html(locale_results);
    $("#results").html("");
    var dests = Object.values(destinations);
    for (var i=0;i<dests.length;i++) {
        var dest=dests[i];
        $.getJSON("https://timetable.search.ch/api/route.json?from="+srcAddr+"&to="+dest.addr+"&date="+dest.date+"&time="+dest.time+"&time_type=arrival",
            function(result) {
            if(result.messages!==undefined) {
                $("#dropzone").addClass("inputError");
                return;
            }
            interpretJSON(srcAddr,result.connections);
        });
    }
    await sleep(1000);
    dropzone.removeClass();
    dropzone.addClass("ready");
    dropzone.html("");
    dropzone.prop("contenteditable",true);
};

const interpretJSON = function(srcAddr,conns) {
    console.log(conns);
    var n = conns.length-1;
    var results = $("#results");
    var rdiv = $("<div>");
    rdiv.addClass("result");
    var targ = $("<span>");
    targ.addClass("result_target");
    targ.text(srcAddr+" => "+conns[n].to);
    rdiv.append(targ);
    var dep = conns[n].departure;
    var s = $("<span>");
    s.addClass("result_depart");
    s = makeResultDate(s,dep);
    rdiv.append(s);
    var arr = conns[n].arrival;
    var s2 = $("<span>");
    s2.addClass("result_arrive");
    s2 = makeResultDate(s2,arr);
    rdiv.append(s2);
    var s3 = $("<span>");
    s3.addClass("result_duration");
    var dur = conns[n].duration;
    s3.text((dur/60)+"min");
    rdiv.append(s3);
    results.append(rdiv);
};
const makeResultDate = function(s, datetime=null) {
    if (datetime===null) {
        datetime = s.children("input").val();
        s.html("");
    }
    s.addClass("date");
    var depDate = new Date(datetime).toLocaleString(locale, {weekday: 'long'});
    depDate = depDate.charAt(0).toUpperCase() + depDate.slice(1);
    if (s.hasClass("result_depart")) s.text(locale_departure+": "+depDate+", "+datetime.substring(0,datetime.length-3).substring(11));
    else s.text(locale_arrival+": "+depDate+", "+datetime.substring(0,datetime.length-3).substring(11));
    var sint = $("<input type=\"hidden\">");
    sint.val(datetime);
    s.append(sint);
    return s;
}
const makeready = function() {
    dropzone.removeClass();
    dropzone.addClass("ready");
    dropzone.prop("contenteditable",true);
    dropzone.on('drop', function(e) {
        var srcAddr = e.originalEvent.dataTransfer.getData('text/plain');
        dropzone.html(srcAddr.replaceAll(/[\n\r\v\t]/g,' '));
        e.stopPropagation();
        e.preventDefault();
        checkAddress();
    });
};
const addDest = function(addr,date,time) {
    var n = Object.getOwnPropertyNames(destinations).length;
    var dest = new Destination(addr, date, time);
    destinations[""+dest.hash] = dest;
    displayDest(dest);
    document.cookie = "destinations="+JSON.stringify(destinations);
    if (n==0) makeready();
};
const checkDest = function() {
    $("#destAddrInput").removeClass();
    $("#destDateInput").removeClass();
    $("#destTimeInput").removeClass();
    var addr = document.getElementById("destAddrInput").value.trim();
    var date = document.getElementById("destDateInput").value.trim();
    var time = document.getElementById("destTimeInput").value.trim();
    var errorfree = true;
    if (!addr) {
        $("#destAddrInput").addClass("inputError");
        errorfree = false;
    }
    if (!date || (!date.match(/^\d{1,2}\.([01]?\d\.((20)?\d{2})?)?$/) && !date.match(/^\d{4}-\d{2}-\d{2}$/))) {
        $("#destDateInput").addClass("inputError");
        errorfree = false;
    }
    if (!time || !time.match(/^\d{1,2}:\d{2}$/)) {
        $("#destTimeInput").addClass("inputError");
        errorfree = false;
    }
    if (!errorfree) return;
    if (addr.toLowerCase()!=="bern") {
        $.getJSON("https://timetable.search.ch/api/route.json?from=Bern&to="+addr+"&date="+date+"&time="+time+"&time_type=arrival",function(result) {
            if(result.messages!==undefined) {
                if (typeof result.messages == "String") {
                    if (result.messages=="No timetable information for this period.") {
                        $("#destDateInput").addClass("inputError");
                        return;
                    }
                    if(result.messages.substring(0,5)=="Stop ")
                    {
                        $("#destAddrInput").addClass("inputError");
                        return;
                    }
                    $("#destAddrInput").addClass("inputError");
                    $("#destDateInput").addClass("inputError");
                    return;
                }
                else {
                    for (var i=0;i<result.messages.length;i++) {
                        if (result.messages[i]=="No timetable information for this period.") {
                            $("#destDateInput").addClass("inputError");
                        }
                        else if (result.messages[i].substring(0,5)=="Stop ") {
                            $("#destAddrInput").addClass("inputError");
                        }
                        else {
                            $("#destAddrInput").val(result.messages[i]);
                            $("#destAddrInput").addClass("inputError");
                            $("#destDateInput").addClass("inputError");
                        }
                    }
                    return;
                }
            }
            addDest(addr,date,time);
        });
    }
    else {
        addDest(addr,date,time);
    }
};
jQuery(function($){
    $("[contenteditable]").focusout(function(){
        var element = $(this);        
        if (!element.text().trim().length) {
            element.empty();
        }
    });
});
const displayDest = function(dest) {
    var div = $("<div>");
    div.prop('id', dest.hash);
    div.addClass("destination");
    var thr = $("<div>");
    thr.addClass("dest_address");
    var txtAddr = document.createTextNode(dest.addr);
    thr.append(txtAddr);
    div.append(thr);
    var button = $("<button>");
    button.click(function(){deleteThis(dest.hash);});    
    div.append(button);
    var tdr = $("<div>");
    tdr.addClass("dest_arrival");
    var isoDate = ""+dest.date.substring(6,10)+"-"+dest.date.substring(3,5)+"-"+dest.date.substring(0,2);
    var depDate = new Date(isoDate).toLocaleString(locale, {weekday: 'long'});
    depDate = depDate.charAt(0).toUpperCase() + depDate.slice(1);
    var txtTime = document.createTextNode(depDate+", "+dest.date+" "+dest.time);
    tdr.append(txtTime);
    div.append(tdr);
    destTable.append(div);
};
const deleteThis = function(hash) {
    delete destinations[""+hash];
    $("#"+hash).remove();
    document.cookie = "destinations="+JSON.stringify(destinations);
}
const inputLanguage = function() {
    document.title = l10n[locale].title;
    $("h1").text(l10n[locale].title);
    var urlString = window.location.href.split('?')[0];
    history.pushState(null, l10n[locale].title, urlString+"?lang="+locale);
    $("#srcTitle").text(l10n[locale].srcTitle);
    $("#submit").text(l10n[locale].submit);
    $("#destTitle").text(l10n[locale].destTitle);
    $("#addDestTitle").text(l10n[locale].addDestTitle);
    $("#destAddrInputLabel").text(l10n[locale].destAddrInputLabel);
    $("#destDateInputLabel").text(l10n[locale].destDateInputLabel);
    $("#destTimeInputLabel").text(l10n[locale].destTimeInputLabel);
    $("#addDest").text(l10n[locale].addDest);
    locale_results = l10n[locale].results;
    locale_departure=l10n[locale].departure;
    locale_arrival=l10n[locale].arrival;
    $(".date").each(function(){
       makeResultDate($(this)); 
    });
    $("#srcAddr").text(locale_results);
    destTable.html("");
    displayStoredDestinations();
}
window.onload = function() {
    var destDate = flatpickr('#destDateInput',{
        //dateFormat: 'd.m.Y H:i',
        //enableTime: true,
        time_24hr: true,
        dateFormat: 'd.m.Y',
        locale: locale
    });
    var destTime = flatpickr('#destTimeInput',{
        enableTime: true,
        noCalendar: true,
        time_24hr: true,
        dateFormat: 'H:i',
        locale: locale
    });
    var destcookie = document.cookie.substring(13);
    if (destcookie) {
        destTable.html("");
        try {       
            destinations = JSON.parse(destcookie);
            displayStoredDestinations();
        }
        catch(e) {
            document.cookie = "destinations={}";
        }
    }
    if (Object.getOwnPropertyNames(destinations).length>0) makeready();
    $("#lang").on("click",displayChoices);
    $(".choices button").on("click",swapLanguage);
};
const displayStoredDestinations = function() {
    var dests = Object.values(destinations);
    for (var i=0; i<dests.length; i++) {
        var tmp = new Destination();
        Object.assign(tmp,dests[i]);
        destinations[""+tmp.hash] = tmp;
        displayDest(tmp);
    }
}
const displayChoices = function(event) {
    $(".choices").addClass("visible");
    $("#lang").on("click",function(){
       $(".choices").removeClass("visible");
       $("#lang").on("click",displayChoices);
    });
}
const swapLanguage = function(event) {
    document.body.classList.remove(locale);
    locale = event.target.id;
    document.body.classList.add(locale);
    var destDate = flatpickr('#destDateInput',{
        //dateFormat: 'd.m.Y H:i',
        //enableTime: true,
        time_24hr: true,
        dateFormat: 'd.m.Y',
        locale: locale
    });
    var destTime = flatpickr('#destTimeInput',{
        enableTime: true,
        noCalendar: true,
        time_24hr: true,
        dateFormat: 'H:i',
        locale: locale
    });
    inputLanguage();
    $(".choices").removeClass("visible");
    $("#lang").on("click",displayChoices);
}