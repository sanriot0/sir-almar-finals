<template>
  <div class="d-flex mx-auto align-center justify-center" style="height: 100vh; background-color: #FFFFFF;">
    <v-card width="450" rounded="xl" class="pa-6" elevation="2" style="background-color: #FFFFFF; border: 2px solid #FFDCDC;">
      <v-card-text class="text-center px-4">
        <!-- Account Icon Avatar -->
        <v-avatar size="80" class="mb-3" style="background-color: #FFF9D6;">
          <v-icon size="40" color="#D8A2A2">mdi-account-outline</v-icon>
        </v-avatar>

        <h2 class="text-h5 font-weight-bold mb-1" style="color: #D8A2A2;">
          {{ isRegistering ? 'Create an Account' : 'Welcome to SmartNest' }}
        </h2>
        <p class="text-body-2 text-grey-darken-1 mb-4">
          {{ isRegistering ? 'Sign up to get started' : 'Please sign in to continue' }}
        </p>

        <!-- Error / Success Alerts -->
        <v-alert v-if="errorMessage" type="error" variant="tonal" density="compact" class="mb-3">
          {{ errorMessage }}
        </v-alert>
        <v-alert v-if="successMessage" type="success" variant="tonal" density="compact" class="mb-3">
          {{ successMessage }}
        </v-alert>

        <!-- Form Inputs -->
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-if="isRegistering"
            v-model="name"
            label="Full Name"
            variant="outlined"
            density="comfortable"
            color="#D8A2A2"
            class="mb-1"
            rounded="lg"
            prepend-inner-icon="mdi-account"
            required
          ></v-text-field>

          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            variant="outlined"
            density="comfortable"
            color="#D8A2A2"
            class="mb-1"
            rounded="lg"
            prepend-inner-icon="mdi-email"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            variant="outlined"
            density="comfortable"
            color="#D8A2A2"
            class="mb-3"
            rounded="lg"
            prepend-inner-icon="mdi-lock"
            required
          ></v-text-field>

          <!-- Main Action Button (Sign In / Create Account) -->
          <v-btn
            block
            size="large"
            type="submit"
            class="text-none font-weight-bold rounded-pill mb-3 text-white"
            elevation="0"
            style="background-color: #D8A2A2;"
          >
            {{ isRegistering ? 'Create Account' : 'Sign In' }}
          </v-btn>
        </v-form>

        <!-- Switch between Sign In and Register -->
        <div class="text-caption mb-4">
          <span v-if="isRegistering">Already have an account? </span>
          <span v-else>Don't have an account? </span>
          <a href="#" class="font-weight-bold text-decoration-none" style="color: #8EA66B;" @click.prevent="toggleMode">
            {{ isRegistering ? 'Sign In' : 'Create one' }}
          </a>
        </div>

        <div class="d-flex align-center my-3 text-grey">
          <v-divider class="border-opacity-50"></v-divider>
          <span class="px-3 text-caption font-weight-medium">Or</span>
          <v-divider class="border-opacity-50"></v-divider>
        </div>

        <!-- Google OAuth Button -->
        <v-btn
          variant="outlined"
          prepend-icon="mdi-google"
          block
          size="large"
          class="text-none font-weight-bold rounded-pill"
          style="color: #D8A2A2; border-color: #D8A2A2;"
          @click="loginWithGoogle"
        >
          Sign in with Google
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
//@ts-nocheck
import { ref } from 'vue'

definePageMeta({
  layout: false
})

const config = useRuntimeConfig()

// State variables
const isRegistering = ref(false)
const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const toggleMode = () => {
  isRegistering.value = !isRegistering.value
  errorMessage.value = ''
  successMessage.value = ''
  name.value = ''
  email.value = ''
  password.value = ''
}

// Handle Form Submission (Create Account or Sign In)
const handleSubmit = () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!email.value || !password.value || (isRegistering.value && !name.value)) {
    errorMessage.value = 'Please fill in all required fields.'
    return
  }

  // Kunin ang mga nakasave na users mula sa localStorage
  const savedUsers = JSON.parse(localStorage.getItem('registered_users') || '[]')

  if (isRegistering.value) {
    // Check kung may existing email na
    const existingUser = savedUsers.find((u: any) => u.email === email.value)
    if (existingUser) {
      errorMessage.value = 'Email is already registered. Please sign in.'
      return
    }

    // I-save ang bagong account
    const newUser = {
      name: name.value,
      email: email.value,
      password: password.value,
      picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email.value // Dummy avatar
    }

    savedUsers.push(newUser)
    localStorage.setItem('registered_users', JSON.stringify(savedUsers))

    successMessage.value = 'Account created successfully! You can now sign in.'
    setTimeout(() => {
      isRegistering.value = false
      successMessage.value = ''
      password.value = ''
    }, 1500)

  } else {
    // Login Process
    const foundUser = savedUsers.find((u: any) => u.email === email.value && u.password === password.value)
    
    if (foundUser) {
      // I-save ang aktibong sesyon sa localStorage para sa dashboard at sidebar
      localStorage.setItem('google_user', JSON.stringify(foundUser))
      localStorage.setItem('google_token', 'local_session_token')
      navigateTo('/')
    } else {
      errorMessage.value = 'Invalid email or password. Please try again.'
    }
  }
}

// Google OAuth Login Function (Fully Preserved)
const loginWithGoogle = () => {
  const client = window.google.accounts.oauth2.initTokenClient({
    client_id: config.public.googleClientId,
    scope: "openid email profile",
    callback: async (response: any) => {
      const userInfo = await $fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        },
      );

      localStorage.setItem("google_user", JSON.stringify(userInfo));
      localStorage.setItem("google_token", response.access_token);

      navigateTo("/");
    },
  });

  client.requestAccessToken();
};

declare global {
  interface Window {
    google: any
  }
}
</script>

<style>
</style>