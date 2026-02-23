// Initialize Mermaid for all diagrams
function initializeMermaid() {
    console.log('Initializing Mermaid...');
    
    if (typeof mermaid === 'undefined') {
        console.error('Mermaid library not loaded!');
        return false;
    }
    
    try {
        // Basic configuration that works with most Mermaid versions
        const config = { 
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
            flowchart: {
                htmlLabels: true,
                curve: 'basis'
            },
            sequence: {
                diagramMarginX: 50,
                diagramMarginY: 10,
                actorMargin: 50,
                width: 150,
                height: 65,
                boxMargin: 10,
                boxTextMargin: 5,
                noteMargin: 10,
                messageMargin: 35,
                mirrorActors: true,
                bottomMarginAdj: 1,
                useMaxWidth: true
            }
        };
        
        mermaid.initialize(config);
        console.log('Mermaid initialized successfully');
        return true;
    } catch (error) {
        console.error('Failed to initialize Mermaid:', error);
        return false;
    }
}

// Function to manually render all mermaid diagrams
function renderAllMermaidDiagrams() {
    console.log('Looking for Mermaid diagrams to render...');
    
    if (typeof mermaid === 'undefined') {
        console.error('Cannot render: Mermaid library not loaded');
        return;
    }
    
    const diagrams = document.querySelectorAll('pre.mermaid');
    console.log(`Found ${diagrams.length} Mermaid diagram(s)`);
    
    if (diagrams.length === 0) {
        console.warn('No Mermaid diagrams found on page');
        return;
    }
    
    diagrams.forEach((diagram, index) => {
        console.log(`Processing diagram ${index + 1}`);
        
        // Check if Mermaid has already processed this diagram
        if (diagram.getAttribute('data-processed')) {
            console.log(`Diagram ${index + 1} already processed by Mermaid`);
            return;
        }
        
        // Different Mermaid versions have different APIs
        if (typeof mermaid.run === 'function') {
            // Version 10+ API
            console.log(`Using mermaid.run() for diagram ${index + 1}`);
            try {
                mermaid.run({ nodes: [diagram] });
                console.log(`Diagram ${index + 1} rendered successfully`);
            } catch (error) {
                console.error(`Failed to render diagram ${index + 1}:`, error);
            }
        } else if (typeof mermaid.render === 'function') {
            // Older API
            console.log(`Using mermaid.render() for diagram ${index + 1}`);
            try {
                const content = diagram.textContent.trim();
                const id = 'mermaid-diagram-' + Date.now() + '-' + index;
                const { svg } = mermaid.render(id, content);
                diagram.innerHTML = svg;
                console.log(`Diagram ${index + 1} rendered successfully`);
            } catch (error) {
                console.error(`Failed to render diagram ${index + 1}:`, error);
            }
        } else {
            console.error(`No known Mermaid rendering API found for diagram ${index + 1}`);
        }
    });
}

// Global function for debugging Mermaid
window.debugMermaid = function() {
    console.log('=== Mermaid Debug Information ===');
    console.log('Mermaid library loaded:', typeof mermaid !== 'undefined');
    if (typeof mermaid !== 'undefined') {
        console.log('Mermaid version:', mermaid.version || 'unknown');
        console.log('Mermaid API available:');
        console.log('  - mermaid.run:', typeof mermaid.run);
        console.log('  - mermaid.render:', typeof mermaid.render);
        console.log('  - mermaid.init:', typeof mermaid.init);
    }
    
    const diagrams = document.querySelectorAll('pre.mermaid');
    console.log(`Total Mermaid diagrams on page: ${diagrams.length}`);
    
    diagrams.forEach((diagram, index) => {
        console.log(`Diagram ${index + 1}:`);
        console.log('  - Has SVG:', !!diagram.querySelector('svg'));
        console.log('  - data-processed:', diagram.getAttribute('data-processed'));
        console.log('  - Content preview:', diagram.textContent.trim().substring(0, 100) + '...');
    });
    
    console.log('=== End Mermaid Debug ===');
};

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing page...');
    
    // Initialize Mermaid
    const mermaidInitialized = initializeMermaid();
    
    // Render diagrams after a short delay to ensure everything is ready
    if (mermaidInitialized) {
        setTimeout(function() {
            renderAllMermaidDiagrams();
            
            // If any diagrams still don't have SVG, try again after a bit
            setTimeout(function() {
                const diagrams = document.querySelectorAll('pre.mermaid');
                const withoutSvg = Array.from(diagrams).filter(diag => !diag.querySelector('svg'));
                
                if (withoutSvg.length > 0) {
                    console.log(`Retrying rendering for ${withoutSvg.length} diagram(s)`);
                    renderAllMermaidDiagrams();
                }
            }, 500);
        }, 100);
    }
    
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    // Sidebar submenu toggle
    document.querySelectorAll('.nav-item.has-submenu > .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#concepts' || this.getAttribute('href') === '#advanced-concepts') {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('open');
            }
        });
    });
    
    // Auto-expand submenu when clicking on concepts section
    document.querySelectorAll('.sidebar-submenu a').forEach(link => {
        link.addEventListener('click', function() {
            const parent = this.closest('.nav-item.has-submenu');
            if (parent) {
                parent.classList.add('open');
            }
        });
    });
});