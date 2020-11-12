module.exports = {
    // Set default select option for dropdowns
    defaultSelectOption: function(selected, options) {
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"');
    }
}