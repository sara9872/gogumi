<template>
  <div>
    <h1>익명 게시판</h1>
    <router-link to="/board/write">글쓰기</router-link>
    <ul>
      <li v-for="post in board.posts" :key="post.id">
        <router-link :to="`/board/${post.id}`">{{ post.title || '(제목 없음)' }}</router-link>
        <small> — {{ new Date(post.createdAt).toLocaleString() }}</small>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useBoard } from '@/composables/useBoard';
const board = useBoard();
</script>