<template>
  <div
    class="text-center"
    :class="{
      'tw-hidden': useDayjs()(props.date).format('ddd, DD/MM/YYYY') === 'Invalid Date',
    }"
  >
    <v-chip color="info">
      <span class="tw-text-xs">
        {{
          useDayjs()(props.date).format('ddd, DD/MM/YYYY') !== 'Invalid Date'
            ? useDayjs()(props.date).format('ddd, DD/MM/YYYY')
            : null
        }}
      </span>
    </v-chip>
  </div>
  <div
    class="tw-chat"
    :class="[
      isOwner ? 'tw-chat-end' : 'tw-chat-start',
      props.msgType !== 'text' ? '' : 'tw-drop-shadow-lg',
    ]"
  >
    <div
      class="tw-chat-image tw-avatar"
      :class="props.msgType !== 'text' ? 'tw-row-auto' : ''"
    >
      <div
        class="tw-w-10 tw-rounded-full"
        v-if="props.img"
      >
        <img :src="props.img" />
      </div>
      <div
        class="tw-w-10 tw-rounded-full"
        v-else
      >
        <v-icon size="x-large">mdi-account-circle-outline</v-icon>
      </div>
    </div>
    <div class="tw-chat-header">
      <time class="tw-text-xs tw-opacity-50 tw-ms-2">
        {{ useDayjs()(props.time).format('HH:mm') }}
      </time>
    </div>
    <div
      class="tw-chat-bubble text-secondary"
      :class="isOwner ? 'tw-bg-[#d4caff]' : 'tw-bg-[#fff]'"
      v-if="props.msgType === 'text'"
    >
      {{ props.msgText }}
    </div>

    <div
      class="tw-chat-bubble tw-bg-transparent"
      v-if="props.msgType !== 'text'"
    >
      <img :src="props.msgSticker" />
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  name?: string
  img?: string
  msgType: string
  msgText?: string
  msgSticker?: string
  date?: any
  time?: number
  isOwner?: boolean
}>()
</script>
