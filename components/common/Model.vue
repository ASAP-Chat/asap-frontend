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
          :color="props.isSuccess ? 'info' : 'error'"
        >
          {{
            props.isSuccess
              ? 'mdi-tooltip-check-outline'
              : 'mdi-tooltip-remove-outline'
          }}
        </v-icon>
        <br />
        <b
          class="tw-text-3xl tw-text-[#53b389]"
          :class="props.isSuccess ? 'tw-text-[#53b389]' : 'tw-text-[#E71313]'"
          >{{ props.header }}</b
        >
      </v-card-title>
      <v-card-text
        class="text-center tw-mt-0 tw-text-base"
        :class="getSystemColorScheme() === 'dark' ? 'text-white' : ''"
      >
        <p>
          {{ props.content }}
        </p>
      </v-card-text>
      <v-card-actions class="justify-center mt-4">
        <v-btn
          size="large"
          class="text-white font-weight-bold tw-text-base px-6"
          :class="props.isSuccess ? 'tw-bg-[#53b389]' : 'tw-bg-[#E71313]'"
          :to="props.to"
          @click="btnAction"
          >{{ props.buttonText }}
        </v-btn>
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
  to?: string
}>()

const emits = defineEmits(['btn-action'])

const dialog = ref(true)

const btnAction = () => {
  emits('btn-action')
}
</script>

<style scoped></style>
