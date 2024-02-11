<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn
        variant="tonal"
        :color="localStatus"
        v-bind="props"
        class="tw-rounded-l-md tw-rounded-r-none"
      >
        {{ generateStatus(localStatus) }}
      </v-btn>

      <v-btn
        v-if="localStatus !== Status.COMPLETED"
        variant="tonal"
        :color="localStatus"
        icon="mdi-chevron-right"
        size="small"
        class="tw-h-9 tw-rounded-l-none tw-rounded-r-md"
        @click="updateStatusByStep"
        density="compact"
      >
        <template v-slot:default>
          <v-icon :color="localStatus"></v-icon>
        </template>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="item in presetStatus"
        :value="item.value"
        @click="updateStatus(item.value)"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script setup lang="ts">
import { Status } from '~/constants/Status'
import { updateChatStatus } from '~/services/message.service'

const props = defineProps<{
  id: string
  status: string
}>()

const localStatus = ref(props.status)

const presetStatus = [
  {
    value: String(Status.PENDING),
    title: 'รอดำเนินการ',
  },
  {
    value: String(Status.ONGOING),
    title: 'ดำเนินการ',
  },
  {
    value: String(Status.COMPLETED),
    title: 'เสร็จสิ้น',
  },
]

const updateStatus = async (newValue: string) => {
  localStatus.value = newValue
  await updateChatStatus(props.id, localStatus.value)
}

const updateStatusByStep = async () => {
  const nextStatus = ref('')
  nextStatus.value =
    localStatus.value === Status.PENDING
      ? Status.ONGOING
      : localStatus.value === Status.ONGOING
      ? Status.COMPLETED
      : ''
  localStatus.value = nextStatus.value
  await updateChatStatus(props.id, nextStatus.value)
}
</script>
