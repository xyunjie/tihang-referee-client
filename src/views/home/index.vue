<template>
    <a-layout class="home-layout">
      <a-layout-header>
        <div class="logo">欢迎来到首页</div>
      </a-layout-header>
      <a-layout-content style="padding: 24px">
        <div class="content">
          <h2>首页内容</h2>
        </div>
      </a-layout-content>
    </a-layout>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { Layout } from 'ant-design-vue';
  
  export default defineComponent({
    name: 'Home',
    components: {
      'a-layout': Layout,
      'a-layout-header': Layout.Header,
      'a-layout-content': Layout.Content,
    },
  });
  </script>
  
  <style scoped>
  
  .home-layout .logo {
    color: #fff;
    font-size: 20px;
    text-align: center;
    line-height: 64px;
    background-color: #001529;
  }
  </style>
  