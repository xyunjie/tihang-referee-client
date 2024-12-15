<template>
  <a-layout id="app" class="app-layout">
    <!-- 顶部导航栏 -->
    <a-layout-header class="header">
      <div class="logo">管理系统</div>
      <a-menu theme="dark" mode="horizontal" :default-selected-keys="['dashboard']">
        <a-menu-item key="dashboard">
          <router-link to="/dashboard">首页</router-link>
        </a-menu-item>
        <a-menu-item key="users">
          <router-link to="/users">用户管理</router-link>
        </a-menu-item>
        <a-menu-item key="settings">
          <router-link to="/settings">设置</router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-header>

    <a-layout>
      <!-- 侧边栏 -->
      <a-layout-sider width="200" class="sider">
        <a-menu
          theme="dark"
          mode="inline"
          :default-selected-keys="['dashboard']"
        >
          <a-menu-item key="dashboard">
            <router-link to="/dashboard">首页</router-link>
          </a-menu-item>
          <a-menu-item key="users">
            <router-link to="/users">用户管理</router-link>
          </a-menu-item>
          <a-menu-item key="settings">
            <router-link to="/settings">设置</router-link>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <!-- 主体内容区域 -->
      <a-layout-content class="content">
        <router-view></router-view>  <!-- 渲染路由视图 -->
      </a-layout-content>
    </a-layout>

    <!-- 页脚 -->
    <a-layout-footer class="footer">
      <div>© 2024 管理系统 | All Rights Reserved</div>
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
}

.header {
  background: #001529;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.sider {
  background: #001529;
}

.content {
  padding: 24px;
  background: #f0f2f5;
}

.footer {
  text-align: center;
  background: #001529;
  color: white;
  padding: 10px;
}

.ant-menu {
  background: #001529;
  border-bottom: none;
}

.ant-menu-item {
  color: white;
}

.ant-menu-item-selected {
  background-color: #1890ff !important;
}
</style>
