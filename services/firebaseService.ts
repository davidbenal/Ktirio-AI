import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';
import type { Project, Folder } from '../types';

// ==================== PROJECTS ====================

/**
 * Cria um novo projeto no Firestore
 */
export const createProject = async (
  userId: string,
  projectData: Omit<Project, 'id' | 'createdAt'>
): Promise<string> => {
  try {
    const projectsRef = collection(db, 'users', userId, 'projects');
    const docRef = await addDoc(projectsRef, {
      ...projectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    throw error;
  }
};

/**
 * Busca todos os projetos do usuário
 */
export const getUserProjects = async (userId: string): Promise<Project[]> => {
  try {
    const projectsRef = collection(db, 'users', userId, 'projects');
    const q = query(projectsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
    })) as Project[];
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    throw error;
  }
};

/**
 * Busca um projeto específico
 */
export const getProject = async (
  userId: string,
  projectId: string
): Promise<Project | null> => {
  try {
    const projectRef = doc(db, 'users', userId, 'projects', projectId);
    const projectDoc = await getDoc(projectRef);
    
    if (!projectDoc.exists()) {
      return null;
    }
    
    return {
      id: projectDoc.id,
      ...projectDoc.data(),
      createdAt: projectDoc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
    } as Project;
  } catch (error) {
    console.error('Erro ao buscar projeto:', error);
    throw error;
  }
};

/**
 * Atualiza um projeto
 */
export const updateProject = async (
  userId: string,
  projectId: string,
  updates: Partial<Project>
): Promise<void> => {
  try {
    const projectRef = doc(db, 'users', userId, 'projects', projectId);
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    throw error;
  }
};

/**
 * Deleta um projeto
 */
export const deleteProject = async (
  userId: string,
  projectId: string
): Promise<void> => {
  try {
    const projectRef = doc(db, 'users', userId, 'projects', projectId);
    await deleteDoc(projectRef);
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    throw error;
  }
};

// ==================== FOLDERS ====================

/**
 * Cria uma nova pasta
 */
export const createFolder = async (
  userId: string,
  folderName: string
): Promise<string> => {
  try {
    const foldersRef = collection(db, 'users', userId, 'folders');
    const docRef = await addDoc(foldersRef, {
      name: folderName,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar pasta:', error);
    throw error;
  }
};

/**
 * Busca todas as pastas do usuário
 */
export const getUserFolders = async (userId: string): Promise<Folder[]> => {
  try {
    const foldersRef = collection(db, 'users', userId, 'folders');
    const querySnapshot = await getDocs(foldersRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
    })) as Folder[];
  } catch (error) {
    console.error('Erro ao buscar pastas:', error);
    throw error;
  }
};

/**
 * Atualiza uma pasta
 */
export const updateFolder = async (
  userId: string,
  folderId: string,
  newName: string
): Promise<void> => {
  try {
    const folderRef = doc(db, 'users', userId, 'folders', folderId);
    await updateDoc(folderRef, {
      name: newName,
    });
  } catch (error) {
    console.error('Erro ao atualizar pasta:', error);
    throw error;
  }
};

/**
 * Deleta uma pasta
 */
export const deleteFolder = async (
  userId: string,
  folderId: string
): Promise<void> => {
  try {
    // Primeiro, atualiza todos os projetos que estão nessa pasta
    const projectsRef = collection(db, 'users', userId, 'projects');
    const q = query(projectsRef, where('folderId', '==', folderId));
    const querySnapshot = await getDocs(q);
    
    const updatePromises = querySnapshot.docs.map(doc =>
      updateDoc(doc.ref, { folderId: null })
    );
    await Promise.all(updatePromises);
    
    // Depois deleta a pasta
    const folderRef = doc(db, 'users', userId, 'folders', folderId);
    await deleteDoc(folderRef);
  } catch (error) {
    console.error('Erro ao deletar pasta:', error);
    throw error;
  }
};

// ==================== STORAGE ====================

/**
 * Faz upload de uma imagem para o Firebase Storage
 */
export const uploadImage = async (
  userId: string,
  projectId: string,
  file: File | Blob,
  filename: string
): Promise<string> => {
  try {
    const storageRef = ref(storage, `users/${userId}/projects/${projectId}/${filename}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw error;
  }
};

/**
 * Deleta uma imagem do Firebase Storage
 */
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    throw error;
  }
};

/**
 * Converte uma URL de data em Blob
 */
export const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};
