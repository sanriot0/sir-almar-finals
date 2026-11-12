<template>
  <v-app style="background-color: #FFFFFF;">
    <!-- Navigation Sidebar -->
    <v-navigation-drawer v-model="drawer" elevation="0" style="background-color: #FFFFFF; border-right: 1px solid #FFDCDC;">
      <div v-if="user" class="pa-4 d-flex align-center">
        <v-avatar size="44" class="mr-3 elevation-1" style="background-color: #FFF9D6;">
          <v-img :src="user.picture" alt="Profile" />
        </v-avatar>
        <div class="overflow-hidden">
          <div class="text-subtitle-2 font-weight-bold text-truncate" style="color: #D8A2A2;">{{ user.name }}</div>
          <div class="text-caption text-grey-darken-1 text-truncate">{{ user.email }}</div>
        </div>
      </div>

      <v-divider style="border-color: #FFDCDC;"></v-divider>

      <v-list nav density="comfortable" class="mt-2 px-2">
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          to="/"
          rounded="lg"
          class="mb-1"
          style="color: #8EA66B;"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-text-recognition"
          title="Image-to-Text (OCR)"
          to="/ocr"
          rounded="lg"
          class="mb-1"
          style="color: #8EA66B;"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-translate"
          title="Image Translator"
          to="/translator"
          rounded="lg"
          class="mb-1"
          style="color: #8EA66B;"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-4">
          <v-btn
            block
            variant="flat"
            prepend-icon="mdi-logout"
            class="text-none font-weight-bold rounded-pill"
            style="color: #ffffff; background-color: #D8A2A2;"
            @click="logout"
          >
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Top App Bar -->
    <v-app-bar flat border color="#FFFFFF" style="border-bottom: 1px solid #FFDCDC !important;">
      <v-app-bar-nav-icon @click="drawer = !drawer" style="color: #D8A2A2;"></v-app-bar-nav-icon>
      <v-app-bar-title class="font-weight-bold" style="color: #D8A2A2;">
        System Integration Project
      </v-app-bar-title>
    </v-app-bar>

    <!-- Main Page Content -->
    <v-main style="background-color: #FFFFFF;">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const drawer = ref(true)
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