<template>
  <div
    class="text-center"
    :class="{
      'tw-hidden':
        useDayjs()(props.date).format('ddd, DD/MM/YYYY') === 'Invalid Date',
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
  <div class="tw-chat tw-chat-start">
    <div class="tw-chat-image tw-avatar">
      <div class="tw-w-10 tw-rounded-full">
        <img :src="props.img" />
      </div>
    </div>
    <div class="tw-chat-header">
      <span class="font-weight-bold">{{ props.name }}</span>
      <time class="tw-text-xs tw-opacity-50 tw-ms-2">{{
        useDayjs()(props.time).format('HH:mm')
      }}</time>
    </div>
    <div
      class="tw-chat-bubble tw-bg-[#d4caff] text-secondary"
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
}>()
</script>
