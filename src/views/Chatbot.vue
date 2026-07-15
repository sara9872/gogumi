<template>
  <div class="localhub-chatbot">
    <button v-if="!isOpen" class="launcher" type="button" aria-label="챗봇 열기" @click="isOpen = true">🤖</button>

    <section v-else class="panel" :class="{ expanded: isExpanded }" role="dialog" aria-label="LocalHub AI 챗봇">
      <header class="header">
        <div class="brand"><span class="avatar">🤖</span><div><strong>LocalHub AI</strong><small>구미·경북 여행 도우미</small></div></div>
        <div><button @click="isExpanded = !isExpanded">{{ isExpanded ? '↙' : '↗' }}</button><button @click="close">×</button></div>
      </header>

      <main ref="messageArea" class="messages">
        <div class="row assistant"><span class="mini-avatar">🤖</span><article class="bubble"><strong>안녕하세요! 👋</strong><p>구미·경북 지역 정보를 도와드리는 LocalHub AI입니다.<br>무엇을 도와드릴까요?</p></article></div>

        <section v-if="messages.length === 0" class="suggestions">
          <h3>✨ 추천 질문</h3>
          <button v-for="q in suggestions" :key="q.text" @click="submit(q.text)"><span>{{ q.icon }}</span>{{ q.text }}</button>
        </section>

        <div v-for="m in messages" :key="m.id" class="row" :class="m.role">
          <span v-if="m.role === 'assistant'" class="mini-avatar">🤖</span>
          <article class="bubble" :class="{ userBubble: m.role === 'user', errorBubble: m.error }">
            <p>{{ m.content }}</p>
            <div v-if="m.results?.length" class="results">
              <button v-for="item in m.results" :key="item.id" class="result" @click="goDetail(item)">
                <img :src="item.imageUrl" :alt="item.title" @error="onImgError">
                <span><small>{{ item.typeName }}</small><strong>{{ item.title }}</strong><em>{{ item.address }}</em><em v-if="item.dateText">{{ item.dateText }}</em></span>
              </button>
            </div>
            <time>{{ m.time }}</time>
          </article>
        </div>

        <div v-if="loading" class="row assistant"><span class="mini-avatar">🤖</span><article class="bubble"><p>관련 정보를 확인하고 있어요.</p><div class="dots"><i></i><i></i><i></i></div></article></div>
      </main>

      <footer class="footer">
        <form @submit.prevent="submit(input)"><input v-model="input" maxlength="300" placeholder="메시지를 입력하세요..." :disabled="loading"><button :disabled="loading || !input.trim()">➤</button></form>
        <p>AI가 생성한 답변은 참고용 정보입니다.</p>
      </footer>
    </section>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';
import { answerLocalHubQuestion } from '@/services/localHubChatbotService';

const router = useRouter();
const isOpen = ref(false), isExpanded = ref(false), loading = ref(false), input = ref('');
const messages = ref([]), messageArea = ref(null);
const suggestions = [
  { icon:'🏔️', text:'구미 관광지 추천해줘' },
  { icon:'🎉', text:'이번 달 축제 알려줘' },
  { icon:'🍴', text:'구미 맛집 알려줘' },
  { icon:'🏨', text:'금오산 근처 숙박 추천해줘' }
];

function close(){ isOpen.value=false; isExpanded.value=false; }
function message(role, content, extra={}) { const d=new Date(); return { id:`${role}-${Date.now()}-${Math.random()}`, role, content, time:d.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'}), ...extra }; }
async function submit(raw){ const q=raw.trim(); if(!q||loading.value)return; messages.value.push(message('user',q)); input.value=''; loading.value=true; await scroll(); try{ const a=await answerLocalHubQuestion(q); messages.value.push(message('assistant',a.text,{results:a.results,error:a.error})); }catch(e){ console.error(e); messages.value.push(message('assistant','일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',{error:true})); }finally{ loading.value=false; await scroll(); } }
async function scroll(){ await nextTick(); if(messageArea.value) messageArea.value.scrollTop=messageArea.value.scrollHeight; }
function goDetail(item){ router.push({name:'place-detail',params:{id:item.id},query:{type:item.typeId}}); }
function onImgError(e){ e.target.src='/images/default-place.png'; }
</script>

<style scoped>
.localhub-chatbot{position:fixed;right:24px;bottom:24px;z-index:9999;font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.launcher{width:64px;height:64px;border:5px solid #fff;border-radius:50%;background:linear-gradient(145deg,#1cb486,#078760);font-size:30px;cursor:pointer;box-shadow:0 10px 28px rgba(8,122,90,.32)}.panel{display:grid;grid-template-rows:auto 1fr auto;width:min(390px,calc(100vw - 32px));height:min(650px,calc(100vh - 48px));overflow:hidden;border:1px solid #dce7e3;border-radius:18px;background:#fff;box-shadow:0 18px 50px rgba(31,41,55,.22)}.panel.expanded{width:min(760px,calc(100vw - 48px));height:min(820px,calc(100vh - 48px))}.header{display:flex;justify-content:space-between;align-items:center;padding:13px 16px;color:#fff;background:linear-gradient(110deg,#0f9b72,#087a5a)}.brand{display:flex;gap:11px;align-items:center}.brand div{display:flex;flex-direction:column}.brand small{font-size:12px;opacity:.9}.avatar,.mini-avatar{display:grid;place-items:center;border-radius:50%;background:#fff}.avatar{width:46px;height:46px;font-size:24px}.mini-avatar{flex:0 0 auto;width:32px;height:32px;font-size:17px}.header button{width:36px;height:36px;border:0;border-radius:9px;background:transparent;color:#fff;font-size:24px;cursor:pointer}.messages{overflow-y:auto;padding:18px 16px 22px;background:#f5f8f7}.row{display:flex;gap:9px;align-items:flex-start;margin-bottom:14px}.row.user{justify-content:flex-end}.bubble{max-width:82%;padding:12px 14px 8px;border:1px solid #e4ebe8;border-radius:14px 14px 14px 5px;background:#fff;font-size:14px;line-height:1.55;box-shadow:0 2px 9px rgba(17,24,39,.06)}.bubble p{margin:0;white-space:pre-wrap}.userBubble{border:0;border-radius:14px 14px 5px 14px;background:#dff3ff}.errorBubble{border-color:#ffcecd;background:#fff0ef;color:#c03936}.bubble time{display:block;margin-top:5px;color:#99a2ac;font-size:10px;text-align:right}.suggestions{display:grid;gap:8px;margin:18px 0 22px 41px}.suggestions h3{margin:0 0 2px;font-size:15px}.suggestions button{display:flex;gap:9px;align-items:center;padding:10px 14px;border:1px solid #54bea0;border-radius:999px;background:#fff;color:#087a5a;font-weight:700;cursor:pointer}.results{display:grid;gap:8px;margin-top:10px}.result{display:grid;grid-template-columns:72px 1fr;gap:10px;width:100%;padding:0;overflow:hidden;border:1px solid #dce7e3;border-radius:10px;background:#fff;text-align:left;cursor:pointer}.result img{width:72px;height:82px;object-fit:cover}.result>span{display:flex;flex-direction:column;min-width:0;padding:8px 8px 8px 0}.result small{color:#0c8c67;font-weight:700}.result strong,.result em{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.result em{color:#76818d;font-size:11px;font-style:normal}.dots{display:flex;gap:5px;margin-top:8px}.dots i{width:7px;height:7px;border-radius:50%;background:#20ad82;animation:b 1.2s infinite}.dots i:nth-child(2){animation-delay:.15s}.dots i:nth-child(3){animation-delay:.3s}@keyframes b{0%,60%,100%{opacity:.35;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}.footer{padding:12px 14px 10px;border-top:1px solid #dce7e3}.footer form{display:grid;grid-template-columns:1fr 42px;gap:8px;padding:5px 5px 5px 13px;border:1px solid #cfdad6;border-radius:999px}.footer input{min-width:0;border:0;outline:0}.footer button{width:38px;height:38px;border:0;border-radius:50%;background:#0c946d;color:#fff;cursor:pointer}.footer button:disabled{opacity:.4}.footer>p{margin:7px 0 0;color:#98a1aa;font-size:10px;text-align:center}@media(max-width:640px){.localhub-chatbot{right:14px;bottom:14px}.panel,.panel.expanded{position:fixed;inset:0;width:100vw;height:100dvh;border:0;border-radius:0}.launcher{width:58px;height:58px}}
</style>
