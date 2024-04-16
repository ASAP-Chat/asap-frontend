<template>
  <div class="text-center">
    <v-card
      flat
      height="104"
      width="104"
      class="tw-place-items-center tw-flex"
    >
      <v-img
        v-if="type.startsWith('image')"
        :src="src"
        width="88"
      />
      <video
        v-else-if="type.startsWith('video')"
        preload="metadata"
        width="88"
        controls
      >
        <source
          :src="src"
          type="video/mp4"
        />
        Your browser does not support HTML video.
      </video>
    </v-card>
    <p
      class="mt-1 text-error tw-text-sm"
      v-if="type.startsWith('video') && size >= 200000000"
    >
      ไฟล์นี้มีขนาดเกิน 1MB
    </p>
    <p
      class="mt-1 text-error tw-text-sm"
      v-if="type.startsWith('image') && size >= 10000000"
    >
      ไฟล์นี้มีขนาดเกิน 1MB
    </p>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  src: string
  type: string
  size: number
}>()
</script>
