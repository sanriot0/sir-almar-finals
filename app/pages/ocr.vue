<template>
  <v-container class="py-6" max-width="1200">
    <!-- Top Header Banner -->
    <v-card class="rounded-xl pa-6 mb-6 text-white" elevation="0" style="background: linear-gradient(135deg, #D8A2A2 0%, #e2b7b7 100%);">
      <div class="d-flex justify-space-between align-center flex-wrap gap-4">
        <div>
          <div class="text-caption font-weight-bold text-uppercase tracking-wider mb-1" style="color: #FFF9D6; opacity: 0.9;">Smart Text Recognition</div>
          <h1 class="text-h4 font-weight-bold mb-1" style="color: #FFF9D6;">Turn pictures into words.</h1>
          <p class="text-body-2" style="color: #FFF9D6; opacity: 0.95;">Upload a photo of a document, note, or printed page. Tesseract.js will extract the words so you can copy and use them.</p>
        </div>
        <v-chip class="font-weight-bold px-4" prepend-icon="mdi-check-circle" size="small" style="background-color: #FFF9D6; color: #8EA66B;">
          OCR Ready
        </v-chip>
      </div>
    </v-card>

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" closable>
      {{ errorMessage }}
    </v-alert>

    <v-row>
      <!-- Left Column: Upload & Preview -->
      <v-col cols="12" md="6">
        <v-card class="rounded-xl pa-6 h-100" elevation="0" style="background-color: #FFFFFF; border: 2px solid #FFDCDC;">
          <div class="d-flex align-center mb-4">
            <v-avatar rounded="lg" class="mr-3" style="background-color: #FFF9D6; color: #D8A2A2;">
              <v-icon>mdi-upload</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold" style="color: #D8A2A2;">Upload Image</div>
              <div class="text-caption text-grey-darken-1">Select an image to get started</div>
            </div>
          </div>

          <!-- Drag and Drop Box -->
          <div 
            class="pa-6 rounded-xl text-center mb-4 position-relative"
            style="border: 2px dashed #D8A2A2; background-color: #FFFFFF; cursor: pointer;"
            @click="triggerFileInput"
          >
            <v-file-input
              v-model="selectedImage"
              accept="image/*"
              class="d-none"
              @update:model-value="handleImageUpload"
            ></v-file-input>

            <v-icon size="48" color="#D8A2A2" class="mb-2">mdi-cloud-upload-outline</v-icon>
            <div class="text-subtitle-2 font-weight-bold" style="color: #D8A2A2;">Drag and drop your image</div>
            <div class="text-caption text-grey-darken-1 mb-3">or click here to browse files</div>
            <v-btn class="text-white text-none px-6 rounded-pill font-weight-bold" size="small" elevation="0" style="background-color: #8EA66B;">
              Choose Image
            </v-btn>
            <div class="text-caption text-grey-darken-1 mt-2" style="font-size: 10px;">JPG, PNG, JPEG, WEBP</div>
          </div>

          <!-- Image Preview & Extract Action -->
          <div v-if="previewUrl" class="mt-4">
            <div class="text-caption font-weight-bold mb-2" style="color: #D8A2A2;">Image Preview</div>
            <div class="d-flex align-center gap-4 pa-2 rounded-lg" style="background-color: #FFFFFF; border: 1.5px solid #FFDCDC;">
              <v-img :src="previewUrl" max-height="80" width="80" class="rounded" cover></v-img>
              <div class="flex-grow-1">
                <v-btn
                  class="text-white text-none mb-2 font-weight-bold"
                  block
                  size="small"
                  rounded="pill"
                  elevation="0"
                  style="background-color: #8EA66B;"
                  :loading="loading"
                  @click="runOcr"
                >
                  <v-icon start>mdi-text-recognition</v-icon> Extract Text
                </v-btn>
                <div v-if="loading" class="d-flex align-center gap-2">
                  <v-progress-linear indeterminate color="#8EA66B" height="6" rounded></v-progress-linear>
                  <span class="text-caption text-grey-darken-1">Processing...</span>
                </div>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Right Column: Extracted Text Result -->
      <v-col cols="12" md="6">
        <v-card class="rounded-xl pa-6 h-100 d-flex flex-column justify-space-between" elevation="0" style="background-color: #FFFFFF; border: 2px solid #FFDCDC;">
          <div>
            <div class="d-flex justify-space-between align-center mb-4">
              <div class="d-flex align-center">
                <v-avatar rounded="lg" class="mr-3" style="background-color: #FFF9D6; color: #D8A2A2;">
                  <v-icon>mdi-file-document-outline</v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold" style="color: #D8A2A2;">Extracted Text</div>
                  <div class="text-caption text-grey-darken-1">Your recognized text will appear here</div>
                </div>
              </div>
              <v-chip size="x-small" class="font-weight-bold" style="background-color: #8EA66B; color: #ffffff;">{{ wordCount }} words</v-chip>
            </div>

            <!-- Output Box -->
            <div v-if="loading" class="text-center py-12 my-auto">
              <v-progress-circular indeterminate color="#8EA66B" size="48" class="mb-3"></v-progress-circular>
              <div class="text-body-2 font-weight-medium" style="color: #D8A2A2;">Extracting words via Tesseract.js...</div>
            </div>

            <div v-else-if="!extractedText" class="text-center py-12 my-auto text-grey-darken-1">
              <v-icon size="64" color="#FFDCDC" class="mb-2">mdi-text-box-search-outline</v-icon>
              <div class="text-subtitle-2 font-weight-bold" style="color: #D8A2A2;">No text yet</div>
              <div class="text-caption">Upload an image and click Extract Text to see your results.</div>
            </div>

            <v-textarea
              v-else
              v-model="extractedText"
              variant="outlined"
              rows="9"
              readonly
              bg-color="#FFFFFF"
              color="#D8A2A2"
              class="rounded-lg"
              hide-details
            ></v-textarea>
          </div>

          <!-- Bottom Actions -->
          <div class="d-flex justify-end gap-3 mt-4 pt-4" style="border-top: 1px solid #FFDCDC;">
            <v-btn
              variant="flat"
              class="text-none rounded-pill px-4 font-weight-bold text-white"
              prepend-icon="mdi-content-copy"
              style="background-color: #8EA66B;"
              :disabled="!extractedText"
              @click="copyText"
            >
              {{ copied ? 'Copied!' : 'Copy Text' }}
            </v-btn>
            <v-btn
              variant="flat"
              class="text-none rounded-pill px-4 font-weight-bold text-white"
              prepend-icon="mdi-delete-outline"
              style="background-color: #D8A2A2;"
              :disabled="!extractedText && !previewUrl"
              @click="clearAll"
            >
              Clear Text
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Footer Note -->
    <div class="text-center text-caption mt-6" style="color: #D8A2A2;">
      <v-icon size="small" class="mr-1">mdi-shield-check</v-icon> Your images are processed securely in your browser using Tesseract.js.
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { createWorker } from 'tesseract.js'

const selectedImage = ref<any>(null)
const previewUrl = ref<string | null>(null)
const rawFile = ref<any>(null)
const extractedText = ref<string>('')
const loading = ref<boolean>(false)
const errorMessage = ref<string>('')
const copied = ref<boolean>(false)

const wordCount = computed(() => {
  if (!extractedText.value) return 0
  return extractedText.value.trim().split(/\s+/).length
})

const triggerFileInput = () => {
  const inputEl = document.querySelector('input[type="file"]') as HTMLInputElement
  if (inputEl) inputEl.click()
}

const handleImageUpload = (file: any) => {
  const actualFile = Array.isArray(file) ? file[0] : file
  errorMessage.value = ''
  copied.value = false

  if (!actualFile) return

  rawFile.value = actualFile
  previewUrl.value = URL.createObjectURL(actualFile)
  extractedText.value = ''
  
  runOcr()
}

const runOcr = async () => {
  if (!rawFile.value) return
  loading.value = true
  errorMessage.value = ''

  try {
    const worker = await createWorker('eng')
    const ret = await worker.recognize(rawFile.value)
    extractedText.value = ret.data.text.trim() || 'No readable text detected in this image.'
    await worker.terminate()
  } catch (error) {
    console.error('OCR Error:', error)
    errorMessage.value = 'Failed to process image. Please try another file.'
  } finally {
    loading.value = false
  }
}

const copyText = async () => {
  if (!extractedText.value) return
  await navigator.clipboard.writeText(extractedText.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

const clearAll = () => {
  selectedImage.value = null
  rawFile.value = null
  previewUrl.value = null
  extractedText.value = ''
  errorMessage.value = ''
}
</script>