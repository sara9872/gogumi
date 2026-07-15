import { ref, watch } from 'vue';

const STORAGE_KEY = 'anon_board_posts_v1';

function hex(buffer) {
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password) {
  const enc = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', enc);
  return hex(digest);
}

function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

const posts = ref(loadPosts());
watch(posts, () => savePosts(posts.value), { deep: true });

export function useBoard() {
  async function createPost({ title, content, password }) {
    const passwordHash = await hashPassword(password);
    const post = {
      id: Date.now().toString() + Math.floor(Math.random() * 1000),
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      passwordHash
    };
    posts.value.unshift(post);
    return post;
  }

  function getAll() {
    return posts.value;
  }

  function findById(id) {
    return posts.value.find(p => p.id === id) || null;
  }

  async function verifyPassword(post, password) {
    if (!post) return false;
    const hash = await hashPassword(password);
    return hash === post.passwordHash;
  }

  async function updatePost(id, { title, content }, password) {
    const post = findById(id);
    if (!post) throw new Error('게시글을 찾을 수 없습니다.');
    const ok = await verifyPassword(post, password);
    if (!ok) throw new Error('비밀번호가 일치하지 않습니다.');
    post.title = title;
    post.content = content;
    post.updatedAt = new Date().toISOString();
    // reactive 객체 already updated
    return post;
  }

  async function deletePost(id, password) {
    const post = findById(id);
    if (!post) throw new Error('게시글을 찾을 수 없습니다.');
    const ok = await verifyPassword(post, password);
    if (!ok) throw new Error('비밀번호가 일치하지 않습니다.');
    posts.value = posts.value.filter(p => p.id !== id);
    return true;
  }

  return {
    posts,
    createPost,
    getAll,
    findById,
    updatePost,
    deletePost,
    verifyPassword
  };
}