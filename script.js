$(document).ready(function() {
    var totalChapters = 9;
    var loadedChapters = 0;

    // Initialize the flipbook
    $("#flipbook").turn({
        width: 1000,
        height: 700,
        autoCenter: true,
        gradients: true,
        acceleration: true,
        elevation: 50,
        display: 'double',
        when: {
            turning: function(e, page, view) {
                // Disable right-click on pages
                $('.page-content').on('contextmenu', function(e) {
                    return false;
                });
            },
            turned: function(e, page) {
                // Update URL hash for direct linking
                window.location.hash = page;
            }
        }
    });

    // Load chapters
    function loadChapter(chapterNum) {
        $.ajax({
            url: 'chapters/chapter' + chapterNum + '.html',
            method: 'GET',
            success: function(content) {
                const pageDiv = $('<div/>', {
                    class: 'page'
                }).html(content);
                
                $('#flipbook').turn('addPage', pageDiv, chapterNum + 2); // +2 to account for cover and TOC
                loadedChapters++;
                
                if (loadedChapters === totalChapters) {
                    // All chapters loaded
                    console.log('All chapters loaded successfully');
                }
            },
            error: function() {
                console.log('Failed to load chapter ' + chapterNum);
                // Add placeholder page for missing chapters
                const placeholder = $('<div/>', {
                    class: 'page'
                }).html('<div class="page-content"><h1>Chapter ' + chapterNum + '</h1><p>Content coming soon...</p></div>');
                
                $('#flipbook').turn('addPage', placeholder, chapterNum + 2);
                loadedChapters++;
            }
        });
    }

    // Load all chapters
    for(let i = 1; i <= totalChapters; i++) {
        loadChapter(i);
    }

    // Responsive sizing
    $(window).resize(function() {
        var width = Math.min(1000, $(window).width() - 40);
        var height = (width / 1000) * 700;
        $('#flipbook').turn('size', width, height);
    }).resize();

    // Keyboard navigation
    $(document).keydown(function(e) {
        switch(e.keyCode) {
            case 37: // left arrow
                $('#flipbook').turn('previous');
                break;
            case 39: // right arrow
                $('#flipbook').turn('next');
                break;
        }
    });

    // Handle hash changes for direct linking to pages
    if (window.location.hash) {
        var page = parseInt(window.location.hash.substring(1));
        if (!isNaN(page)) {
            $('#flipbook').turn('page', page);
        }
    }
});