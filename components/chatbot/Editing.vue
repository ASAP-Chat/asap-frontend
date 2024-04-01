<template>
  <v-dialog
    :width="470"
    persistent
  >
    <v-card>
      <div class="tw-flex tw-justify-between tw-items-center px-6 pt-8 pb-4">
        <p class="font-weight-bold tw-text-xl">แก้ไขรูปแบบการตอบกลับของแชตบอท</p>
        <common-icon-button
          icon="mdi-close"
          size="small"
          color="secondary-lighten"
          @click="close()"
        />
      </div>

      <v-form class="px-6 pt-3 pb-3">
        <div class="form-control">
          <p class="pb-2">คีย์เวิร์ด</p>
          <div
            v-for="(item, index) in localInfo.keyword"
            :key="index"
          >
            <v-textarea
              v-model="localInfo.keyword[index]"
              :id="`keyword`[index]"
              :name="`keyword`[index]"
              density="compact"
              variant="outlined"
              rounded="lg"
              color="primary"
              auto-grow
              rows="1"
              counter
              maxlength="50"
              :rules="[required]"
              :error="dupKeyword"
            >
              <template v-slot:append>
                <common-icon-button
                  v-if="localInfo.keyword.length > 1"
                  :class="
                    localInfo.keyword.length !== 3 && index === localInfo.keyword.length - 1
                      ? 'mr-3'
                      : ''
                  "
                  icon="mdi-close"
                  color="primary"
                  density="comfortable"
                  size="small"
                  @click="removeTextarea(index)"
                />
                <common-icon-button
                  v-if="localInfo.keyword.length < 3 && index === localInfo.keyword.length - 1"
                  icon="mdi-plus"
                  :variant="item === '' ? 'outlined' : 'tonal'"
                  color="primary"
                  density="comfortable"
                  size="small"
                  @click="addTextarea"
                  :disabled="item === ''"
                />
              </template>
            </v-textarea>
          </div>
          <p
            class="mb-3 text-error tw-text-sm mt-n3"
            v-if="dupKeyword"
          >
            มี Keyword ซ้ำกับรูปแบบการตอบกลับของแชตบอทที่มีอยู่แล้ว, <br />โปรดเปลี่ยน Keyword :
            {{ dupWording }}
          </p>
        </div>
        <div class="form-control tw-mt-2">
          <p class="pb-2">ข้อความตอบกลับ</p>
          <CommonTextArea
            id="replyMessage"
            name="replyMessage"
            :rules="[required]"
            v-model="localInfo.replyMessage"
            counter
            maxlength="500"
            :error="dupReply"
          />
          <p
            class="mb-3 text-error tw-text-sm mt-n3"
            v-if="dupReply"
          >
            ข้แความตอบกลับนี้มีอยู่แล้ว
          </p>
        </div>
      </v-form>
      <div class="tw-flex tw-justify-between pb-6 px-6">
        <div>
          <CommonOutlinedButton
            text="ลบ"
            icon="mdi-trash-can-outline"
            color="error"
            class="font-weight-bold"
            @click="confirmDelete = true"
          />
        </div>
        <div>
          <common-button
            text="บันทึก"
            icon="mdi-content-save"
            color="primary"
            :disabled="disabledButton"
            @click="editChatbotMsg"
          />
        </div>
      </div>
    </v-card>
    <CommonConfirmModal
      v-model="confirmDelete"
      header="ลบรูปแบบการตอบกลับของแชตบอท"
      :content="`คุณยืนยันที่จะลบรูปแบบการตอบกลับของแชตบอทนี้ใช่หรือไม่?`"
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
const dupWording = ref('')
const dupReply = ref(false)

const props = defineProps<{
  id?: string
  keyword: string[]
  replyMessage: string
  page: number
}>()

const localInfo = ref<any>({
  id: props.id,
  keyword: [...props.keyword],
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
    id: props.id,
    keyword: [...props.keyword],
    replyMessage: props.replyMessage,
  }
  emits('close')
}

const editChatbotMsg = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/chatbot-message/${props.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        keyword: localInfo.value.keyword,
        replyMessage: localInfo.value.replyMessage,
      }),
      headers: {
        'content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token.value,
      },
    })

    if (response.status === 200) {
      dupKeyword.value = false
      emits('close')
      await getChatbotMsg(props.page)
      toast.success('บันทึกสำเร็จ', useToastOption)
    } else if (response.status === 401) {
      dupKeyword.value = false
      await useRefreshToken()
      await editChatbotMsg()
    } else if (response.status === 500) {
      const dup = await response.json()
      if (dup.message.includes('replyMessage:')) {
        dupReply.value = true
      } else {
        const regex = /keyword: "(.*?)"/
        const match = dup.message.match(regex)
        if (match && match.length > 1) {
          dupWording.value = match[1]
        }
        dupKeyword.value = true
      }
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
      await getChatbotMsg(props.page)
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
    localInfo.value.id = newValue
  }
)

watch(
  () => props.keyword,
  (newValue) => {
    localInfo.value.keyword = [...newValue]
  }
)
watch(
  () => props.replyMessage,
  (newValue) => {
    localInfo.value.replyMessage = newValue
  }
)

for (let i = 0; i < 3; i++) {
  watch(
    () => localInfo.value.keyword[i],
    (newValue) => {
      if (dupKeyword.value) dupKeyword.value = false
    }
  )
}

watch(
  () => localInfo.value.replyMessage,
  (newValue) => {
    dupReply.value = false
  }
)
</script>
