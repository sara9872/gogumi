<template>
  <div>
    <h2>글 쓰기</h2>
    <form @submit.prevent="onSubmit">
      <div>
        <label>제목</label>
        <input v-model="title" required />
      </div>
      <div>
        <label>내용</label>
        <textarea v-model="content" rows="8" required></textarea>
      </div>
      <div>
        <label>비밀번호</label>
        <input v-model="password" type="password" required />
      </div>
      <div>
        <label>비밀번호 확인</label>
        <input v-model="password2" type="password" required />
      </div>
      <button type="submit">저장</button>
      <router-link to="/board">취소</router-link>
    </form>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useBoard } from '@/composables/useBoard';

const router = useRouter();
const board = useBoard();

const title = ref('');
const content = ref('');
const password = ref('');
const password2 = ref('');
const error = ref('');

async function onSubmit() {
  error.value = '';
  if (password.value !== password2.value) {
    error.value = '비밀번호가 일치하지 않습니다.';
    return;
  }
  try {
    await board.createPost({ title: title.value, content: content.value, password: password.value });
    router.push('/board');
  } catch (e) {
    error.value = e.message || '저장 실패';
  }
}
</script>