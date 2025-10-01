<template>
  <div class="min-h-screen bg-[#F7F7F8] font-sans text-gray-800">
    <RouterView />

    <!-- Modals globais -->
    <ModalContainer />
  </div>
</template>

<script>
import { RouterView } from 'vue-router'
import ModalContainer from './components/ModalContainer.vue'

export default {
  name: 'App',
  components: {
    RouterView,
    ModalContainer
  }
}
</script>