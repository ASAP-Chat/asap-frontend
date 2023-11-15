<template>
  <v-dialog
    v-model="dialog"
    width="auto"
    persistent
  >
    <v-card
      class="rounded-xl pa-8"
      :class="getSystemColorScheme() === 'dark' ? 'tw-bg-[#1D232A]' : ''"
    >
      <v-card-title class="mx-2 pb-0 text-center">
        <v-icon
          class="tw-text-8xl"
          color="error"
        >
          mdi-tooltip-question-outline
        </v-icon>
        <br />
        <b class="tw-text-3xl text-error">{{ props.header }}</b>
      </v-card-title>
      <v-card-text
        class="text-center tw-mt-0 tw-text-base"
        :class="getSystemColorScheme() === 'dark' ? 'text-white' : ''"
      >
        <p>
          {{ props.content }}
        </p>
      </v-card-text>
      <v-card-actions class="justify-center mt-4 tw-gap-12">
        <v-btn
          size="large"
          class="font-weight-bold tw-text-base px-6"
          variant="tonal"
          @click="btnAction"
          >{{ props.cancelWording }}
        </v-btn>
        <v-btn
          size="large"
          color="error"
          class="font-weight-bold tw-text-base px-6"
          variant="flat"
          @click="confirmAction"
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

const dialog = ref(true)

const btnAction = () => {
  emits('btn-action')
}

const confirmAction = () => {
  emits('confirm-action')
}
</script>

<style scoped></style>
