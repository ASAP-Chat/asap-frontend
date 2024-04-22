<template>
  <div>
    <v-file-input
      multiple
      v-show="false"
      variant="solo"
      flat
      type="file"
      ref="fileInputRef"
      @change="(event:Event)=>{
        emits('handleImageChange',event)
      }"
      accept="image/png,image/jpg,image/jpeg,image/jfif,image/gif,video/*"
    />
    <CommonIconButton
      class="ml-2"
      icon="mdi-paperclip-plus"
      color="primary"
      :density="densityBtn"
      @click="$emit('handleClickAttachment')"
      :disabled="disabledBtn"
    />
  </div>
</template>

<script setup lang="ts">
import type { VInput } from 'vuetify/lib/components/index.mjs'

const props = defineProps<{
  previewImageUrl: any
  disabledBtn?: boolean
  densityBtn?: string
}>()
const emits = defineEmits<{
  (e: 'handleImageChange', event: Event): void
  (e: 'handleClickAttachment'): void
}>()
const fileInputRef = ref<VInput>()
defineExpose({
  fileInputRef,
})
</script>
