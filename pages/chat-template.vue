<template>
  <div class="pa-5">
    <div class="tw-flex tw-justify-between mb-4">
      <div class="tw-flex tw-items-center">
        <span class="tw-text-xl font-weight-bold text-primary">{{
          chatTemplateData.data.length
        }}</span>
        &nbsp; รูปแบบคำตอบ
      </div>
      <div>
        <v-btn
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
      class="tw-justify-items-center tw-overflow-y-auto custom-scrollbar tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-1 lg:tw-grid-cols-1 xl:tw-grid-cols-3"
    >
      <div
        v-for="item in chatTemplateData.data.slice().sort((a:any, b:any) => {
          const dateA = new Date(a.updatedAt)
          const dateB = new Date(b.updatedAt)

          return dateB.getTime() - dateA.getTime()
        })"
        class="mb-6"
      >
        <ChatTemplateCard
          :id="item._id"
          :keyword="item.keyword"
          :template="item.template"
          :allow-edit="true"
          @edit="storeEdit(item._id, item.keyword, item.template)"
        />
      </div>
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
import { getChatTemplate } from '../services/message.service'
useHead({
  title: 'รูปแบบคำตอบ',
})
const chatTempDialog = ref(false)
const editDialog = ref(false)
const { chatTemplateData } = await getChatTemplate()

const selectedTemplate = ref<any>({
  _id: '',
  keyword: '',
  template: '',
})
const setSelectTemplate = async (id: string, keyword: string, template: string) => {
  selectedTemplate.value = { id, keyword, template }
}
const storeEdit = (id: string, keyword: string, template: string) => {
  editDialog.value = true
  setSelectTemplate(id, keyword, template)
}
</script>
