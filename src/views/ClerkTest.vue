<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h1 class="text-2xl font-bold mb-4">Teste Clerk</h1>

      <div class="space-y-4">
        <div>
          <strong>isLoaded:</strong> {{ isLoaded }}
        </div>
        <div>
          <strong>isSignedIn:</strong> {{ isSignedIn }}
        </div>
        <div v-if="user">
          <strong>User ID:</strong> {{ user.id }}
        </div>

        <div v-if="isLoaded && isSignedIn" class="border p-4 rounded">
          <h3 class="font-semibold mb-2">UserButton:</h3>
          <UserButton />
        </div>

        <div v-if="isLoaded && !isSignedIn" class="border p-4 rounded">
          <h3 class="font-semibold mb-2">SignIn:</h3>
          <SignIn
            routing="path"
            path="/clerk-test"
            fallbackRedirectUrl="/gallery"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SignIn, UserButton, useAuth } from '@clerk/vue'

export default {
  name: 'ClerkTest',
  components: {
    SignIn,
    UserButton
  },
  setup() {
    const { isLoaded, isSignedIn, user } = useAuth()

    return {
      isLoaded,
      isSignedIn,
      user
    }
  }
}
</script>