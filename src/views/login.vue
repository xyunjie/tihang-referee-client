<template>
    <a-layout class="login-layout">
      <a-layout-content class="login-content">
        <div class="login-form-container">
          <a-card title="登录" :bordered="false">
            <a-form
              :model="loginForm"
              :rules="rules"
              @finish="onLogin"
            >
              <a-form-item label="用户名" name="username">
                <a-input v-model:value="loginForm.username" placeholder="请输入用户名" />
              </a-form-item>
              <a-form-item label="密码" name="password">
                <a-input-password v-model:value="loginForm.password" placeholder="请输入密码" />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" html-type="submit" block>登录</a-button>
              </a-form-item>
            </a-form>
          </a-card>
        </div>
      </a-layout-content>
    </a-layout>
  </template>
  
  <script lang="ts">
  import { defineComponent, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { Form, Input, Button, Layout, Card } from 'ant-design-vue';
  
  export default defineComponent({
    name: 'Login',
    components: {
      'a-form': Form,
      'a-input': Input,
      'a-input-password': Input.Password,
      'a-button': Button,
      'a-layout': Layout,
      'a-layout-content': Layout.Content,
      'a-card': Card,
    },
    setup() {
      const router = useRouter();
  
      const loginForm = reactive({
        username: '',
        password: '',
      });
  
      const rules = {
        username: [{ required: true, message: '请输入用户名' }],
        password: [{ required: true, message: '请输入密码' }],
      };
  
      const onLogin = () => {
        // 模拟登录成功
        if (loginForm.username && loginForm.password) {
          router.push('/home');  // 登录成功后跳转到首页
        } else {
          console.log('请输入正确的用户名和密码');
        }
      };
  
      return {
        loginForm,
        rules,
        onLogin,
      };
    },
  });
  </script>
  
  <style scoped>
  .login-layout {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f2f5;
  }
  
  .login-content {
    width: 400px;
    padding: 20px;
  }
  
  .login-form-container {
    max-width: 100%;
  }
  </style>
  