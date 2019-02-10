function validateForm() {
    var company = document.forms["applicationForm"]["company_field"].value;
    var position = document.forms["applicationForm"]["position_field"].value;
    var experience = document.forms["applicationForm"]["experience_field"].value;
    var source = document.forms["applicationForm"]["source_field"].value;
    if (company == "" || position = "" || experience = "" || source = "") {
      alert("Name must be filled out");
      return false;
    }
}