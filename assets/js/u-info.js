/*
*   Functions to handle getting/setting cookies
*/

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setDate(date.getDate() + days);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; domain=.rasa.com";
}

function getCookie(name) {

    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

function getCurrentDate() {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    return day + "." + month + "." + year;
}

/*
*   Functions to fire event on element
*   Required to fire change event to auto-fill discourse forum signup data
*/

function fireEvent(element,event){
    if (document.createEventObject){
    // dispatch for IE
    var evt = document.createEventObject();
    return element.fireEvent('on'+event,evt)
    }
    else{
    // dispatch for firefox + others
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent(event, true, true ); // event type,bubbling,cancelable
    return !element.dispatchEvent(evt);
    }
}


/*
* cookie definitions
*
* u_lp = aquisition landingpage
* u_fv = first visit timestamp
* u_fu = forum user
* u_vb = visited blog
* u_vd = visited docs
*
*/

window.addEventListener('load', (event) => {

    //defaults
    var cookie_duration = 356; //default cookie duration

    // u_lp - aquisition landingpage
    var u_lp = getCookie('u_lp');
    if (!u_lp) { setCookie('u_lp', window.location.href, cookie_duration); }

    // u_fv - first visit date
    var u_fv = getCookie('u_fv');
    if (!u_fv) { setCookie('u_fv', getCurrentDate(), cookie_duration); }

    // u_fu - forum user
    var u_fu = getCookie('u_fu');
    if (!u_fu) {
	if (document.getElementById("current-user"))
        	setCookie('u_fu', 'true', cookie_duration);
	else
		setCookie('u_fu', 'false', cookie_duration);
    } else {
        if (document.getElementById("current-user")) {
            setCookie('u_fu', 'true', cookie_duration);
        }
    }

    // u_vb - visited blog
    var u_vb = getCookie('u_vb');
    if (!u_vb) {
	if (window.location.href.includes("blog.rasa.com"))
        	setCookie('u_vb', 'true', cookie_duration);
	else
        	setCookie('u_vb', 'false', cookie_duration);
    } else {
        if (window.location.href.includes("blog.rasa.com")) {
            setCookie('u_vb', 'true', cookie_duration);
        }
    }

    // u_vd - visited docs
    var u_vd = getCookie('u_vd');
    if (!u_vd) {
	if (window.location.href.includes("rasa.com/docs/"))
        	setCookie('u_vd', 'true', cookie_duration);
	else
		setCookie('u_vd', 'false', cookie_duration);
    } else {
        if (window.location.href.includes("rasa.com/docs/")) {
            setCookie('u_vd', 'true', cookie_duration);
        }
    }

    /*
    * Fill all hidden form fields
    */

    //all getform forms + mailchimp forms (rasa.com, blog.rasa.com)

    if (document.getElementById("u_lp") != null) { document.getElementById("u_lp").value = getCookie('u_lp'); }
    if (document.getElementById("u_fv") != null) { document.getElementById("u_fv").value = getCookie('u_fv'); }
    if (document.getElementById("u_fu") != null) { document.getElementById("u_fu").value = getCookie('u_fu'); }
    if (document.getElementById("u_vb") != null) { document.getElementById("u_vb").value = getCookie('u_vb'); }
    if (document.getElementById("u_vd") != null) { document.getElementById("u_vd").value = getCookie('u_vd'); }
    if (document.getElementById("u_id") != null) { document.getElementById("u_id").value = getCookie('userId'); }


    //jotform (rasa.com main signup)

    if (document.getElementById("input_14") != null) { document.getElementById("input_14").value = getCookie('u_lp'); }
    if (document.getElementById("input_15") != null) { document.getElementById("input_15").value = getCookie('u_fv'); }
    if (document.getElementById("input_16") != null) { document.getElementById("input_16").value = getCookie('u_fu'); }
    if (document.getElementById("input_17") != null) { document.getElementById("input_17").value = getCookie('u_vb'); }
    if (document.getElementById("input_18") != null) { document.getElementById("input_18").value = getCookie('u_vd'); }
    if (document.getElementById("input_19") != null) { document.getElementById("input_19").value = getCookie('userId'); }


});

    //discourse forum signup form
$( document ).ready(function() {
    var $div = $("#discourse-modal");
    var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
            if (mutation.attributeName === "class") {
                var attributeValue = $(mutation.target).prop(mutation.attributeName);
                console.log("Class attribute changed to:", attributeValue);
                if (attributeValue.indexOf('create-account') !== -1){
                    console.log("SignUp Loaded");
                    if (document.querySelector(".create-account .user-fields div:nth-child(4) input") != null) { 
                        document.querySelector(".create-account .user-fields div:nth-child(4) input").value = getCookie('u_lp'); 
                        fireEvent(document.querySelector(".create-account .user-fields div:nth-child(4) input"), "change");
                    }    
                    if (document.querySelector(".create-account .user-fields div:nth-child(5) input") != null) { 
                        document.querySelector(".create-account .user-fields div:nth-child(5) input").value = getCookie('u_fv'); 
                        fireEvent(document.querySelector(".create-account .user-fields div:nth-child(5) input"), "change");
                    }
                    if (document.querySelector(".create-account .user-fields div:nth-child(6) input") != null) { 
                        document.querySelector(".create-account .user-fields div:nth-child(6) input").value = getCookie('u_fu');
                        fireEvent(document.querySelector(".create-account .user-fields div:nth-child(6) input"), "change");
                    }
                    if (document.querySelector(".create-account .user-fields div:nth-child(7) input") != null) { 
                        document.querySelector(".create-account .user-fields div:nth-child(7) input").value = getCookie('u_vb');
                        fireEvent(document.querySelector(".create-account .user-fields div:nth-child(7) input"), "change");
                    }
                    if (document.querySelector(".create-account .user-fields div:nth-child(8) input") != null) { 
                        document.querySelector(".create-account .user-fields div:nth-child(8) input").value = getCookie('u_vd');
                        fireEvent(document.querySelector(".create-account .user-fields div:nth-child(8) input"), "change");
                    }
                    if (document.querySelector(".create-account .user-fields div:nth-child(9) input") != null) { 
                        document.querySelector(".create-account .user-fields div:nth-child(9) input").value = getCookie('userId');
                        fireEvent(document.querySelector(".create-account .user-fields div:nth-child(9) input"), "change");
                    } 
                }  
            }
        });
    });
    observer.observe($div[0], {
    attributes: true
    });
});