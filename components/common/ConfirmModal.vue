<template>
  <v-dialog width="auto">
    <v-card class="rounded-xl pa-8 tw-bg-white">
      <v-card-title class="mx-2 pb-0 text-center">
        <v-icon
          class="tw-text-8xl"
          color="error"
        >
          mdi-tooltip-question-outline
        </v-icon>
        <br />
      </v-card-title>
      <p class="tw-text-3xl text-error text-center font-weight-bold">{{ props.header }}</p>

      <v-card-text class="text-center tw-mt-0 tw-text-base">
        <p v-html="props.content"></p>
      </v-card-text>
      <v-card-actions class="justify-center mt-4 tw-gap-12">
        <v-btn
          size="large"
          class="font-weight-bold tw-text-base px-6"
          variant="tonal"
          @click="emits('btn-action')"
          >{{ props.cancelWording }}
        </v-btn>
        <v-btn
          size="large"
          color="error"
          class="font-weight-bold tw-text-base px-6"
          flat
          variant="outlined"
          @click="emits('confirm-action')"
          >{{ props.confirmWording }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  header: string
  content?: string
  confirmWording: string
  cancelWording: string
}>()

const emits = defineEmits(['btn-action', 'confirm-action'])
</script>
