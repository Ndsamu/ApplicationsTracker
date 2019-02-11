//onsubmit="return validateForm()"

function validateForm() {
    var company = document.forms["applicationForm"]["company_field"].value;
    var position = document.forms["applicationForm"]["position_field"].value;
    var experience = document.forms["applicationForm"]["experience_field"].value;
    var source = document.forms["applicationForm"]["source_field"].value;
    var errors = "";
    if (company == "" || company.indexOf('\'') > -1) {
        errors+="*Please enter a company name.\r\n";
    }
    if (position == "" || position.indexOf('\'') > -1) {
        errors+="*Please enter a valid position.\n";
    }
    if (experience == "" || experience.indexOf('\'') > -1) {
        errors+="*Please enter a valid experience level.\n";
    }
    if (source == "" || source.indexOf('\'') > -1) {
        errors+="*Please enter a valid job source.\n";
    }
    if (errors) {
        document.getElementById('errorDiv').textContent = errors;
        return false;
    } else {
        console.log("Form Validation Successful.");
    }
}