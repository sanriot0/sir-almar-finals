<template>
  <v-container class="py-8" max-width="1100">
    <v-row v-if="user">
      <!-- Welcome Hero Banner -->
      <v-col cols="12">
        <v-card class="rounded-xl pa-8 text-white" elevation="0" style="background: linear-gradient(135deg, #D8A2A2 0%, #e2b7b7 100%);">
          <div class="d-flex flex-column flex-sm-row align-center justify-space-between text-center text-sm-left">
            <div class="d-flex flex-column flex-sm-row align-center">
              <v-avatar size="88" class="mb-4 mb-sm-0 mr-sm-6 elevation-2" style="border: 3px solid #FFF9D6;">
                <v-img :src="user.picture" alt="User Avatar" />
              </v-avatar>
              <div>
                <v-chip size="small" class="font-weight-bold mb-2" prepend-icon="mdi-google" style="background-color: #FFF9D6; color: #8EA66B;">
                  Authenticated via Google OAuth
                </v-chip>
                <h1 class="text-h4 font-weight-bold mb-1" style="color: #FFF9D6;">Welcome back, {{ user.name }}!</h1>
                <p class="text-body-2" style="color: #FFF9D6; opacity: 0.95;">Ready to scan documents or translate languages today?</p>
              </div>
            </div>
            <div class="mt-6 mt-sm-0">
              <v-btn
                variant="flat"
                class="font-weight-bold rounded-pill px-6 text-none"
                prepend-icon="mdi-logout"
                style="background-color: #FFF9D6; color: #D8A2A2;"
                @click="logout"
              >
                Sign Out
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Quick Action Cards Heading -->
      <v-col cols="12" class="pt-4 pb-0">
        <h2 class="text-h6 font-weight-bold" style="color: #D8A2A2;">System Features</h2>
        <p class="text-caption text-grey-darken-1">Choose a tool to get started</p>
      </v-col>

      <!-- OCR Feature Card -->
      <v-col cols="12" md="6">
        <v-card class="rounded-xl pa-6 h-100 d-flex flex-column justify-space-between" elevation="0" hover to="/ocr" style="background-color: #FFFFFF; border: 2px solid #FFDCDC;">
          <div>
            <div class="d-flex align-center mb-4">
              <v-avatar rounded="lg" size="48" class="mr-4" style="background-color: #FFF9D6; color: #D8A2A2;">
                <v-icon size="24">mdi-text-recognition</v-icon>
              </v-avatar>
              <div>
                <h3 class="text-subtitle-1 font-weight-bold" style="color: #D8A2A2;">Image-to-Text (OCR)</h3>
                <div class="text-caption text-grey-darken-1">Tesseract.js Engine</div>
              </div>
            </div>
            <p class="text-body-2 text-grey-darken-1 mb-6">
              Upload documents, screenshots, or notes to automatically extract editable text right inside your browser.
            </p>
          </div>
          <v-btn
            block
            rounded="pill"
            append-icon="mdi-arrow-right"
            class="text-none font-weight-bold text-white"
            elevation="0"
            style="background-color: #8EA66B;"
          >
            Launch OCR Tool
          </v-btn>
        </v-card>
      </v-col>

      <!-- Image Translator Feature Card -->
      <v-col cols="12" md="6">
        <v-card class="rounded-xl pa-6 h-100 d-flex flex-column justify-space-between" elevation="0" hover to="/translator" style="background-color: #FFFFFF; border: 2px solid #FFDCDC;">
          <div>
            <div class="d-flex align-center mb-4">
              <v-avatar rounded="lg" size="48" class="mr-4" style="background-color: #FFF9D6; color: #D8A2A2;">
                <v-icon size="24">mdi-translate</v-icon>
              </v-avatar>
              <div>
                <h3 class="text-subtitle-1 font-weight-bold" style="color: #D8A2A2;">Image Translator</h3>
                <div class="text-caption text-grey-darken-1">Multi-language Support</div>
              </div>
            </div>
            <p class="text-body-2 text-grey-darken-1 mb-6">
              Upload photos written in foreign languages (Tagalog, Spanish, Japanese, etc.) and instantly translate them to English.
            </p>
          </div>
          <v-btn
            block
            rounded="pill"
            append-icon="mdi-arrow-right"
            class="text-none font-weight-bold text-white"
            elevation="0"
            style="background-color: #8EA66B;"
          >
            Launch Translator
          </v-btn>
        </v-card>
      </v-col>

      <!-- System Stack Details Footer Card -->
      <v-col cols="12" class="mt-2">
        <v-card class="rounded-xl pa-6" elevation="0" style="background-color: #FFFFFF; border: 2px solid #FFDCDC;">
          <div class="d-flex align-center justify-space-between flex-wrap gap-4">
            <div>
              <div class="text-subtitle-2 font-weight-bold" style="color: #D8A2A2;">System Integration Project Stack</div>
              <div class="text-caption text-grey-darken-2">Nuxt 4 • Vuetify 4 • Tesseract.js • Google OAuth 2.0</div>
            </div>
            <v-chip size="small" class="font-weight-bold" prepend-icon="mdi-check-circle" style="background-color: #FFF9D6; color: #8EA66B;">
              All Systems Operational
            </v-chip>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <div v-else class="d-flex justify-center align-center" style="min-height: 50vh;">
      <v-progress-circular indeterminate color="#D8A2A2" size="56"></v-progress-circular>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const user = ref<any>(null)

onMounted(() => {
  const storedUser = localStorage.getItem('google_user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
})

const logout = () => {
  localStorage.removeItem('google_user')
  localStorage.removeItem('google_token')
  navigateTo('/login')
}
</script>