$(document).ready(function() {
    $('#flipbook').turn({
        width: 1000,
        height: 600,
        autoCenter: true,
        duration: 1000,
        gradients: true,
        acceleration: true,
        elevation: 50,
        when: {
            turning: function(e, page, view) {
                // Add any custom logic for page turns
            }
        }
    });
});