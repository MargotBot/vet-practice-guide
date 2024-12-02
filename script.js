document.addEventListener('DOMContentLoaded', function() {
    const pageContent = document.getElementById('page-content');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const pageNumber = document.getElementById('page-number');
    let currentPage = 1;
    let chapters = [];

    // Load chapters configuration
    fetch('chapters.json')
        .then(response => response.json())
        .then(data => {
            chapters = data;
            displayCurrentPage();
            updateNavigation();
        })
        .catch(error => {
            console.error('Error loading chapters:', error);
            pageContent.innerHTML = `<p class="error">Error loading content: ${error.message}</p>`;
        });

    function displayCurrentPage() {
        if (currentPage === 1) {
            // Display cover page
            pageContent.innerHTML = `
                <h1>Modern Veterinary Practice Management</h1>
                <h2>A Comprehensive Guide for Small and Medium Practices</h2>
                <p class="author">2024 Edition</p>
            `;
            return;
        }

        // Find the current chapter
        const chapter = chapters.find(c => 
            currentPage >= c.pageStart && currentPage <= c.pageEnd
        );

        if (chapter) {
            fetch(`chapters/${chapter.file}`)
                .then(response => response.text())
                .then(content => {
                    pageContent.innerHTML = marked.parse(content);
                })
                .catch(error => {
                    console.error('Error loading chapter:', error);
                    pageContent.innerHTML = `<p class="error">Error loading chapter content: ${error.message}</p>`;
                });
        }
    }

    function updateNavigation() {
        const maxPage = chapters.length > 0 ? 
            Math.max(...chapters.map(c => c.pageEnd)) : 
            1;

        prevButton.disabled = currentPage <= 1;
        nextButton.disabled = currentPage >= maxPage;
        pageNumber.textContent = `Page ${currentPage}`;

        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('page', currentPage);
        window.history.pushState({}, '', url);
    }

    // Navigation event listeners
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayCurrentPage();
            updateNavigation();
        }
    });

    nextButton.addEventListener('click', () => {
        const maxPage = chapters.length > 0 ? 
            Math.max(...chapters.map(c => c.pageEnd)) : 
            1;
        if (currentPage < maxPage) {
            currentPage++;
            displayCurrentPage();
            updateNavigation();
        }
    });

    // Handle URL parameters on load
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    if (pageParam) {
        const page = parseInt(pageParam);
        if (!isNaN(page) && page >= 1) {
            currentPage = page;
        }
    }
});