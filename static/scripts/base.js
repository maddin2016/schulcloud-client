function getQueryParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function(){
    // Initialize bootstrap-select
    $('select').not('.no-bootstrap').chosen({
        width: "100%",
        "disable_search": true
    });

    $.fn.serializeObject = function() {
        const data = {};
        $(this.serializeArray()).each(function(index, obj){
            data[obj.name] = obj.value;
        });
        return data;
    }

    // notification stuff
    var $notification = $('.notification');
    var $notificationContent = $notification.find('.notification-content')

    window.$.showNotification = function(content, type) {
        $notificationContent.html(content);

        // remove old classes in case type was set before
        $notification.removeClass();
        $notification.addClass('notification alert alert-dismissible');
        if(type) {
            $notification.addClass('alert-' + type);
        }

        $notification.fadeIn();
    };

    window.$.hideNotification = function() {
        $notification.fadeOut();
    }
});