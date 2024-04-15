<template>
  <CommonModal
    v-if="showModal"
    :header="isSuccessRegister ? 'ลงทะเบียนสำเร็จ!' : 'ลงทะเบียนไม่สำเร็จ!'"
    :content="
      isSuccessRegister ? 'คุณได้ทำการลงทะเบียนสำเร็จเรียบร้อยแล้ว' : 'ขออภัย, โปรดลองอีกครั้ง'
    "
    :buttonText="isSuccessRegister ? 'เข้าสู่ระบบ' : 'ลองอีกครั้ง'"
    :isSuccess="isSuccessRegister"
    :to="isSuccessRegister ? '/login/' : '/signup/'"
    @btn-action="closeModal"
  />
  <div class="tw-hero tw-min-h-screen lg:tw-bg-base-200">
    <div
      class="tw-card tw-flex-shrink-0 sm:tw-max-w-xl tw-max-w-sm lg:tw-shadow-2xl tw-bg-base-100 mt-4 mb-4"
      style="width: 1500px"
    >
      <div class="tw-card-body">
        <div class="text-center">
          <v-img
            :width="150"
            aspect-ratio="1/1"
            :src="imageSrc"
            class="mx-auto"
          ></v-img>
          <p class="tw-mb-5">ระบบจัดการแชตลูกค้า<br />สำหรับร้านค้าใน Social Media</p>
          <h5 class="tw-text-3xl font-weight-bold tw-mb-4">สร้างบัญชี ASAP สำหรับเจ้าของธุรกิจ</h5>
          <p class="text-secondary-lighten">
            ในกรณีที่ท่านไม่ใช่เจ้าของธุรกิจ โปรดติดต่อเจ้าของร้าน เพื่อให้ invite เข้าร่วมทีม
          </p>
        </div>
        <v-form v-model="isFormValid">
          <div class="form-control tw-mt-2">
            <CommonTextField
              :rules="[required, checkEmail]"
              v-model="userInfo.email"
              id="email"
              name="email"
              type="email"
              label="อีเมล"
              :error="dupEmail"
            />
            <p
              class="mb-3 text-error tw-text-sm mt-n3"
              v-if="dupEmail"
            >
              ที่อยู่อีเมลนี้มีในระบบแล้ว
            </p>
          </div>
          <div class="form-control tw-mt-2">
            <CommonTextField
              :rules="[required, englishNumberSpecial, passwordLengthMin, passwordLengthMax]"
              v-model="userInfo.password"
              id="password"
              name="password"
              label="รหัสผ่าน"
              @click:append-inner="visible = !visible"
              :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
              :type="visible ? 'text' : 'password'"
              counter
            />
          </div>
          <div class="form-control tw-mt-2">
            <CommonTextField
              :rules="[required, confirmPassword(userInfo.confirmPassword, userInfo.password)]"
              v-model="userInfo.confirmPassword"
              id="confirm-password"
              name="confirm-password"
              label="ยืนยันรหัสผ่าน"
              @click:append-inner="confirmVisible = !confirmVisible"
              :append-inner-icon="confirmVisible ? 'mdi-eye' : 'mdi-eye-off'"
              :type="confirmVisible ? 'text' : 'password'"
            />
          </div>
          <div class="form-control tw-mt-2">
            <CommonTextField
              :rules="[required]"
              v-model="userInfo.displayName"
              id="displayName"
              name="displayName"
              type="displayName"
              label="ชื่อผู้ใช้"
              :error="dupName"
            />
            <p
              class="mb-3 text-error tw-text-sm mt-n3"
              v-if="dupName"
            >
              ขื่อผู้ใช้นี้มีในระบบแล้ว
            </p>
          </div>
        </v-form>
        <!-- Biz question -->
        <div v-if="!!userInfo?.isOwner">
          <div class="form-control tw-mb-3">
            <CommonTextField
              :rules="[required]"
              v-model="userInfo.shop!.name"
              id="bizName"
              name="bizName"
              type="text"
              label="ชื่อธุรกิจ"
              maxlength="100"
              counter
              :error="dupShopName"
            />
            <p
              class="mb-3 text-error tw-text-sm mt-n3"
              v-if="dupShopName"
            >
              ขื่อร้านค้านี้มีในระบบแล้ว
            </p>
          </div>
          <div class="form-control tw-mb-3">
            <v-autocomplete
              class="text-select"
              label="ประเภทธุรกิจ"
              id="bizCategory"
              density="compact"
              variant="outlined"
              color="primary"
              :rules="[required]"
              :items="categories"
              v-model="userInfo.shop!.category"
            ></v-autocomplete>
          </div>
          <div class="form-controls tw-mb-3">
            <v-textarea
              label="รายละเอียด (ไม่จำเป็น)"
              placeholder="เช่น ร้านขายเสื้อผ้า, ร้านเสริมสวย"
              v-model="userInfo.shop!.detail"
              maxlength="300"
              density="compact"
              variant="outlined"
              color="primary"
              counter
              auto-grow
              rows="1"
            ></v-textarea>
          </div>
          <v-form v-model="isSocialValid">
            <div class="form-control tw-mt-5">
              <p>
                ช่องทาง social media
                <span class="text-error">อย่างน้อย 1 ช่องทาง</span>
              </p>
              <v-checkbox
                v-model="selectedSocial"
                label="Facebook"
                value="facebook"
                color="primary"
                hide-details
              ></v-checkbox>
              <CommonTextField
                v-if="selectedSocial.find((value) => value === 'facebook')"
                :rules="selectedSocial.includes('facebook') ? [required, facebookLink] : []"
                v-model="userInfo.shop!.social!.facebook"
                label="Facebook Page Link"
              />
              <v-checkbox
                v-model="selectedSocial"
                label="Instagram"
                value="instagram"
                color="primary"
                hide-details
              ></v-checkbox>
              <CommonTextField
                v-if="selectedSocial.find((value) => value === 'instagram')"
                :rules="selectedSocial.includes('instagram') ? [required, instagramLink] : []"
                v-model="userInfo.shop!.social!.instagram"
                label="Instagram Page Link"
              />
              <v-checkbox
                v-model="selectedSocial"
                label="Line"
                value="line"
                color="primary"
                hide-details
              ></v-checkbox>
              <CommonTextField
                v-if="selectedSocial.find((value) => value === 'line')"
                :rules="selectedSocial.includes('line') ? [required] : []"
                v-model="userInfo.shop!.social!.line"
                label="ID Line Official Account"
                data-test="idLine"
              />
            </div>
          </v-form>
        </div>
        <div class="form-control tw-my-2">
          <CommonButton
            text="สร้างบัญชีผู้ใช้งาน"
            block
            size="large"
            color="primary"
            :disabled="isButtonDisabled"
            :loading="loading"
            @click="register(userInfo)"
          />
        </div>
        <p class="tw-text-[#6F7580]">
          มีบัญชีอยู่แล้ว?
          <NuxtLink to="/login/">
            <a class="text-primary text-decoration-underline"> เข้าสู่ระบบ</a>
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { businessCategories } from '~/data/businessCategories.data'
import type UserSignup from '~/interfaces/auth.interface'
import imageSrc from '~/assets/images/logo.png'

useHead({
  title: 'Welcome to ASAP',
})

definePageMeta({
  layout: false,
})
const {
  checkEmail,
  required,
  passwordLengthMin,
  passwordLengthMax,
  confirmPassword,
  facebookLink,
  instagramLink,
  englishNumberSpecial,
} = useFormRules()

const userInfo = ref<UserSignup>({
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
  isOwner: true,
  shop: {
    name: '',
    category: '',
    detail: '',
    social: {
      facebook: '',
      instagram: '',
      line: '',
    },
  },
})

const isFormValid = ref(false)
const isSocialValid = ref(false)
const selectedSocial = ref<string[]>([])

const showModal = ref(false)
const isSuccessRegister = ref()
const loading = ref(false)
const dupName = ref(false)
const dupEmail = ref(false)
const dupShopName = ref(false)

const categories = JSON.parse(JSON.stringify(businessCategories))

const isShopInfoValid = computed(() => {
  const shop = userInfo.value?.shop
  return !!shop?.name && !!shop?.category
})

const isButtonDisabled = computed(() => {
  return (
    !isFormValid.value ||
    selectedSocial.value.length === 0 ||
    !isShopInfoValid.value ||
    !isSocialValid.value
  )
})

const visible = ref(false)
const confirmVisible = ref(false)

const register = async (user: UserSignup) => {
  loading.value = true
  try {
    const response = await useFetch(`${import.meta.env.VITE_BASE_URL}/register`, {
      method: 'post',
      body: JSON.stringify({
        email: user.email.trim(),
        password: user.confirmPassword,
        displayName: user.displayName.trim(),
        isOwner: user.isOwner,
        shop: user.shop,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.status.value === 'success') {
      loading.value = false
      isSuccessRegister.value = true
      showModal.value = true
      window.scrollTo(0, document.body.offsetHeight)
    } else {
      loading.value = false
      const dup = await response.error
      if (dup.value?.data.data.keyValue.displayName) {
        dupName.value = true
      } else if (dup.value?.data.data.keyValue.shopName) {
        dupShopName.value = true
      } else if (dup.value?.data.data.keyValue.email) {
        dupEmail.value = true
      } else {
        isSuccessRegister.value = false
        showModal.value = true
        console.log('🍪🥛 ~ register ~ dup:', dup.value?.data.data.keyValue)
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const closeModal = () => {
  showModal.value = false
}

watch(
  () => userInfo.value.email,
  (newValue) => {
    dupEmail.value = false
  }
)
watch(
  () => userInfo.value.displayName,
  (newValue) => {
    dupName.value = false
  }
)
watch(
  () => userInfo.value.shop?.name,
  (newValue) => {
    dupShopName.value = false
  }
)
</script>
