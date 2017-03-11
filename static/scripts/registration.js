$(document).ready(function() {
    var $form = $('.registration-form');

    $form.on('submit', function(e) {
        e.preventDefault();
        var data = $(this).serializeObject();

        $.post($form.prop('action'), data, function(res) {
            // Because Server is your supervisor
            window.location = res.location;
        });
    });
});