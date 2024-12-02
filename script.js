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
});