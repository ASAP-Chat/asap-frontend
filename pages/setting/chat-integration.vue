<template>
  <CommonModal
    v-if="deleteModal"
    :header="isSuccessDelete ? 'ยกเลิกการเชื่อมต่อสำเร็จ!' : 'ยกเลิกการเชื่อมต่อไม่สำเร็จ!'"
    :content="isSuccessDelete ? 'การเชื่อมต่อได้ถูกยกเลิกเรียบร้อยแล้ว' : 'ขออภัย, โปรดลองอีกครั้ง'"
    buttonText="ปิด"
    :isSuccess="isSuccessDelete"
    @btn-action="closeModal"
  />
  <CommonModal
    v-if="createModalFacebook"
    :header="fbStatus ? 'คุณเชื่อมต่อ Facebook สำเร็จ!' : 'คุณเชื่อมต่อ Facebook ไม่สำเร็จ!'"
    :content="fbStatus ? 'การเชื่อมต่อเรียบร้อยแล้ว' : 'ขออภัย, กรุณาตรวจสอบข้อมูลและลองอีกครั้ง'"
    :buttonText="fbStatus ? 'ปิด' : 'ลองอีกครั้ง'"
    :isSuccess="fbStatus"
    @btn-action="closeModal"
  />
  <div class="mt-2">
    <span class="bg-primary text-white tw-px-3.5 tw-py-1.5 tw-rounded-lg">
      {{ socialInfo?.data?.length ? socialInfo?.data?.length : 0 }}/3 &nbsp;ช่องทาง
    </span>
  </div>
  <div class="mt-12 mx-auto">
    <div class="bg-white tw-rounded-3xl tw-px-8 tw-py-4">
      <v-table
        v-if="socialInfo && socialInfo.data && socialInfo.data.length > 0"
        fixed-header
      >
        <thead>
          <tr class="tw-text-lg text-left tw-text-[#464646]">
            <th class="font-weight-bold tw-w-96">ชื่อช่องทาง</th>
            <th class="text-left font-weight-bold tw-w-64">สถานะ</th>
            <th class="tw-w-64"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="tw-text-sm"
            v-if="socialInfo && socialInfo.data"
            v-for="item in socialInfo.data"
            :key="item.name"
          >
            <td>
              <v-icon
                class="mr-3 mb-1"
                size="x-large"
              >
                {{ generateSocialIcon(item?.socialType) }}
              </v-icon>
              {{ item?.profile?.displayName }}
            </td>
            <td
              class="text-left tw-flex tw-items-center tw-justify-start"
              :class="item?.status?.isAvailable ? 'text-success' : 'text-warning'"
            >
              <div>
                <v-tooltip
                  v-if="!item?.status?.isAvailable"
                  activator="parent"
                  location="top"
                  >โปรดยกเลิกการเชื่อมต่อ และเชื่อมต่อใหม่ด้วยข้อมูลที่ถูกต้อง
                </v-tooltip>
                <div class="tw-flex tw-items-center tw-justify-center">
                  <v-icon
                    :color="item?.status?.isAvailable ? 'success' : 'warning'"
                    class="mr-1"
                  >
                    {{ item?.status?.isAvailable ? 'mdi-check-circle' : 'mdi-close' }}
                  </v-icon>
                  <span :class="{ 'font-weight-bold': item?.status?.isAvailable }">{{
                    item?.status?.isAvailable ? 'พร้อมใช้งาน' : 'ไม่พร้อมใช้งาน'
                  }}</span>
                </div>
              </div>
            </td>
            <td class="text-center">
              <v-btn
                variant="flat"
                color="error-lighten"
                rounded="lg"
                @click=";(confirmDeleteModal = true), (cancelItemId = item?._id)"
                >ยกเลิกการเชื่อมต่อ</v-btn
              >
              <CommonConfirmModal
                v-if="cancelItemId === item?._id"
                v-model="confirmDeleteModal"
                :header="`คุณต้องการยกเลิกการเชื่อมต่อ ${item.socialType} ใช่หรือไม่ !`"
                :content="`หากยืนยัน, การเชื่อมต่อจะถูกยกเลิกและข้อความจาก ${item.socialType} จะไม่แสดงบน ASAP <br/>คุณจะต้องทำการเชื่อมต่อใหม่เมื่อต้องการใช้บริการอีกครั้ง`"
                buttonText="ปิด"
                cancelWording="ยกเลิก"
                confirmWording="ยืนยัน"
                :isSuccess="false"
                @btn-action="closeModal"
                @confirm-action="cancelSocialAccount(item._id)"
              />
            </td>
          </tr>
        </tbody>
      </v-table>

      <div class="tw-text-center">
        <v-btn
          variant="flat"
          class="tw-mx-auto mt-4"
          color="success"
          rounded="lg"
          prepend-icon="mdi-plus"
          @click="connectDialog = true"
        >
          <template v-slot:prepend>
            <v-icon color="white"></v-icon>
          </template>
          เพิ่มการเชื่อมต่อ</v-btn
        >
      </div>
    </div>
    <div>
      <v-row justify="center">
        <v-dialog
          v-model="connectDialog"
          width="auto"
          persistent
        >
          <v-card
            :width="400"
            class="text-center pt-3"
          >
            <v-card-text>
              <v-btn
                class="tw-absolute tw-top-2.5 tw-right-2.5"
                @click="connectDialog = false"
                variant="text"
              >
                <v-icon
                  icon="mdi-close"
                  color="secondary-lighten"
                ></v-icon>
              </v-btn>
              <div class="text-center mx-auto">
                <h3 class="tw-text-xl">เลือกช่องทาง</h3>
                <p class="tw-text-sm tw-opacity-60">เลือกช่องทางที่ต้องการเชื่อมต่อ</p>
              </div>
              <v-table
                fixed-header
                class="tw-bg-white pt-4"
              >
                <tbody>
                  <tr
                    class="tw-text-sm"
                    v-for="item in socialList"
                  >
                    <td class="font-weight-bold text-left">
                      <v-icon
                        class="mr-3 mb-1"
                        size="x-large"
                        :style="{
                          background:
                            item.socialType === SocialType.INSTAGRAM
                              ? 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)'
                              : 'none',
                          '-webkit-text-fill-color':
                            item.socialType === SocialType.INSTAGRAM ? 'transparent' : 'inherit',
                          'background-clip':
                            item.socialType === SocialType.INSTAGRAM ? 'text' : 'initial',
                        }"
                      >
                        {{ generateSocialIcon(item.socialType) }}
                      </v-icon>
                      {{ item.name }}
                    </td>

                    <td class="text-center">
                      <v-icon
                        v-if="socialInfo?.data?.some((data: any) => data.socialType === item.socialType)"
                        color="success"
                      >
                        mdi-check
                      </v-icon>
                      <v-btn
                        v-else
                        variant="outlined"
                        color="primary"
                        class="font-weight-bold"
                        @click=";(connectSocialDialog = true), (selectSocial = item.socialType)"
                      >
                        {{ 'เชื่อมต่อ' }}
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="connectSocialDialog"
          width="auto"
          persistent
        >
          <component
            :is="getSocialConnectModalComponent(selectSocial)"
            @back="connectSocialDialog = false"
            @created-success=";(connectSocialDialog = false), (connectDialog = false)"
          />
        </v-dialog>
      </v-row>
    </div>
  </div>
  <div class="text-center mt-4"></div>
</template>
<script setup lang="ts">
import SettingLineConnectModal from '~/components/setting/LineConnectModal.vue'
import SettingFbConnectModal from '~/components/setting/FbConnectModal.vue'
import SettingIgConnectModal from '~/components/setting/IgConnectModal.vue'
import { SocialType } from '~/interfaces/social.interface'
import { ACCESS_TOKEN } from '~/constants/Token'
import { getSocialAccount } from '~/services/message.service'

useHead({
  title: 'การตั้งค่า',
})
definePageMeta({
  layout: 'setting',
})

const route = useRoute()
const router = useRouter()

const connectDialog = ref(false)
const connectSocialDialog = ref(false)
const deleteModal = ref(false)
const isSuccessDelete = ref()
const confirmDeleteModal = ref(false)
const cancelItemId = ref()

const closeModal = () => {
  deleteModal.value = false
  confirmDeleteModal.value = false
  createModalFacebook.value = false
}

const selectSocial = ref('')

const socialList = [
  {
    name: 'LINE Official Account',
    socialType: SocialType.LINE,
  },
  {
    name: 'Facebook Page',
    socialType: SocialType.FACEBOOK,
  },
  {
    name: 'Instagram',
    socialType: SocialType.INSTAGRAM,
  },
]
const { socialInfo } = await getSocialAccount()
const access_token = useCookie(ACCESS_TOKEN)

const storeSelectCus = useCookie('storeSelectCus')

const cancelSocialAccount = async (id: string) => {
  try {
    const response = await useFetch(`${import.meta.env.VITE_BASE_URL}/social-account/${id}`, {
      method: 'delete',
      headers: {
        Authorization: 'Bearer ' + access_token.value,
      },
    })

    if (response.status.value === 'success') {
      socialInfo.value.data = socialInfo.value.data.filter((social: any) => social._id !== id)
      isSuccessDelete.value = true
      deleteModal.value = true
      storeSelectCus.value = null
    } else {
      console.log('call - refresh token')
      isSuccessDelete.value = false
      deleteModal.value = true
      await useRefreshToken()
    }
  } catch (error: any) {
    console.log(error)
  }
}

const getSocialConnectModalComponent = (socialType: string) => {
  switch (socialType) {
    case SocialType.LINE:
      return SettingLineConnectModal
    case SocialType.FACEBOOK:
      return SettingFbConnectModal
    case SocialType.INSTAGRAM:
      return SettingIgConnectModal
    default:
      return null
  }
}
const createModalFacebook = ref(false)
const fbStatus = ref()

onBeforeMount(async () => {
  await getSocialAccount()

  if (route.query.state === 'integrate-facebook') {
    const code = route.query.code as string
    const facebookResponse: any = await createFacebook(code)
    if (facebookResponse?.status?.isAvailable && facebookResponse?.status?.isInitialized) {
      fbStatus.value = true
      await router.replace({
        query: {},
      })
    } else {
      fbStatus.value = false
    }
    createModalFacebook.value = await true
  }
})
</script>
