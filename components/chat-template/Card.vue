<template>
  <div>
    <v-card
      class="py-2 px-5 tw-border"
      rounded="xl"
      flat
      :width="props.width ? props.width : 400"
      :link="!allowEdit"
    >
      <div class="tw-flex tw-justify-between">
        <div class="tw-flex tw-items-center">{{ props.keyword }}</div>
        <div v-if="allowEdit">
          <v-btn
            color="black"
            variant="text"
            icon="mdi-pencil-outline"
            @click="edit"
          ></v-btn>
        </div>
      </div>
      <div>
        <div class="tw-chat tw-chat-end tw-whitespace-pre-line">
          <div class="tw-chat-bubble tw-bg-[#d4caff] text-black">{{ props.template }}</div>
        </div>
      </div>
    </v-card>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  id: string
  keyword: string
  template: string
  allowEdit: boolean
  width?: number
}>()
const emits = defineEmits(['edit'])
const edit = () => {
  emits('edit')
}
</script>
