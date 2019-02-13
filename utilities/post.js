function validateApplication(application) {
    
    var errors = "";
    console.log(application);
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

            resetData();
        }
    });

    function resetData() {
        $('#company').val('');
        $('#position').val('');
        $('#experience').val('');
        $('#source').val('');
    }
    
})