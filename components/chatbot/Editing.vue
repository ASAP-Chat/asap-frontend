<template>
  <v-dialog
    :width="470"
    persistent
  >
    <v-card>
      <div class="tw-flex tw-justify-between tw-items-center px-6 pt-8 pb-4">
        <p class="font-weight-bold tw-text-xl">แก้ไขรูปแบบการตอบกลับของแชตบอท</p>
        <v-btn
          @click="close()"
          variant="text"
        >
          <v-icon
            icon="mdi-close"
            color="secondary-lighten"
          ></v-icon>
        </v-btn>
      </div>

      <v-form
        v-model="isFormValid"
        class="px-6 pt-3 pb-3"
      >
        <div class="form-control">
          <p class="pb-2">คีย์เวิร์ด</p>
          <div
            v-for="(keyword, index) in localInfo.keyword"
            :key="index"
          >
            <v-textarea
              v-model="localInfo.keyword[index]"
              id="keyword"
              name="keyword"
              density="compact"
              variant="outlined"
              rounded="lg"
              color="primary"
              auto-grow
              rows="1"
              counter
              maxlength="50"
              :rules="[required]"
            >
              <template v-slot:append>
                <v-btn
                  v-if="localInfo.keyword.length > 1"
                  :class="
                    localInfo.keyword.length !== 3 && index === localInfo.keyword.length - 1
                      ? 'mr-3'
                      : ''
                  "
                  icon
                  flat
                  @click="removeTextarea(index)"
                  density="comfortable"
                  size="small"
                >
                  <v-icon color="primary">mdi-close</v-icon>
                </v-btn>
                <v-btn
                  v-if="localInfo.keyword.length < 3 && index === localInfo.keyword.length - 1"
                  flat
                  icon
                  density="comfortable"
                  size="small"
                  @click="addTextarea"
                  :disabled="keyword === ''"
                >
                  <v-icon color="primary">mdi-plus</v-icon>
                </v-btn>
              </template>
            </v-textarea>
          </div>
          <p
            class="mb-3 text-error tw-text-sm mt-n3"
            v-if="dupKeyword"
          >
            Keyword นี้มีอยู่แล้ว
          </p>
        </div>
        <div class="form-control tw-mt-2">
          <p class="pb-2">ข้อความตอบกลับ</p>
          <v-textarea
            id="replyMessage"
            name="replyMessage"
            :rules="[required]"
            v-model="localInfo.replyMessage"
            density="compact"
            variant="outlined"
            rounded="lg"
            color="primary"
            auto-grow
            rows="1"
            counter
            maxlength="500"
          ></v-textarea>
        </div>
      </v-form>
      <div class="tw-flex tw-justify-between pb-6 px-6">
        <div>
          <v-btn
            color="error"
            class="font-weight-bold"
            variant="outlined"
            rounded="lg"
            text="ลบ"
            @click="confirmDelete = true"
          >
            <template v-slot:prepend>
              <v-icon color="red darken-4">mdi-trash-can-outline</v-icon>
            </template>
          </v-btn>
        </div>
        <div>
          <v-btn
            color="primary"
            class="font-weight-bold"
            flat
            rounded="lg"
            text="บันทึก"
            prepend-icon="mdi-content-save"
            :disabled="disabledButton"
            @click="editChatbotMsg"
          >
            <template v-slot:prepend>
              <v-icon color="white">mdi mdi-content-save</v-icon>
            </template>
          </v-btn>
        </div>
      </div>
    </v-card>
    <CommonConfirmModal
      v-model="confirmDelete"
      header="ลบรูปแบบการตอบกลับของแชตบอท"
      :content="`คุณยืนยันจะลบรูปแบบการตอบกลับของแชตบอทนี้ใช่หรือไม่?`"
      cancelWording="ยกเลิก"
      confirmWording="ยืนยัน"
      :isSuccess="false"
      @btn-action="confirmDelete = false"
      @confirm-action="deleteChatbotMsg()"
    />
  </v-dialog>
</template>
<script setup lang="ts">
import { ACCESS_TOKEN } from '~/constants/Token'
import { useToast } from 'vue-toastification'
import { getChatbotMsg } from '~/services/chatbot.service'

const toast = useToast()
const confirmDelete = ref(false)
const dupKeyword = ref(false)
const isFormValid = ref(false)

const props = defineProps<{
  id: string
  keyword: string[]
  replyMessage: string
}>()

const localInfo = ref<any>({
  _id: props.id,
  keyword: props.keyword,
  replyMessage: props.replyMessage,
})

const disabledButton = computed(() => {
  return (
    !localInfo.value.replyMessage ||
    localInfo.value.keyword[localInfo.value.keyword.length - 1] === ''
  )
})

const addTextarea = () => {
  localInfo.value.keyword.push('')
}

const removeTextarea = (index: any) => {
  localInfo.value.keyword.splice(index, 1)
}

const { required } = useFormRules()
const access_token = useCookie(ACCESS_TOKEN)

const emits = defineEmits(['close'])
const close = () => {
  dupKeyword.value = false
  localInfo.value = {
    _id: props.id,
    keyword: props.keyword,
    replyMessage: props.replyMessage,
  }
  emits('close')
}

const editChatbotMsg = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/chatbot-message${props.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        keyword: localInfo.value.keyword,
        template: localInfo.value.template,
      }),
      headers: {
        'content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token.value,
      },
    })

    if (response.status === 200) {
      close()
      await getChatbotMsg()
      toast.success('บันทึกสำเร็จ', useToastOption)
    } else if (response.status === 401) {
      dupKeyword.value = false
      await useRefreshToken()
      await editChatbotMsg()
    }
    if (response.status === 500) {
      dupKeyword.value = true
    } else {
      console.log('err')
    }
  } catch (error) {
    console.log(error)
  }
}

const deleteChatbotMsg = async () => {
  try {
    const response = await useFetch(
      `${import.meta.env.VITE_BASE_URL}/chatbot-message/${props.id}`,
      {
        method: 'delete',
        headers: {
          Authorization: 'Bearer ' + access_token.value,
        },
      }
    )

    if (response.status.value === 'success') {
      close()
      confirmDelete.value = false
      toast.success('ลบรูปแบบคำตอบสำเร็จ', useToastOption)
      await getChatbotMsg()
    } else {
      await useRefreshToken()
      await deleteChatbotMsg()
    }
  } catch (error: any) {
    console.log(error)
  }
}

watch(
  () => props.id,
  (newValue) => {
    localInfo.value._id = newValue
  }
)

watch(
  () => props.keyword,
  (newValue) => {
    localInfo.value.keyword = newValue
  }
)
watch(
  () => props.replyMessage,
  (newValue) => {
    localInfo.value.replyMessage = newValue
  }
)
</script>
