<template>
  <SplashScreen v-if="showSplashScreen" />

  <div v-else>
    <div class="bg-gray-100 min-h-screen pb-10">
    <RouterView />
    </div>
  
    <van-tabbar v-if="showTabBar" v-model="active" active-color="#3c57b6">
      <van-tabbar-item icon="home-o" replace to="/">Home</van-tabbar-item>
      <van-tabbar-item icon="list-switch" replace to="/ticket-inspection"
        >Ticket Inspection</van-tabbar-item
      >
      
      <van-tabbar-item icon="contact-o" replace to="/profile"
        >Profile</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted} from "vue";
import { RouterView, useRoute } from "vue-router";
import SplashScreen from "./components/SplashScreen.vue";


const route = useRoute();
const showSplashScreen = ref(true);
const active = ref(0);
const showTabBar = computed(() => route.meta.showTabBar);

watch(
  () => route.path,
  (newPath) => {
    switch (newPath) {
      case "/":
        active.value = 0;
        break;
      case "/ticket-inspection":
        active.value = 1;
        break;
      case "/profile":
        active.value = 3;
        break;
      default:
        active.value = null;
    }
  }
);


onMounted(()=>{
  setTimeout(()=>{
    showSplashScreen.value = false;
  },1000);
}) ;
</script>

<style scoped></style>
