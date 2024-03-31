<template>
  <v-btn
    flat
    icon
    variant="text"
  >
    <v-icon>{{ icon }}</v-icon>
  </v-btn>
</template>
<script setup lang="ts">
const props = defineProps<{
  icon: string
}>()
</script>
