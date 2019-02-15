$( document ).ready(function() {

    $('#applicationForm').submit(function(event) {
        event.preventDefault(); // Stops browser from navigating away from page
        // Fill JSON object with application
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
                success: function(res) {
                    addApplication(res.application);
                },
                error: function() {
                    console.log('Server failed to respond.');
                }
            });
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
        var data = { names: names }
        console.log('Data: ' + names);
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: window.location + 'applications/delete',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function(res) {
                if (res.response == 'success') {
                    var application;
                    for (i in names) {
                        application = document.getElementById(names[i]);
                        application.parentNode.removeChild(application);
                    }
                }
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
        document.getElementById('errorDiv').textContent = "Successful submission!";
        return true;
    }
}

function addApplication(application) {
    const container = document.getElementsByClassName('applicationDelete')[0];
    const appWrap = document.createElement('div');
    appWrap.classList.add('application-wrapper');
    appWrap.id = application.company;
    const checkbox = document.createElement('div')
    checkbox.classList.add('checkbox');
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.classList.add(application.company);
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