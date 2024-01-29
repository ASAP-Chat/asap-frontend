<template>
  <div class="tw-leading-normal tw-tracking-normal tw-text-white gradient">
    <LayoutNav />
    <div data-aos="fade-up" class="tw-pt-24">
      <div class="tw-container tw-px-3 tw-mx-auto tw-flex tw-flex-wrap tw-flex-col md:tw-flex-row tw-items-center">
        <div
          class="tw-flex tw-flex-col tw-w-full md:tw-w-2/5 tw-justify-center tw-items-start tw-text-center md:tw-text-left">
          <p class="tw-uppercase tw-tracking-loose tw-w-full">SSA3</p>
          <h1 class="tw-my-4 tw-text-5xl tw-font-bold tw-leading-tight">
            Customer Chat Management System for Social Media Stores
          </h1>
          <p class="tw-leading-normal tw-text-2xl tw-mb-8">
            ASAP CHAT
          </p>
          <button
            class="tw-mx-auto lg:tw-mx-0 tw-hover:tw-underline tw-bg-white tw-text-gray-800 tw-font-bold tw-rounded-full tw-my-6 tw-py-4 tw-px-8 tw-shadow-lg tw-focus:outline-none tw-focus:shadow-outline tw-transform tw-transition tw-hover:tw-scale-105 tw-duration-300 tw-ease-in-out">
            สมัครใช้งาน
          </button>
        </div>
        <div class="tw-w-full md:tw-w-3/5 tw-py-6 tw-text-center">
          <img class="tw-w-full md:tw-w-3/5 tw-z-50" :src="heroSrc" />
        </div>
      </div>
    </div>
    <div class="tw-relative -tw-mt-8 lg:tw-mt-8">
      <svg viewBox="0 0 1428 174" version="1.1" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g transform="translate(-2.000000, 44.000000)" fill="#FFFFFF" fill-rule="nonzero">
            <path
              d="M0,0 C90.7283404,0.927527913 147.912752,27.187927 291.910178,59.9119003 C387.908462,81.7278826 543.605069,89.334785 759,82.7326078 C469.336065,156.254352 216.336065,153.6679 0,74.9732496"
              opacity="0.100000001"></path>
            <path
              d="M100,104.708498 C277.413333,72.2345949 426.147877,52.5246657 546.203633,45.5787101 C666.259389,38.6327546 810.524845,41.7979068 979,55.0741668 C931.069965,56.122511 810.303266,74.8455141 616.699903,111.243176 C423.096539,147.640838 250.863238,145.462612 100,104.708498 Z"
              opacity="0.100000001"></path>
            <path
              d="M1046,51.6521276 C1130.83045,29.328812 1279.08318,17.607883 1439,40.1656806 L1439,120 C1271.17211,77.9435312 1140.17211,55.1609071 1046,51.6521276 Z"
              id="Path-4" opacity="0.200000003"></path>
          </g>
          <g transform="translate(-4.000000, 76.000000)" fill="#FFFFFF" fill-rule="nonzero">
            <path
              d="M0.457,34.035 C57.086,53.198 98.208,65.809 123.822,71.865 C181.454,85.495 234.295,90.29 272.033,93.459 C311.355,96.759 396.635,95.801 461.025,91.663 C486.76,90.01 518.727,86.372 556.926,80.752 C595.747,74.596 622.372,70.008 636.799,66.991 C663.913,61.324 712.501,49.503 727.605,46.128 C780.47,34.317 818.839,22.532 856.324,15.904 C922.689,4.169 955.676,2.522 1011.185,0.432 C1060.705,1.477 1097.39,3.129 1121.236,5.387 C1161.703,9.219 1208.621,17.821 1235.4,22.304 C1285.855,30.748 1354.351,47.432 1440.886,72.354 L1441.191,104.352 L1.121,104.031 L0.457,34.035 Z">
            </path>
          </g>
        </g>
      </svg>
    </div>
    <section id="chat" class="tw-bg-white tw-border-b tw-py-14">
      <div class="container tw-max-w-5xl tw-mx-auto tw-m-8">
        <h2 data-aos="fade-up"
          class="tw-w-full tw-my-2 tw-text-5xl tw-font-bold tw-leading-tight tw-text-center tw-text-gray-800">
          แชท
        </h2>
        <div data-aos="fade-up" class="tw-w-full tw-mb-4">
          <div class="tw-h-1 tw-mx-auto tw-bg-primary tw-w-64 tw-opacity-25 tw-my-0 tw-py-0 tw-rounded-t">
          </div>
        </div>
        <div data-aos="fade-up-right" class="tw-flex">
          <div class="tw-w-5/6 tw-sm:w-1/2 tw-p-6 tw-flex tw-justify-center tw-items-center">
            <div class="tw-text-[20px] tw-text-gray-800 tw-mb-2 tw-leading-6">
              จัดการแชทผ่านเว็บไซต์ LINE OA, Facebook messenger และ Instagram
              ในที่เดียว <br /> 
              รองรับแอดมินที่ทำงานเป็นทีม ปลอดภัยไม่ต้องใช้บัญชีส่วนตัว
            </div>
            <!-- <p class="tw-text-gray-600 tw-mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              at ipsum eu nunc commodo posuere et sit amet ligula.
              <br />
              <br />
            </p> -->
          </div>
          <div class="tw-w-full tw-sm:w-1/2 tw-p-6 tw-flex tw-justify-center tw-items-center">
            <img src="../assets/images/chat.svg" alt="chat" class="tw-w-full tw-rounded-lg tw-drop-shadow-xl tw-shadow-md">
          </div>

        </div>
      </div>
    </section>
    <section id="chatbot" class="tw-bg-white tw-border-b tw-py-16">
      <div class="container tw-max-w-5xl tw-mx-auto m-8">
        <h2 data-aos="fade-up"
          class="tw-w-full tw-my-2 tw-text-5xl tw-font-bold tw-leading-tight tw-text-center tw-text-gray-800">
          แชทบอท
        </h2>
        <div data-aos="fade-up" class="tw-w-full tw-mb-4">
          <div class="tw-h-1 tw-mx-auto tw-bg-primary tw-w-64 tw-opacity-25 tw-my-0 tw-py-0 tw-rounded-t">
          </div>
        </div>
        <div data-aos="fade-up-left" class="tw-flex">
          <div class="tw-w-full tw-sm:w-1/2 tw-p-6 tw-flex tw-justify-center tw-items-center">
            <img src="../assets/images/chatbot.svg" alt="chat" class="tw-w-full tw-rounded-lg tw-drop-shadow-xl tw-shadow-md">
          </div>
          <div class="tw-w-5/6 tw-sm:w-1/2 tw-p-6 tw-flex tw-flex-col tw-justify-center tw-items-center">
            <div class="tw-text-[20px] tw-text-gray-800 tw-mb-2 tw-leading-6">
              ตอบด้วยแชทบอท ตลอด 24 ชั่วโมง สร้างได้เองง่าย ๆ แอดมินทำงานสลับไปมากับบอทได้ตลอดเวลา แก้บอทที่เดียวใช้ได้ทุกช่องทาง
            </div>
            <!-- <p class="tw-text-gray-600 tw-mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              at ipsum eu nunc commodo posuere et sit amet ligula.
              <br />
              <br />
            </p> -->
          </div>
        </div>
      </div>
    </section>
    <section id="chattemplate" class="tw-bg-white tw-border-b tw-py-16">
      <div class="container tw-max-w-5xl tw-mx-auto m-8">
        <h2 data-aos="fade-up"
          class="tw-w-full tw-my-2 tw-text-5xl tw-font-bold tw-leading-tight tw-text-center tw-text-gray-800">
          แชทเทมเพลต
        </h2>
        <div data-aos="fade-up" class="tw-w-full tw-mb-4">
          <div class="tw-h-1 tw-mx-auto tw-bg-primary tw-w-64 tw-opacity-25 tw-my-0 tw-py-0 tw-rounded-t">
          </div>
        </div>
        <div data-aos="fade-up-right" class="tw-flex">
          <div class="tw-w-5/6 tw-sm:w-1/2 tw-p-6 tw-flex tw-justify-center tw-items-center tw-flex-col">
            <div class="tw-text-[20px] tw-text-gray-800 tw-mb-2 tw-leading-6 ">
              ผู้ใช้งานสามารถสร้างชุดข้อความ (Template message) เพื่อนำมาใช้เป็นชุดข้อความมาตรฐานสำหรับให้
              ผู้ใช้งานทุกคนเรียกใช้ชุดข้อความเดียวกันในการให้บริการตอบแชทที่เป็นมาตรฐานเดียวกันได้
            </div>
            <!-- <p class="tw-text-gray-600 tw-mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              at ipsum eu nunc commodo posuere et sit amet ligula.
              <br />
              <br />
            </p> -->
          </div>
          <div class="tw-w-full tw-sm:w-1/2 tw-p-6">
            <div class="tw-w-full tw-sm:w-1/2 tw-p-6 tw-flex tw-justify-center tw-items-center">
            <img src="../assets/images/chattemplate.svg" alt="chat" class="tw-w-full tw-rounded-lg tw-drop-shadow-xl tw-shadow-md">
          </div>
          </div>

        </div>
      </div>
    </section>
    <section id="teammanagement" class="tw-bg-white tw-border-b tw-py-16">
      <div class="container tw-max-w-5xl tw-mx-auto m-8">
        <h2 data-aos="fade-up"
          class="tw-w-full tw-my-2 tw-text-5xl tw-font-bold tw-leading-tight tw-text-center tw-text-gray-800">
          ระบบจัดการทีม
        </h2>
        <div data-aos="fade-up" class="tw-w-full tw-mb-4">
          <div class="tw-h-1 tw-mx-auto tw-bg-primary tw-w-64 tw-opacity-25 tw-my-0 tw-py-0 tw-rounded-t">
          </div>
        </div>
        <div data-aos="fade-up-left" class="tw-flex">
          <div class="tw-w-full tw-sm:w-1/2 tw-p-6">
            <div class="tw-w-full tw-sm:w-1/2 tw-p-6 tw-flex tw-justify-center tw-items-center">
            <img src="../assets/images/chat.svg" alt="chat" class="tw-w-full tw-rounded-lg tw-drop-shadow-xl tw-shadow-md">
          </div>
          </div>
          <div class="tw-w-5/6 tw-sm:w-1/2 tw-p-6 tw-flex tw-justify-center tw-items-center tw-flex-col">
            <div class="tw-text-[20px] tw-text-gray-800 tw-mb-2 tw-leading-6">
              จัดการแชทผ่านเว็บไซต์ LINE OA, Facebook messenger และ Instagram
              ในที่เดียว รองรับแอดมินที่ทำงานเป็นทีม ปลอดภัยไม่ต้องใช้บัญชีส่วนตัว
            </div>
            <!-- <p class="tw-text-gray-600 tw-mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              at ipsum eu nunc commodo posuere et sit amet ligula.
              <br />
              <br />
            </p> -->
          </div>
        </div>
      </div>
    </section>
    <svg data-aos="zoom-in-up" class="wave-top" viewBox="0 0 1439 147" version="1.1" xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-1.000000, -14.000000)" fill-rule="nonzero">
          <g class="wave" fill="#f8fafc">
            <path
              d="M1440,84 C1383.555,64.3 1342.555,51.3 1317,45 C1259.5,30.824 1206.707,25.526 1169,22 C1129.711,18.326 1044.426,18.475 980,22 C954.25,23.409 922.25,26.742 884,32 C845.122,37.787 818.455,42.121 804,45 C776.833,50.41 728.136,61.77 713,65 C660.023,76.309 621.544,87.729 584,94 C517.525,105.104 484.525,106.438 429,108 C379.49,106.484 342.823,104.484 319,102 C278.571,97.783 231.737,88.736 205,84 C154.629,75.076 86.296,57.743 0,32 L0,0 L1440,0 L1440,84 Z">
            </path>
          </g>
          <g transform="translate(1.000000, 15.000000)" fill="#FFFFFF">
            <g transform="translate(719.500000, 68.500000) rotate(-180.000000) translate(-719.500000, -68.500000) ">
              <path
                d="M0,0 C90.7283404,0.927527913 147.912752,27.187927 291.910178,59.9119003 C387.908462,81.7278826 543.605069,89.334785 759,82.7326078 C469.336065,156.254352 216.336065,153.6679 0,74.9732496"
                opacity="0.100000001"></path>
              <path
                d="M100,104.708498 C277.413333,72.2345949 426.147877,52.5246657 546.203633,45.5787101 C666.259389,38.6327546 810.524845,41.7979068 979,55.0741668 C931.069965,56.122511 810.303266,74.8455141 616.699903,111.243176 C423.096539,147.640838 250.863238,145.462612 100,104.708498 Z"
                opacity="0.100000001"></path>
              <path
                d="M1046,51.6521276 C1130.83045,29.328812 1279.08318,17.607883 1439,40.1656806 L1439,120 C1271.17211,77.9435312 1140.17211,55.1609071 1046,51.6521276 Z"
                opacity="0.200000003"></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
    <section id="contact" data-aos="zoom-in-up" class="tw-container tw-mx-auto tw-text-center tw-py-6 tw-mb-12">
      <h2 class="tw-w-full tw-my-2 tw-text-5xl tw-font-bold tw-leading-tight tw-text-center tw-text-white">
        Call to Action
      </h2>
      <div class="tw-w-full tw-mb-4">
        <div class="tw-h-1 tw-mx-auto tw-bg-primary tw-w-1/6 tw-opacity-25 tw-my-0 tw-py-0 tw-rounded-t"></div>
      </div>
      <h3 class="tw-my-4 tw-text-3xl tw-leading-tight">
        Main Hero Message to sell yourself!
      </h3>
      <button
        class="tw-mx-auto tw-lg:mx-0 tw-hover:underline tw-bg-white tw-text-gray-800 tw-font-bold tw-rounded-full tw-my-6 tw-py-4 tw-px-8 tw-shadow-lg tw-focus:outline-none tw-focus:shadow-outline tw-transform tw-transition tw-hover:scale-105 tw-duration-300 tw-ease-in-out">
        Action!
      </button>
    </section>
    <LayoutFooter />
  </div>
</template>


<script setup lang="ts">
import heroSrc from '~/assets/images/hero.png'

useHead({
  title: 'Welcome',
})
definePageMeta({
  layout: false,
})
</script>

<style>
.hero-img {
  animation: mymove infinite;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

@keyframes mymove {
  0% {
    margin-top: -0.5vw;
  }

  100% {
    margin-top: 1vw;
  }
}
</style>
