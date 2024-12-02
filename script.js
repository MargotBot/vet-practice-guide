$(document).ready(function() {
    $("#flipbook").turn({
        width: 1000,
        height: 700,
        autoCenter: true,
        gradients: true,
        elevation: 50,
        pages: 11,
        when: {
            turning: function(e, page, view) {
                if (page == 1) {
                    $(this).turn('peel', 'br');
                }
            }
        }
    });

    $(window).resize(function() {
        let width = Math.min(1000, $(window).width() - 40);
        let height = (width / 1000) * 700;
        $('#flipbook').turn('size', width, height);
    }).resize();

    $(document).keydown(function(e) {
        if (e.keyCode == 37) $('#flipbook').turn('previous');
        if (e.keyCode == 39) $('#flipbook').turn('next');
    });
});