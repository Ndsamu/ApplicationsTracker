$( document ).ready(function() {

    $('#applicationForm').submit(function(event) {
        event.preventDefault(); // Stops browser from navigating away from page
        
        var application = {
            company: $('#company').val(),
            position: $('#position').val(),
            experience: $('#experience').val(),
            source: $('#source').val()
        };

        console.log(application);

        if (validateApplication(application)) {
            $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: window.location + 'applications/create',
                data: JSON.stringify(application),
                dataType: 'json',
                success: function() {
                    $('#errorDiv').html('Successful submission!');
                }
            });

            document.getElementById('errorDiv').textContent = "Successful submission!";

            resetData();
        }
    });

    $('#applicationDelete').submit(function(event) {
        event.preventDefault(); // Stops browser from navigating away from page
        var names = [];
        $(":checkbox").each(function () {
            var isChecked = $(this).is(":checked");
            if (isChecked) {
                names.push($(this).attr("class"));
            }
        });
        var test = { names: names }
        console.log('Data: ' + names);
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: window.location + 'applications/delete',
            data: JSON.stringify(test),
            dataType: 'json'
        });
    });

    function resetData() {
        $('#company').val('');
        $('#position').val('');
        $('#experience').val('');
        $('#source').val('');
    };
    
})

function validateApplication(application) {
    
    var errors = "";
    if (application.company == "" || application.company.indexOf('\'') > -1) {
        errors+="*Please enter a company name.\r\n";
    }
    if (application.position == "" || application.position.indexOf('\'') > -1) {
        errors+="*Please enter a valid position.\n";
    }
    if (application.experience == "" || application.experience.indexOf('\'') > -1) {
        errors+="*Please enter a valid experience level.\n";
    }
    if (application.source == "" || application.source.indexOf('\'') > -1) {
        errors+="*Please enter a valid job source.\n";
    }
    if (errors) {
        document.getElementById('errorDiv').textContent = errors;
        return false;
    } else {
        console.log("Form Validation Successful.");
        return true;
    }
}