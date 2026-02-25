// Initialize Mermaid for all diagrams
function initializeMermaid() {
    if (typeof mermaid === 'undefined') {
        return false;
    }
    
    try {
        // Basic configuration that works with most Mermaid versions
        const config = { 
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
            flowchart: {
                htmlLabels: false,
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
        return true;
    } catch (error) {
        return false;
    }
}

// Function to manually render all mermaid diagrams
function renderAllMermaidDiagrams() {
    if (typeof mermaid === 'undefined') {
        return;
    }
    
    const diagrams = document.querySelectorAll('pre.mermaid');
    
    if (diagrams.length === 0) {
        return;
    }
    
    diagrams.forEach((diagram, index) => {
        
        // Check if Mermaid has already processed this diagram
        if (diagram.getAttribute('data-processed')) {
            return;
        }
        
        // Different Mermaid versions have different APIs
        if (typeof mermaid.run === 'function') {
            // Version 10+ API
            try {
                mermaid.run({ 
                    nodes: [diagram],
                    suppressErrors: true 
                });
            } catch (error) {
                console.error('Mermaid rendering error:', error.message);
                // Show error in diagram container as fallback
                diagram.innerHTML = `<div class="mermaid-error">图表渲染失败: ${error.message.substring(0, 100)}...</div>`;
            }
        } else if (typeof mermaid.render === 'function') {
            // Older API
            try {
                const content = diagram.textContent.trim();
                const id = 'mermaid-diagram-' + Date.now() + '-' + index;
                const { svg } = mermaid.render(id, content);
                diagram.innerHTML = svg;
            } catch (error) {
                console.error('Mermaid rendering error:', error.message);
                // Show error in diagram container as fallback
                diagram.innerHTML = `<div class="mermaid-error">图表渲染失败: ${error.message.substring(0, 100)}...</div>`;
            }
        } else {
            // If no known API is available, show error
            diagram.innerHTML = '<div class="mermaid-error">Mermaid API 不可用</div>';
        }
    });
}

// Global function for debugging Mermaid - kept for development purposes
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
                    renderAllMermaidDiagrams();
                }
            }, 500);
        }, 100);
    }
    
    // Handle navigation for both internal anchors and external links
    document.querySelectorAll('.sidebar-nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = this.getAttribute('data-target');
            
            // Check if it's an internal anchor link (starts with #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                // Update active state for current page
                document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
            // For links with data-target (submenu toggles), handle as toggle
            else if (target) {
                // This is a submenu toggle, let the other event handler handle it
            }
            // For other links (external HTML pages), allow default navigation
            else {
                // Let the default behavior occur (page navigation)
            }
        });
    });
    
    // Update active nav link on scroll for index page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
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
    }
    
    // Sidebar submenu toggle - handle submenu toggling separately
    document.querySelectorAll('.nav-item.has-submenu > .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            // Check if this link has a data-target attribute for submenu
            const target = this.getAttribute('data-target');
            if (target) {
                // This is a submenu toggle, prevent default and toggle the submenu
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('open');
            }
            // If no data-target, let the link behave normally (for page navigation)
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
    
    // Auto-highlight current page on load
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    
    // Remove all active classes first
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.querySelectorAll('.sidebar-submenu a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class based on current page
    if (currentPage === 'index.html' || currentPage === '') {
        // For index page, highlight architecture
        const architectureLink = document.querySelector('.nav-link[href="#architecture"]');
        if (architectureLink) {
            architectureLink.classList.add('active');
        }
    } else {
        // For other pages, find the matching link
        document.querySelectorAll('.sidebar-submenu a').forEach(link => {
            if (link.textContent.trim() === 'Pod' && currentPage.includes('pod.html')) {
                link.classList.add('active');
                
                // Also highlight parent menu
                const parentItem = link.closest('.nav-item.has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            } else if (link.textContent.trim() === 'Deployment' && currentPage.includes('deployment.html')) {
                link.classList.add('active');
                
                const parentItem = link.closest('.nav-item.has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            } else if (link.textContent.trim() === 'Service' && currentPage.includes('service.html')) {
                link.classList.add('active');
                
                const parentItem = link.closest('.nav-item.has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            } else if (link.textContent.trim() === 'Node' && currentPage.includes('node.html')) {
                link.classList.add('active');
                
                const parentItem = link.closest('.nav-item.has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            } else if (link.textContent.trim() === 'ConfigMap' && currentPage.includes('configmap.html')) {
                link.classList.add('active');
                
                const parentItem = link.closest('.nav-item.has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            } else if (link.textContent.trim() === 'Secret' && currentPage.includes('secret.html')) {
                link.classList.add('active');
                
                const parentItem = link.closest('.nav-item.has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            } else if (link.textContent.trim() === 'Helm' && currentPage.includes('helm.html')) {
                link.classList.add('active');
                
                const parentItem = link.closest('.nav-item.has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            } else if (link.textContent.trim() === '网络原理' && currentPage.includes('networking.html')) {
                link.classList.add('active');
                
                const parentItem = link.closest('.nav-item.has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            } else if (link.textContent.trim() === '存储' && currentPage.includes('storage.html')) {
                link.classList.add('active');
                
                const parentItem = link.closest('.nav-item.has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            } else if (link.textContent.trim() === '命名空间' && currentPage.includes('namespace.html')) {
                link.classList.add('active');
                
                const parentItem = link.closest('.nav-item.has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            } else if (link.textContent.trim() === '标签与选择器' && currentPage.includes('labels.html')) {
                link.classList.add('active');
                
                const parentItem = link.closest('.nav-item.has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            } else if (link.textContent.trim() === '证书管理' && currentPage.includes('certificates.html')) {
                link.classList.add('active');
                
                const parentItem = link.closest('.nav-item.has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            } else if (link.textContent.trim() === '节点扩缩容' && currentPage.includes('scaling.html')) {
                link.classList.add('active');
                
                const parentItem = link.closest('.nav-item.has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            } else if (link.textContent.trim() === '集群版本升级' && currentPage.includes('upgrades.html')) {
                link.classList.add('active');
                
                const parentItem = link.closest('.nav-item.has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            } else if (link.textContent.trim() === 'Helm Chart 编写' && currentPage.includes('helm-charts.html')) {
                link.classList.add('active');
                
                const parentItem = link.closest('.nav-item.has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            } else if (link.textContent.trim() === 'CoreDNS' && currentPage.includes('coredns.html')) {
                link.classList.add('active');
                
                const parentItem = link.closest('.nav-item.has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            } else if (link.textContent.trim() === '数据库/中间件部署' && currentPage.includes('stateful-apps.html')) {
                link.classList.add('active');
                
                const parentItem = link.closest('.nav-item.has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            } else if (link.textContent.trim() === 'Ingress 高级配置' && currentPage.includes('ingress.html')) {
                link.classList.add('active');
                
                const parentItem = link.closest('.nav-item.has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            } else if (link.textContent.trim() === 'CI 集成' && currentPage.includes('ci-integration.html')) {
                link.classList.add('active');
                
                const parentItem = link.closest('.nav-item.has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            } else if (link.textContent.trim() === 'GitOps 与 Argo CD' && currentPage.includes('gitops-argocd.html')) {
                link.classList.add('active');
                
                const parentItem = link.closest('.nav-item.has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            }
        });
    }
    
    // Default expand the "核心概念" (Core Concepts) menu
    const conceptsMenu = document.querySelector('.nav-item.has-submenu a[data-target="concepts"]');
    if (conceptsMenu) {
        const parentItem = conceptsMenu.closest('.nav-item.has-submenu');
        if (parentItem) {
            parentItem.classList.add('open');
        }
    }
    
    // Default expand the "高级概念" (Advanced Concepts) menu
    const advancedConceptsMenu = document.querySelector('.nav-item.has-submenu a[data-target="advanced-concepts"]');
    if (advancedConceptsMenu) {
        const parentItem = advancedConceptsMenu.closest('.nav-item.has-submenu');
        if (parentItem) {
            parentItem.classList.add('open');
        }
    }
    
    // Additional logic to ensure submenu items remain open when navigating between pages
    document.querySelectorAll('.sidebar-submenu a').forEach(link => {
        if (link.classList.contains('active')) {
            const parentItem = link.closest('.nav-item.has-submenu');
            if (parentItem) {
                parentItem.classList.add('open');
            }
        }
    });
});