<template>
  <div class="min-h-screen bg-white flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Ktírio</h1>
        <p class="text-gray-500 text-sm">Virtual Home Staging AI</p>
      </div>

      <SignUp
        :appearance="{
          elements: {
            formButtonPrimary: 'bg-gray-900 hover:bg-gray-800 text-sm normal-case transition-colors duration-200',
            card: 'shadow-lg border border-gray-100 rounded-lg',
            headerTitle: 'text-xl font-semibold text-gray-900',
            headerSubtitle: 'text-gray-500 text-sm',
            socialButtonsBlockButton: 'border-gray-200 hover:border-gray-300 transition-colors duration-200',
            formFieldInput: 'border-gray-200 focus:border-gray-400 focus:ring-gray-400 rounded-md',
            footerActionLink: 'text-gray-600 hover:text-gray-900 transition-colors duration-200'
          }
        }"
        routing="path"
        path="/sign-up"
        fallbackRedirectUrl="/gallery"
        signInUrl="/sign-in"
      />
    </div>
  </div>
</template>

<script>
import { SignUp } from '@clerk/vue'

export default {
  name: 'SignUpPage',
  components: {
    SignUp
  }
}
</script>