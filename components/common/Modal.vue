<template>
  <v-dialog
    v-model="dialog"
    width="auto"
    persistent
  >
    <v-card class="rounded-xl pa-8 tw-bg-white">
      <v-card-title class="mx-2 pb-0 text-center">
        <v-icon
          class="tw-text-8xl"
          :color="props.isSuccess ? 'info' : 'error'"
          v-if="!props.customIcon"
        >
          {{ props.isSuccess ? 'mdi-tooltip-check-outline' : 'mdi-tooltip-remove-outline' }}
          {{ props.customIcon }}
        </v-icon>
        <v-icon
          class="tw-text-8xl"
          :color="props.isSuccess ? 'info' : 'error'"
          v-else
        >
          {{ props.customIcon }}
        </v-icon>
        <br />
        <b
          class="tw-text-3xl tw-text-[#53b389]"
          :class="props.isSuccess ? 'tw-text-[#53b389]' : 'tw-text-[#E71313]'"
          >{{ props.header }}</b
        >
      </v-card-title>
      <v-card-text class="text-center tw-mt-0 tw-text-base">
        <p>
          {{ props.content }}
        </p>
      </v-card-text>
      <v-card-actions class="justify-center mt-4">
        <CommonButton
          :text="buttonText!"
          @click="btnAction"
          size="large"
          class="text-white font-weight-bold tw-text-base px-6"
          :class="props.isSuccess ? 'tw-bg-[#53b389]' : 'tw-bg-[#E71313]'"
          :to="props.to"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  header: string
  content?: string
  buttonText?: string
  isSuccess: boolean
  customIcon?: string
  to?: string
}>()

const emits = defineEmits(['btn-action'])

const dialog = ref(true)

const btnAction = () => {
  emits('btn-action')
}
</script>

<style scoped></style>
