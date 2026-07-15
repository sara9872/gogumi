<!-- 파일: src/components/layout/Header.vue -->
<template>
  <!-- 상단 네비게이션: router-link 사용 -->
  <header class="site-header">
    <div class="container">
      <h1 class="logo">GoGumi</h1>
      <nav>
        <ul class="nav-list">
          <li><router-link to="/">홈</router-link></li>
          <li><router-link to="/tourist-attractions">관광지</router-link></li>
          <li><router-link to="/festivals">축제</router-link></li>
          <li><router-link to="/restaurants">음식점</router-link></li>
          <li><router-link to="/board">커뮤니티</router-link></li>
          <li><router-link to="/chatbot">챗봇</router-link></li>
          <li><router-link to="/about">About</router-link></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
// 한국어 주석: router-link는 SPA 내비게이션을 위해 사용합니다.
</script>

<style scoped>
.site-header {
  background: #0d6efd;
  color: white;
  padding: 12px 16px;
}
.nav-list {
  list-style: none;
  display: inline-flex;
  gap: 12px;
  margin: 0;
  padding: 0;
}
a { color: inherit; text-decoration: none; }
</style>