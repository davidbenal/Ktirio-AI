import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  updateProfile
} from 'firebase/auth'
import { auth } from './firebase.js'

/**
 * Firebase Authentication Service
 *
 * Provides methods for user authentication including:
 * - Email/password registration and login
 * - Anonymous login
 * - Sign out
 * - Auth state monitoring
 */

/**
 * Create a new user with email and password
 */
export const registerWithEmail = async (email, password, displayName = '') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    // Update display name if provided
    if (displayName) {
      await updateProfile(userCredential.user, { displayName })
    }

    return {
      user: userCredential.user,
      success: true,
      message: 'Conta criada com sucesso!'
    }
  } catch (error) {
    return {
      user: null,
      success: false,
      message: getAuthErrorMessage(error.code)
    }
  }
}

/**
 * Sign in with email and password
 */
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return {
      user: userCredential.user,
      success: true,
      message: 'Login realizado com sucesso!'
    }
  } catch (error) {
    return {
      user: null,
      success: false,
      message: getAuthErrorMessage(error.code)
    }
  }
}

/**
 * Sign in anonymously (for testing/guest access)
 */
export const loginAnonymously = async () => {
  try {
    const userCredential = await signInAnonymously(auth)
    return {
      user: userCredential.user,
      success: true,
      message: 'Login anônimo realizado com sucesso!'
    }
  } catch (error) {
    return {
      user: null,
      success: false,
      message: getAuthErrorMessage(error.code)
    }
  }
}

/**
 * Sign out current user
 */
export const logout = async () => {
  try {
    await signOut(auth)
    return {
      success: true,
      message: 'Logout realizado com sucesso!'
    }
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao fazer logout: ' + error.message
    }
  }
}

/**
 * Monitor authentication state changes
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}

/**
 * Get current user
 */
export const getCurrentUser = () => {
  return auth.currentUser
}

/**
 * Convert Firebase auth error codes to Portuguese messages
 */
const getAuthErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/email-already-in-use': 'Este email já está em uso.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/invalid-email': 'Email inválido.',
    'auth/user-disabled': 'Esta conta foi desabilitada.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/invalid-credential': 'Credenciais inválidas.',
    'auth/missing-password': 'Por favor, insira sua senha.',
    'auth/operation-not-allowed': 'Operação não permitida.'
  }

  return errorMessages[errorCode] || 'Erro de autenticação: ' + errorCode
}