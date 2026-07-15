<template>
  <div v-if="post">
    <h2>게시글 수정</h2>
    <form @submit.prevent="onSave">
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
      <button type="submit">저장</button>
      <router-link :to="`/board/${post.id}`">취소</router-link>
    </form>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
  <div v-else>게시글을 찾을 수 없습니다.</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBoard } from '@/composables/useBoard';

const route = useRoute();
const router = useRouter();
const board = useBoard();

const post = ref(null);
const title = ref('');
const content = ref('');
const password = ref('');
const error = ref('');

onMounted(() => {
  const p = board.findById(route.params.id);
  if (p) {
    post.value = p;
    title.value = p.title;
    content.value = p.content;
  }
});

async function onSave() {
  error.value = '';
  try {
    await board.updatePost(route.params.id, { title: title.value, content: content.value }, password.value);
    router.push(`/board/${route.params.id}`);
  } catch (e) {
    error.value = e.message || '수정 실패';
  }
}
</script>