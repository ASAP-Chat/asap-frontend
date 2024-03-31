<template>
  <v-btn
    class="font-weight-bold"
    flat
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
}>()
</script>
