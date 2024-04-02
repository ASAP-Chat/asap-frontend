<template>
  <v-navigation-drawer
    permanent
    width="290"
    order="1"
  >
    <div class="pa-6">
      <v-table>
        <tbody>
          <tr>
            <td><p class="tw-text-base tw-font-semibold">เปิด - ปิด แชตบอท</p></td>
            <td>
              <CommonSwitch
                v-model="all"
                color="#7E68F7"
                :disabled="role === Role.AGENT"
              />
            </td>
          </tr>
          <tr>
            <td class="tw-flex tw-items-center">
              <v-icon class="mr-2">{{ generateSocialIcon(SocialType.LINE) }}</v-icon> LINE
            </td>
            <td>
              <CommonSwitch
                color="#4BD66E"
                v-model="line"
                :disabled="role === Role.AGENT"
              />
            </td>
          </tr>
          <tr>
            <td class="tw-flex tw-items-center">
              <v-icon class="mr-2">{{ generateSocialIcon(SocialType.FACEBOOK) }}</v-icon
              >Facebook
            </td>
            <td>
              <CommonSwitch
                color="#4BD66E"
                v-model="fb"
                :disabled="role === Role.AGENT"
              />
            </td>
          </tr>
          <tr>
            <td class="tw-flex tw-items-center">
              <v-icon class="mr-2">{{ generateSocialIcon(SocialType.INSTAGRAM) }}</v-icon
              >Instagram
            </td>
            <td>
              <CommonSwitch
                color="#4BD66E"
                v-model="ig"
                :disabled="role === Role.AGENT"
              />
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
import { SocialType } from '~/constants/SocialType'
import { getChatbotStatus, updateChatbotStatus } from '~/services/chatbot.service'
import { Role } from '~/constants/Role'
import { USER } from '~/constants/Token'

const user: any = useCookie(USER)
const { role } = user.value || {}

const { data } = (await getChatbotStatus()).chatbotStatus.value
const line = ref(data[0].isEnabledLine)
const fb = ref(data[0].isEnabledFacebook)
const ig = ref(data[0].isEnabledInstagram)
const all = ref(line.value || fb.value || ig.value)
const statusId = data[0]._id

const updateValues = () => {
  if (all.value) {
    line.value = true
    fb.value = true
    ig.value = true
  } else if (line.value && fb.value && ig.value && !all.value) {
    line.value = false
    fb.value = false
    ig.value = false
  }
  updateChatbotStatus(statusId, line.value, fb.value, ig.value)
}

const updateBySocial = () => {
  if (fb.value && line.value && ig.value) {
    all.value = true
  } else if (!fb.value && !line.value && !ig.value) {
    all.value = false
  }
  updateChatbotStatus(statusId, line.value, fb.value, ig.value)
}

watch(() => all.value, updateValues)
watch(() => fb.value, updateBySocial)
watch(() => line.value, updateBySocial)
watch(() => ig.value, updateBySocial)
</script>
