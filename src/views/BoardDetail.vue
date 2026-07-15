<template>
  <div v-if="post">
    <h2>{{ post.title }}</h2>
    <p>{{ post.content }}</p>
    <small>작성: {{ new Date(post.createdAt).toLocaleString() }}</small>
    <div style="margin-top:1rem">
      <router-link :to="`/board/${post.id}/edit`">수정</router-link>
      <button @click="onDelete">삭제</button>
      <router-link to="/board">목록으로</router-link>
    </div>
    <p v-if="msg" style="color:red">{{ msg }}</p>
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
const msg = ref('');

onMounted(() => {
  post.value = board.findById(route.params.id);
});

async function onDelete() {
  const pw = prompt('삭제를 위해 비밀번호를 입력하세요');
  if (pw === null) return;
  try {
    await board.deletePost(route.params.id, pw);
    router.push('/board');
  } catch (e) {
    msg.value = e.message || '삭제 실패';
  }
}
</script>