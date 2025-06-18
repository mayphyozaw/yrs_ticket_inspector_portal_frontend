<template>
  <van-nav-bar title="Profile" :fixed="true" />
  <div class="pt-[46px]"></div>

  <van-pull-refresh
    v-model="refreshing"
    pulling-text="Pull to refresh"
    loosing-text="Pull to refresh"
    loading-text="Loading"
    success-text="Successfully loaded"
    @refresh="onRefresh"
  >
   
    
    <div
      v-if="profile != null"
      class="bg-theme rounded-b-lg shadow-sm p-3 flex justify-start items-center"
    >
      <img
        src="@/assets/image/user.png"
        alt=""
        class="w-14 h-14 p-1 bg-gray-100 rounded-lg"
      />
      <div class="ml-3">
        <h6 class="text-sm text-white">{{ profile.name }}</h6>
        <p class="text-sm text-white">{{ profile.email }}</p>
       
      </div>
    </div>

    <div class="p-3">
      <van-cell-group inset class="mb-3 mx-0">

        <van-cell is-link to="/change-password">
          <template #title>
            <div class="flex items-center">
                <van-icon name="shield-o" class="text-lg mr-1"/>
                <span >Change Password</span>
            </div>
          </template>
        </van-cell>


      </van-cell-group>

      <div v-if="profile != null">
        <van-button
          type="default"
          plain
          block
          class="rounded-lg border-none"
          loading-text="Loading..."
          :loading="logoutBtnLoading"
          @click="onLogout"
          >Logout</van-button
        >
      </div>
    </div>
  </van-pull-refresh>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProfileStore } from "@/stores/profileStore";
import { useLogoutStore } from "@/stores/logoutStore";
import { showSuccessToast } from "vant";
import { showConfirmDialog } from "vant";

const route = useRoute();
const router = useRouter();
const profileStore = useProfileStore();
const logoutStore = useLogoutStore();

const profile = ref(null);
const refreshing = ref(false);
const logoutBtnLoading = ref(false);

const fetchProfile = async () => {
  await profileStore.get();
  profile.value = profileStore.getResponse?.data;
  refreshing.value = false;
};

const onLogout = async () => {
  logoutBtnLoading.value = true;

  showConfirmDialog({
    title: "Logout",
    message: "Are you sure, you want to logout?",
    cancelButtonText: "Cancel",
    confirmButtonText: "Confirm",
    confirmButtonColor: "#1CBC9B",
  })
    .then(async () => {
      await logoutStore.store();

      if (logoutStore.getErrorMessage == null) {
        ls.remove("__access-token");
        showSuccessToast(logoutStore.getResponse?.message);
        router.push("/");
      }
      logoutBtnLoading.value = false;
    })
    .catch(() => {
      logoutBtnLoading.value = false;
    });
};

const onRefresh = () => {
  fetchProfile();
};

onMounted(() => {
  fetchProfile();
});
</script>

<style scoped></style>
