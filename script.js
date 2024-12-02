document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 1;
    const content = document.getElementById('page-content');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageNum = document.getElementById('page-number');

    async function loadPage() {
        try {
            if (currentPage === 1) {
                content.innerHTML = `
                    <h1>Modern Veterinary Practice Management</h1>
                    <h2>A Comprehensive Guide for Small and Medium Practices</h2>
                    <p class="author">2024 Edition</p>
                `;
                return;
            }

            const response = await fetch('chapters.json');
            const chapters = await response.json();
            
            const chapter = chapters.find(c => 
                currentPage >= c.pageStart && currentPage <= c.pageEnd
            );

            if (chapter) {
                const chapterContent = await fetch(`chapters/${chapter.file}`);
                const markdown = await chapterContent.text();
                content.innerHTML = marked.parse(markdown);
            }
        } catch (error) {
            console.error('Error:', error);
            content.innerHTML = '<p class="error">Error loading content</p>';
        }
        pageNum.textContent = `Page ${currentPage}`;
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= 35; // Max pages from chapters.json
    }

    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            loadPage();
        }
    };

    nextBtn.onclick = () => {
        if (currentPage < 35) {
            currentPage++;
            loadPage();
        }
    };

    // Initialize
    loadPage();
});