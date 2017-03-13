$(document).ready(function() {

    var $modal = $('.modal');
    var $form = $modal.find('.modal-form');

    // TODO: replace with something cooler
    var reloadRecords = function() {
        window.location.reload();
    };

    $('.edit-form-school').on('submit', function(e) {
        e.preventDefault();
        var data = $(this).serializeObject();
        const id = data._id;
        delete data._id;
        $.ajax({
            url: $(this).prop('action') + id,
            method: 'PATCH',
            data,
            success: function(result) {
                $.showNotification('Speichern erfolgreich!', 'success');
                reloadRecords();
            }
        });
    });


    $('.btn-add').on('click', function(e) {
        e.preventDefault();
        populateModalForm($modal, {
            title: 'Hinzufügen',
            closeLabel: 'Schließen',
            submitLabel: 'Hinzufügen'
        });
        $modal.modal('show');
    });

    $('.btn-edit').on('click', function(e) {
        e.preventDefault();
        $.getJSON($(this).attr('href'), function(result) {
            populateModalForm($modal, {
                title: 'Bearbeiten',
                closeLabel: 'Schließen',
                submitLabel: 'Speichern',
                fields: result
            });
            $modal.modal('show');
        });
    });

    $('.btn-delete').on('click', function(e) {
        e.preventDefault();
        $.ajax({
            url: $(this).attr('href'),
            type: 'DELETE',
            success: function(result) {
                $.showNotification('Löschen erfolgreich!', 'success');
                reloadRecords();
            }
        });
    });

    var populateModalForm = function(modal, data) {

        var $title = $modal.find('.modal-title');
        var $btnSubmit = $modal.find('.btn-submit');
        var $btnClose = $modal.find('.btn-close');

        $title.html(data.title);
        $btnSubmit.html(data.submitLabel);
        $btnClose.html(data.closeLabel);

        // fields
        $('[name]', $form).not('[data-force-value]').each(function() {
            var value = (data.fields || {})[$(this).prop('name')] || '';

            console.log(value);

            switch($(this).prop("type")) {
                case "radio":
                case "checkbox":
                    $(this).each(function() {
                        if($(this).attr('value') == value) $(this).attr("checked",value);
                    });
                    break;
                default:
                    $(this).val(value).trigger("chosen:updated");
            }
        });
    };

    $form.on('submit', function(e) {
        e.preventDefault();

        var data = $(this).serializeObject();

        const id = data._id;
        delete data._id;

        let options;
        if(id) {
            options = {
                url: $form.prop('action') + id,
                method: 'PATCH',
                data
            }
        } else {
            options = {
                url: $form.prop('action'),
                method: 'POST',
                data
            }
        }

        options.success = function() {
            $.showNotification('Speichern erfolgreich!', 'success');
            reloadRecords();
        }

        $.ajax(options);

        $modal.modal('hide');
    });

    $modal.find('.close, .btn-close').on('click', function() {
        $modal.modal('hide');
    });

});