<template>
  <v-btn
    class="font-weight-bold"
    :variant="variant"
    rounded="lg"
    :text="text"
  >
    <template
      v-slot:prepend
      v-if="icon"
    >
      <v-icon>{{ icon }}</v-icon>
    </template>
  </v-btn>
</template>
<script setup lang="ts">
const props = defineProps<{
  text: string
  icon?: string
  variant: 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain'
}>()
</script>
