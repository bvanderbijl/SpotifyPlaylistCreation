function hideShowElement(id, button_id) {
    var elem = document.getElementById(button_id);

    $('#' + id).slideToggle(200);

    if (elem .value === "Hide parameters") {
      elem .value = 'Show parameters';
    } else {
      elem.value  = 'Hide parameters';
    }
}
