$(document).ready(function() {
    var $form = $('.login-form');
    var $btnToggleProviers = $('.btn-toggle-providers');
    var $loginProviders = $('.login-providers');
    var $school = $('.school');
    var $systems = $('.system');

    var loadSystems = function(schoolId) {
        $systems.empty();
        $.getJSON('/login/systems/' + schoolId, function(systems) {
            systems.forEach(system => {
                $systems.append('<option value="' + system._id + '">' + system.type + '</option>');
            });
            $systems.trigger('chosen:updated');
        });
    };

    $btnToggleProviers.on('click', function(e) {
        e.preventDefault();
        $btnToggleProviers.hide();
        $loginProviders.show();
    });

    $school.on('change', function() {
        loadSystems($school.val());
    });

    $form.on('submit', function(e) {
        e.preventDefault();

        var data = $(this).serializeObject();

        $.post($form.prop('action'), data, function() {
            window.location = '/login/success/';
        }).fail(function() {
            $.showNotification('Benutzername oder Passwort falsch.', 'danger')
        })
    });


});