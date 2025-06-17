/**
 * Content-to-Experience Converter
 * Main Application JavaScript
 */

// Global namespaces to organize code
const App = {};
App.Core = {};
App.Modules = {};
App.Utils = {};

/**
 * Core Application Functionality
 */
App.Core = (function() {
    // Private variables
    let _config = {
        storage: {
            projectsKey: 'c2e_projects',
            settingsKey: 'c2e_settings',
            recentKey: 'c2e_recent'
        },
        maxProjectNameLength: 50,
        autosaveInterval: 60000, // 1 minute
        version: '1.0.0'
    };
    
    let _state = {
        currentProject: null,
        isDirty: false,
        lastSaved: null
    };
    
    let _autosaveTimer = null;
    
    // Private methods
    const _initAutosave = function() {
        _autosaveTimer = setInterval(() => {
            if (_state.isDirty && _state.currentProject) {
                _saveCurrentProject();
                console.log('Project autosaved');
            }
        }, _config.autosaveInterval);
    };
    
    const _saveCurrentProject = function() {
        if (!_state.currentProject) return false;
        
        // Get current project data from UI
        const projectData = App.Modules.Editor.getProjectData();
        
        // Update project metadata
        _state.currentProject.lastModified = new Date().toISOString();
        _state.currentProject.data = projectData;
        
        // Save to localStorage
        _saveProjectToStorage(_state.currentProject);
        
        // Update state
        _state.isDirty = false;
        _state.lastSaved = new Date();
        
        // Trigger event
        document.dispatchEvent(new CustomEvent('project:saved', { 
            detail: { project: _state.currentProject } 
        }));
        
        return true;
    };
    
    const _saveProjectToStorage = function(project) {
        // Get existing projects
        const projects = _getProjectsFromStorage();
        
        // Find and update or add new
        const existingIndex = projects.findIndex(p => p.id === project.id);
        
        if (existingIndex >= 0) {
            projects[existingIndex] = project;
        } else {
            projects.push(project);
        }
        
        // Save back to localStorage
        localStorage.setItem(_config.storage.projectsKey, JSON.stringify(projects));
        
        // Update recent projects list
        _updateRecentProjects(project.id);
        
        return true;
    };
    
    const _getProjectsFromStorage = function() {
        const projectsJSON = localStorage.getItem(_config.storage.projectsKey);
        return projectsJSON ? JSON.parse(projectsJSON) : [];
    };
    
    const _getProjectById = function(id) {
        const projects = _getProjectsFromStorage();
        return projects.find(p => p.id === id) || null;
    };
    
    const _updateRecentProjects = function(projectId) {
        let recents = JSON.parse(localStorage.getItem(_config.storage.recentKey) || '[]');
        
        // Remove if exists and add to front
        recents = recents.filter(id => id !== projectId);
        recents.unshift(projectId);
        
        // Keep only most recent 5
        recents = recents.slice(0, 5);
        
        localStorage.setItem(_config.storage.recentKey, JSON.stringify(recents));
    };
    
    const _createNewProject = function(name) {
        // Validate name
        const projectName = (name || 'Untitled Project').trim().substring(0, _config.maxProjectNameLength);
        
        // Create project object
        const newProject = {
            id: 'proj_' + Date.now(),
            name: projectName,
            created: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            data: {
                content: [],
                settings: {
                    platforms: ['website', 'instagram', 'email', 'linkedin'],
                    defaultPlatform: 'website'
                }
            }
        };
        
        // Save to storage
        _saveProjectToStorage(newProject);
        
        // Set as current project
        _state.currentProject = newProject;
        _state.isDirty = false;
        _state.lastSaved = new Date();
        
        // Trigger event
        document.dispatchEvent(new CustomEvent('project:created', { 
            detail: { project: newProject } 
        }));
        
        return newProject;
    };
    
    const _loadProject = function(id) {
        // Get project from storage
        const project = _getProjectById(id);
        
        if (!project) {
            console.error('Project not found:', id);
            return false;
        }
        
        // Set as current project
        _state.currentProject = project;
        _state.isDirty = false;
        _state.lastSaved = new Date();
        
        // Update UI
        App.Modules.Editor.loadProjectData(project.data);
        
        // Update recent projects
        _updateRecentProjects(id);
        
        // Trigger event
        document.dispatchEvent(new CustomEvent('project:loaded', { 
            detail: { project: project } 
        }));
        
        return true;
    };
    
    // Public API
    return {
        init: function() {
            console.log('Initializing Content-to-Experience Converter v' + _config.version);
            
            // Initialize modules
            App.Modules.Editor.init();
            App.Modules.Preview.init();
            App.Modules.Analytics.init();
            App.Modules.Export.init();
            
            // Set up autosave
            _initAutosave();
            
            // Set up event listeners
            document.addEventListener('content:changed', () => {
                _state.isDirty = true;
            });
            
            // Check for last open project
            const recentProjects = JSON.parse(localStorage.getItem(_config.storage.recentKey) || '[]');
            if (recentProjects.length > 0) {
                const lastProjectId = recentProjects[0];
                _loadProject(lastProjectId);
            }
            
            return this;
        },
        
        createProject: function(name) {
            return _createNewProject(name);
        },
        
        loadProject: function(id) {
            return _loadProject(id);
        },
        
        saveCurrentProject: function() {
            return _saveCurrentProject();
        },
        
        getProjects: function() {
            return _getProjectsFromStorage();
        },
        
        getRecentProjects: function() {
            const recentIds = JSON.parse(localStorage.getItem(_config.storage.recentKey) || '[]');
            const projects = _getProjectsFromStorage();
            
            return recentIds
                .map(id => projects.find(p => p.id === id))
                .filter(p => p !== undefined); // Filter out any that weren't found
        },
        
        deleteProject: function(id) {
            const projects = _getProjectsFromStorage();
            const updatedProjects = projects.filter(p => p.id !== id);
            
            localStorage.setItem(_config.storage.projectsKey, JSON.stringify(updatedProjects));
            
            // Update recent projects
            const recents = JSON.parse(localStorage.getItem(_config.storage.recentKey) || '[]');
            const updatedRecents = recents.filter(recId => recId !== id);
            localStorage.setItem(_config.storage.recentKey, JSON.stringify(updatedRecents));
            
            // If current project was deleted, clear it
            if (_state.currentProject && _state.currentProject.id === id) {
                _state.currentProject = null;
                _state.isDirty = false;
            }
            
            // Trigger event
            document.dispatchEvent(new CustomEvent('project:deleted', { 
                detail: { projectId: id } 
            }));
            
            return true;
        },
        
        // Getters
        getCurrentProject: function() {
            return _state.currentProject;
        },
        
        isDirty: function() {
            return _state.isDirty;
        }
    };
})();

/**
 * Editor Module
 * Handles the content editing interface
 */
App.Modules.Editor = (function() {
    // Private variables
    let _elements = [];
    let _selectedElement = null;
    
    // Private methods
    const _bindEvents = function() {
        // Element selection
        document.querySelectorAll('.element-library-item').forEach(item => {
            item.addEventListener('click', function() {
                const elementType = this.getAttribute('data-element-type') || 'generic';
                _addElement(elementType);
            });
        });
    };
    
    const _addElement = function(type) {
        // Create new element object
        const newElement = {
            id: 'el_' + Date.now(),
            type: type,
            content: {
                title: 'New ' + type.charAt(0).toUpperCase() + type.slice(1),
                settings: {}
            },
            position: _elements.length // Add to end by default
        };
        
        // Add to elements array
        _elements.push(newElement);
        
        // Select the new element
        _selectElement(newElement.id);
        
        // Update UI
        _renderElements();
        
        // Trigger change event
        document.dispatchEvent(new CustomEvent('content:changed'));
        
        return newElement;
    };
    
    const _selectElement = function(elementId) {
        _selectedElement = _elements.find(el => el.id === elementId) || null;
        
        // Update UI to reflect selection
        document.querySelectorAll('.interactive-element').forEach(el => {
            el.classList.remove('selected');
        });
        
        if (_selectedElement) {
            const elementEl = document.getElementById(_selectedElement.id);
            if (elementEl) {
                elementEl.classList.add('selected');
            }
        }
        
        // Show appropriate properties panel
        _updatePropertiesPanel();
    };
    
    const _updatePropertiesPanel = function() {
        // This would update a properties panel for the selected element
        // Implementation would depend on UI structure
        console.log('Selected element:', _selectedElement);
    };
    
    const _renderElements = function() {
        // This would render all elements to the canvas
        // Implementation would depend on UI structure
        console.log('Rendering elements:', _elements);
    };
    
    // Public API
    return {
        init: function() {
            console.log('Initializing Editor module');
            _bindEvents();
            return this;
        },
        
        getProjectData: function() {
            // Return current project data for saving
            return {
                content: _elements,
                settings: {
                    // Editor settings would go here
                }
            };
        },
        
        loadProjectData: function(projectData) {
            if (!projectData || !projectData.content) return false;
            
            // Load elements
            _elements = projectData.content;
            _selectedElement = null;
            
            // Update UI
            _renderElements();
            
            return true;
        },
        
        // Element management
        addElement: _addElement,
        selectElement: _selectElement,
        
        removeElement: function(elementId) {
            const index = _elements.findIndex(el => el.id === elementId);
            
            if (index >= 0) {
                _elements.splice(index, 1);
                
                // If the removed element was selected, deselect
                if (_selectedElement && _selectedElement.id === elementId) {
                    _selectedElement = null;
                    _updatePropertiesPanel();
                }
                
                // Update UI
                _renderElements();
                
                // Trigger change event
                document.dispatchEvent(new CustomEvent('content:changed'));
                
                return true;
            }
            
            return false;
        }
    };
})();

/**
 * Preview Module
 * Handles multi-platform content previews
 */
App.Modules.Preview = (function() {
    // Private variables
    let _platforms = ['website', 'instagram', 'email', 'linkedin'];
    let _currentPlatform = 'website';
    let _previewMode = 'desktop'; // desktop, tablet, mobile
    
    // Private methods
    const _bindEvents = function() {
        // Platform switcher
        document.querySelectorAll('[data-platform]').forEach(btn => {
            btn.addEventListener('click', function() {
                const platform = this.getAttribute('data-platform');
                _setCurrentPlatform(platform);
            });
        });
        
        // Preview mode switcher
        document.querySelectorAll('[data-preview-mode]').forEach(btn => {
            btn.addEventListener('click', function() {
                const mode = this.getAttribute('data-preview-mode');
                _setPreviewMode(mode);
            });
        });
    };
    
    const _setCurrentPlatform = function(platform) {
        if (_platforms.includes(platform)) {
            _currentPlatform = platform;
            _updatePreview();
        }
    };
    
    const _setPreviewMode = function(mode) {
        if (['desktop', 'tablet', 'mobile'].includes(mode)) {
            _previewMode = mode;
            _updatePreview();
        }
    };
    
    const _updatePreview = function() {
        // This would update the preview based on current platform and mode
        console.log('Updating preview for platform:', _currentPlatform, 'mode:', _previewMode);
    };
    
    // Public API
    return {
        init: function() {
            console.log('Initializing Preview module');
            _bindEvents();
            return this;
        },
        
        refreshPreview: function() {
            _updatePreview();
        },
        
        checkConsistency: function() {
            // This would check content consistency across platforms
            // For now, just return a mock result
            return {
                website: { compatible: true, issues: [] },
                instagram: { compatible: true, issues: ['Image dimensions not optimal'] },
                email: { compatible: false, issues: ['Interactive elements not supported'] },
                linkedin: { compatible: true, issues: [] }
            };
        }
    };
})();

/**
 * Analytics Module
 * Handles engagement metrics and visualization
 */
App.Modules.Analytics = (function() {
    // Mock data for demonstration
    const _mockData = {
        engagementRate: 62,
        timeSpent: '2:34',
        conversionRate: 8.3,
        improvement: {
            engagementRate: 12,
            timeSpent: 72, // seconds
            conversionRate: 3.1
        }
    };
    
    // Would initialize charts and visualizations
    const _initCharts = function() {
        // This would initialize Chart.js visualizations
        console.log('Initializing analytics charts');
    };
    
    // Public API
    return {
        init: function() {
            console.log('Initializing Analytics module');
            _initCharts();
            return this;
        },
        
        getData: function() {
            // In a real app, this would calculate or fetch real analytics
            return _mockData;
        },
        
        generateHeatMap: function() {
            // This would generate an attention heat map
            console.log('Generating heat map');
        },
        
        optimizeEngagement: function() {
            // This would analyze content and suggest optimizations
            return {
                suggestions: [
                    { element: 'quiz', suggestion: 'Add images to quiz options to increase engagement' },
                    { element: 'header', suggestion: 'Use more action-oriented language in headline' },
                    { element: 'general', suggestion: 'Add a poll to increase user participation' }
                ],
                score: 76 // Engagement potential score out of 100
            };
        }
    };
})();

/**
 * Export Module
 * Handles content export for different platforms
 */
App.Modules.Export = (function() {
    // Would handle export to different formats
    const _generateExport = function(format) {
        console.log('Exporting content as', format);
        
        // In a real app, this would create appropriate export data
        return {
            success: true,
            format: format,
            data: {},
            message: 'Export successful'
        };
    };
    
    // Public API
    return {
        init: function() {
            console.log('Initializing Export module');
            return this;
        },
        
        generateEmbed: function() {
            return _generateExport('embed');
        },
        
        generatePDF: function() {
            return _generateExport('pdf');
        },
        
        generateSocialMedia: function(platform) {
            return _generateExport(platform || 'all');
        }
    };
})();

/**
 * Utility Functions
 */
App.Utils = {
    // Generate a unique ID
    generateId: function(prefix = '') {
        return prefix + Math.random().toString(36).substr(2, 9);
    },
    
    // Format date for display
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    },
    
    // Debounce function for performance
    debounce: function(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    App.Core.init();
});