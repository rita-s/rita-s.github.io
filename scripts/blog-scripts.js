document.addEventListener('DOMContentLoaded', function() {
    // Store original state of all content elements
    const allSections = document.querySelectorAll('.section-title');
    const allGrids = document.querySelectorAll('.blog-grid');
    const originalSectionStates = {};
    const originalGridStates = {};

    // Save original states
    allSections.forEach(section => {
        originalSectionStates[section.id] = section.style.display || '';
    });

    allGrids.forEach(grid => {
        originalGridStates[grid.getAttribute('data-category')] = grid.style.display || '';
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Pagination functionality for blog - FIXED VERSION
    const paginationLinks = document.querySelectorAll('.blog-pagination .page, .blog-pagination .next');
    const pages = document.querySelectorAll('.blog-content');

    if (paginationLinks.length > 0 && pages.length > 0) {
        paginationLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                // Get the target page
                const targetPage = this.getAttribute('data-page');
                console.log('Switching to page:', targetPage); // Debug log

                // Update pagination UI
                document.querySelectorAll('.blog-pagination .page').forEach(pageLink => {
                    pageLink.classList.remove('current');
                });
                document.querySelector(`.blog-pagination .page[data-page="${targetPage}"]`).classList.add('current');

                // Hide all pages immediately
                pages.forEach(page => {
                    page.style.display = 'none';
                });

                // Show the target page
                const targetPageEl = document.getElementById(`page${targetPage}`);
                if (targetPageEl) {
                    targetPageEl.style.display = 'block';
                } else {
                    console.error(`Page element #page${targetPage} not found!`);
                }

                // Update the next/previous link
                const nextLink = document.querySelector('.blog-pagination .next');
                if (nextLink) {
                    if (targetPage === "2") {
                        nextLink.setAttribute('data-page', '1');
                        nextLink.textContent = 'Previous Page';
                    } else {
                        nextLink.setAttribute('data-page', '2');
                        nextLink.textContent = 'Next Page';
                    }
                }

                // Smooth scroll to top of blog posts section
                const blogPostsSection = document.querySelector('.blog-posts');
                if (blogPostsSection) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    window.scrollTo({
                        top: blogPostsSection.offsetTop - headerHeight - 20,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Category filtering functionality
    const categoryPills = document.querySelectorAll('.category-pill');

    if (categoryPills.length > 0) {
        categoryPills.forEach(pill => {
            pill.addEventListener('click', function(e) {
                e.preventDefault();

                // Update UI state
                categoryPills.forEach(p => p.classList.remove('active'));
                this.classList.add('active');

                const selectedCategory = this.getAttribute('data-category');

                // Handle "All" category
                if (selectedCategory === 'all') {
                    // Always reset to a known good state
                    resetToAllCategories();
                } else {
                    // Filter by specific category
                    filterByCategory(selectedCategory);
                }
            });
        });
    }

    // Function to reset to show all categories (page 1)
    function resetToAllCategories() {
        // Reset to first page
        document.getElementById('page1').style.display = 'block';
        document.getElementById('page2').style.display = 'none';

        // Make sure pagination is visible
        document.querySelector('.blog-pagination').style.display = 'flex';

        // Reset pagination state
        document.querySelectorAll('.blog-pagination .page').forEach(pageLink => {
            pageLink.classList.remove('current');
        });
        document.querySelector('.blog-pagination .page[data-page="1"]').classList.add('current');

        // Reset all section titles and blog grids to their original state
        allSections.forEach(section => {
            section.style.display = originalSectionStates[section.id] || '';
        });

        allGrids.forEach(grid => {
            const category = grid.getAttribute('data-category');
            grid.style.display = originalGridStates[category] || '';
            grid.classList.remove('fade-out', 'fade-in');
        });

        // Reset next link
        const nextLink = document.querySelector('.blog-pagination .next');
        if (nextLink) {
            nextLink.setAttribute('data-page', '2');
            nextLink.textContent = 'Next Page';
        }
    }

    // Function to filter by specific category
    function filterByCategory(category) {
        // Hide pagination when filtering
        document.querySelector('.blog-pagination').style.display = 'none';

        // Show both pages to ensure we see all matching content
        document.getElementById('page1').style.display = 'block';
        document.getElementById('page2').style.display = 'block';

        // Hide all sections and grids immediately for cleaner transition
        allSections.forEach(section => {
            section.style.display = 'none';
        });

        allGrids.forEach(grid => {
            grid.style.display = 'none';
        });

        // Show only matching content
        const matchingSections = document.querySelectorAll(`.section-title#${category}`);
        const matchingGrids = document.querySelectorAll(`.blog-grid[data-category="${category}"]`);

        matchingSections.forEach(section => {
            section.style.display = 'block';
        });

        matchingGrids.forEach(grid => {
            grid.style.display = 'grid';
        });

        // Maintain scroll position to keep categories in view
        const categoriesSection = document.querySelector('.blog-categories-nav');
        if (categoriesSection) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            window.scrollTo({
                top: categoriesSection.offsetTop - headerHeight - 20,
                behavior: 'smooth'
            });
        }
    }

    // Copy link functionality for share buttons
    const copyButtons = document.querySelectorAll('.share-copy');

    copyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // Get the current URL
            const url = window.location.href;

            // Use modern clipboard API if available, fallback to execCommand
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url)
                    .then(showCopySuccess)
                    .catch(err => {
                        console.error('Failed to copy: ', err);
                        // Fallback to old method
                        copyWithExecCommand(url);
                    });
            } else {
                copyWithExecCommand(url);
            }
        });
    });

    // Helper function for legacy clipboard copying
    function copyWithExecCommand(text) {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showCopySuccess();
    }

    // Helper function to show copy success message
    function showCopySuccess() {
        const successMessage = document.createElement('div');
        successMessage.classList.add('copy-success');
        successMessage.textContent = 'Link copied to clipboard!';
        document.body.appendChild(successMessage);

        setTimeout(() => {
            successMessage.classList.add('show');
        }, 10);

        setTimeout(() => {
            successMessage.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(successMessage);
            }, 300);
        }, 2000);
    }

    // Social share functionality
    const shareButtons = document.querySelectorAll('.share-btn:not(.share-copy)');

    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const platform = this.getAttribute('data-platform');
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            let shareUrl;

            switch(platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                default:
                    return;
            }

            window.open(shareUrl, '_blank', 'width=600,height=400');
        });
    });

    // Category links in article sidebar
    const sidebarCategories = document.querySelectorAll('.sidebar-category');

    if (sidebarCategories.length > 0) {
        sidebarCategories.forEach(link => {
            link.addEventListener('click', function(e) {
                // Don't prevent default - we want to navigate to the category page
                sidebarCategories.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
});