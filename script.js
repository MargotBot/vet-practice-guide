$(document).ready(function() {
    $("#flipbook").turn({
        width: 1000,
        height: 700,
        autoCenter: true,
        gradients: true,
        acceleration: true,
        elevation: 50,
        pages: 20,
        when: {
            turning: function(e, page, view) {
                // Handle page turning events
            },
            turned: function(e, page, view) {
                // After page turn complete
            }
        }
    });

    // Load chapter content
    for(let i = 1; i <= 9; i++) {
        $.get(`chapters/chapter${i}.html`, function(data) {
            const pageDiv = $('<div/>', {
                class: 'page'
            }).html(data);
            $('#flipbook').turn('addPage', pageDiv);
        });
    }
});