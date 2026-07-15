<!-- src/components/LocalBoard.vue -->
<template>
  <div class="board-container">
    <h2>GO! GUMI 익명 커뮤니티</h2>
    
    <!-- 글쓰기 폼 -->
    <div class="write-form" v-if="isWriting">
      <input v-model="newPost.title" placeholder="제목을 입력하세요" />
      <textarea v-model="newPost.content" placeholder="내용을 입력하세요"></textarea>
      <input type="password" v-model="newPost.password" placeholder="수정/삭제용 비밀번호 (4자리 이상)" />
      <button @click="savePost">등록</button>
      <button @click="isWriting = false">취소</button>
    </div>

    <!-- 게시글 목록 -->
    <div v-else>
      <button @click="isWriting = true">+ 글쓰기</button>
      <ul>
        <li v-for="post in posts" :key="post.id">
          <h3>{{ post.title }} <span style="font-size:12px; color:gray;">{{ post.date }}</span></h3>
          <p>{{ post.content }}</p>
          <div class="actions">
            <input type="password" v-model="post.inputPwd" placeholder="비밀번호 확인" />
            <button @click="deletePost(post)">삭제</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const posts = ref([])
const isWriting = ref(false)
const newPost = ref({ title: '', content: '', password: '' })

// 초기 로드
onMounted(() => {
  const saved = localStorage.getItem('gumi_posts')
  if (saved) posts.value = JSON.parse(saved)
})

const savePost = () => {
  if(newPost.value.password.length < 4) return alert("비밀번호를 4자리 이상 입력하세요.")
  
  const post = {
    id: Date.now(),
    title: newPost.value.title,
    content: newPost.value.content,
    password: newPost.value.password,
    date: new Date().toLocaleDateString(),
    inputPwd: ''
  }
  posts.value.unshift(post)
  localStorage.setItem('gumi_posts', JSON.stringify(posts.value))
  
  isWriting.value = false
  newPost.value = { title: '', content: '', password: '' }
}

const deletePost = (post) => {
  if (post.password !== post.inputPwd) {
    return alert("비밀번호가 일치하지 않습니다.")
  }
  posts.value = posts.value.filter(p => p.id !== post.id)
  localStorage.setItem('gumi_posts', JSON.stringify(posts.value))
  alert("삭제되었습니다.")
}
</script>