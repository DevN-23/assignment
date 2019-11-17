$(function() {
    $('.edit-user').on('click', function() {
        var id = $(this).attr('data-id');
        var name = $('#td-name-'+id).text().trim();
        var email = $('#td-email-'+id).text().trim();
        $('#hidden-user-id').val(id);
        $('#user-name').val(name);
        $('#user-email').val(email);
        $('#update-modal').modal('show');
    });

    $('#update-form').on('submit', function(e) {
        e.preventDefault();
        var $this = $(this);
        var id = $('#hidden-user-id').val();
        var formData = {
            name: $('#user-name').val(),
            email_id: $('#user-email').val()
        };
        $.ajax({
            type: $this.attr('method'),
            url: $this.attr('action')+'/'+id,
            data: formData,
            success: function(data){
                $('#td-name-'+id).text(formData.name);
                $('#td-email-'+id).text(formData.email_id);
                $('#alert-error').hide();
                $('#alert-success').text(data.message).show();
                $('#update-modal').modal('hide');
                setTimeout(function() {
                    $('#alert-success').hide();
                }, 1200);
            },
            error: function(error){
                $('#alert-success').hide();
                $('#alert-error').text(data.message).show();
                setTimeout(function() {
                    $('#alert-error').hide();
                }, 1200);
                console.log(error);
            }
        });
        return false;
    });
});