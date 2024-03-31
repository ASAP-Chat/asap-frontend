<template>
  <v-card
    class="pa-5 mb-9 tw-border tw-border-[#d4caff]"
    rounded="xl"
    flat
    :width="480"
  >
    <div class="tw-flex tw-flex-col tw-h-full">
      <div
        class="tw-text-end"
        v-if="allowEdit"
      >
        <CommonIconButton
          icon="mdi-pencil-outline"
          color="primary"
          density="compact"
          @click="emit('edit')"
        />
      </div>
      <div v-for="item in keyword">
        <div class="tw-chat tw-chat-start tw-whitespace-pre-line">
          <div class="tw-chat-bubble tw-bg-[#EEEEEE] text-black">{{ item }}</div>
        </div>
      </div>

      <div class="tw-mt-auto">
        <div class="tw-chat tw-chat-end tw-whitespace-pre-line">
          <div class="tw-chat-image">
            <v-icon
              size="x-large"
              color="primary"
              >mdi-robot-outline</v-icon
            >
          </div>
          <div class="tw-chat-bubble tw-bg-[#d4caff] text-black">{{ replyMessage }}</div>
        </div>
      </div>
    </div>
  </v-card>
</template>
<script setup lang="ts">
const props = defineProps<{
  id: string
  keyword?: string[]
  replyMessage: string
  allowEdit: boolean
}>()
const emit = defineEmits(['edit'])
</script>
