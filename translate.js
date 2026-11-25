const requests = new Map();
let callbackInstalled = false;

export function nativeChannel(name) {
  return globalThis.window?.webkit?.messageHandlers?.[name];
}

export function nativeTranslation(payload, signal) {
  const channel = nativeChannel('appleTranslate');
  if (!channel) return Promise.reject(Object.assign(Error('此设备没有苹果翻译桥接。'), {code:'NO_NATIVE'}));
  if (!callbackInstalled) {
    const previous = window.__onAppleTranslateResult;
    window.__onAppleTranslateResult = (id, text, error, engine) => {
      const receive = requests.get(id);
      if (receive) receive(text, error, engine);
      else previous?.(id, text, error, engine);
    };
    callbackInstalled = true;
  }
  return new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(signal.reason); return; }
    const requestId = crypto.randomUUID();
    const finish = () => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      requests.delete(requestId);
    };
    const cancel = () => {
      try { channel.postMessage({requestId, action:'cancel'}); } catch {}
    };
    const abort = () => { finish(); cancel(); reject(signal.reason); };
    const timer = setTimeout(() => {
      finish(); cancel(); reject(Error('本机翻译超时。'));
    }, payload.action === 'download' ? 300000 : payload.mode === 'call' ? 3200 : 12000);
    requests.set(requestId, (text, error, engine) => {
      finish();
      if (error || typeof text !== 'string') reject(Error(error || '本机翻译不可用。'));
      else resolve({text, provider:engine || 'appleTranslation'});
    });
    signal?.addEventListener('abort', abort, {once:true});
    try { channel.postMessage({...payload,requestId}); }
    catch (error) { finish(); reject(error); }
  });
}

function ylToken(){let t=localStorage.getItem('yueliao-mailbox-secret');if(!/^[a-f0-9]{64}$/.test(t||'')){t=[...crypto.getRandomValues(new Uint8Array(32))].map(x=>x.toString(16).padStart(2,'0')).join('');localStorage.setItem('yueliao-mailbox-secret',t)}return t}


const languageCode = lang => /^vi(?:-|$)/i.test(lang || '') ? 'vi' : /^zh(?:-|$)/i.test(lang || '') ? 'zh-CN' : null;
const cache = new Map();
const pending = new Map();
const preferencesKey = 'yueliao-translation-preferences';

export function translationPreferences() {
  try {
    const preferences = JSON.parse(localStorage.getItem(preferencesKey)) || {};
    return {onlineText:preferences.onlineText === true, onlineSpeech:preferences.onlineSpeech === true};
  } catch { return {onlineText:false, onlineSpeech:false}; }
}

export function setTranslationPreferences(preferences) {
  localStorage.setItem(preferencesKey, JSON.stringify(preferences));
  cache.clear();
}

export async function prepareLocalLanguages(signal) {
  for (const [fromLang,toLang] of [['zh-CN','vi'],['vi','zh-CN']]) {
    await nativeTranslation({action:'download',fromLang,toLang},signal);
  }
}

export async function translationCapabilities() {
  if (!nativeChannel('yueliaoSpeech')) return null;
  const {text}=await nativeTranslation({action:'capabilities'});
  return JSON.parse(text);
}

const fail = (message, code) => Object.assign(new Error(message), {code});

async function performTranslation(text, source, target, options, online) {
  let localError;
  if (nativeChannel('appleTranslate')) {
    try {
      const result = await nativeTranslation({
        sourceText:text, fromLang:source, toLang:target, mode:options.mode,
        conversationId:options.conversationId, messageId:options.messageId, context:options.context,
      }, options.signal);
      if (result.text.trim()) return result;
    } catch (error) {
      options.signal?.throwIfAborted();
      localError = error;
    }
  }
  if (!online) {
    const preferences=translationPreferences();
    if (options.allowOnline===false || (!preferences.onlineText &&
      (!navigator.userActivation?.isActive || !window.confirm('允许越聊将待翻译的文字发送到在线翻译服务？')))) {
      throw localError || fail('请点击翻译按钮并允许在线翻译。','OFFLINE_ONLY');
    }
    if (!preferences.onlineText) setTranslationPreferences({...preferences,onlineText:true});
  }
  if (globalThis.navigator?.onLine === false) throw fail('当前离线，连接网络后可重试翻译。','NETWORK');
  const controller = new AbortController();
  const abort = () => controller.abort(options.signal.reason);
  options.signal?.throwIfAborted();
  options.signal?.addEventListener('abort', abort, {once:true});
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch('/api/translate', {
      method:'POST', credentials:'same-origin', headers:{'Content-Type':'application/json','X-YueLiao-Consent':'translation',Authorization:'Bearer '+ylToken()},
      body:JSON.stringify({text,source,target}),signal:controller.signal,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw fail(result.error || '在线翻译暂不可用，请重试。',result.code || 'UNAVAILABLE');
    if (typeof result.text !== 'string' || !result.text.trim()) throw fail('在线翻译未返回有效内容。','UNAVAILABLE');
    return {text:result.text.trim(),provider:result.provider,model:result.model};
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener('abort', abort);
  }
}

export async function translate(text, source='zh-CN', target='vi', options={}) {
  options.signal?.throwIfAborted();
  const original = typeof text === 'string' ? text.trim() : '';
  if (!original) throw fail('请输入需要翻译的内容。','EMPTY');
  if (Array.from(original).length > 450) throw fail('每条翻译最多支持 450 个字。','TOO_LONG');
  const from=languageCode(source), to=languageCode(target);
  if (!from || !to || from===to) throw fail('请选择中越互译方向。','LANGUAGE');
  const online=options.allowOnline!==false&&translationPreferences().onlineText;
  const key=JSON.stringify([from,to,original,online,options.mode,options.conversationId,options.messageId,options.context]);
  if (cache.has(key)) return {...cache.get(key)};
  if (!options.signal && pending.has(key)) return {...await pending.get(key)};
  const task=performTranslation(original,from,to,options,online);
  if (!options.signal) pending.set(key,task);
  try {
    const result=await task;
    if (options.mode!=='call') {
      if (cache.size>=150) cache.delete(cache.keys().next().value);
      if (online || !translationPreferences().onlineText) cache.set(key,result);
    }
    return {...result};
  } finally { if (!options.signal) pending.delete(key); }
}

let activeSpeechReject;

/** Speaks using available device voices; resolves after playback. A new call cancels the previous call. */
export function speak(text, lang = 'vi') {
  if (!globalThis.speechSynthesis || !globalThis.SpeechSynthesisUtterance) {
    return Promise.reject(fail('当前浏览器不支持朗读，请使用 Safari 或 Chrome。', 'UNSUPPORTED'));
  }
  if (!String(text || '').trim()) return Promise.reject(fail('没有可朗读的内容。', 'EMPTY'));
  if (activeSpeechReject) activeSpeechReject(fail('已停止上一段朗读。', 'CANCELLED'));
  globalThis.speechSynthesis.cancel();
  return new Promise((resolve, reject) => {
    activeSpeechReject = reject;
    const utterance = new globalThis.SpeechSynthesisUtterance(String(text));
    utterance.lang = languageCode(lang) === 'vi' ? 'vi-VN' : 'zh-CN';
    utterance.rate = 0.9;
    const voices = globalThis.speechSynthesis.getVoices();
    const voice = voices.find(item => item.lang.toLowerCase() === utterance.lang.toLowerCase()) || voices.find(item => item.lang.toLowerCase().startsWith(utterance.lang.slice(0, 2)));
    if (voice) utterance.voice = voice;
    const clean = () => { if (activeSpeechReject === reject) activeSpeechReject = undefined; };
    utterance.onend = () => { clean(); resolve(); };
    utterance.onerror = event => {
      clean();
      reject(fail(event.error === 'canceled' || event.error === 'interrupted' ? '朗读已停止。' : '朗读不可用，请检查设备语音或音量设置。', event.error === 'canceled' || event.error === 'interrupted' ? 'CANCELLED' : 'SPEECH'));
    };
    globalThis.speechSynthesis.speak(utterance);
  });
}
