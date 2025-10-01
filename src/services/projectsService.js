import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase.js'

/**
 * Firestore service for managing user projects
 *
 * Provides CRUD operations for:
 * - Creating projects
 * - Reading user projects
 * - Updating projects
 * - Deleting projects
 * - Real-time project syncing
 */

const PROJECTS_COLLECTION = 'projects'

/**
 * Create a new project for a user
 */
export const createProject = async (userId, projectData) => {
  try {
    const project = {
      ...projectData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), project)

    return {
      success: true,
      id: docRef.id,
      project: { ...project, id: docRef.id },
      message: 'Projeto criado com sucesso!'
    }
  } catch (error) {
    console.error('Erro ao criar projeto:', error)
    return {
      success: false,
      message: 'Erro ao criar projeto: ' + error.message
    }
  }
}

/**
 * Get all projects for a user
 */
export const getUserProjects = async (userId) => {
  try {
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    )

    const querySnapshot = await getDocs(q)
    const projects = []

    querySnapshot.forEach((doc) => {
      projects.push({
        id: doc.id,
        ...doc.data()
      })
    })

    return {
      success: true,
      projects,
      message: 'Projetos carregados com sucesso!'
    }
  } catch (error) {
    console.error('Erro ao carregar projetos:', error)
    return {
      success: false,
      projects: [],
      message: 'Erro ao carregar projetos: ' + error.message
    }
  }
}

/**
 * Get a specific project by ID
 */
export const getProject = async (projectId) => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        success: true,
        project: {
          id: docSnap.id,
          ...docSnap.data()
        },
        message: 'Projeto carregado com sucesso!'
      }
    } else {
      return {
        success: false,
        project: null,
        message: 'Projeto não encontrado'
      }
    }
  } catch (error) {
    console.error('Erro ao carregar projeto:', error)
    return {
      success: false,
      project: null,
      message: 'Erro ao carregar projeto: ' + error.message
    }
  }
}

/**
 * Update an existing project
 */
export const updateProject = async (projectId, updates) => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId)

    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    }

    await updateDoc(docRef, updateData)

    return {
      success: true,
      message: 'Projeto atualizado com sucesso!'
    }
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error)
    return {
      success: false,
      message: 'Erro ao atualizar projeto: ' + error.message
    }
  }
}

/**
 * Delete a project
 */
export const deleteProject = async (projectId) => {
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId))

    return {
      success: true,
      message: 'Projeto excluído com sucesso!'
    }
  } catch (error) {
    console.error('Erro ao excluir projeto:', error)
    return {
      success: false,
      message: 'Erro ao excluir projeto: ' + error.message
    }
  }
}

/**
 * Duplicate a project
 */
export const duplicateProject = async (userId, originalProject) => {
  try {
    const duplicatedProject = {
      name: `${originalProject.name} (Cópia)`,
      baseImage: originalProject.baseImage,
      history: [...(originalProject.history || [])],
      fixedDimensions: originalProject.fixedDimensions ? { ...originalProject.fixedDimensions } : null
    }

    return await createProject(userId, duplicatedProject)
  } catch (error) {
    console.error('Erro ao duplicar projeto:', error)
    return {
      success: false,
      message: 'Erro ao duplicar projeto: ' + error.message
    }
  }
}

/**
 * Create a new project from a specific version
 */
export const createProjectFromVersion = async (userId, originalProject, imageUrl) => {
  try {
    const newProject = {
      name: `${originalProject.name} (Nova versão)`,
      baseImage: imageUrl,
      history: [],
      fixedDimensions: originalProject.fixedDimensions ? { ...originalProject.fixedDimensions } : null
    }

    return await createProject(userId, newProject)
  } catch (error) {
    console.error('Erro ao criar projeto da versão:', error)
    return {
      success: false,
      message: 'Erro ao criar projeto da versão: ' + error.message
    }
  }
}