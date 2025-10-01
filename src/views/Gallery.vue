<template>
  <!-- Conteúdo principal -->
  <div class="h-screen bg-white flex overflow-hidden">
    <!-- Sidebar de Navegação -->
    <div class="w-64 bg-gray-950 border-r border-gray-800 flex flex-col">
      <!-- Header da Sidebar -->
      <div class="p-6 border-b border-gray-800">
        <h2 class="text-xl font-bold text-white">Ktírio</h2>
        <p class="text-sm text-gray-400">Virtual Home Staging</p>
      </div>

      <!-- Navegação -->
      <nav class="flex-1 p-4 space-y-1">
        <button
          @click="setFilter('all')"
          :class="[
            'w-full flex items-center px-3 py-2.5 text-left rounded-md transition-all text-sm font-medium',
            currentFilter === 'all'
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          Todos os Projetos
          <span class="ml-auto text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{{ projects.length }}</span>
        </button>

        <button
          @click="setFilter('favorites')"
          :class="[
            'w-full flex items-center px-3 py-2.5 text-left rounded-md transition-all text-sm font-medium',
            currentFilter === 'favorites'
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          Favoritos
          <span class="ml-auto text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{{ favoriteProjects.length }}</span>
        </button>

        <button
          @click="setFilter('recent')"
          :class="[
            'w-full flex items-center px-3 py-2.5 text-left rounded-md transition-all text-sm font-medium',
            currentFilter === 'recent'
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          Recentes
        </button>

        <button
          @click="setFilter('archived')"
          :class="[
            'w-full flex items-center px-3 py-2.5 text-left rounded-md transition-all text-sm font-medium',
            currentFilter === 'archived'
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          Arquivados
          <span class="ml-auto text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{{ archivedProjects.length }}</span>
        </button>

        <div class="pt-4 border-t border-gray-800">
          <button
            @click="createNewProject"
            class="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-2.5 px-4 rounded-md flex items-center justify-center transition-all text-sm"
          >
            <span class="mr-2">+</span>
            Novo Projeto
          </button>
        </div>
      </nav>

      <!-- Perfil do Usuário -->
      <div class="p-4 border-t border-gray-800">
        <SignedIn>
          <div
            class="clerk-user-button-custom"
            @click="handleUserButtonClick"
            ref="userButtonContainer"
          >
            <UserButton
              :showName="true"
              :appearance="{
                elements: {
                  userButtonBox: 'w-full',
                  userButtonTrigger: {
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s',
                    outline: 'none',
                    boxShadow: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: 'rgb(31 41 55)'
                    },
                    '&:focus': {
                      outline: 'none',
                      boxShadow: 'none'
                    }
                  },
                  userButtonAvatarBox: 'w-10 h-10 flex-shrink-0 order-1',
                  userButtonAvatarImage: 'w-10 h-10 rounded-full',
                  userButtonOuterIdentifier: 'flex-1 min-w-0 order-2'
                }
              }"
            />
          </div>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button class="w-full px-4 py-2.5 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-all font-medium text-sm">
              Fazer Login
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>

    <!-- Conteúdo Principal -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header fixo -->
      <div class="p-8 pb-4 border-b border-gray-100">
        <h1 class="text-2xl font-semibold text-gray-900 mb-1">
          {{ getFilterTitle() }}
        </h1>
        <p class="text-gray-500 text-sm">
          {{ getFilterDescription() }}
        </p>
      </div>

      <!-- Área dos projetos com scroll -->
      <div class="flex-1 overflow-y-auto p-8 pt-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="project in filteredProjects"
            :key="project.id"
            class="bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer relative group"
          >
            <div @click="openProject(project.id)" class="p-4">
              <div class="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center overflow-hidden">
                <img
                  v-if="project.baseImage"
                  :src="project.baseImage"
                  :alt="project.name"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-gray-400 text-sm">Sem imagem</span>
              </div>

              <h3 class="font-medium text-gray-900 mb-1 text-sm">{{ project.name }}</h3>
              <p class="text-xs text-gray-500">
                {{ formatDate(project.createdAt) }}
              </p>

              <div class="flex justify-start items-center mt-2">
                <span
                  v-if="project.isArchived"
                  class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md"
                >
                  Arquivado
                </span>
              </div>
            </div>

            <!-- Menu de 3 pontos -->
            <div class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="relative">
                <button
                  @click.stop="toggleProjectMenu(project.id)"
                  class="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                  :class="{ 'bg-gray-100': activeProjectMenu === project.id }"
                >
                  <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                  </svg>
                </button>

                <!-- Dropdown menu -->
                <div
                  v-if="activeProjectMenu === project.id"
                  class="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10"
                >
                  <button
                    @click.stop="renameProject(project)"
                    class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Renomear projeto
                  </button>

                  <button
                    @click.stop="toggleFavorite(project)"
                    class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {{ project.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos' }}
                  </button>

                  <button
                    @click.stop="duplicateProject(project)"
                    class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Duplicar projeto
                  </button>

                  <hr class="my-1">

                  <button
                    v-if="!project.isArchived"
                    @click.stop="archiveProject(project)"
                    class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Arquivar projeto
                  </button>

                  <button
                    v-else
                    @click.stop="unarchiveProject(project)"
                    class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Desarquivar projeto
                  </button>

                  <button
                    @click.stop="deleteProject(project)"
                    class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Excluir projeto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="projects.length === 0" class="text-center py-16">
          <p class="text-gray-500 text-sm mb-4">Nenhum projeto encontrado</p>
          <button
            @click="createNewProject"
            class="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-md text-sm transition-colors"
          >
            Criar Primeiro Projeto
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { computed, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '../stores/projects.js'
import { useNavigationStore } from '../stores/navigation.js'
import { useUser, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/vue'
import { useConfirmModal } from '../composables/useConfirmModal.js'

export default {
  name: 'Gallery',
  components: {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton
  },
  setup() {
    const projectsStore = useProjectsStore()
    const navigationStore = useNavigationStore()
    const { user } = useUser()
    const { prompt } = useConfirmModal()
    const router = useRouter()

    // Estado do filtro atual
    const currentFilter = ref('all')
    const activeProjectMenu = ref(null)

    onMounted(async () => {
      // Inicializar projetos se necessário
      if (!projectsStore.isInitialized) {
        await projectsStore.loadProjects()
      }
    })

    // Computeds
    const projects = computed(() => projectsStore.projects)

    const favoriteProjects = computed(() =>
      projects.value.filter(project => project.isFavorite && !project.isArchived)
    )

    const archivedProjects = computed(() =>
      projects.value.filter(project => project.isArchived)
    )

    const recentProjects = computed(() => {
      const sorted = [...projects.value]
        .filter(project => !project.isArchived)
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      return sorted.slice(0, 10)
    })

    const filteredProjects = computed(() => {
      switch (currentFilter.value) {
        case 'favorites':
          return favoriteProjects.value
        case 'recent':
          return recentProjects.value
        case 'archived':
          return archivedProjects.value
        default:
          return projects.value.filter(project => !project.isArchived)
      }
    })

    // Métodos de filtro
    const setFilter = (filter) => {
      currentFilter.value = filter
    }

    const getFilterTitle = () => {
      switch (currentFilter.value) {
        case 'favorites':
          return 'Projetos Favoritos'
        case 'recent':
          return 'Projetos Recentes'
        case 'archived':
          return 'Projetos Arquivados'
        default:
          return 'Todos os Projetos'
      }
    }

    const getFilterDescription = () => {
      switch (currentFilter.value) {
        case 'favorites':
          return 'Seus projetos marcados como favoritos'
        case 'recent':
          return 'Últimos projetos editados'
        case 'archived':
          return 'Projetos arquivados'
        default:
          return 'Gerencie seus projetos de decoração com IA'
      }
    }


    const createNewProject = async () => {
      const name = await prompt({
        title: 'Novo Projeto',
        message: 'Qual será o nome do seu novo projeto?',
        placeholder: 'Nome do projeto',
        initialValue: 'Novo Projeto',
        confirmText: 'Criar Projeto',
        cancelText: 'Cancelar',
        validation: (value) => {
          if (!value.trim()) {
            return 'O nome do projeto não pode estar vazio'
          }
          if (value.trim().length > 100) {
            return 'O nome do projeto não pode ter mais de 100 caracteres'
          }
          return null
        }
      })

      if (name) {
        const newProject = await projectsStore.createNewProject(name.trim())
        navigationStore.navigateToProject(newProject.id)
      }
    }

    const openProject = (projectId) => {
      navigationStore.navigateToProject(projectId)
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('pt-BR')
    }

    // Métodos do menu de ações dos projetos
    const toggleProjectMenu = (projectId) => {
      activeProjectMenu.value = activeProjectMenu.value === projectId ? null : projectId
    }

    const renameProject = async (project) => {
      activeProjectMenu.value = null
      const newName = await prompt({
        title: 'Renomear Projeto',
        message: 'Digite o novo nome do projeto:',
        placeholder: 'Nome do projeto',
        initialValue: project.name,
        confirmText: 'Renomear',
        cancelText: 'Cancelar',
        validation: (value) => {
          if (!value.trim()) {
            return 'O nome do projeto não pode estar vazio'
          }
          if (value.trim().length > 100) {
            return 'O nome do projeto não pode ter mais de 100 caracteres'
          }
          return null
        }
      })

      if (newName) {
        projectsStore.renameProject(project.id, newName.trim())
      }
    }

    const toggleFavorite = (project) => {
      activeProjectMenu.value = null
      projectsStore.toggleFavorite(project.id)
    }

    const duplicateProject = async (project) => {
      activeProjectMenu.value = null
      const duplicatedProject = await projectsStore.duplicateProject(project.id)
      if (duplicatedProject) {
        // Opcional: navegar para o projeto duplicado
        // navigationStore.navigateToProject(duplicatedProject.id)
      }
    }

    const archiveProject = (project) => {
      activeProjectMenu.value = null
      projectsStore.toggleArchive(project.id)
    }

    const unarchiveProject = (project) => {
      activeProjectMenu.value = null
      projectsStore.toggleArchive(project.id)
    }

    const deleteProject = async (project) => {
      activeProjectMenu.value = null
      const typedName = await prompt({
        title: 'Excluir Projeto',
        message: `Para confirmar a exclusão permanente do projeto "${project.name}", digite o nome do projeto abaixo:`,
        placeholder: 'Digite o nome do projeto',
        initialValue: '',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        validation: (value) => {
          if (!value.trim()) {
            return 'Digite o nome do projeto para confirmar'
          }
          if (value.trim() !== project.name) {
            return 'O nome digitado não confere com o nome do projeto'
          }
          return null
        }
      })

      if (typedName && typedName.trim() === project.name) {
        projectsStore.deleteProject(project.id)
      }
    }

    // Fechar menu ao clicar fora
    const closeMenuOnClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        activeProjectMenu.value = null
      }
    }

    // Adicionar listener global
    if (typeof document !== 'undefined') {
      document.addEventListener('click', closeMenuOnClickOutside)
    }

    const getUserInitials = () => {
      const name = user?.fullName || user?.firstName || 'U'
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    }

    const userButtonContainer = ref(null)

    const handleUserButtonClick = (event) => {
      // Procura pelo botão real do Clerk dentro do container
      const userButton = userButtonContainer.value?.querySelector('button[data-testid="userButton"]') ||
                        userButtonContainer.value?.querySelector('[data-localization-key="userButton.defaultTitle"]') ||
                        userButtonContainer.value?.querySelector('.cl-userButtonTrigger') ||
                        userButtonContainer.value?.querySelector('button')

      if (userButton && !event.target.closest('button')) {
        userButton.click()
      }
    }


    return {
      // Estado
      currentFilter,
      activeProjectMenu,

      // Computeds
      projects,
      favoriteProjects,
      archivedProjects,
      filteredProjects,

      // Métodos
      createNewProject,
      openProject,
      formatDate,
      setFilter,
      getFilterTitle,
      getFilterDescription,

      // Métodos do menu de ações
      toggleProjectMenu,
      renameProject,
      toggleFavorite,
      duplicateProject,
      archiveProject,
      unarchiveProject,
      deleteProject,

      // User methods
      getUserInitials,
      handleUserButtonClick,
      userButtonContainer,
      user
    }
  }
}
</script>

<style>
.clerk-user-button-custom .cl-userButtonInnerIdentifier {
  color: #ffffff !important;
}

.clerk-user-button-custom .cl-userButtonOuterIdentifier {
  color: #ffffff !important;
}

.clerk-user-button-custom .cl-userButtonOuterIdentifier * {
  color: #ffffff !important;
}

.clerk-user-button-custom .cl-userButtonOuterIdentifierText {
  color: #d1d5db !important;
}

.clerk-user-button-custom .cl-userButtonOuterIdentifierText * {
  color: #d1d5db !important;
}

.clerk-user-button-custom [data-localization-key="userButton.account.name"] {
  color: #ffffff !important;
}

.clerk-user-button-custom [data-localization-key="userButton.account.email"] {
  color: #d1d5db !important;
}

.clerk-user-button-custom .cl-userButton__identifier {
  color: #ffffff !important;
}

.clerk-user-button-custom .cl-userButton__identifier * {
  color: #ffffff !important;
}

.clerk-user-button-custom .cl-userButton__identifierText {
  color: #d1d5db !important;
}

.clerk-user-button-custom .cl-userButton__identifierText * {
  color: #d1d5db !important;
}

/* Força especificamente o nome do usuário */
.clerk-user-button-custom span.cl-userButtonOuterIdentifier {
  color: #ffffff !important;
}

.clerk-user-button-custom span.cl-userButtonOuterIdentifier > * {
  color: #ffffff !important;
}
</style>