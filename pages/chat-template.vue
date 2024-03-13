<template>
  <div class="px-9 pt-9">
    <div class="tw-flex tw-justify-between mb-7">
      <div
        class="tw-flex tw-items-center bg-primary-lighten tw-px-5 text-primary tw-rounded-lg"
        style="border: 2px solid #674ae7"
      >
        {{ chatTemplateData.data.length }}
        &nbsp;รูปแบบคำตอบ
      </div>
      <div class="tw-flex tw-gap-3 tw-items-center tw-w-96">
        <v-text-field
          density="compact"
          variant="outlined"
          color="primary"
          rounded="lg"
          placeholder="ค้นหา"
          bg-color="white"
          hide-details
          v-model="searchKeyword"
        >
          <template v-slot:prepend-inner>
            <v-icon color="primary">mdi-magnify</v-icon>
          </template>
        </v-text-field>
        <v-btn
          v-if="role !== Role.AGENT"
          prepend-icon="mdi-plus"
          color="primary"
          class="font-weight-bold"
          flat
          rounded="lg"
          @click="chatTempDialog = true"
        >
          <template v-slot:prepend> <v-icon color="white"></v-icon> </template>เพิ่มใหม่
        </v-btn>
      </div>
    </div>
    <ChatTemplateCreateModal
      v-model="chatTempDialog"
      @close-modal="chatTempDialog = false"
    />

    <div
      :class="
        filteredTemplateData.length === 0
          ? 'bg-transparent tw-text-center mt-12'
          : 'bg-white tw-px-6 tw-pt-6 tw-overflow-y-auto tw-grid tw-grid-cols-1 sm:tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-2 xl:tw-grid-cols-3'
      "
      class="tw-rounded-3xl tw-justify-items-center"
      style="max-height: calc(100vh - 200px)"
    >
      {{ filteredTemplateData.length === 0 ? 'ไม่พบรูปแบบคำตอบที่คุณค้นหา' : '' }}

      <ChatTemplateCard
        v-for="item in filteredTemplateData.sort((a:any, b:any) => {
          const dateA = new Date(a.updatedAt)
          const dateB = new Date(b.updatedAt)

          return dateB.getTime() - dateA.getTime()
        })"
        class="mb-6"
        :id="item._id"
        :keyword="item.keyword"
        :template="item.template"
        :allow-edit="role !== Role.AGENT"
        @edit="storeEdit(item._id, item.keyword, item.template)"
      />
    </div>
    <ChatTemplateEditModal
      v-model="editDialog"
      :id="selectedTemplate?.id"
      :keyword="selectedTemplate?.keyword"
      :template="selectedTemplate?.template"
      @close-modal="editDialog = false"
    />
  </div>
</template>
<script setup lang="ts">
import { USER } from '~/constants/Token'
import { getChatTemplate } from '../services/message.service'
import { Role } from '~/constants/Role'
useHead({
  title: 'รูปแบบคำตอบ',
})
const chatTempDialog = ref(false)
const editDialog = ref(false)
const { chatTemplateData } = await getChatTemplate()
const user: any = useCookie(USER)
const { role } = user.value && user.value

const selectedTemplate = ref<any>({
  _id: '',
  keyword: '',
  template: '',
})

const storeEdit = (id: string, keyword: string, template: string) => {
  editDialog.value = true
  selectedTemplate.value = { id, keyword, template }
}

const searchKeyword = ref('')
const filteredTemplateData = computed(() => {
  const keyword = searchKeyword.value.toLowerCase().trim()
  return chatTemplateData.value.data
    .sort((a: any, b: any) => {
      const dateA = new Date(a.updatedAt)
      const dateB = new Date(b.updatedAt)

      return dateA.getTime() - dateB.getTime()
    })
    .filter((item: any) => {
      return (
        item.keyword.toLowerCase().includes(keyword) ||
        item.template.toLowerCase().includes(keyword)
      )
    })
})
</script>
