$( document ).ready(function() {

    $('#applicationForm').submit(function(event) {
        // Stops browser from navigating away from page
        event.preventDefault();
        // Fill JSON object with application
        var application = {
            company: $('#company').val(),
            position: $('#position').val(),
            experience: $('#experience').val(),
            source: $('#source').val()
        };

        if (validateApplication(application)) {
            // Make a post request using AJAX which passes the application
            // Data passed through HTML must be "stringified"
            $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: window.location + 'applications/create',
                data: JSON.stringify(application),
                dataType: 'json',
                success: function(res) {
                    addApplication(res.application);
                },
                error: function() {
                    console.log('Server failed to respond.');
                }
            });
            resetData();
        }
        $("#company").focus();
    });

    $('#applicationDelete').submit(function(event) {
        // Stops browser from navigating away from page
        event.preventDefault();
        var IDs = [];
        $(":checkbox").each(function () {
            var isChecked = $(this).is(":checked");
            if (isChecked) {
                //console.log($(this).parentNode.attr("class"));
                IDs.push($(this).attr("class"));
            }
        });
        var data = { IDs: IDs }
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: window.location + 'applications/delete',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function(res) {
                if (res.response == 'success') {
                    var application;
                    for (i in IDs) {
                        application = document.getElementById(IDs[i]);
                        application.parentNode.removeChild(application);
                    }
                }
            },
            error: function() {
                console.log('Server failed to respond.');
            }
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
    document.getElementById('errorCompany').textContent = "";
    document.getElementById('errorPosition').textContent = "";
    document.getElementById('errorExperience').textContent = "";
    document.getElementById('errorSource').textContent = "";
    var errors = "";
    if (application.company == "" || application.company.indexOf('\'') > -1) {
        errors+="*Please enter a valid company name.<br>";
        document.getElementById('errorCompany').textContent = "*Invalid input";
    }
    if (application.position == "" || application.position.indexOf('\'') > -1) {
        errors+="*Please enter a valid position.<br>";
        document.getElementById('errorPosition').textContent = "*Invalid input";
    }
    if (application.experience == "" || application.experience.indexOf('\'') > -1) {
        errors+="*Please enter a valid experience level.<br>";
        document.getElementById('errorExperience').textContent = "*Invalid input";
    }
    if (application.source == "" || application.source.indexOf('\'') > -1) {
        errors+="*Please enter a valid job source.";
        document.getElementById('errorSource').textContent = "*Invalid input";
    }
    if (errors) {
        document.getElementById('errorDiv').innerHTML = errors;
        return false;
    } else {
        document.getElementById('errorCompany').textContent = "";
        document.getElementById('errorPosition').textContent = "";
        document.getElementById('errorExperience').textContent = "";
        document.getElementById('errorSource').textContent = "";
        document.getElementById('errorDiv').innerHTML = "";
        return true;
    }
}

function addApplication(application) {
    const container = document.getElementsByClassName('applicationDelete')[0];
    const appWrap = document.createElement('div');
    appWrap.classList.add('application-wrapper');
    appWrap.id = application.id;
    const checkbox = document.createElement('div')
    checkbox.classList.add('checkbox');
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.classList.add(application.id);
    const app = document.createElement('div')
    app.classList.add('application');

    checkbox.appendChild(check);
    appWrap.appendChild(checkbox);
    appWrap.appendChild(app);
    container.insertBefore(appWrap, container.childNodes[3]);
    
    app.innerHTML = '\
    Company: ' + application.company + '<br>\
    Position: ' + application.position + '<br>\
    Experience: ' + application.experience + '<br>\
    Source: ' + application.source + '<br>';
}