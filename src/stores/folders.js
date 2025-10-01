import { defineStore } from 'pinia'
import { ref } from 'vue'
import { initialFolders } from '../mockData.js'

export const useFoldersStore = defineStore('folders', () => {
  // State
  const folders = ref([...initialFolders])

  // Actions
  const addFolder = (folderName) => {
    const newFolder = {
      id: `folder-${Date.now()}`,
      name: folderName
    }
    folders.value.push(newFolder)
  }

  const deleteFolder = async (folderId) => {
    // TODO: Integrar com modal de confirmação quando migrado
    const folder = folders.value.find(f => f.id === folderId)
    if (window.confirm(`Tem certeza que deseja excluir a pasta "${folder?.name || 'esta pasta'}"?`)) {
      folders.value = folders.value.filter(f => f.id !== folderId)
    }
  }

  const renameFolder = async (folderId, newName) => {
    if (!newName?.trim()) return

    const folder = folders.value.find(f => f.id === folderId)
    if (folder) {
      folder.name = newName.trim()
    }
  }

  return {
    // State
    folders,

    // Actions
    addFolder,
    deleteFolder,
    renameFolder
  }
})