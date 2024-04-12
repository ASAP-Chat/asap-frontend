<template>
  <v-card
    flat
    height="104"
    width="104"
    class="tw-place-items-center tw-flex"
  >
    <v-img
      :src="src"
      width="88"
    />
  </v-card>
</template>
<script setup lang="ts">
const props = defineProps<{
  src: string
}>()
</script>
