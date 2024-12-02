$(document).ready(function() {
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
            turned: function(e, page, view) {
                // Update page number display if needed
                if (window.location.hash) {
                    window.location.hash = page;
                }
            }
        }
    });

    // Load chapter content
    let loadedPages = 0;
    const totalChapters = 9;

    function addChapter(chapterNum, data) {
        const pageDiv = $('<div/>', {
            class: 'page'
        }).html(data);
        
        $('#flipbook').turn('addPage', pageDiv, chapterNum + 2); // +2 to account for cover and TOC
        loadedPages++;

        if (loadedPages === totalChapters) {
            // All chapters loaded
            $('#flipbook').turn('page', 1); // Go to cover
        }
    }

    // Load each chapter
    for(let i = 1; i <= totalChapters; i++) {
        $.ajax({
            url: `chapters/chapter${i}.html`,
            method: 'GET',
            success: function(data) {
                addChapter(i, data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error(`Failed to load chapter ${i}:`, textStatus);
                // Add placeholder page for missing chapter
                addChapter(i, `<div class="page-content"><h1>Chapter ${i}</h1><p>Content coming soon...</p></div>`);
            }
        });
    }

    // Keyboard navigation
    $(document).keydown(function(e) {
        if (e.keyCode == 37) { // left arrow
            $('#flipbook').turn('previous');
        } else if (e.keyCode == 39) { // right arrow
            $('#flipbook').turn('next');
        }
    });

    // Responsive resizing
    $(window).resize(function() {
        // Adjust flipbook size based on window size
        let width = Math.min(1000, $(window).width() - 40);
        let height = (width / 1000) * 700; // maintain aspect ratio
        $('#flipbook').turn('size', width, height);
    }).resize();
});