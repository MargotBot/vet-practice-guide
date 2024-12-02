document.addEventListener('DOMContentLoaded', function() {
    const flipbook = document.getElementById('flipbook');
    const pageContainer = document.getElementById('page-content');
    let currentPage = 1;
    let chapters = [];

    async function loadChapters() {
        try {
            const response = await fetch('chapters.json');
            chapters = await response.json();
            initializeBook();
        } catch (error) {
            console.error('Error loading chapters:', error);
            pageContainer.innerHTML = '<p class="error">Error loading content. Please try again later.</p>';
        }
    }

    function initializeBook() {
        displayCurrentPage();
        setupNavigation();
        handleURLParameters();
    }

    function displayCurrentPage() {
        if (!chapters.length) return;
        
        const chapter = chapters.find(c => c.pageStart <= currentPage && c.pageEnd >= currentPage);
        if (chapter) {
            fetch(`chapters/${chapter.file}`)
                .then(response => response.text())
                .then(content => {
                    pageContainer.innerHTML = marked(content);
                    updatePageNumber();
                })
                .catch(error => {
                    console.error('Error loading page content:', error);
                    pageContainer.innerHTML = '<p class="error">Error loading page content.</p>';
                });
        }
    }

    function setupNavigation() {
        document.getElementById('prev-page').addEventListener('click', () => navigateToPage(currentPage - 1));
        document.getElementById('next-page').addEventListener('click', () => navigateToPage(currentPage + 1));
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') navigateToPage(currentPage - 1);
            if (e.key === 'ArrowRight') navigateToPage(currentPage + 1);
        });
    }

    function navigateToPage(newPage) {
        const maxPage = chapters.reduce((max, chapter) => Math.max(max, chapter.pageEnd), 0);
        if (newPage >= 1 && newPage <= maxPage) {
            currentPage = newPage;
            displayCurrentPage();
            updateURL();
        }
    }

    function updatePageNumber() {
        document.getElementById('page-number').textContent = `Page ${currentPage}`;
    }

    function updateURL() {
        const url = new URL(window.location);
        url.searchParams.set('page', currentPage);
        window.history.pushState({}, '', url);
    }

    function handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = urlParams.get('page');
        if (pageParam) {
            const page = parseInt(pageParam);
            if (!isNaN(page)) {
                navigateToPage(page);
            }
        }
    }

    // Initialize the flipbook
    loadChapters();
});