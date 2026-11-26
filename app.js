import {createNotifications,createRinger} from './notifications.js?v=ring-21';
import {createAudioTranscriber} from './speech-stream.js?v=caption-21';
import {createMailboxClient} from './mailbox.js?v=offline-13';
import {translate, speak} from './translate.js?v=gemini-27';
import {createPeerService} from './peer.js?v=call-22';
import {setupInterfaceLanguage} from './i18n.js?v=caption-status-51';

const icons={chat:'M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5A8.5 8.5 0 1 1 21 11.5Z M7 10h9 M7 14h5',users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M16 3a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',user:'M20 21v-2a8 8 0 0 0-16 0v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',phone:'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7a2 2 0 0 1 1.7 2Z',video:'M15 10l7-4v12l-7-4 M3 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2',settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M9 2l-1 3-3 1-3-1-1 4 3 2v3l-2 2 2 4 3-1 3 1 1 3h4l1-3 3-1 3 1 2-4-2-2v-3l2-2-1-4-3 1-3-1-1-3Z',search:'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',plus:'M12 5v14 M5 12h14',swap:'M4 7h16l-4-4 M20 17H4l4 4',translate:'M4 5h12 M10 3v2 M6 8c2 4 5 6 9 7 M13 5c-1 6-4 9-9 11 M14 21l4-10 4 10 M16 17h4',chevron:'M9 5l7 7-7 7',back:'M15 5l-7 7 7 7',arrow:'M5 12h14 M14 7l5 5-5 5',info:'M12 11v6 M12 7h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',mic:'M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0V5 M5 10v2a7 7 0 0 0 14 0v-2 M12 19v3 M8 22h8',smile:'M8 14s1 3 4 3 4-3 4-3 M8 9h.01 M16 9h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',image:'M3 3h18v18H3z M3 16l6-6 12 11 M15 7h.01',send:'M22 2 9 15 M22 2l-7 20-6-7-7-6Z',volume:'M11 5 6 9H2v6h4l5 4V5 M15 8a6 6 0 0 1 0 8 M18 5a10 10 0 0 1 0 14',check:'M4 12l5 5L20 6',doublecheck:'M1 12l5 5L17 6 M10 16l2 2L23 7',lock:'M5 11h14v11H5z M8 11V7a4 4 0 0 1 8 0v4',spark:'M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z',pin:'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0 M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',more:'M5 12h.01 M12 12h.01 M19 12h.01',globe:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M2 12h20 M12 2c5 6 5 14 0 20-5-6-5-14 0-20',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4',close:'M6 6l12 12 M6 18 18 6',hangup:'M3 16v-4c5-5 13-5 18 0v4h-5v-4 M3 16h5v-4',stop:'M6 6h12v12H6z',copy:'M8 8h13v13H8z M16 8V3H3v13h5'};
const icon=(name,cls='')=>`<svg ${cls?`class="${cls}"`:''} viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[name]||icons.chat}"/></svg>`;
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem('yueliao-'+key))??fallback}catch{return fallback}};
const write=(key,value)=>{try{localStorage.setItem('yueliao-'+key,JSON.stringify(value))}catch{toast('设备存储空间不足，部分记录可能无法保存。')}};
const uid=()=>crypto.randomUUID();
let deferredInstallPrompt=null;
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstallPrompt=event;});
window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;toast('越聊已安装到设备。')});
const now=()=>new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});
const assets={linh:'/assets/linh.jpg',minh:'/assets/minh.jpg',an:'/assets/an.jpg',cafe:'/assets/cafe.jpg',city:'/assets/city.jpg',lake:'/assets/lake.jpg'};
const assistantContact={id:'ai-assistant',name:'越聊助手',cn:'AI',full:'越聊 AI 助手',location:'中文 · Tiếng Việt',language:'zh',demo:true,assistant:true,online:true,preview:'聊天、问答、中越翻译',unread:0};
const seedContacts=[assistantContact];
const seedMessages=[];
const state={profile:read('profile',{id:'yueliao-'+uid().slice(0,8),name:'小语',language:'zh',avatarTile:Math.floor(Math.random()*16)}),contacts:read('contacts',seedContacts),messages:read('messages',{}),calls:read('calls',[]),active:'ai-assistant',tab:'chat',filter:'all',search:'',auto:read('auto',true),connection:'idle',connectionText:'连接好友，开启双语聊天',sending:false,recording:false,call:null};
for(const messages of Object.values(state.messages))for(const m of messages)if(m.translationPending)m.translationPending=false;
// Upgrade old demo contacts without touching real friends or their conversations.
state.contacts=[...state.contacts.filter(c=>!c.demo&& !c.id.startsWith('demo-')&&c.id!=='ai-assistant'),{...assistantContact}];
state.calls=state.calls.filter(c=>!c.demo&&!String(c.contact).startsWith('demo-'));
if(!state.messages['ai-assistant'])state.messages['ai-assistant']=[{id:'ai-welcome',text:'你好，我是越聊助手。可以陪你聊天、回答问题、翻译中越文。发送后，最近的助手对话会由在线 AI 服务处理；请勿输入密码等敏感信息。',out:false,lang:'zh',time:now()}];
const welcomeMessage=state.messages['ai-assistant']?.find(m=>m.id==='ai-welcome');if(welcomeMessage){if(/Groq|译文由/.test(welcomeMessage.text||''))welcomeMessage.text='你好，我是越聊助手。可以陪你聊天、回答问题、翻译中越文。发送后，最近的助手对话会由在线 AI 服务处理；请勿输入密码等敏感信息。';if(!welcomeMessage.translation||/Groq|译文由/.test(welcomeMessage.translation))welcomeMessage.translation='Xin chào, tôi là trợ lý YueLiao. Tôi có thể trò chuyện, trả lời câu hỏi và dịch Trung – Việt. Các tin nhắn gần đây sẽ được dịch vụ AI trực tuyến xử lý; vui lòng không nhập mật khẩu hoặc thông tin nhạy cảm.';}
write('contacts',state.contacts);write('calls',state.calls);write('messages',state.messages);
const removedFriends=new Set(read('removed-friends',[]));
let accountState={loading:true};
async function deviceHeaders(headers={}){
 if(!mailbox)throw Error('无法建立设备身份，请检查浏览器是否允许本站存储数据。');
 await mailbox.ensure();
 const token=localStorage.getItem('yueliao-mailbox-secret');
 if(!/^[a-f0-9]{64}$/.test(token||''))throw Error('设备身份暂不可用，请刷新后重试。');
 return {...headers,Authorization:`Bearer ${token}`};
}
function accountMarkup(){
 const a=accountState;
 if(a.loading)return '<p>正在连接设备身份…</p>';
 if(a.error||!a.authenticated)return '<p>暂时无法连接设备身份</p><button class="secondary" data-account-refresh>重试</button>';
 return `<h3>已登录 · 设备身份</h3><p class="account-login-name"><span>设备昵称</span><strong data-user-content>${esc(a.name||state.profile.name)}</strong></p><p>智能助手：${a.assistantConfigured&&a.assistantAuthorized?'可使用':'暂不可用'}</p><p>云端通话字幕：${!a.speechConfigured?'服务未配置':a.speechAuthorized?'已开通':'此设备未开通'}</p><p>好友和本机聊天记录保存在当前设备。</p>`;
}
function renderAccount(){
 document.querySelectorAll('[data-account-panel]').forEach(el=>{
  el.innerHTML=accountMarkup();
  el.querySelector('[data-account-refresh]')?.addEventListener('click',loadAccount);
 });
 const button=document.querySelector('[data-action="account"]');
 if(button){
  const label=accountState.loading?'正在连接设备':accountState.authenticated?'已登录 · 设备身份':'设备身份未连接';
  button.title=label;
  button.setAttribute('aria-label',label);
 }
}
async function loadAccount(){
 accountState={loading:true};renderAccount();
 try{
  const headers=await deviceHeaders();
  const response=await fetch('/api/account',{headers,cache:'no-store',credentials:'same-origin',signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw Error();
  accountState=await response.json();
 }catch{accountState={error:true}}
 renderAccount();
}
function accountModal(){openModal('<h2>使用状态</h2><div class="account-panel" data-account-panel></div>',()=>{renderAccount();loadAccount()})}
if(new URLSearchParams(location.search).has('account'))state.tab='settings';
window.addEventListener('pageshow',()=>loadAccount());
const randomAvatarTile=current=>{let tile=Math.floor(Math.random()*16);if(Number.isInteger(current)&&tile%2===current%2)tile=(tile+1)%16;return tile};
if(!Number.isInteger(state.profile.avatarTile)||state.profile.avatarTile<0||state.profile.avatarTile>15){state.profile.avatarTile=randomAvatarTile();write('profile',state.profile)}
state.contacts.forEach(c=>{if(!c.demo)c.online=false;else c.unread=0});
let pageActive=true,connectionStarted=false,connectionAttempt=null,connectionEpoch=0,friendRetryTimer=null;
const activeContact=()=>state.contacts.find(c=>c.id===state.active)||state.contacts[0];
const save=()=>{write('contacts',state.contacts);write('messages',state.messages);write('calls',state.calls);write('profile',state.profile)};
let toastTimer,modalCleanup=null,recorder=null,recordStream=null,recordTimer,recordAttempt=0,callRecognition=null,callStream=null,remoteStream=null,callTick=null,callStarted=0;
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),4500)}
function numericChatID(id){const match=/^yueliao-([a-f0-9]{8})$/i.exec(id||'');return match?String(parseInt(match[1],16)).padStart(10,'0'):String(id||'')}
function peerChatID(value){const digits=String(value).replace(/\s/g,'');if(/^\d{1,10}$/.test(digits)&&Number(digits)<=4294967295)return 'yueliao-'+Number(digits).toString(16).padStart(8,'0');return String(value).trim()}
const validAvatar=value=>typeof value==='string'&&value.length<180000&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value);
const avatar=(c,extra='')=>{if(c?.group)return `<span class="avatar ${extra}" style="background:#dcebcf;color:#355b48;display:grid;place-items:center">${icon('users')}</span>`;if(validAvatar(c?.avatarUrl))return `<img class="avatar ${extra}" src="${esc(c.avatarUrl)}" alt="${esc(c?.name||'头像')}" style="object-fit:cover">`;let seed=0;for(const char of String(c?.id||c?.name||'avatar'))seed=(Math.imul(seed,31)+char.charCodeAt(0))>>>0;const tile=Number.isInteger(c?.avatarTile)&&c.avatarTile>=0&&c.avatarTile<16?c.avatarTile:seed%16;return `<span class="avatar anime-avatar ${extra}" role="img" aria-label="${esc(c?.name||'3D 卡通头像')}" style="background-position:${tile%2?8:94}% ${tile%2?32:40}%;background-size:360% 360%"></span>`};
const contactName=c=>c.assistant?'<span data-ui-text>越聊助手</span>':`<span data-user-content>${esc(c.name)}</span>`;
const meAvatar=()=>avatar(state.profile);
const ringer=typeof createRinger==='function'?createRinger():{start:()=>false,stop(){},unlock(){}};
document.addEventListener('click',()=>{if(state.call&&!callStarted)ringer.unlock()},{passive:true});
document.addEventListener('ringer-status',e=>{const b=document.querySelector('#call-ring-retry');if(b){b.hidden=e.detail==='stopped';b.textContent=e.detail==='blocked'?'🔊 点此开启呼叫铃声':'🔊 重试铃声（请调高音量）'}});
const notifications=typeof createNotifications==='function'?createNotifications({onOpen:handleNotificationOpen,onCalls:syncCloudCalls}):null;
let pendingNotification=new URLSearchParams(location.search).get('incoming'), cloudDialing=false;
function handleNotificationOpen(p){if(p.peerId&&state.contacts.some(c=>c.id===p.peerId))openChat(p.peerId);if(p.callId){pendingNotification=p.callId;notifications?.poll()}}
function notificationSettings(){openModal(`<h2>通知与来电</h2><p>${esc(notifications?.guidance()||'此浏览器暂不支持通知')}</p><p id="notification-state">正在检查配置…</p><button class="primary" id="enable-notifications" disabled>开启消息与来电通知</button><button class="secondary" id="disable-notifications">关闭此设备通知</button><p>网页打开且已点按过页面时，来电会播放铃声。锁屏通知的声音由 iPhone 系统控制。</p>`,()=>{notifications?.load().then(c=>{const enable=document.querySelector('#enable-notifications');if(enable)enable.disabled=!c.configured;const el=document.querySelector('#notification-state');if(el)el.textContent=c.configured?'服务已配置 · '+(globalThis.Notification?.permission==='granted'?'系统已允许通知':'请开启通知权限'):'锁屏通知暂未开放。网页打开时仍可接收来电提示。'}).catch(()=>{});document.querySelector('#enable-notifications').onclick=async()=>{try{await mailbox?.ensure();await notifications.enable();toast('消息与来电通知已开启')}catch(e){toast(e.message)}};document.querySelector('#disable-notifications').onclick=async()=>{try{await notifications.disable();toast('已关闭此设备推送')}catch(e){toast(e.message)}}})}
function syncCloudCalls(rows,actor){
 for(const row of rows){
  const incoming=row.recipient===actor,contact=state.contacts.find(c=>!c.demo&&c.id===(incoming?row.caller_peer:row.recipient_peer));if(!contact)continue;
  const expired=Date.parse(row.expires_at)<=Date.now();
  if(['missed','declined','cancelled','ended'].includes(row.status)||expired&&['ringing','accepted'].includes(row.status)){
   const status=expired&&['ringing','accepted'].includes(row.status)?'missed':row.status;
   if(!state.calls.some(c=>c.id===row.id)){state.calls.unshift({id:row.id,contact:contact.id,name:contact.name,kind:row.kind,incoming,status:incoming&&status==='cancelled'?'missed':status,date:new Date(row.created_at).toLocaleString('zh-CN')});state.calls=state.calls.slice(0,40);save()}
   if(state.call?.callId===row.id){finishCallUI(status);peer.hangup()}continue;
  }
  if(incoming&&row.status==='ringing'&&!state.call){
   state.call=makeCallState(contact,row.kind,{incoming:true,wasIncoming:true,cloud:true,phase:'incoming',callId:row.id});renderCall();if(!ringer.start())toast('收到来电，点按页面后可启用铃声');
  }
  const call=state.call;if(call?.callId===row.id&&!incoming&&row.status==='accepted'&&!cloudDialing&&!call.mediaDialed){
   cloudDialing=true;call.mediaDialed=true;
   resumePeer().then(()=>{if(state.call!==call)throw Error('通话已结束');return peer.addFriend(contact.id)}).then(()=>{if(state.call!==call)throw Error('通话已结束');return peer.call(contact.id,row.kind,{callId:row.id})}).catch(e=>{toast(e.message);if(state.call===call)finishCallUI('missed')}).finally(()=>{cloudDialing=false});
  }
 }
 if(state.tab==='calls'&&!state.call)render();
 if(pendingNotification){const row=rows.find(r=>r.id===pendingNotification);if(row){if(!['ringing','accepted','connected'].includes(row.status)||Date.parse(row.expires_at)<=Date.now()){state.tab='calls';render();toast('该来电已结束，可在通话记录中查看')}pendingNotification=null}}
}


function render(){
const _prevMessages=messagesEl();if(_prevMessages){chatScroll.savedTop=_prevMessages.scrollTop;chatScroll.savedHeight=_prevMessages.scrollHeight;chatScroll.savedContact=state.active;}
const c=activeContact();
 document.querySelector('#app').innerHTML=`<div class="shell ${state.tab==='settings'?'profile-open':''} ${state.tab!=='chat'?'alternate-open':''}" id="shell"><header class="topbar"><div class="top-left"><a class="brand" href="/" aria-label="越聊首页"><img src="/assets/yueliao-logo.jpg" alt=""><div><strong>越聊</strong><small>YUE LIAO</small></div></a><span class="top-tagline">让每一句，都被听懂。</span></div><div class="top-right"><span class="launch-status">限量公测</span><span class="language-chip">${icon('globe')} 中文 ${icon('swap')} Tiếng Việt</span><button class="vip-pill" data-action="membership">VIP</button></div></header><div class="workspace"><aside class="sidebar"><div class="side-head"><div class="side-title"><div><span class="eyebrow">YUÈ LIÁO</span><h1>消息</h1></div><button class="round-add" data-action="add" aria-label="添加好友">${icon('plus')}</button></div><div class="search">${icon('search')}<input id="contact-search" type="search" placeholder="搜索好友或聊天记录" value="${esc(state.search)}" aria-label="搜索好友或聊天记录"></div><div class="filters"><button class="filter ${state.filter==='all'?'active':''}" data-filter="all">全部</button><button class="filter ${state.filter==='friends'?'active':''}" data-filter="friends">好友</button><button class="filter ${state.filter==='unread'?'active':''}" data-filter="unread">未读</button></div></div><div class="group-actions"><button data-action="create-group">创建群聊</button><button data-action="join-group">加入群聊</button></div><div class="contacts" id="contacts"></div><button class="connection" data-action="connect" id="connection">${connectionMarkup()}</button></aside><main class="main ${state.tab!=='chat'?'alternate-view':''} ${c.group?'group-chat':''}" id="main">${state.tab==='chat'?chatMarkup(c):sectionMarkup()}</main></div><nav class="bottom-nav" aria-label="主导航">${[['chat','chat','消息'],['calls','phone','通话'],['settings','user','我的']].map(([tab,i,t])=>`<button class="bottom-nav-item ${state.tab===tab?'active':''}" data-tab="${tab}" aria-label="${t}" aria-current="${state.tab===tab?'page':'false'}">${icon(i)}<span>${t}</span>${tab==='chat'&&state.contacts.some(c=>c.unread)?'<i class="nav-dot"></i>':''}</button>`).join('')}</nav></div><input type="file" id="file-input" accept="image/jpeg,image/png,image/webp" hidden>`;
renderContacts();bindApp();renderAccount();if(state.tab==='chat'){renderMessages();bindComposer();restoreChatScrollAfterRender()}
}
function connectionMarkup(){const messages={idle:'尚未连接聊天服务 · 点击连接',connecting:'正在连接聊天信令服务，请稍候…',ready:'聊天信令已连接 · 通话仍需好友在线',error:'聊天服务连接失败 · 点击重试',disconnected:'聊天服务已断开 · 点击重试'};return `<i class="connection-dot ${state.connection==='ready'?'live':''}"></i><span role="status">${messages[state.connection]||esc(state.connectionText)}</span>${['error','disconnected'].includes(state.connection)?'<strong>重试</strong>':icon('chevron')}`}
async function installApp(){
 const installed=window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true;
 if(installed){toast('越聊已安装到设备。');return}
 if(deferredInstallPrompt){
  const promptEvent=deferredInstallPrompt;deferredInstallPrompt=null;
  try{await promptEvent.prompt();const choice=await promptEvent.userChoice;toast(choice?.outcome==='accepted'?'越聊正在安装。':'安装已取消。')}catch{installGuide()}
  return;
 }
 installGuide();
}
function installGuide(){
 const ios=/iPhone|iPad|iPod/i.test(navigator.userAgent);
 const text=ios?'iPhone 或 iPad：请在 Safari 打开越聊，点分享按钮，再选“添加到主屏幕”。':'此浏览器暂不支持自动安装。可从浏览器菜单选择“安装应用”或“添加到主屏幕”。';
 openModal(`<h2>安装越聊</h2><p>把越聊添加到主屏幕，下次可从应用图标直接打开。</p><div class="install-guide">${icon('info')}<span>${text}</span></div><p class="install-note">当前提供网页与 PWA 安装方式，暂未发布 App Store、TestFlight 或 APK 安装包。</p><button class="primary" data-action="close-install">知道了</button>`,()=>{document.querySelector('[data-action="close-install"]').onclick=closeModal});
}
function membershipModal(){
 openModal(`<h2>会员服务暂未开放</h2><p class="membership-intro">目前越聊不收取会员费用，好友连接、双语聊天和文字翻译可直接使用。</p><div class="membership-current"><span>当前开放</span><strong>好友连接 · 双语聊天 · 文字翻译</strong></div><p class="membership-payment">会员权益、价格与支付方式确定并正式开放后，会在这里清楚说明。</p><button class="primary" data-action="close-membership">继续使用越聊</button>`,()=>{document.querySelector('[data-action="close-membership"]').onclick=closeModal});
}
function startLiveModal(){const friends=state.contacts.filter(c=>!c.demo&&!c.group);openModal(`<h2>开始实时翻译</h2><p>好友通话与普通文字翻译可直接使用。智能助手与部分在线能力暂未向游客开放。</p><p>先连接好友，再发起语音或视频通话。通话时自动尝试开启字幕；无法识别时可输入文字字幕。</p><p>麦克风用于通话与字幕识别。语音识别和翻译会使用在线服务；处理方式请查看隐私说明。</p><a href="/privacy.html" target="_blank" rel="noopener">隐私与数据处理</a><div class="buttons"><button class="primary" id="live-add">添加好友并连接</button><button class="secondary" id="live-text">先试文字翻译</button></div>${friends.map(c=>`<button class="setting-row" data-live-friend="${esc(c.id)}">${contactName(c)} <span>打开聊天</span></button>`).join('')}`,()=>{document.querySelector('#live-add').onclick=addModal;document.querySelector('#live-text').onclick=translateModal;document.querySelectorAll('[data-live-friend]').forEach(b=>b.onclick=()=>{closeModal();openChat(b.dataset.liveFriend)})})}

function renderContacts(){updateUnreadIndicator();const el=document.querySelector('#contacts');if(!el)return;const list=[...state.contacts].sort((a,b)=>Number(!!a.demo)-Number(!!b.demo)||(b.lastMessageAt||0)-(a.lastMessageAt||0)).filter(c=>(state.filter!=='friends'||!c.demo)&&(state.filter!=='unread'||c.unread)&&(!state.search||`${c.name} ${c.cn||''} ${c.preview||''} ${(state.messages[c.id]||[]).map(m=>m.text||'').join(' ')}`.toLowerCase().includes(state.search.toLowerCase())));el.innerHTML=list.length?list.map(c=>`<button class="contact ${state.active===c.id?'active':''}" data-contact="${esc(c.id)}"><div class="avatar-wrap">${avatar(c)}${c.online?'<i class="online-dot"></i>':''}</div><div class="contact-copy"><div class="contact-line"><span class="contact-name">${contactName(c)} <span style="font-weight:400;color:#a5ad9d;font-size:10px">${esc(c.cn||'')}</span></span><span class="contact-time">${esc(c.time||'')}</span></div><div class="contact-sub"><span class="lang-mini">${c.language==='vi'?'VI':'中'}</span>${c.group?'群聊 · 中越翻译':c.demo?'AI 助手':c.online?'已连接 · 双语聊天':c.cloudId?'离线 · 可留言':'好友离线'}</div><div class="contact-line"><p class="contact-last">${c.assistant?'<span data-ui-text>聊天、问答、中越翻译</span>':esc(c.preview||'打个招呼吧 👋')}</p>${c.unread?`<span class="unread">${c.unread}</span>`:''}</div></div></button>`).join(''):`<div class="empty">${icon('users')}${state.filter==='unread'?'暂时没有未读消息':state.filter==='friends'?'还没有添加好友<br>用好友号，开始一段新对话':'没有找到相关好友'}<br>${state.filter==='friends'?'<button class="secondary" data-action="add">添加好友</button>':''}</div>`;el.querySelectorAll('[data-contact]').forEach(b=>b.onclick=()=>openChat(b.dataset.contact));el.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>action(b.dataset.action))}
function chatMarkup(c){return `<header class="chat-head"><button class="mobile-back" data-action="back" aria-label="返回消息">${icon('back')}</button><div class="person"><button class="contact-avatar-button" data-contact-info="${esc(c.id)}" aria-label="查看${esc(contactName(c))}的资料">${avatar(c)}</button><div><h2>${contactName(c)}<span>${esc(c.cn||'')}</span></h2><p><i class="dot" style="${!c.online?'background:#c5ccbe':''}"></i>${c.group?'文字群聊 · 中越双语':c.demo?'AI 助手 · 聊天 / 翻译 / 问答':c.online?'在线 · 可以开始聊天':c.cloudId?'离线 · 可发送留言':'离线 · 等待好友连接'}</p></div></div><div class="chat-actions" ${c.assistant?'hidden':''}><button class="icon-button" data-action="audio" aria-label="语音通话">${icon('phone')}</button><button class="icon-button" data-action="video" aria-label="视频通话">${icon('video')}</button>${c.group?'<button class="secondary" data-action="meeting">会议</button>':''}<span class="separator"></span><button class="icon-button info" data-action="contact-info" aria-label="好友资料">${icon('info')}</button></div></header><div class="messages" id="messages" role="log" aria-label="聊天消息" aria-live="polite"></div><div class="composer-area"><div class="composer-translate-toolbar"><button class="translation-direction" data-action="language" aria-label="切换翻译方向">${state.profile.language==='vi'?'🇻🇳 Tiếng Việt':'🇨🇳 中文'} ${icon('swap')} ${state.profile.language==='vi'?'🇨🇳 中文':'🇻🇳 Tiếng Việt'}</button><label class="auto-translate-control"><span>自动翻译</span><button class="toggle ${state.auto?'on':''}" data-action="toggle" role="switch" aria-checked="${state.auto}" aria-label="自动翻译"></button></label></div><div class="chat-compose-row"><button class="compose-circle" id="record-button" data-action="record" aria-label="录制语音消息">${icon('volume')}</button><div class="composer"><textarea id="message-input" maxlength="450" rows="1" placeholder="" aria-label="聊天消息"></textarea><button class="input-mic" data-action="record" aria-label="录制语音消息">${icon('mic')}</button></div><button class="compose-circle" data-action="emoji" aria-label="添加表情">${icon('smile')}</button><button class="compose-circle" id="compose-more" data-action="more-tools" aria-label="更多功能" aria-expanded="false">${icon('plus')}</button><button class="send" id="send-button" data-action="send" hidden>发送 ${icon('send')}</button></div><div class="compose-more" id="compose-more-panel" hidden><button data-action="image">${icon('image')}图片</button><button data-action="audio">${icon('phone')}语音通话</button><button data-action="video">${icon('video')}视频通话</button><button data-action="language">${icon('translate')}切换语言</button></div><p class="composer-note">${state.recording?'正在录音，再次点击麦克风结束并发送':c.demo?'AI 对话与翻译可能由在线服务处理 · 查看隐私说明':'通话语音字幕使用云端识别。'}</p></div>`}
function detailsMarkup(c){if(c.group)return `<div class="details-title">群聊</div><div class="profile">${avatar(c)}<h3>${contactName(c)}</h3><p>中越双语文字群聊</p><p>群号：${esc(c.code)}</p><button class="primary" data-action="group-info">群成员与邀请</button></div>`;if(c.assistant)return `<div class="details-title">越聊助手</div><div class="profile">${avatar(c)}<h3 data-ui-text>一个助手，就够了</h3><p>聊天 · 问答 · 中越翻译</p></div><div class="detail-section"><p>直接用中文或越南语提问。助手会参考最近的对话回答。</p><p>AI 内容可能有误，请核实重要信息。</p></div>`;return `<div class="details-title">聊天信息 ${icon('more')}</div><div class="profile">${avatar(c)}<h3>${contactName(c)} ${esc(c.cn||'')}</h3><p class="native-name">${esc(c.full||c.name)}</p><p class="location">${icon('pin')}${esc(c.location||'在世界的另一边')}</p><div class="profile-tags"><span>${c.language==='vi'?'越南语母语':'中文母语'}</span><span>${c.demo?'AI 助手':'我的好友'}</span></div></div><div class="detail-section"><h3>对话语言 ${icon('translate')}</h3><div class="language-settings"><div class="language-block"><small>我的语言</small><span>${state.profile.language==='vi'?'🇻🇳 越南语':'🇨🇳 中文'}</span></div>${icon('swap')}<div class="language-block"><small>好友语言</small><span>${c.language==='vi'?'🇻🇳 越南语':'🇨🇳 中文'}</span></div></div><div class="auto-translate-row"><span>自动翻译消息</span><button class="toggle ${state.auto?'on':''}" data-action="toggle" role="switch" aria-checked="${state.auto}" aria-label="自动翻译消息"></button></div><div class="feature-card"><div class="feature-icon">${icon('video')}</div><h3>听见声音，也听懂心意。</h3><p>语音和视频通话中，开启双语字幕<br>让每一次交流，都更靠近一点。</p><button data-action="call-help">了解通话翻译 ${icon('arrow')}</button></div></div><div class="detail-section"><h3>共享的瞬间 <button data-action="shared" aria-label="查看共享图片">${icon('chevron')}</button></h3><div class="shared-grid">${['cafe','city','lake'].map(a=>`<button data-photo="${a}" aria-label="查看${a==='cafe'?'咖啡店':a==='city'?'城市':'湖泊'}照片"><img src="${assets[a]}" alt="${a==='cafe'?'咖啡店的日常':a==='city'?'城市风景':'水边风景'}"></button>`).join('')}</div></div><div class="detail-footer">不同的语言，相同的心情。<br>越聊 · Connect beyond words</div>`}
/* ---------- 聊天滚动：微信 / Telegram 式跟随与锚点 ---------- */
/* 唯一滚动入口：只有新消息到达、且用户正在底部附近（80px 内）时才跟随到底部；
   翻译状态、消息状态、组件重渲染一律不强制滚动，改用滚动锚点保持阅读位置。 */
const CHAT_FOLLOW_PX = 80;
const chatScroll = { following: true, unreadBelow: 0, savedTop: 0, savedHeight: 0, savedContact: null };
const messagesEl = () => document.querySelector('#messages');
const isNearBottom = (el, px = CHAT_FOLLOW_PX) => !el || (el.scrollHeight - el.scrollTop - el.clientHeight <= px);
function scrollChatToBottom(el, smooth) { if (!el) return; el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'instant' }); }
function htmlToNode(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
function captureChatAnchor(el) {
  if (!el) return null;
  const top = el.getBoundingClientRect().top;
  for (const n of el.querySelectorAll('[data-message-id]')) {
    const r = n.getBoundingClientRect();
    if (r.bottom > top + 1) return { id: n.dataset.messageId, gap: r.top - top, scrollHeight: el.scrollHeight, scrollTop: el.scrollTop };
  }
  return { id: null, gap: 0, scrollHeight: el.scrollHeight, scrollTop: el.scrollTop };
}
function restoreChatAnchor(el, anchor) {
  if (!el || !anchor) return;
  if (anchor.id) {
    const n = el.querySelector('[data-message-id="' + CSS.escape(anchor.id) + '"]');
    if (n) { el.scrollTop = Math.max(0, el.scrollTop + (n.getBoundingClientRect().top - el.getBoundingClientRect().top) - anchor.gap); return; }
  }
  el.scrollTop = Math.max(0, anchor.scrollTop + (el.scrollHeight - anchor.scrollHeight));
}
function syncScrollToBottomButton(el) {
  if (!el) return;
  const wrap = el.querySelector('.scroll-to-bottom-wrap');
  if (!wrap) return;
  const show = el.scrollHeight - el.scrollTop - el.clientHeight > CHAT_FOLLOW_PX;
  wrap.classList.toggle('visible', show);
  const count = wrap.querySelector('.scroll-to-bottom-count');
  if (count) { count.textContent = chatScroll.unreadBelow > 99 ? '99+' : String(chatScroll.unreadBelow); count.hidden = !(show && chatScroll.unreadBelow > 0); }
}
function bindMessagesScroll(el) {
  if (!el || el._chatScrollBound) return;
  el._chatScrollBound = true;
  el.addEventListener('scroll', () => {
    chatScroll.following = isNearBottom(el);
    if (chatScroll.following) chatScroll.unreadBelow = 0;
    syncScrollToBottomButton(el);
  }, { passive: true });
}
function messageFingerprint(m) { return [m.text || '', m.translation || '', m.translationPending ? '1' : '0', m.translationError ? '1' : '0', m.status || '', m.url || '', m.kind || ''].join('|'); }
function bindMessageNode(node, m, c, messages) {
  node.querySelectorAll('[data-speak]').forEach(b => b.onclick = () => { const mm = messages.find(x => x.id === b.dataset.speak); if (!mm) return; speak(mm.text, mm.lang === 'vi' ? 'vi-VN' : 'zh-CN').catch(e => { if (e.code !== 'CANCELLED') toast(e.message); }); });
  node.querySelectorAll('[data-image-id]').forEach(b => b.onclick = () => { const mm = messages.find(x => x.id === b.dataset.imageId); if (mm) photoModal(mm.url); });
  node.querySelectorAll('[data-retry]').forEach(b => b.onclick = () => retryTranslation(c.id, b.dataset.retry));
  node.querySelectorAll('[data-contact-info]').forEach(b => b.onclick = () => { state.active = b.dataset.contactInfo; contactModal(); });
}
function renderMessages(opts = {}) {
  const el = messagesEl(); if (!el) return;
  const c = activeContact(); const messages = state.messages[c.id] || [];
  const wasFollowing = chatScroll.following;
  const anchor = captureChatAnchor(el);
  bindMessagesScroll(el);
  let divider = el.querySelector('.date-divider');
  if (!divider) { divider = document.createElement('div'); divider.className = 'date-divider'; el.prepend(divider); }
  divider.textContent = c.demo ? '今天 · AI 对话' : '聊天记录保存在本设备';
  const existing = new Map([...el.querySelectorAll('[data-message-id]')].map(n => [n.dataset.messageId, n]));
  const wanted = new Set(messages.map(m => m.id));
  let prev = divider;
  for (const m of messages) {
    const fp = messageFingerprint(m);
    let node = existing.get(m.id);
    if (node) {
      if (node._chatFp !== fp) {
        const fresh = htmlToNode(messageMarkup(m, c));
        fresh._chatFp = fp;
        node.replaceWith(fresh);
        bindMessageNode(fresh, m, c, messages);
        node = fresh;
      }
    } else {
      node = htmlToNode(messageMarkup(m, c));
      node._chatFp = fp;
      bindMessageNode(node, m, c, messages);
      prev.after(node);
    }
    prev = node;
  }
  for (const [id, node] of existing) if (!wanted.has(id)) node.remove();
  let empty = el.querySelector('.messages-empty');
  if (!messages.length) {
    if (!empty) { empty = document.createElement('div'); empty.className = 'empty messages-empty'; empty.innerHTML = `${icon('chat')}故事，就从一句你好开始。<br>发送第一条消息，认识新朋友。`; prev.after(empty); }
  } else empty?.remove();
  let toBottom = el.querySelector('.scroll-to-bottom-wrap');
  if (!toBottom) {
    toBottom = document.createElement('div');
    toBottom.className = 'scroll-to-bottom-wrap';
    toBottom.innerHTML = `<button class="scroll-to-bottom" type="button" aria-label="回到底部">${icon('arrow')}<span>回到底部</span><b class="scroll-to-bottom-count" hidden></b></button>`;
    toBottom.querySelector('button').onclick = () => { chatScroll.following = true; chatScroll.unreadBelow = 0; scrollChatToBottom(el, true); syncScrollToBottomButton(el); };
  }
  el.append(toBottom);
  const doFollow = opts.follow === 'always' || (opts.follow === true && wasFollowing);
  if (doFollow) { chatScroll.unreadBelow = 0; scrollChatToBottom(el, false); }
  else restoreChatAnchor(el, anchor);
  syncScrollToBottomButton(el);
}
function restoreChatScrollAfterRender() {
  const el = messagesEl(); if (!el) return;
  if (chatScroll.savedContact === state.active && !chatScroll.following) {
    el.scrollTop = Math.max(0, chatScroll.savedTop + (el.scrollHeight - chatScroll.savedHeight));
  } else scrollChatToBottom(el, false);
  syncScrollToBottomButton(el);
}
function safeMedia(url){return typeof url==='string'&&(/^data:(image\/(jpeg|png|webp)|audio\/(webm|ogg|mp4));/i.test(url)||Object.values(assets).includes(url))?url:''}
function messageMarkup(m,c){const isPhoto=m.kind==='image',isVoice=m.kind==='audio';return `<div class="message ${m.out?'out':''} ${isPhoto?'photo':''}" data-message-id="${esc(m.id)}">${m.out?meAvatar():!c.group&&!c.assistant?`<button class="message-avatar-button" data-action="contact-info" data-contact-info="${esc(c.id)}" aria-label="查看好友资料">${avatar(c)}</button>`:avatar(c.group?{id:m.senderId,name:m.senderName}:c)}<div class="message-column"><div class="message-label">${m.out?esc(state.profile.name):c.assistant?contactName(c):esc(m.senderName||c.name)}</div><div class="bubble ${isVoice?'audio-bubble':''}">${isPhoto?`<button style="padding:0;width:100%" data-image-id="${esc(m.id)}" aria-label="查看图片"><img src="${esc(safeMedia(m.url))}" alt="好友分享的照片"></button><div class="photo-caption">${icon('pin')}${esc(m.caption||'分享一刻日常')}</div>`:`${isVoice?`<audio controls preload="none" src="${esc(safeMedia(m.url))}"></audio><div style="font-size:10px;color:#a0ab93">${esc(m.text||'语音消息 · 未转写')}</div>`:`<div>${esc(m.text)}</div>`}${state.auto&&m.translation?`<div class="translated"><span class="translation-label">${icon('translate')}${m.lang==='vi'?'中文翻译':'Bản dịch tiếng Việt'}</span>${esc(m.translation)}</div>`:''}${m.translationPending?'<div class="translated"><span class="translation-label">正在翻译…</span></div>':''}${m.translationError?`<div class="translated" style="color:#c58b72">翻译暂不可用 <button data-retry="${esc(m.id)}" style="text-decoration:underline;padding:0 2px">重试</button></div>`:''}`}</div><div class="message-footer"><span>${esc(m.time||now())}</span>${m.out?`${icon('doublecheck')}<span>${esc(m.status||'保存在本机')}</span>`:''}${m.text?`<button class="speak-button" data-speak="${esc(m.id)}" aria-label="朗读消息">${icon('volume')}</button>`:''}</div></div></div>`}
function sectionMarkup(){if(state.tab==='friends')return `<div class="section-view"><h2>每一次相遇，都值得。</h2><p>用一个好友号，连接另一种生活。<br>同时在线，即可开始私密的双语对话。</p><button class="primary" data-action="add" style="margin-top:20px">${icon('plus')} 添加好友</button><div class="view-cards">${state.contacts.map(c=>`<div class="view-card">${avatar(c)}<h3>${contactName(c)} ${esc(c.cn||'')}</h3><p>${c.demo?'AI 助手':c.online?'在线':'离线'} · ${c.language==='vi'?'越南语':'中文'}</p><button data-contact="${esc(c.id)}">开始聊天 ${icon('arrow')}</button></div>`).join('')}</div></div>`;if(state.tab==='calls'){const friends=state.contacts.filter(c=>!c.demo&&!c.assistant&&!c.group);const callCards=friends.length?`<div class="call-start-list">${friends.map(c=>{const disabled=!c.online&&!c.cloudId;return `<article class="call-start-card"><button class="call-start-person" data-contact-info="${esc(c.id)}" aria-label="查看${esc(contactName(c))}的资料">${avatar(c)}<span><strong>${contactName(c)} ${esc(c.cn||'')}</strong><small>${c.online?'在线':c.cloudId?'可发起来电':'好友当前离线'}</small></span></button><div class="call-start-actions"><button data-call-contact="${esc(c.id)}" data-kind="audio" ${disabled?'disabled':''}>${icon('phone')}<span>语音</span></button><button data-call-contact="${esc(c.id)}" data-kind="video" ${disabled?'disabled':''}>${icon('video')}<span>视频</span></button></div></article>`}).join('')}</div>`:`<div class="call-start-empty"><p>添加好友并连接后，即可从这里发起语音或视频通话。</p><button class="primary" data-action="add">添加好友</button></div>`;const history=state.calls.length?state.calls.map(c=>`<div class="call-log">${avatar(state.contacts.find(p=>p.id===c.contact))}<div class="call-info"><h3>${contactName(c)} ${c.demo?'<span class="demo-badge">演示</span>':''}</h3><p>${c.status==='missed'?'未接来电 · ':c.status==='declined'?'已拒绝 · ':c.status==='cancelled'?'已取消 · ':c.status==='ended'?'已结束 · ':''}${esc(c.kind==='video'?'视频通话':'语音通话')} · ${esc(c.date)}</p></div><button class="icon-button" data-recall="${esc(c.contact)}" data-kind="${esc(c.kind)}" aria-label="再次通话">${icon(c.kind==='video'?'video':'phone')}</button></div>`).join(''):`<div class="empty">${icon('phone')}还没有通话记录</div>`;return `<div class="section-view call-center"><header class="call-center-heading"><h2>通话</h2><p>选择好友，直接发起语音或视频通话；通话中可开启中越双语字幕。</p></header><section class="call-start-section"><h3>发起新通话</h3>${callCards}</section><section class="call-history-section"><h3>最近通话</h3>${history}</section></div>`};return `<div class="section-view my-profile-view native-profile"><div class="profile-cover"><div class="cover-portrait" aria-hidden="true">${meAvatar()}</div><div class="cover-toolbar"><span>越聊 · YUÈ LIÁO</span><button data-action="help" aria-label="使用帮助">${icon('info')}</button></div><div class="cover-identity"><button class="cover-avatar" data-action="profile" aria-label="修改头像">${meAvatar()}</button><div><button class="cover-name" data-action="profile" data-user-content>${esc(state.profile.name)}</button><button class="cover-number" data-action="copy">越聊号：${esc(numericChatID(state.profile.id))} ${icon('copy')}</button></div><button class="cover-edit" data-action="profile" aria-label="编辑个人资料">${icon('chevron')}</button></div></div><div class="profile-sheet"><div class="profile-group">${profileRow('profile','users','个人资料','blue')}${profileRow('account','lock','使用状态','orange')}${profileRow('language','translate','我的语言','green',state.profile.language==='vi'?'Tiếng Việt':'简体中文')}<div class="profile-row"><span class="profile-tile green">${icon('translate')}</span><span>自动翻译</span><button class="toggle ${state.auto?'on':''}" data-action="toggle" role="switch" aria-checked="${state.auto}" aria-label="自动翻译"></button></div></div><div class="profile-group">${profileRow('notifications','bell','消息通知与来电提醒','blue')}${profileRow('install','globe','安装越聊','green')}${profileRow('membership','spark','会员权益','purple')}<a class="profile-row" href="/privacy.html" target="_blank" rel="noopener"><span class="profile-tile gray">${icon('lock')}</span><span>隐私与数据处理</span>${icon('chevron')}</a>${profileRow('help','info','关于越聊','purple','帮助与信息')}</div><p class="profile-footnote">好友与聊天记录保存在当前浏览器，请勿随意清除网站数据。</p></div></div>`}
function profileRow(actionName,symbol,label,color,detail=''){return `<button class="profile-row" data-action="${actionName}"><span class="profile-tile ${color}">${icon(symbol)}</span><span>${label}</span><small>${detail}</small>${icon('chevron')}</button>`}

function bindApp(){document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{stopRecording(false);state.tab=b.dataset.tab;state.search='';render()});document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>action(b.dataset.action));document.querySelectorAll('[data-photo]').forEach(b=>b.onclick=()=>photoModal(assets[b.dataset.photo]));document.querySelectorAll('[data-contact-info]').forEach(b=>b.onclick=()=>{state.active=b.dataset.contactInfo;contactModal()});document.querySelectorAll('[data-call-contact]').forEach(b=>b.onclick=()=>{state.active=b.dataset.callContact;startCall(b.dataset.kind)});document.querySelectorAll('.view-card [data-contact]').forEach(b=>b.onclick=()=>openChat(b.dataset.contact));document.querySelectorAll('[data-recall]').forEach(b=>b.onclick=()=>{openChat(b.dataset.recall);startCall(b.dataset.kind)});document.querySelector('#contact-search').oninput=e=>{state.search=e.target.value;renderContacts()};document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(t=>t.classList.toggle('active',t===b));renderContacts()});document.querySelector('#file-input').onchange=sendImage}
function syncComposer(){const el=document.querySelector('#message-input');if(!el)return;const hasText=!!el.value.trim();document.querySelector('#send-button').hidden=!hasText;document.querySelector('#compose-more').hidden=hasText;el.style.height='auto';el.style.height=Math.min(el.scrollHeight,120)+'px';const _m=messagesEl();if(_m&&chatScroll.following)scrollChatToBottom(_m,false)}
function bindComposer(){const el=document.querySelector('#message-input');el.addEventListener('input',syncComposer);syncComposer();el.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();sendText()}});el.addEventListener('focus',()=>{setTimeout(()=>{const _m=messagesEl();if(_m&&chatScroll.following)scrollChatToBottom(_m,false)},350)});if(state.recording)document.querySelector('#record-button')?.classList.add('recording')}
function openChat(id){if(state.recording)stopRecording(false);state.active=id;state.tab='chat';chatScroll.following=true;chatScroll.unreadBelow=0;const c=activeContact();c.unread=0;const alert=document.querySelector('#message-alert');if(alert)alert.hidden=true;save();render();document.querySelector('#shell').classList.add('chat-open');requestAnimationFrame(()=>{const _el=messagesEl();if(_el){if(chatScroll.following)scrollChatToBottom(_el,false);syncScrollToBottomButton(_el);}});if(c.assistant)backfillAssistant()}
function action(name){if(name==='start-live'){startLiveModal();return}if(name==='install'){installApp();return}if(name==='membership'){membershipModal();return}if(name==='close-details'){document.querySelector('#shell')?.classList.remove('details-open');return}if(name==='create-group'){groupEntry(false);return}if(name==='join-group'){groupEntry(true);return}if(name==='group-info'||name==='contact-info'&&activeContact().group){groupInfo(activeContact());return}if(name==='contact-info'){contactModal();return}if(name==='meeting'){joinMeeting();return}if(activeContact().group&&['audio','video','image','record'].includes(name)){toast('群聊目前支持文字，视频通话请使用会议入口。');return}if(name==='more-tools'){const panel=document.querySelector('#compose-more-panel');panel.hidden=!panel.hidden;document.querySelector('#compose-more').setAttribute('aria-expanded',String(!panel.hidden));return;}if(name==='account'){accountModal();return;}if(activeContact().assistant&&['audio','video','image','record','shared'].includes(name)){toast('AI 助手目前支持文字聊天，请直接输入问题。');return;}if(name==='notifications'){notificationSettings();return}({add:addModal,profile:profileModal,help:helpModal,translate:translateModal,connect:connectPeer,copy:copyID,toggle:toggleTranslation,back:()=>{stopRecording(false);document.querySelector('#shell').classList.remove('chat-open')},send:sendText,audio:()=>startCall('audio'),video:()=>startCall('video'),emoji:emojiModal,image:()=>document.querySelector('#file-input').click(),record:recordVoice,language:switchLanguage,'contact-info':contactModal,'call-help':callHelp,shared:()=>photoModal(assets.cafe)})[name]?.()}
function toggleTranslation(){state.auto=!state.auto;if(state.auto&&activeContact().assistant)backfillAssistant();write('auto',state.auto);document.querySelectorAll('[data-action="toggle"]').forEach(b=>{b.classList.toggle('on',state.auto);b.setAttribute('aria-checked',String(state.auto))});renderMessages()}
function switchLanguage(){stopRecording(false);const draft=document.querySelector('#message-input')?.value;state.profile.language=state.profile.language==='vi'?'zh':'vi';save();const wasOpen=document.querySelector('#shell').classList.contains('chat-open');render();if(wasOpen){document.querySelector('#shell').classList.add('chat-open');requestAnimationFrame(()=>{const _el=messagesEl();if(_el){if(chatScroll.following)scrollChatToBottom(_el,false);else restoreChatScrollAfterRender();syncScrollToBottomButton(_el);}});}if(draft)document.querySelector('#message-input').value=draft;toast('翻译方向已切换')}
function isChatVisible(id){
  return state.active===id&&state.tab==='chat'&&!state.call&&document.visibilityState!=='hidden'&&(window.innerWidth>600||document.querySelector('#shell')?.classList.contains('chat-open'));
}
function updateUnreadIndicator(){
  const count=state.contacts.filter(c=>!c.demo).reduce((sum,c)=>sum+(c.unread||0),0);
  document.title=count?`(${count}) 越聊 · 新消息`:'越聊 · 让每一句，都被听懂';
  const nav=document.querySelector('[data-tab="chat"]');
  if(nav){nav.querySelector('.nav-dot')?.remove();if(count){const dot=document.createElement('i');dot.className='nav-dot';dot.textContent=count>99?'99+':count;nav.append(dot)}nav.setAttribute('aria-label',count?`消息，${count} 条未读`:'消息')}
}
let messageAlertTimer;
function showMessageAlert(contact,message){
  let alert=document.querySelector('#message-alert');
  if(!alert){alert=document.createElement('button');alert.id='message-alert';alert.className='message-alert';alert.setAttribute('role','status');alert.setAttribute('aria-live','polite');document.body.append(alert)}
  alert.replaceChildren();const title=document.createElement('strong');title.dataset.userContent='';title.textContent=`${contact.name} · 新消息`;
  const preview=document.createElement('span');preview.dataset.userContent='';preview.textContent=message.kind==='image'?'[图片]':message.kind==='audio'?'[语音消息]':message.text.slice(0,90);
  alert.append(title,preview);alert.hidden=false;
  alert.onclick=()=>{alert.hidden=true;state.search='';state.filter='all';openChat(contact.id)};
  clearTimeout(messageAlertTimer);messageAlertTimer=setTimeout(()=>{alert.hidden=true},7000);
}
function pushMessage(id,m){
  (state.messages[id]||=[]).push(m);
  const c=state.contacts.find(c=>c.id===id);
  if(c){c.preview=m.kind==='image'?'[图片]':m.kind==='audio'?'[语音消息]':m.text;c.time=m.time;c.lastMessageAt=Date.now();
    if(!m.out&&!isChatVisible(id)){c.unread=(c.unread||0)+1;if(!c.demo)showMessageAlert(c,m)}
  }
  save();if(state.active===id&&state.tab==='chat'){if(!m.out&&!chatScroll.following)chatScroll.unreadBelow++;renderMessages({follow:m.out?'always':true});}renderContacts();
}
async function translatedMessage(text,lang){const m={id:uid(),kind:'text',text,lang,out:true,time:now()};if(state.auto){try{const t=await translate(text,lang==='vi'?'vi':'zh-CN',lang==='vi'?'zh-CN':'vi');m.translation=t.text;m.provider=t.provider}catch(e){m.translationError=true;toast(e.message+' 原文仍可发送。')}}return m}
async function sendText(){if(activeContact().group){await sendGroupText();return;}if(activeContact().assistant){await sendAssistant();return;}const input=document.querySelector('#message-input');const text=input?.value.trim();if(!text||state.sending)return;const c=activeContact();if(!c.demo&&!c.online&&!c.cloudId){toast('请双方先打开新版连接一次，开启离线消息。');return}state.sending=true;const btn=document.querySelector('#send-button');btn.disabled=true;btn.innerHTML='<i class="spinner"></i> 翻译中';try{const m=await translatedMessage(text,state.profile.language);if(!c.demo){m.status=await deliverMessage(c,wireMessage(m))}else m.status='演示已读';input.value='';syncComposer();pushMessage(c.id,m);}catch(e){toast(e.message)}finally{state.sending=false;const current=document.querySelector('#send-button');if(current){current.disabled=false;current.innerHTML=`发送 ${icon('send')}`}}}
function wireMessage(m){const {out,status,translationError,...wire}=m;return wire}
function assistantLanguage(text,fallback=state.profile.language){return /[\u3400-\u9fff]/u.test(text)?'zh':/[a-zA-ZÀ-ỹ]/u.test(text)?'vi':fallback}
async function translateAssistantMessage(m){if(!m?.text||m.error||m.translationPending)return;m.lang=assistantLanguage(m.text,m.lang);m.translationPending=true;m.translationError=false;if(state.active==='ai-assistant')renderMessages();try{const chunks=Array.from(m.text).join('').match(/[\s\S]{1,450}/gu)||[];const parts=[];for(let i=0;i<chunks.length;i+=3)parts.push(...await Promise.all(chunks.slice(i,i+3).map(text=>translate(text,m.lang==='vi'?'vi':'zh-CN',m.lang==='vi'?'zh-CN':'vi').then(r=>r.text))));m.translation=parts.join('\n');}catch{m.translationError=true}finally{m.translationPending=false;save();if(state.active==='ai-assistant')renderMessages()}}
async function backfillAssistant(){if(!state.auto)return;for(const m of (state.messages['ai-assistant']||[]).slice(-6)){if(m.id!=='ai-welcome'&&!m.error&&!m.translation&&!m.translationPending)await translateAssistantMessage(m)}}
async function sendAssistant(){
 const input=document.querySelector('#message-input'),text=input?.value.trim();if(!text||state.sending)return;
 const id='ai-assistant',lang=assistantLanguage(text);state.sending=true;input.value='';syncComposer();
 const outgoing={id:uid(),kind:'text',text,out:true,lang,time:now(),status:'已提交'};pushMessage(id,outgoing);
 const outgoingTranslation=state.auto?translateAssistantMessage(outgoing):Promise.resolve();
 const button=document.querySelector('#send-button');if(button){button.disabled=true;button.textContent='思考中…'}
 try{
  const messages=(state.messages[id]||[]).filter(m=>m.id!=='ai-welcome'&&!m.error&&m.text).slice(-12).map(m=>({role:m.out?'user':'assistant',content:m.text}));
  const headers=await deviceHeaders({'Content-Type':'application/json'});
  const response=await fetch('/api/assistant',{method:'POST',headers,body:JSON.stringify({messages}),signal:AbortSignal.timeout(45000)});
  const data=await response.json();
  if(response.status===401){
   openModal('<h2>设备身份暂不可用</h2><p>刷新网页后，越聊会尝试重新连接此设备。连接后可再次发送消息。</p><button class="secondary" data-action="assistant-unavailable-close">继续使用越聊</button>',()=>{
    document.querySelector('[data-action="assistant-unavailable-close"]').onclick=closeModal;
   });
   throw Error('智能助手暂时无法识别此设备，请刷新后重试。');
  }
  if(!response.ok)throw Error(data.error||'AI 暂时无法回复，请稍后重试');
  const reply={id:uid(),kind:'text',text:data.text,out:false,lang:assistantLanguage(data.text,lang),time:now()};pushMessage(id,reply);if(state.auto)await translateAssistantMessage(reply);
 }catch(e){pushMessage(id,{id:uid(),text:e.name==='TimeoutError'?'回复超时，请重新发送。':e.message,out:false,lang,time:now(),error:true})}
 finally{await outgoingTranslation;state.sending=false;const b=document.querySelector('#send-button');if(b){b.disabled=false;b.innerHTML=`发送 ${icon('send')}`}}
}

async function retryTranslation(id,mid){const m=state.messages[id]?.find(m=>m.id===mid);if(id==='ai-assistant'){await translateAssistantMessage(m);return;}if(!m?.text)return;try{const result=await translate(m.text,m.lang==='vi'?'vi':'zh-CN',m.lang==='vi'?'zh-CN':'vi');m.translation=result.text;m.translationError=false;save();if(state.active===id)renderMessages()}catch(e){toast(e.message)}}
function openModal(content,setup){closeModal();document.querySelector('#modal-root').innerHTML=`<div class="modal-overlay"><section class="modal" role="dialog" aria-modal="true" aria-label="越聊对话框"><button class="modal-close icon-button" id="modal-close" aria-label="关闭">${icon('close')}</button>${content}</section></div>`;document.querySelector('#modal-close').onclick=closeModal;document.querySelector('.modal-overlay').onclick=e=>{if(e.target===e.currentTarget)closeModal()};setup?.();setTimeout(()=>document.querySelector('.modal input,.modal textarea,.modal button:not(.modal-close)')?.focus(),100)}
function closeModal(){modalCleanup?.();modalCleanup=null;document.querySelector('#modal-root').innerHTML=''}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(state.call)endCall();else closeModal()}if(e.key==='Tab'&&document.querySelector('.modal')){const all=[...document.querySelector('.modal').querySelectorAll('button:not(:disabled),input,textarea,select,a')];if(!all.length)return;if(e.shiftKey&&document.activeElement===all[0]){e.preventDefault();all.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===all.at(-1)){e.preventDefault();all[0].focus()}}});
function addModal(){openModal(`${icon('users')}<h2>你好，新朋友。</h2><p>输入对方的越聊号，跨过语言的距离。<br>首次添加时双方打开新版并连接，之后可以离线留言。</p><div class="my-id">我的越聊号 <button id="copy-id">复制</button><br><strong>${esc(numericChatID(state.profile.id))}</strong></div><form id="add-form"><label for="friend-id">好友的越聊号</label><input id="friend-id" placeholder="输入对方的数字越聊号" maxlength="80" required autocomplete="off"><p class="error" id="add-error" role="status"></p><div class="buttons"><button type="button" class="secondary" id="add-cancel">取消</button><button type="submit" class="primary" id="add-submit">添加并连接</button></div></form><p style="font-size:9px;color:#aab39e;margin-top:18px;line-height:1.8">连接通过公共 PeerJS 服务建立。好友需获得本站访问权限；双方用新版连接一次后支持离线留言，通话仍需双方在线。</p>`,()=>{document.querySelector('#copy-id').onclick=copyID;document.querySelector('#add-cancel').onclick=closeModal;document.querySelector('#add-form').onsubmit=async e=>{e.preventDefault();const id=peerChatID(document.querySelector('#friend-id').value.trim());if(id===state.profile.id){document.querySelector('#add-error').textContent='这是你自己的好友号，输入对方的好友号试试。';return}const btn=document.querySelector('#add-submit');btn.disabled=true;btn.textContent='正在连接…';try{await peer.connect(state.profile);removedFriends.delete(id);write('removed-friends',[...removedFriends]);await peer.addFriend(id);closeModal();openChat(id);toast('好友已连接，打个招呼吧！')}catch(error){if(document.querySelector('#add-error'))document.querySelector('#add-error').textContent=error.message}finally{if(btn.isConnected){btn.disabled=false;btn.textContent='添加并连接'}}}})}
async function copyID(){try{await navigator.clipboard.writeText(numericChatID(state.profile.id));toast('好友号已复制，发给朋友吧！')}catch{toast(`我的好友号：${numericChatID(state.profile.id)}`)}}
function profileModal(){
 const draft={...state.profile};
 openModal(`<h2>个人资料</h2><div id="avatar-preview">${avatar(draft,'profile-avatar')}</div><div class="buttons"><button class="secondary" id="avatar-upload">从相册选择</button><button class="secondary" id="avatar-reroll">切换人物头像</button></div><input hidden type="file" id="profile-photo" accept="image/*"><form id="profile-form"><label for="profile-name">昵称</label><input id="profile-name" value="${esc(draft.name)}" required maxlength="20"><label for="profile-id">越聊号</label><input id="profile-id" value="${esc(numericChatID(draft.id))}" inputmode="numeric" pattern="[0-9]{1,10}" maxlength="10" required><p>修改号码后，好友需要用新号码重新连接，才能继续接收离线消息。已有聊天记录保留。</p><label for="profile-language">我的语言</label><select id="profile-language"><option value="zh" ${draft.language==='zh'?'selected':''}>简体中文</option><option value="vi" ${draft.language==='vi'?'selected':''}>Tiếng Việt</option></select><p id="profile-error" class="error" role="status"></p><div class="buttons"><button class="primary" type="submit">保存资料</button></div></form><div class="account-panel" data-account-panel>${accountMarkup()}</div>`,()=>{
 renderAccount();loadAccount();
 const preview=()=>document.querySelector('#avatar-preview').innerHTML=avatar(draft,'profile-avatar');
 document.querySelector('#avatar-reroll').onclick=()=>{delete draft.avatarUrl;draft.avatarTile=randomAvatarTile(draft.avatarTile);preview()};
 document.querySelector('#avatar-upload').onclick=()=>document.querySelector('#profile-photo').click();
 document.querySelector('#profile-photo').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>15000000)throw Error('请选择小于 15 MB 的图片。');const image=new Image();const url=URL.createObjectURL(file);try{image.src=url;await image.decode();const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;const size=Math.min(image.naturalWidth,image.naturalHeight);canvas.getContext('2d').drawImage(image,(image.naturalWidth-size)/2,(image.naturalHeight-size)/2,size,size,0,0,256,256);draft.avatarUrl=canvas.toDataURL('image/jpeg',0.8);preview()}finally{URL.revokeObjectURL(url)}}catch{document.querySelector('#profile-error').textContent='图片读取失败，请选择 JPG 或 PNG 图片。'}};
 document.querySelector('#profile-form').onsubmit=async e=>{e.preventDefault();const error=document.querySelector('#profile-error'),form=e.currentTarget,button=e.submitter||form.querySelector('button[type="submit"]');const name=document.querySelector('#profile-name').value.trim(),digits=document.querySelector('#profile-id').value.trim();if(!name||!/^\d{1,10}$/.test(digits)||Number(digits)>4294967295){error.textContent='请输入昵称和 0 至 4294967295 之间的数字越聊号。';return}const next={...draft,name,id:peerChatID(digits),language:document.querySelector('#profile-language').value};if((state.call||state.recording)&&next.id!==state.profile.id){error.textContent='请结束通话或录音后再修改越聊号。';return}if(button)button.disabled=true;error.textContent='正在保存…';try{if(next.id!==state.profile.id){await peer.connect(next)}localStorage.setItem('yueliao-profile',JSON.stringify(next));const idChanged=next.id!==state.profile.id;Object.assign(state.profile,next);if(!next.avatarUrl)delete state.profile.avatarUrl;closeModal();render();toast('资料已保存。好友重新连接后可看到更新。');if(idChanged)location.reload()}catch(err){peer.connect(state.profile).catch(()=>{});error.textContent=err.message||'保存失败，请重试。';if(button)button.disabled=false}};
 });
}
function contactModal(){const c=activeContact();openModal(`<div class="profile" style="padding-bottom:10px">${avatar(c)}<h2>${contactName(c)} ${esc(c.cn||'')}</h2><p class="native-name">${esc(c.full||c.name)}</p><p class="location">${icon('pin')}${esc(c.location||'在世界的另一边')}</p><div class="profile-tags"><span>${c.language==='vi'?'越南语母语':'中文母语'}</span><span>${c.demo?'AI 助手':'我的好友'}</span></div></div><div class="my-id">${c.demo?'越聊 AI 助手，支持文字聊天、问答与中越翻译。':`好友号<br>${esc(numericChatID(c.id))}<br>状态：${c.online?'已连接':'离线'}`}</div>${!c.demo?'<button class="secondary" id="delete-friend" style="color:#b73535;width:100%;margin-top:16px">删除好友</button>':''}<div class="buttons"><button class="secondary" id="contact-audio">${icon('phone')} 语音</button><button class="primary" id="contact-video">${icon('video')} 视频</button></div>`,()=>{document.querySelector('#delete-friend')?.addEventListener('click',()=>deleteFriendModal(c));document.querySelector('#contact-audio').onclick=()=>{closeModal();startCall('audio')};document.querySelector('#contact-video').onclick=()=>{closeModal();startCall('video')}})}
function helpModal(){openModal(`<h2>让交流，简单一点。</h2><p>越聊 1.0 现已开放限量公测，手机和电脑都可使用。</p><div class="my-id"><strong>01 · 游客极速体验</strong><br>无需注册即可添加好友、聊天和使用文字翻译。<br><br><strong>02 · 连接朋友</strong><br>在“添加好友”里交换越聊号。首次连接时双方需打开页面。好友资料和聊天记录保存在当前设备，不会自动同步到其他设备。<br><br><strong>03 · 开启语音与视频</strong><br>允许麦克风／摄像头后即可通话。实际效果取决于双方网络、设备权限和中继服务状态。<br><br><strong>04 · 开启中越双语字幕</strong><br>通话字幕会将语音识别为文字并翻译。识别能力受设备和网络影响，无法识别时仍可继续通话或使用文字字幕。</div><p style="font-size:10px;color:#a2ab97;line-height:1.9;margin-top:15px">语音识别与翻译可能使用在线服务，具体数据处理方式请查看隐私说明。</p>`)}
function callHelp(){openModal(`${icon('translate')}<h2>听见，也听懂。</h2><p>视频通话会在允许麦克风后自动开启字幕，将你说的话识别为文字并翻译。语音通话也会自动开启字幕，双方各自识别自己的声音。</p><div class="my-id">中文 → 越南语<br>“我们明天一起喝咖啡吧。”<br><strong>Ngày mai chúng ta cùng đi uống cà phê nhé.</strong></div><p style="margin-top:16px;color:#9daa90;font-size:11px;line-height:1.9">字幕效果受网络、设备和权限影响。无法识别时仍可继续通话或使用文字字幕。在线语音与翻译服务的数据处理方式请查看隐私说明。</p><div class="buttons"><button class="primary" id="try-subtitle">知道了</button></div>`,()=>{document.querySelector('#try-subtitle').onclick=closeModal})}
function translateModal(){openModal(`${icon('translate')}<h2>一句话，连接你我。</h2><p>写下想说的话，看看另一种语言里的它。</p><div class="translate-demo"><select id="translate-direction" aria-label="翻译方向"><option value="zh">🇨🇳 中文 → 🇻🇳 越南语</option><option value="vi">🇻🇳 越南语 → 🇨🇳 中文</option></select><textarea id="translate-input" maxlength="450" rows="3" style="margin-top:12px" aria-label="待翻译文字">我们明天一起喝咖啡吧。</textarea><button class="primary" id="translate-submit">翻译一下 ${icon('spark')}</button><div class="translation-result" id="translate-result" aria-live="polite">让每一句，都被听懂。</div><p style="font-size:9px;color:#a4af98;line-height:1.9;margin-top:13px">中越文字通过越聊服务使用 Gemini 翻译。最多 450 字。</p></div>`,()=>{document.querySelector('#translate-direction').onchange=e=>{document.querySelector('#translate-input').value=e.target.value==='vi'?'Xin chào! Rất vui được gặp bạn.':'我们明天一起喝咖啡吧。'};document.querySelector('#translate-submit').onclick=async()=>{const btn=document.querySelector('#translate-submit'),result=document.querySelector('#translate-result'),lang=document.querySelector('#translate-direction').value;btn.disabled=true;btn.textContent='正在翻译…';try{const r=await translate(document.querySelector('#translate-input').value,lang==='vi'?'vi':'zh-CN',lang==='vi'?'zh-CN':'vi');result.textContent=r.text}catch(e){result.textContent=e.message}finally{btn.disabled=false;btn.innerHTML=`翻译一下 ${icon('spark')}`}}})}
function deleteFriendModal(c){
 if(c.demo)return;
 openModal(`<h2>删除好友？</h2><p>将从本机好友列表移除「${contactName(c)}」，停止接收此好友的消息与来电。不会删除对方设备上的记录。</p><label><input type="checkbox" id="delete-history"> 同时删除本机与此好友的聊天记录</label><p id="delete-error" class="error" role="status"></p><div class="buttons"><button class="secondary" id="delete-cancel">取消</button><button class="primary" id="delete-confirm" style="background:#b73535">确认删除</button></div>`,()=>{
 document.querySelector('#delete-cancel').onclick=closeModal;
 document.querySelector('#delete-confirm').onclick=async e=>{const button=e.currentTarget;button.disabled=true;try{if(c.cloudId){if(!mailbox)throw Error('离线服务暂不可用，请稍后重试。');await mailbox.unlink(c)}if(state.call?.contact.id===c.id)endCall();stopRecording(false);removedFriends.add(c.id);write('removed-friends',[...removedFriends]);peer.removeFriend?.(c.id);state.contacts=state.contacts.filter(x=>x.id!==c.id);if(document.querySelector('#delete-history').checked)delete state.messages[c.id];if(state.active===c.id)state.active='ai-assistant';save();closeModal();render();toast('好友已删除，可用越聊号重新添加。')}catch(error){document.querySelector('#delete-error').textContent=error.message||'删除失败，请重试。';button.disabled=false}};
 });
}
function emojiModal(){openModal(`<h2>用表情，说心情。</h2><div class="emoji-grid">${['😊','👋','☕','✨','❤️','🌿','🙌','🥰','👍','🎉','🌸','🇻🇳','🇨🇳','🤝','💬','😂','🙏','🌞'].map(e=>`<button data-emoji="${e}">${e}</button>`).join('')}</div>`,()=>{document.querySelectorAll('[data-emoji]').forEach(b=>b.onclick=()=>{const e=b.dataset.emoji;closeModal();const input=document.querySelector('#message-input');if(input){input.value+=e;syncComposer();input.focus()}})})}
function photoModal(url){if(!safeMedia(url))return;openModal(`<h2 style="font-size:15px;margin-bottom:18px">分享生活的小美好。</h2><img class="image-preview" src="${esc(url)}" alt="分享的照片"><p style="margin-top:14px;font-size:10px">${activeContact().demo?'演示分享 · 越聊':''}</p>`)}
async function sendImage(e){const file=e.target.files?.[0];e.target.value='';if(!file)return;const c=activeContact();if(!c.demo&&!c.online&&!c.cloudId){toast('请双方先打开新版连接一次，开启离线消息。');return}if(!['image/jpeg','image/png','image/webp'].includes(file.type)){toast('请使用 JPG、PNG 或 WebP 图片。');return}if(file.size>5*1024*1024){toast('图片请小于 5MB。');return}try{const url=await resizeImage(file);const m={id:uid(),kind:'image',url,out:true,time:now(),status:c.demo?'演示已读':'已发送'};if(!c.demo)m.status=await deliverMessage(c,wireMessage(m));pushMessage(c.id,m)}catch(error){toast(error.message||'图片读取失败，请换一张试试。')}}
async function resizeImage(file){const data=await dataURL(file);const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=data});const canvas=document.createElement('canvas'),scale=Math.min(1,1000/Math.max(img.width,img.height));canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);const url=canvas.toDataURL('image/jpeg',.72);if(url.length>850000)throw Error('图片较复杂，请选择更小的图片。');return url}
function dataURL(blob){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(blob)})}
async function recordVoice(){if(state.recording){stopRecording(true);return}if(state.call){toast('请先结束通话。');return}const c=activeContact();if(!c.demo&&!c.online&&!c.cloudId){toast('请双方先打开新版连接一次，开启离线消息。');return}if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){toast('此浏览器不支持网页录音，请使用新版 Safari 或 Chrome。');return}const attempt=++recordAttempt,lang=state.profile.language;try{const acquired=await navigator.mediaDevices.getUserMedia({audio:true});if(attempt!==recordAttempt){acquired.getTracks().forEach(t=>t.stop());return}recordStream=acquired;const chunks=[];const types=['audio/webm','audio/mp4','audio/ogg'];const mime=types.find(t=>MediaRecorder.isTypeSupported(t));const thisRecorder=new MediaRecorder(recordStream,mime?{mimeType:mime}:undefined);recorder=thisRecorder;thisRecorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};const contactID=c.id;thisRecorder.onstop=async()=>{const shouldSend=thisRecorder._send;const blob=new Blob(chunks,{type:thisRecorder.mimeType||mime||'audio/webm'});acquired.getTracks().forEach(t=>t.stop());if(recordStream===acquired)recordStream=null;if(!shouldSend)return;if(blob.size>600000){toast('语音消息太长，请录制更短的内容。');return}try{const m={id:uid(),kind:'audio',url:await dataURL(blob),text:'',lang:lang,out:true,time:now(),status:c.demo?'演示已读':'已发送'};if(!c.demo)m.status=await deliverMessage(c,wireMessage(m));pushMessage(contactID,m)}catch(e){toast(e.message||'语音发送失败。')}};recorder.start();state.recording=true;document.querySelector('#record-button')?.classList.add('recording');const note=document.querySelector('.composer-note');if(note){note.classList.add('recording-label');note.textContent='正在录音 · 再次点击麦克风结束并发送（最长 45 秒）'}toast('正在录音，再次点击麦克风发送语音。');recordTimer=setTimeout(()=>stopRecording(true),45000)}catch(e){recordStream?.getTracks().forEach(t=>t.stop());toast(e.name==='NotAllowedError'?'请在浏览器设置中允许麦克风权限。':e.message||'无法启动录音。')}}
function stopRecording(send=false){recordAttempt++;if(!state.recording)return;clearTimeout(recordTimer);state.recording=false;if(recorder&&recorder.state!=='inactive'){recorder._send=send;recorder.stop()}document.querySelector('#record-button')?.classList.remove('recording');const note=document.querySelector('.composer-note');if(note){note.classList.remove('recording-label');note.textContent='聊天记录保存在本设备 · 翻译服务详情见隐私说明'}}

const mailbox=(()=>{try{return typeof createMailboxClient==='function'?createMailboxClient({
  profile:state.profile,
  onIdentity:cloudId=>{state.profile.cloudId=cloudId;save()},
  onMessage:row=>{
    const c=state.contacts.find(c=>!c.demo&&c.cloudId===row.sender.cloudId&&c.id===row.sender.id);
    if(!c)return false;
    // receiveMessage saves synchronously before starting optional translation.
    receiveMessage(c.id,row.message).catch(()=>{});
    try{return JSON.parse(localStorage.getItem('yueliao-messages')||'{}')[c.id]?.some(m=>m.id===row.message.id)===true}catch{return false}
  },
}):null}catch{return null}})();
async function deliverMessage(contact,message){
  if(mailbox&&contact.cloudId){
    await mailbox.send(contact,message);
    if(contact.online)peer.send(contact.id,message).catch(()=>{});
    return contact.online?'已发送':'已保存 · 待对方收取';
  }
  await peer.send(contact.id,message);return '已发送';
}
const peer=createPeerService({isRemoved:id=>removedFriends.has(id),onStatus:({state:s,message,peerId})=>{if((s!=='error'||!peerId)&&['ready','connecting','disconnected','error'].includes(s)){state.connection=s;state.connectionText=s==='ready'?'已上线 · 点击查看好友号':s==='connecting'?'正在连接聊天服务…':s==='error'?'连接不可用 · 点击重试':message;}const el=document.querySelector('#connection');if(el)el.innerHTML=connectionMarkup();if(s==='ready')restoreFriendConnections();else if(!peerId&&['connecting','disconnected','error'].includes(s))clearFriendRetry();if(s==='error'&&state.call){if(!peerId)toast(message);else if(peerId===state.call.contact.id)setSubtitleStatus('字幕通道暂时断开，正在重新连接；音视频通话可继续。')}},onContact:contact=>{if(removedFriends.has(contact.id))return;let c=state.contacts.find(c=>c.id===contact.id);if(c){Object.assign(c,contact)}else{c={...contact,preview:'连接成功，打个招呼吧 👋',unread:0};state.contacts.push(c)}save();mailbox?.link(c).catch(()=>{});renderContacts();if(state.active===c.id&&state.tab==='chat'){const head=document.querySelector('.person p');if(head)head.innerHTML=`<i class="dot" style="background:${c.online?'#7fb49a':'#c5ccbe'}"></i>${c.online?'在线 · 可以开始聊天':c.cloudId?'离线 · 可发送留言':'离线 · 等待好友连接'}`}},onMessage:({peerId,payload})=>receiveMessage(peerId,payload),onIncomingCall:({peerId,kind,call})=>{const c=state.contacts.find(c=>c.id===peerId);if(!c){call.close();return}const previous=state.call;const id=call.metadata?.callId||call.connectionId;if(previous&&previous.callId!==id){call.close();return}state.call=makeCallState(c,kind,{incoming:true,wasIncoming:true,incomingCall:call,demo:false,cloud:!!previous?.cloud,phase:'incoming',callId:id});renderCall();if(previous?.accepted){ringer.stop();peer.answer(call).then(()=>{if(state.call?.callId===id){state.call.incoming=false;state.call.accepted=true;renderCall()}}).catch(e=>{toast(e.message);endCall()})}else if(!ringer.start())toast('收到来电，点按页面启用铃声')},onCallStream:({localStream:ls,remoteStream:rs})=>{callStream=ls;remoteStream=rs;if(state.call){state.call.phase=rs?'connected':'calling';if(rs&&!callStarted){ringer.stop();state.call.cloud&&notifications?.update(state.call.callId,'connected').catch(()=>{});callStarted=Date.now();callTick=setInterval(updateCallStatus,1000)}renderCallStreams();updateCallStatus()}},onCallEnd:({reason})=>{if(state.call){const labels={'remote-ended':'对方已挂断通话',timeout:'通话未接通，请稍后重试。'};finishCallUI();if(labels[reason])toast(labels[reason])}}});
function clearFriendRetry(){clearTimeout(friendRetryTimer);friendRetryTimer=null}
function restoreFriendConnections(){
  clearFriendRetry();
  if(!pageActive||navigator.onLine===false||document.visibilityState==='hidden'||state.connection!=='ready')return;
  for(const contact of state.contacts.filter(c=>!c.demo&&!c.group&&!c.online))peer.addFriend(contact.id).catch(()=>{});
  // A friend may return later while our signaling connection stays online.
  friendRetryTimer=setTimeout(restoreFriendConnections,15000);
}
function resumePeer(){
  if(!pageActive||navigator.onLine===false)return Promise.resolve();
  if(connectionAttempt)return connectionAttempt;
  const epoch=connectionEpoch;
  const attempt=Promise.resolve().then(async()=>{
    if(epoch!==connectionEpoch||!pageActive||navigator.onLine===false)return;
    if(mailbox){try{await mailbox.start();for(const c of state.contacts.filter(c=>!c.demo&&!c.group&&c.cloudId))mailbox.link(c).catch(()=>{})}catch{toast('离线消息服务暂未连接，仍可尝试在线聊天。')}}
    if(epoch!==connectionEpoch||!pageActive)return;
    const operation=connectionStarted?peer.resume():peer.connect(state.profile);
    connectionStarted=true;
    return operation;
  }).finally(()=>{if(connectionAttempt===attempt)connectionAttempt=null});
  connectionAttempt=attempt;
  return attempt;
}
function pausePeer(){
  mailbox?.stop();
  connectionEpoch++;connectionAttempt=null;clearFriendRetry();peer.disconnect();
  state.connection='disconnected';state.connectionText=navigator.onLine===false?'网络已断开，恢复后自动重连…':'聊天服务已断开，返回后自动重连…';
  for(const contact of state.contacts)if(!contact.demo)contact.online=false;
  save();renderContacts();
  const el=document.querySelector('#connection');if(el)el.innerHTML=connectionMarkup();
  const contact=activeContact(),head=document.querySelector('.person p');
  if(head&&!contact.demo&&!contact.group)head.innerHTML='<i class="dot" style="background:#c5ccbe"></i>'+ (contact.cloudId?'离线 · 可发送留言':'离线 · 等待好友连接');
}
async function connectPeer(){
  if(state.connection==='ready'){addModal();return}
  try{await resumePeer();if(state.connection==='ready')toast('已上线，可以交换好友号开始聊天。')}catch(e){toast(e.message)}
}
function makeCallState(contact,kind,extra={}){
  return {contact,kind,demo:!!contact.demo,phase:contact.demo?'demo':'calling',muted:false,camera:true,
    callId:uid(),captionLanguage:state.profile.language,captionWanted:true,captionAutoAttempted:false,captionSequence:0,
    captionLocal:null,captionRemote:null,remoteCaptionSequence:0,remoteCaptionRevision:-1,captionSessionId:uid(),
    currentUtterance:null,...extra};
}
async function receiveMessage(id,p){
  if(!p||typeof p!=='object')return;
  if(p.kind==='call-end'){
    if(state.call?.contact.id===id&&state.call.callId===p.callId){finishCallUI('ended');peer.hangup();toast('对方已挂断通话')}
    return;
  }
  if(p.kind==='subtitle'||p.kind==='subtitle-state'){
    const call=state.call;
    if(!call||call.contact.id!==id||p.callId!==call.callId)return;
    if(p.kind==='subtitle-state'){
      const label=document.querySelector('#subtitle-remote-state');
      if(label)label.textContent=p.enabled?'对方已开启字幕':'对方尚未开启字幕';
      return;
    }
    if(typeof p.text!=='string'||!p.text.trim()||Array.from(p.text).length>450||typeof p.id!=='string'||p.id.length>100||!Number.isSafeInteger(p.sequence)||p.sequence<1||!Number.isSafeInteger(p.revision)||p.revision<0)return;
    call.remoteCaptionRevisions ||= new Map();
    if(p.revision <= (call.remoteCaptionRevisions.get(p.id) ?? -1))return;
    call.remoteCaptionRevisions.set(p.id,p.revision);
    call.remoteCaptionSequence=Math.max(call.remoteCaptionSequence,p.sequence);call.remoteCaptionRevision=p.revision;
    const incoming={...p,translation:typeof p.translation==='string'?p.translation.slice(0,1800):''};
    if(!call.captionRemote||p.sequence>=call.captionRemote.sequence)call.captionRemote=incoming;
    paintCaption('remote',incoming);
    return;
  }
  if(!['text','image','audio'].includes(p.kind)||typeof p.id!=='string'||p.id.length>80)return;
  if((state.messages[id]||[]).some(m=>m.id===p.id))return;
  if(p.kind==='text'&&(typeof p.text!=='string'||p.text.length>1800))return;
  if(p.kind!=='text'&&(!safeMedia(p.url)||p.url.length>900000))return;
  const m={id:p.id,kind:p.kind,text:typeof p.text==='string'?p.text.slice(0,1800):'',translation:typeof p.translation==='string'?p.translation.slice(0,3600):'',url:p.url,lang:p.lang==='vi'?'vi':'zh',out:false,time:now()};
  // Deliver and notify immediately; translation must not hold up the message.
  pushMessage(id,m);
  await translateIncoming(id,m);
}
async function translateIncoming(id,m){
  if(m.translation||!m.text||!state.auto)return;
  try{m.translation=(await translate(m.text,m.lang==='vi'?'vi':'zh-CN',m.lang==='vi'?'zh-CN':'vi')).text}
  catch{m.translationError=true}
  save();if(state.active===id&&state.tab==='chat')renderMessages();
}
async function startCall(kind,permissionReady=false){if(meetingActive){toast('请先退出群会议。');return}if(!permissionReady){callPermissionGuide(kind);return}
  stopRecording(false);if(state.call)return;const c=activeContact();if(c.assistant){toast('AI 助手目前支持文字聊天。');return}
  if(!c.demo&&!c.online&&!c.cloudId){toast('请先连接好友一次，再发起通话。');return}
  const call=makeCallState(c,kind);state.call=call;renderCall();
  if(!c.demo){ringer.unlock();ringer.start('outgoing');}
  if(!c.demo){try{if(c.cloudId&&notifications){let invite;try{invite=await notifications.invite(c,kind,call.callId)}catch(e){if(!c.online)throw e}if(invite){if(state.call!==call){notifications.update(call.callId,'ended').catch(()=>{});return}call.cloud=true;call.expiry=setTimeout(()=>{if(state.call===call&&!callStarted){finishCallUI('missed');peer.hangup()}},60000);return}}if(!c.online)throw Error('好友暂时离线，暂时无法接通。');const connection=await peer.call(c.id,kind,{callId:call.callId});if(state.call===call&&connection?.metadata?.callId)call.callId=connection.metadata.callId}catch(e){if(state.call===call)finishCallUI();if(/NotAllowed|permission|denied|权限|麦克风|摄像头/i.test(String(e?.message||''))){callPermissionGuide(kind,true);return}toast(e.message)}}
}
function callPermissionGuide(kind,denied=false){const embedded=/MicroMessenger|Telegram/i.test(navigator.userAgent||''),unsupported=!navigator.mediaDevices?.getUserMedia;const title=denied?'需要开启设备权限':unsupported?'请在系统浏览器中打开':'开启中越通话';const text=denied?'刚才没有取得麦克风或摄像头权限。请到浏览器的网站设置中允许麦克风'+(kind==='video'?'和摄像头':'')+'，再回来重试。':unsupported?'当前浏览器无法申请麦克风'+(kind==='video'?'和摄像头':'')+'权限。请复制越聊链接，在 iPhone Safari 或 Android Chrome 中打开。':'点击继续后，浏览器会请求麦克风权限'+(kind==='video'?'，视频通话还会请求摄像头':'')+'。请选择“允许”以开始通话和中越字幕。'+(embedded?' 当前似乎在微信或 Telegram 内打开，若权限弹窗不出现，请从菜单选择“在浏览器打开”。':'');openModal(`<div class="permission-guide">${icon('mic')}<h2>${title}</h2><p>${text}</p><p class="permission-guide-note">麦克风用于通话和语音识别；拒绝权限时，仍可稍后在网页设置中开启。</p><div class="buttons"><button class="secondary" id="call-permission-cancel">${denied||unsupported?'关闭':'稍后再说'}</button><button class="primary" id="call-permission-continue">${denied?'再试一次':unsupported?'知道了':'允许权限并继续'}</button></div></div>`,()=>{document.querySelector('#call-permission-cancel').onclick=closeModal;document.querySelector('#call-permission-continue').onclick=()=>{closeModal();if(!unsupported)startCall(kind,true)}})}
function captionLane(side,label){
  const waiting=side==='local'?'等待我说话…':'等待她说话…';
  return `<section class="caption-lane" id="subtitle-${side}" aria-label="${label}" aria-live="polite"><div class="caption-speaker">${label}<span data-caption-language></span></div><p class="caption-empty" data-caption-placeholder>${waiting}</p><div class="caption-content" data-caption-content hidden><div class="caption-original-block"><span class="caption-field-label">原文</span><p data-caption-original></p></div><div class="caption-translated-block"><span class="caption-field-label">译文</span><p data-caption-translation></p></div><span class="caption-item-status" data-caption-state></span></div></section>`;
}
function renderCall(){
  const call=state.call;if(!call)return;const c=call.contact;closeModal();
  document.querySelector('#modal-root').innerHTML=`<div class="call-overlay" role="dialog" aria-modal="true" aria-label="${call.kind==='video'?'视频':'语音'}通话"><div class="call-ambient"></div><video id="remote-video" class="call-video" autoplay playsinline style="display:none"></video><video id="local-video" class="local-video" autoplay muted playsinline style="display:none"></video><audio id="remote-audio" autoplay></audio><div class="cloud-caption-options" id="caption-device-panel" ${call.captionAuthRequired?'':'hidden'}><small>尚未识别此设备，云端字幕暂不可用。</small><button type="button" id="caption-device-retry">重试字幕</button></div><div class="call-language-pill">${call.captionLanguage==='vi'?'🇻🇳 Tiếng Việt ⇄ 🇨🇳 中文':'🇨🇳 中文 ⇄ 🇻🇳 Tiếng Việt'}</div><div class="call-peer-chip"><i></i>${esc(c.name)}</div><div class="caption-tools"><button class="call-subtitle-toggle" id="subtitle-toggle">${icon('translate')} 开启字幕</button><label class="call-language-select"><select id="subtitle-language" aria-label="字幕语言"><option value="zh" ${call.captionLanguage==='zh'?'selected':''}>中文</option><option value="vi" ${call.captionLanguage==='vi'?'selected':''}>Tiếng Việt</option></select></label><button class="typed-caption-toggle" id="caption-text-toggle">${icon('chat')} 键盘输入</button><form id="caption-text-form" hidden><input id="caption-text-input" maxlength="450" placeholder="说点什么…" aria-label="发送文字消息"><button type="submit">发送字幕</button></form></div><div class="call-header"><div class="call-label">${call.kind==='video'?'视频':'语音'}通话</div><h2 id="call-timer">${call.incoming?'好友邀请你通话':call.demo?'':'正在呼叫…'}</h2></div><div class="call-person" id="call-person"><button type="button" id="call-ring-retry" class="secondary" style="margin-bottom:16px" ${callStarted||call.demo?'hidden':''}>🔊 点此开启呼叫铃声</button>${avatar(c)}<h2 data-user-content>${contactName(c)} ${esc(c.cn||'')}</h2><p>${call.demo?'声音，让距离更近。':call.incoming?'来聊聊今天吧':'等待好友接听'}</p></div><div class="call-subtitles"><div class="caption-heading" hidden><span id="subtitle-remote-state">对方尚未开启字幕</span></div><div class="call-bubble-feed" role="log" aria-label="双语通话记录" aria-live="polite"></div><div class="caption-lanes" hidden>${captionLane('local','我说的')}${captionLane('remote','她说的')}</div><p class="subtitle-status" id="subtitle-status">取得麦克风权限后自动开启字幕</p><p class="caption-privacy" id="caption-privacy" hidden>语音识别与翻译会使用在线服务，详情见隐私说明。</p></div><p class="call-privacy"><a href="/privacy.html" target="_blank" rel="noopener">隐私说明</a></p><div class="call-controls"><div class="control"><button id="call-mic" aria-label="静音">${icon('mic')}</button><span>麦克风</span></div>${call.kind==='video'?`<div class="control"><button id="call-camera" aria-label="关闭摄像头">${icon('video')}</button><span>摄像头</span></div>`:''}<div class="control"><button class="hangup" id="call-hangup" aria-label="挂断">${icon('hangup')}</button><span>${call.incoming?'拒绝':'结束通话'}</span></div><div class="control speaker-control"><button id="call-speaker" aria-label="关闭通话声音" aria-pressed="true">${icon('volume')}</button><span>声音</span></div>${call.incoming?`<div class="control"><button class="answer" id="call-answer" aria-label="接听">${icon('phone')}</button><span>接听</span></div>`:''}</div></div>`;
  document.querySelector('#call-speaker').onclick=()=>{
    call.speakerMuted=!call.speakerMuted;
    for(const id of ['remote-video','remote-audio'])document.getElementById(id).muted=call.speakerMuted;
    const button=document.querySelector('#call-speaker');button.classList.toggle('off',call.speakerMuted);button.setAttribute('aria-pressed',String(!call.speakerMuted));button.setAttribute('aria-label',call.speakerMuted?'开启通话声音':'关闭通话声音');
  };
  document.querySelector('#call-hangup').onclick=endCall;
  document.querySelector('#caption-device-retry').onclick=()=>toggleSubtitles();

  document.querySelector('#call-ring-retry').onclick=()=>ringer.start(call.wasIncoming?'incoming':'outgoing');
  document.querySelector('#call-mic').onclick=()=>{
    call.muted=!call.muted;peer.setMuted(call.muted);callStream?.getAudioTracks().forEach(t=>t.enabled=!call.muted);
    document.querySelector('#call-mic').classList.toggle('off',call.muted);document.querySelector('#call-mic').setAttribute('aria-label',call.muted?'取消静音':'静音');
    if(call.muted)stopSubtitles('已静音，字幕识别已停止。');else if(call.captionWanted&&call.captionAutoAttempted)toggleSubtitles({automatic:true});else maybeStartCallCaptions(call);
  };
  document.querySelector('#call-camera')?.addEventListener('click',async()=>{
    const button=document.querySelector('#call-camera');button.disabled=true;
    try {
      const live=callStream?.getVideoTracks().some(t=>t.readyState!=='ended');
      if(!live){
        if(call.demo)await previewMedia();
        else {await peer.ensureCamera();callStream=peer.localStream;}
        call.camera=true;
      }else call.camera=!call.camera;
      peer.setCamera(call.camera);callStream?.getVideoTracks().forEach(t=>t.enabled=call.camera);
      button.classList.toggle('off',!call.camera);button.setAttribute('aria-label',call.camera?'关闭摄像头':'开启摄像头');renderCallStreams();
    }catch(e){toast(e.message||'摄像头开启失败，请检查浏览器权限。')}finally{button.disabled=false}
  });
  document.querySelector('#subtitle-toggle').onclick=toggleSubtitles;
  document.querySelector('#subtitle-language').onchange=e=>{
    const wasActive=!!callRecognition;stopSubtitles();call.captionLanguage=e.target.value==='vi'?'vi':'zh';state.profile.language=call.captionLanguage;save();
    setSubtitleStatus('语言已更新，请用所选语言说话');if(wasActive)toggleSubtitles({automatic:true});
  };
  document.querySelector('#preview-media')?.addEventListener('click',previewMedia);
  document.querySelector('#call-answer')?.addEventListener('click',async()=>{try{if(call.cloud&&!call.incomingCall){await notifications.update(call.callId,'accepted');if(state.call!==call)return;call.accepted=true;ringer.stop();document.querySelector('#call-answer').disabled=true;document.querySelector('#call-timer').textContent='已接听，等待对方连接…';return}await peer.answer(call.incomingCall);if(state.call!==call)return;call.accepted=true;ringer.stop();call.incoming=false;document.querySelector('#call-answer')?.parentElement.remove();updateCallStatus()}catch(e){toast(e.message);endCall()}});
  document.querySelector('#caption-text-toggle').onclick=()=>{const form=document.querySelector('#caption-text-form');form.hidden=!form.hidden;if(!form.hidden)document.querySelector('#caption-text-input').focus()};
  document.querySelector('#caption-text-form').onsubmit=e=>{e.preventDefault();const input=document.querySelector('#caption-text-input');const text=input.value.trim();if(text){input.value='';syncComposer();processCaptionText(call,text,true,null,true)}};
  renderCallStreams();paintCaption('local',call.captionLocal);paintCaption('remote',call.captionRemote);
  if(callRecognition){const button=document.querySelector('#subtitle-toggle');button.innerHTML=`${icon('translate')} 关闭字幕`;button.setAttribute('aria-pressed','true');setSubtitleStatus(call.captionStatus||'字幕已开启')}
  else if(call.captionStatus)setSubtitleStatus(call.captionStatus);
}
function watchCallAudio(call,stream){
  if(call.watchedStream===stream)return;call.audioCleanup?.();call.watchedStream=stream;const removers=[];
  for(const track of stream?.getAudioTracks()||[]){
    const onMuted=()=>{if(state.call===call&&callRecognition){stopSubtitles();showCaptionFallback('浏览器识别与通话麦克风冲突，已停止识别。可继续通话或使用文字字幕。')}};
    track.addEventListener?.('mute',onMuted);removers.push(()=>track.removeEventListener?.('mute',onMuted));
  }
  call.audioCleanup=()=>removers.forEach(fn=>fn());
}
function renderCallStreams(){
  const call=state.call;if(!call)return;const local=document.querySelector('#local-video'),remote=document.querySelector('#remote-video'),audio=document.querySelector('#remote-audio');
  if(callStream)watchCallAudio(call,callStream);
  if(local&&callStream&&call.kind==='video'){if(local.srcObject!==callStream)local.srcObject=callStream;local.muted=true;local.setAttribute('playsinline','');local.style.display='block';local.play().catch(()=>{})}
  if(remoteStream){if(call.kind==='video'){remote.srcObject=remoteStream;remote.style.display='block';document.querySelector('#call-person').style.display='none';remote.play().catch(()=>toast('点击画面以播放通话声音。'));remote.onclick=()=>remote.play().catch(()=>{})}else{audio.srcObject=remoteStream;audio.play().catch(()=>{toast('点按通话界面开启声音。');document.querySelector('.call-overlay').onclick=()=>audio.play().catch(()=>{})})}}
  maybeStartCallCaptions(call);
}
function updateCallStatus(){const el=document.querySelector('#call-timer');if(!el||!state.call)return;if(callStarted){const s=Math.floor((Date.now()-callStarted)/1000);el.textContent=`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}else el.textContent=state.call.incoming?'好友邀请你通话':state.call.demo?'本机预览 · 无远程好友':'正在呼叫…'}
async function previewMedia(){const call=state.call;if(!call||!navigator.mediaDevices?.getUserMedia){toast('此浏览器无法访问媒体设备。');return}const b=document.querySelector('#preview-media');b.disabled=true;b.textContent='等待设备权限…';try{const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:call.kind==='video'?{facingMode:'user'}:false});if(state.call!==call){stream.getTracks().forEach(t=>t.stop());return}callStream=stream;b.textContent='本机设备已开启';if(call.muted)stream.getAudioTracks().forEach(t=>t.enabled=false);renderCallStreams();document.querySelector('#call-timer').textContent='本机预览 · 无远程好友'}catch(e){if(b.isConnected){b.disabled=false;b.textContent='重新开启本机预览'}toast(e.name==='NotAllowedError'?'请在浏览器设置中允许麦克风／摄像头权限。':'未找到可用设备，请检查麦克风或摄像头。')}}
function setSubtitleStatus(message){if(state.call)state.call.captionStatus=message;const el=document.querySelector('#subtitle-status');if(el)el.textContent=message}
function sendCaption(call,payload){
  if(state.call!==call||call.demo)return;
  call.captionOutbox ||= new Map();
  const key=payload.kind==='subtitle'?payload.id:'state';
  call.captionOutbox.get(key)?.resolve(false);
  return new Promise(resolve=>{
    call.captionOutbox.set(key,{payload:{...payload,callId:call.callId},resolve});
    if(call.captionOutbox.size>40){const first=call.captionOutbox.keys().next().value;call.captionOutbox.get(first).resolve(false);call.captionOutbox.delete(first)}
    flushCaptionOutbox(call);
  });
}
async function flushCaptionOutbox(call){
  if(call.captionSending||state.call!==call)return;
  clearTimeout(call.captionRetry);call.captionSending=true;
  try{
    while(state.call===call&&call.captionOutbox?.size){
      const [key,item]=call.captionOutbox.entries().next().value;
      try{
        await peer.send(call.contact.id,item.payload);
        if(call.captionOutbox.get(key)===item)call.captionOutbox.delete(key);
        item.resolve(true);
        if(call.captionTransportFailed&&state.call===call){call.captionTransportFailed=false;setSubtitleStatus('字幕通道已恢复')}
      }catch{
        item.resolve(false);call.captionTransportFailed=true;
        if(state.call===call){setSubtitleStatus('字幕暂未送达，正在重新连接；音视频通话可继续。');call.captionRetry=setTimeout(()=>flushCaptionOutbox(call),2000)}
        break;
      }
    }
  }finally{call.captionSending=false}
}
function stopSubtitles(message='双语字幕已关闭'){
  const call=state.call;const previous=callRecognition;callRecognition=null;
  if(call){call.subtitleStartGeneration=(call.subtitleStartGeneration||0)+1;call.captionSessionId=uid();call.currentUtterance=null;}
  previous?.stop();
  const button=document.querySelector('#subtitle-toggle');if(button){button.disabled=false;button.innerHTML=`${icon('translate')} 开启字幕`;button.setAttribute('aria-pressed','false')}
  if(call){sendCaption(call,{kind:'subtitle-state',enabled:false,lang:call.captionLanguage})?.catch(()=>{});setSubtitleStatus(message)}
}
function publicCaptionError(error){const message=String(error?.message||'');if(/云端字幕|语音字幕暂不可用/.test(message))return message;if(/permission|denied|NotAllowed|权限|允许/i.test(message))return '请允许麦克风访问，再开启语音字幕。';if(/support|不支持/i.test(message))return '当前浏览器无法识别语音，通话仍可继续，也可以输入文字。';return '语音识别暂时没有启动，通话仍可继续，也可以输入文字。'}
function showCaptionFallback(message,unsupported=false){
  setSubtitleStatus(message);
  const form=document.querySelector('#caption-text-form');if(form)form.hidden=false;
  const button=document.querySelector('#subtitle-toggle');
  if(button){button.disabled=unsupported;button.setAttribute('aria-pressed','false');button.innerHTML=`${icon('translate')} ${unsupported?'语音识别不可用':'重试字幕'}`;}
}
function maybeStartCallCaptions(call){
  if(state.call!==call||call.captionAutoAttempted||!call.captionWanted||call.muted)return;
  if(!callStream?.getAudioTracks().some(track=>track.readyState!=='ended'&&track.enabled!==false))return;
  call.captionAutoAttempted=true;
  if(!callRecognition)toggleSubtitles({automatic:true}).catch(()=>{});
}
async function toggleSubtitles({automatic=false}={}){
  const call=state.call;if(!call)return;
  if(callRecognition){if(!automatic){call.captionWanted=false;stopSubtitles()}return}
  call.captionWanted=true;
  if(call.muted){if(!automatic)toast('请先取消静音，再开启字幕。');return}
  const startGeneration=(call.subtitleStartGeneration||0)+1;call.subtitleStartGeneration=startGeneration;
  const language=call.captionLanguage==='vi'?'vi-VN':'zh-CN';let recognition;
  try{
    const callbacks={language,onText:event=>processCaptionText(call,event.text,event.isFinal,recognition),onState:s=>handleCaptionState(call,recognition,s),onError:e=>handleCaptionError(call,recognition,e)};
    const headers=await deviceHeaders();
    if(state.call!==call||call.subtitleStartGeneration!==startGeneration)return;
    const response=await fetch('/api/speech-config',{headers,credentials:'same-origin',signal:AbortSignal.timeout(10000)});
    if(!response.ok)throw new Error('语音字幕暂不可用');
    const config=await response.json();
    if(state.call!==call||call.subtitleStartGeneration!==startGeneration)return;
    if(!config.configured)throw new Error('云端字幕服务未配置。');
    call.captionAuthRequired=!config.authenticated;
    const devicePanel=document.querySelector('#caption-device-panel');
    if(devicePanel)devicePanel.hidden=!call.captionAuthRequired;
    if(call.captionAuthRequired)throw new Error('尚未识别此设备，请重试云端字幕。');
    if(!config.authorized)throw new Error('当前账号未开通云端字幕。');
    recognition=createAudioTranscriber({...callbacks,stream:callStream});
    if(!recognition.supported){
      const message='当前浏览器不支持实时语音识别，请使用文字字幕。';
      showCaptionFallback(message,true);if(!automatic)toast(message);return;
    }
    if(state.call!==call||call.subtitleStartGeneration!==startGeneration)return;
    callRecognition=recognition;call.captionSessionId=uid();
    const button=document.querySelector('#subtitle-toggle');button.disabled=false;button.innerHTML=`${icon('translate')} 关闭字幕`;button.setAttribute('aria-pressed','true');
    const started=recognition.start();
    if(started===false&&callRecognition===recognition){handleCaptionError(call,recognition,new Error('语音识别启动失败，请使用文字字幕。'));return}
    if(callRecognition===recognition)sendCaption(call,{kind:'subtitle-state',enabled:true,lang:call.captionLanguage})?.catch(()=>{});
  }catch(error){
    if(state.call!==call||call.subtitleStartGeneration!==startGeneration)return;
    if(recognition&&callRecognition===recognition)handleCaptionError(call,recognition,error);
    else{const message=publicCaptionError(error);showCaptionFallback(message);if(!automatic)toast(message)}
  }
}
function handleCaptionState(call,controller,status){
  if(state.call!==call||callRecognition!==controller)return;
  if(status==='transcribing')setSubtitleStatus('正在处理语音字幕…');
  if(status==='starting')setSubtitleStatus('正在启动实时字幕…');
  if(status==='listening')setSubtitleStatus('正在聆听 · 说一句中文或越南语吧');
  if(status==='waiting')setSubtitleStatus('等待语音识别结果…');
  if(status==='idle'){
    callRecognition=null;sendCaption(call,{kind:'subtitle-state',enabled:false})?.catch(()=>{});
    const button=document.querySelector('#subtitle-toggle');if(button){button.innerHTML=`${icon('translate')} 重新开启字幕`;button.setAttribute('aria-pressed','false')}
  }
}
function handleCaptionError(call,controller,error){
  if(state.call!==call||callRecognition!==controller)return;
  if(['TIMEOUT','NETWORK','UNAVAILABLE','INVALID_RESPONSE'].includes(error?.code)){
    setSubtitleStatus(error.message);
    return;
  }
  callRecognition=null;controller.stop();
  sendCaption(call,{kind:'subtitle-state',enabled:false})?.catch(()=>{});
  const message=publicCaptionError(error);showCaptionFallback(message);toast(message);
}
function paintCaption(side,caption){
  const lane=document.querySelector(`#subtitle-${side}`);if(!lane)return;
  const call=state.call;
  if(call&&caption){
    call.captionHistory ||= {local:new Map(),remote:new Map()};
    call.captionHistory[side].set(caption.id, caption);
    const entries=[...call.captionHistory[side].values()];
    caption=entries.at(-1);
    let history=lane.querySelector('.caption-history');
    if(!history){history=document.createElement('div');history.className='caption-history';lane.querySelector('[data-caption-content]').before(history)}
    history.replaceChildren();
    for(const entry of entries.slice(0,-1)){
      const row=document.createElement('article');row.className='caption-history-row';row.dataset.userContent='';
      const original=document.createElement('p');original.className='history-original';original.textContent=entry.text;
      const translated=document.createElement('p');translated.className='history-translation';translated.textContent=entry.translation|| (entry.status==='translation-error'?'翻译失败，请重试':entry.isFinal?'正在翻译…':'正在听…');
      row.append(original,translated);history.append(row);
    }
  }
  lane.querySelector('[data-caption-placeholder]').hidden=!!caption;
  lane.querySelector('[data-caption-content]').hidden=!caption;
  const original=lane.querySelector('[data-caption-original]'),translation=lane.querySelector('[data-caption-translation]');
  original.textContent=caption?.text||'';translation.textContent=caption?.translation||'';
  lane.querySelector('[data-caption-language]').textContent=caption?(caption.lang==='vi'?'VI → 中':'中 → VI'):'';
  lane.querySelector('[data-caption-state]').textContent=caption?.status==='translation-error'?'翻译暂不可用':caption?.isFinal&&!caption.translation?'正在翻译…':!caption?.isFinal&&caption&&!caption.translation?'正在听…':'';
  let retry=lane.querySelector('[data-caption-retry]');
  if(side==='local'&&caption?.status==='translation-error'){
    if(!retry){retry=document.createElement('button');retry.dataset.captionRetry='';retry.className='typed-caption-toggle';retry.textContent='重试翻译';lane.append(retry)}
    retry.disabled=false;
    retry.onclick=()=>retryCaptionTranslation(state.call,caption,retry);
  }else retry?.remove();
  lane.scrollTop=lane.scrollHeight;
  paintCallBubbles(side,caption);

}
function paintCallBubbles(side,caption){
  const call=state.call,feed=document.querySelector('.call-bubble-feed');if(!call||!feed)return;
  call.bubbleOrder ||= [];
  if(caption&&!call.bubbleOrder.some(item=>item.side===side&&item.id===caption.id))call.bubbleOrder.push({side,id:caption.id});
  const follow=feed.scrollHeight-feed.scrollTop-feed.clientHeight<70;
  for(const item of call.bubbleOrder){
    const entry=call.captionHistory?.[item.side]?.get(item.id);if(!entry)continue;
    let row=[...feed.children].find(el=>el.dataset.side===item.side&&el.dataset.captionId===item.id);
    if(!row){row=document.createElement('article');row.className='call-bubble '+item.side;row.dataset.side=item.side;row.dataset.captionId=item.id;row.dataset.userContent='';const original=document.createElement('p'),translated=document.createElement('p');original.className='call-bubble-original';translated.className='call-bubble-translation';row.append(original,translated);feed.append(row)}
    row.children[0].textContent=entry.text;row.children[0].lang=entry.lang==='vi'?'vi':'zh';
    row.children[1].textContent=entry.translation||(entry.status==='translation-error'?'翻译暂不可用':entry.isFinal?'正在翻译…':'正在听…');row.children[1].lang=entry.lang==='vi'?'zh':'vi';
  }
  if(follow)feed.scrollTop=feed.scrollHeight;
}
async function retryCaptionTranslation(call,caption,button){
  const valid=()=>call&&state.call===call&&call.captionLocal===caption&&call.captionSessionId===caption.sessionId;
  if(!valid())return;
  button.disabled=true;
  try{
    const result=await translate(caption.text,caption.lang==='vi'?'vi':'zh-CN',caption.lang==='vi'?'zh-CN':'vi');
    if(!valid())return;
    const complete={...caption,revision:caption.revision+1,translation:result.text,status:'translated'};
    call.captionLocal=complete;paintCaption('local',complete);
    await sendCaption(call,complete);
  }catch(error){if(state.call===call){setSubtitleStatus(error.message);button.disabled=false}}
}
async function translateCaptionWithDeadline(text,lang){
  let timer;
  try{return await Promise.race([
    translate(text,lang==='vi'?'vi':'zh-CN',lang==='vi'?'zh-CN':'vi'),
    new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('翻译服务响应超时，请重试。')),12000)}),
  ])}finally{clearTimeout(timer)}
}
async function processCaptionText(call,value,isFinal,controller,manual=false){
  const valid=()=>state.call===call&&(manual||(callRecognition===controller&&!call.muted));
  if(!valid())return;const text=Array.from(String(value).trim()).slice(0,450).join('');if(!text)return;
  let utterance=!manual&&call.currentUtterance;
  if(!utterance){utterance={id:uid(),sequence:++call.captionSequence,revision:0};if(!manual)call.currentUtterance=utterance;}
  const caption={kind:'subtitle',id:utterance.id,sequence:utterance.sequence,revision:++utterance.revision,sessionId:call.captionSessionId,text,translation:'',lang:call.captionLanguage,isFinal:!!isFinal,status:isFinal?'translating':'listening'};
  call.captionLocal=caption;paintCaption('local',caption);
  sendCaption(call,caption)?.catch(e=>{if(valid())setSubtitleStatus(e.message)});
  utterance.textRevision=caption.revision;
  const textRevision=utterance.textRevision;
  if(!isFinal){
    // Safari may keep speech interim for a long time; translate stable text too.
    await new Promise(resolve=>setTimeout(resolve,850));
    if(!valid()||utterance.textRevision!==textRevision)return;
  }else if(!manual)call.currentUtterance=null;
  try{
    const result=await translateCaptionWithDeadline(text,caption.lang);
    if(!valid()||utterance.textRevision!==textRevision)return;const complete={...caption,revision:++utterance.revision,translation:result.text,status:'translated'};
    if(call.captionLocal?.sequence===caption.sequence)call.captionLocal=complete;paintCaption('local',complete)
    await sendCaption(call,complete);
  }catch(e){
    if(!valid()||utterance.textRevision!==textRevision)return;const failed={...caption,revision:++utterance.revision,status:'translation-error'};
    if(call.captionLocal?.sequence===caption.sequence)call.captionLocal=failed;
    paintCaption('local',failed);setSubtitleStatus(e.message);
    sendCaption(call,failed)?.catch(()=>{});
  }
}
function finishCallUI(result){
  const call=state.call;if(!call)return;ringer.stop();clearTimeout(call.expiry);stopSubtitles();const status=result||(callStarted?'ended':call.wasIncoming&&!call.accepted?'missed':'cancelled');if(call.cloud)notifications?.update(call.callId,status).catch(()=>{});
  state.calls=state.calls.filter(c=>c.id!==call.callId);state.calls.unshift({id:call.callId,status,incoming:!!call.wasIncoming,contact:call.contact.id,name:call.contact.name,kind:call.kind,demo:call.demo,date:new Date().toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})});state.calls=state.calls.slice(0,40);
  state.call=null;clearTimeout(call.captionRetry);for(const item of call.captionOutbox?.values()||[])item.resolve(false);call.captionOutbox?.clear();call.audioCleanup?.();callStream?.getTracks().forEach(t=>t.stop());callStream=null;remoteStream=null;clearInterval(callTick);callTick=null;callStarted=0;closeModal();save();
}
function endCall(){if(!state.call)return;const call=state.call;const demo=call.demo;if(!demo)peer.send(call.contact.id,{kind:'call-end',callId:call.callId}).catch(()=>{});const result=state.call.incoming&&!state.call.accepted?'declined':undefined;finishCallUI(result);if(!demo)peer.hangup()}

window.addEventListener('pagehide',()=>{pageActive=false;stopRecording(false);endCall();pausePeer()});
window.addEventListener('pageshow',event=>{
  const returning=event.persisted||!pageActive||!['ready','connecting'].includes(state.connection);
  pageActive=true;if(returning)resumePeer().catch(()=>{});
});
window.addEventListener('offline',pausePeer);
window.addEventListener('online',()=>{resumePeer().catch(()=>{})});
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden'){clearFriendRetry();return}
  resumePeer().catch(()=>{});
});
/* 键盘弹出/收起：用 visualViewport 跟随可视区变化（iOS Safari / PWA / WKWebView） */
function handleViewportChange(){const _el=messagesEl();if(_el&&state.tab==='chat'){if(chatScroll.following)scrollChatToBottom(_el,false);syncScrollToBottomButton(_el);}}
if(window.visualViewport){window.visualViewport.addEventListener('resize',handleViewportChange);window.visualViewport.addEventListener('scroll',handleViewportChange)}else window.addEventListener('resize',handleViewportChange);
render();
if(typeof setupInterfaceLanguage==='function')setupInterfaceLanguage();
// Save the friend ID before connecting, after the UI can report storage errors.
write('profile',state.profile);
resumePeer().catch(()=>{});

notifications?.start();const requestedChat=new URLSearchParams(location.search).get('chat');if(requestedChat&&state.contacts.some(c=>c.id===requestedChat))openChat(requestedChat);

loadAccount();

let groupSyncBusy=false,meetingActive=false;
const groupCursors=read('group-cursors',{});
async function groupApi(action,data={}){if(!mailbox)throw Error('群聊服务暂不可用，请刷新后重试。');return mailbox.group(action,data)}
function groupEntry(join){openModal(`<h2>${join?'加入群聊':'创建群聊'}</h2><p>${join?'输入朋友分享的群号。':'最多 50 人，支持中越文字自动翻译。'}</p><p>群号是入群凭证，请只发给想邀请的人。群资料保存在当前设备身份下，换设备不会自动同步。</p><form id="group-form"><label for="group-value">${join?'群号':'群名称'}</label><input id="group-value" required maxlength="${join?16:30}" autocomplete="off"><p class="error" id="group-error" role="status"></p><button class="primary" type="submit">${join?'加入':'创建'}</button></form>`,()=>{document.querySelector('#group-form').onsubmit=async e=>{e.preventDefault();const button=e.submitter;button.disabled=true;try{const value=document.querySelector('#group-value').value.trim();const result=await groupApi(join?'join':'create',join?{code:value}:{name:value});const g=result.group;let c=state.contacts.find(c=>c.id===g.id);if(c)Object.assign(c,g);else state.contacts.push({...g,group:true,preview:'欢迎加入群聊',unread:0});save();closeModal();openChat(g.id);syncGroups()}catch(error){const el=document.querySelector('#group-error');if(el)el.textContent=error.message}finally{button.disabled=false}}})}
async function syncGroups(){if(!mailbox||groupSyncBusy||document.visibilityState==='hidden')return;groupSyncBusy=true;try{const {groups}=await groupApi('list');const present=new Set(groups.map(g=>g.id));const oldActive=state.contacts.find(c=>c.id===state.active);state.contacts=state.contacts.filter(c=>!c.group||present.has(c.id));if(oldActive?.group&&!present.has(oldActive.id)){state.active='ai-assistant';render()}
for(const g of groups){let c=state.contacts.find(c=>c.id===g.id);if(!c){c={...g,group:true,unread:0};state.contacts.push(c)}else Object.assign(c,g);if(g.latest>(groupCursors[g.id]||0)){const {messages}=await groupApi('history',{groupId:g.id,after:groupCursors[g.id]||0});for(const m of messages){const existing=state.messages[g.id]?.find(x=>x.id===m.id);if(existing){Object.assign(existing,m,{translation:existing.translation||m.translation,status:'已发送到群聊'})}else{const incoming={...m,time:new Date(m.createdAt).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'}),status:m.out?'已发送到群聊':undefined};pushMessage(g.id,incoming);void translateIncoming(g.id,incoming);}groupCursors[g.id]=Math.max(groupCursors[g.id]||0,m.seq)}if(!messages.length)groupCursors[g.id]=g.latest}}
write('group-cursors',groupCursors);save();renderContacts();if(activeContact().group)renderMessages();
}catch{}finally{groupSyncBusy=false}}
async function sendGroupText(){const c=activeContact(),input=document.querySelector('#message-input'),text=input?.value.trim();if(!text||state.sending)return;state.sending=true;const button=document.querySelector('#send-button');button.disabled=true;button.textContent='发送中…';try{const m=await translatedMessage(text,state.profile.language);await groupApi('send',{groupId:c.id,message:wireMessage(m)});m.senderName=state.profile.name;m.status='已发送到群聊';input.value='';pushMessage(c.id,m);syncComposer();syncGroups()}catch(e){toast(e.message)}finally{state.sending=false;const b=document.querySelector('#send-button');if(b){b.disabled=false;b.innerHTML=`发送 ${icon('send')}`}}}
async function groupInfo(c){openModal(`<h2>${contactName(c)}</h2><p>群号：<strong>${esc(c.code)}</strong></p><button class="secondary" id="copy-group">复制群号邀请朋友</button><p>加入后可查看新消息；云端消息保留 30 天。本版暂不推送群消息，打开网页后自动收取。</p><h3>群成员</h3><div id="group-members">正在加载…</div><p id="group-info-error" class="error" role="status"></p><div class="buttons"><button class="primary" id="group-meeting">进入视频会议</button><button class="secondary" id="group-leave">${c.isOwner?'解散群聊':'退出群聊'}</button></div>`,()=>{document.querySelector('#copy-group').onclick=()=>navigator.clipboard.writeText(c.code).then(()=>toast('群号已复制')).catch(()=>toast(c.code));document.querySelector('#group-meeting').onclick=()=>{closeModal();joinMeeting()};document.querySelector('#group-leave').onclick=()=>{openModal(`<h2>${c.isOwner?'解散群聊？':'退出群聊？'}</h2><p>${c.isOwner?'群成员将无法再发消息，云端群记录会被删除。':'退出后将停止收到群消息。'}</p><button class="secondary" id="group-cancel">取消</button><button class="primary" id="group-confirm">确认</button><p class="error" id="group-exit-error"></p>`,()=>{document.querySelector('#group-cancel').onclick=closeModal;document.querySelector('#group-confirm').onclick=async e=>{e.currentTarget.disabled=true;try{await groupApi(c.isOwner?'dissolve':'leave',{groupId:c.id});state.contacts=state.contacts.filter(x=>x.id!==c.id);state.active='ai-assistant';save();closeModal();render()}catch(error){document.querySelector('#group-exit-error').textContent=error.message;document.querySelector('#group-confirm').disabled=false}}})}});try{const {members}=await groupApi('members',{groupId:c.id});const el=document.querySelector('#group-members');if(el)el.innerHTML=members.map(m=>`<p>${esc(m.name)} ${m.isOwner?'· 群主':''}</p>`).join('')}catch(e){const el=document.querySelector('#group-info-error');if(el)el.textContent=e.message}}
async function joinMeeting(){const group=activeContact();if(!group.group)return;if(state.call||state.recording||meetingActive){toast('请先结束当前通话或录音。');return}meetingActive=true;try{const {startMeeting}=await import('./meeting.js?v=gemini-41');await startMeeting({group,profile:{...state.profile},api:groupApi,onClose:()=>meetingActive=false})}catch(e){meetingActive=false;toast(e.message||'无法进入会议，请检查摄像头和麦克风权限。')}}
if(mailbox){syncGroups();setInterval(syncGroups,5000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='hidden')syncGroups()})}
