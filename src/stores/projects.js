import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { initialProjects } from '../mockData.js'

export const useProjectsStore = defineStore('projects', () => {
  // State
  const projects = ref([...initialProjects])
  const currentProjectId = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const isInitialized = ref(true)

  // Getters
  const currentProject = computed(() => {
    return projects.value.find(p => p.id === currentProjectId.value)
  })

  const favoriteProjects = computed(() => {
    return projects.value.filter(p => p.isFavorite)
  })

  const archivedProjects = computed(() => {
    return projects.value.filter(p => p.isArchived)
  })

  // Actions
  const setCurrentProjectId = (id) => {
    currentProjectId.value = id
  }

  /**
   * Load projects from local storage
   */
  const loadProjects = () => {
    // Just use the initial projects
    projects.value = [...initialProjects]
    isInitialized.value = true
  }

  /**
   * Reset projects store
   */
  const resetProjects = () => {
    projects.value = [...initialProjects]
    currentProjectId.value = null
    isInitialized.value = true
    error.value = null
  }

  const addProject = (project) => {
    projects.value.unshift(project)
  }

  /**
   * Add project locally
   */
  const addProjectAsync = async (projectData) => {
    const localProject = {
      id: `project-${Date.now()}`,
      ...projectData,
      createdAt: new Date().toISOString(),
      isFavorite: false,
      isArchived: false
    }
    addProject(localProject)
    return { success: true, project: localProject }
  }

  const updateProject = (updatedProject) => {
    const index = projects.value.findIndex(p => p.id === updatedProject.id)
    if (index !== -1) {
      projects.value[index] = updatedProject
    }
  }

  const deleteProject = (projectId) => {
    const project = projects.value.find(p => p.id === projectId)

    if (!project) return

    if (!window.confirm(`Tem certeza que deseja excluir "${project.name || 'este projeto'}"?`)) {
      return
    }

    projects.value = projects.value.filter(p => p.id !== projectId)
    if (currentProjectId.value === projectId) {
      currentProjectId.value = null
    }
  }

  const renameProject = (projectId, newName) => {
    if (!newName?.trim()) return

    const project = projects.value.find(p => p.id === projectId)
    if (project) {
      project.name = newName.trim()
    }
  }

  const duplicateProject = (projectId) => {
    const project = projects.value.find(p => p.id === projectId)
    if (!project) return null
    const duplicated = {
      ...project,
      id: `project-${Date.now()}`,
      name: `${project.name} (Cópia)`,
      createdAt: new Date().toISOString(),
      isFavorite: false,
      isArchived: false
    }
    addProject(duplicated)
    return duplicated
  }

  const toggleFavorite = (projectId) => {
    const project = projects.value.find(p => p.id === projectId)
    if (project) {
      project.isFavorite = !project.isFavorite
    }
  }

  const toggleArchive = (projectId) => {
    const project = projects.value.find(p => p.id === projectId)
    if (project) {
      project.isArchived = !project.isArchived
    }
  }

  const moveProject = (projectId, folderId) => {
    const project = projects.value.find(p => p.id === projectId)
    if (project) {
      project.folderId = folderId
    }
  }

  const createNewProject = async (projectName = 'Novo Projeto') => {
    const projectData = {
      name: projectName.trim(),
      baseImage: null,
      history: [],
      folderId: null,
      isFavorite: false,
      isArchived: false
    }

    const result = await addProjectAsync(projectData)
    return result.project
  }

  const createNewProjectFromVersion = (sourceProject, image) => {
    const newProject = {
      ...sourceProject,
      id: `project-${Date.now()}`,
      name: `${sourceProject.name} v${sourceProject.history.length + 2}`,
      baseImage: image || sourceProject.baseImage,
      history: image ? [...sourceProject.history, image] : sourceProject.history,
      createdAt: new Date().toISOString(),
      isFavorite: false,
      isArchived: false
    }
    addProject(newProject)
    return newProject
  }

  return {
    // State
    projects,
    currentProjectId,
    isLoading,
    error,
    isInitialized,

    // Getters
    currentProject,
    favoriteProjects,
    archivedProjects,

    // Actions
    setCurrentProjectId,
    addProject,
    addProjectAsync,
    updateProject,
    deleteProject,
    renameProject,
    duplicateProject,
    toggleFavorite,
    toggleArchive,
    moveProject,
    createNewProject,
    createNewProjectFromVersion,
    loadProjects,
    resetProjects
  }
})