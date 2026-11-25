import {createAudioTranscriber} from './speech-stream.js?v=caption-21';
import {translate,translationPreferences,nativeChannel} from './translate.js?v=gemini-27';
import {loadPeerClient} from './peer.js?v=call-22';

export async function startMeeting({group,profile,api,onClose=()=>{}}){
 let stopped=false,stream,peer,peerId,timer,recognition,roster=[],busy=false,failures=0;
 const calls=new Map(),tiles=new Map(),captions=new Set();
 const root=document.createElement('section');root.className='meeting-overlay';root.setAttribute('role','dialog');root.setAttribute('aria-label','群视频会议');
 root.innerHTML='<header><h2></h2><button data-leave>退出会议</button></header><p data-status role="status">正在申请摄像头和麦克风…</p><div class="meeting-grid"></div><div class="meeting-controls"><button data-mic>关闭麦克风</button><button data-camera>关闭摄像头</button><button data-captions>开启翻译字幕</button><button data-play>播放声音</button></div><p>请戴耳机。语音优先在本机识别，在线识别需开启授权；使用个人资料中的语言。离开页面可能中断会议。</p><p data-caption-status role="status">正在检查字幕服务…</p><form data-caption-form><input aria-label="会议文字字幕" maxlength="450" placeholder="识别不可用时，可输入文字翻译" required><button>发送字幕</button></form><div class="meeting-captions" role="log" aria-live="polite"></div>';
 document.body.append(root);root.querySelector('h2').textContent=group.name+' · 会议（最多 6 人）';
 const status=text=>{root.querySelector('[data-status]').textContent=text};
 function stop(){if(stopped)return;stopped=true;clearTimeout(timer);recognition?.stop();for(const c of calls.values())c.close();peer?.destroy();stream?.getTracks().forEach(t=>t.stop());if(peerId)api('meeting-leave',{groupId:group.id,peerId}).catch(()=>{});root.remove();window.removeEventListener('pagehide',stop);onClose()}
 root.querySelector('[data-leave]').onclick=stop;window.addEventListener('pagehide',stop);
 function tile(id,name,media,local=false){let node=tiles.get(id);if(!node){node=document.createElement('article');const video=document.createElement('video');video.autoplay=true;video.playsInline=true;video.muted=local;const label=document.createElement('p');node.append(video,label);root.querySelector('.meeting-grid').append(node);tiles.set(id,node)}node.querySelector('p').textContent=name;const video=node.querySelector('video');video.srcObject=media;video.play().catch(()=>status('点“播放声音”启用会议音频。'))}
 function attach(call){calls.set(call.peer,call);call.on('stream',media=>{if(stopped)return;const member=roster.find(r=>r.peerId===call.peer);if(member)tile(call.peer,member.name,media)});const remove=()=>{if(calls.get(call.peer)!==call)return;calls.delete(call.peer);tiles.get(call.peer)?.remove();tiles.delete(call.peer)};call.on('close',remove);call.on('error',remove)}
 function showCaption(member){const c=member.caption;if(!c||captions.has(c.id))return;captions.add(c.id);const row=document.createElement('article'),name=document.createElement('strong'),original=document.createElement('p'),translated=document.createElement('p');name.textContent=member.name;original.textContent=c.text;translated.textContent=c.translation||'翻译暂不可用';row.append(name,original,translated);const feed=root.querySelector('.meeting-captions');feed.append(row);while(feed.children.length>80)feed.firstChild.remove();feed.scrollTop=feed.scrollHeight}
 async function poll(){if(stopped||busy)return;busy=true;try{const data=await api('meeting-poll',{groupId:group.id,peerId});if(stopped)return;failures=0;roster=data.participants;for(const member of roster){showCaption(member);if(member.peerId!==peerId&&peerId<member.peerId&&!calls.has(member.peerId)&&peer?.open)attach(peer.call(member.peerId,stream));}for(const [id,call] of calls)if(!roster.some(m=>m.peerId===id)){call.close();tiles.get(id)?.remove();tiles.delete(id);calls.delete(id)}status(`会议中 · ${roster.length}/6 人 · 已接通 ${[...tiles.keys()].filter(id=>id!==peerId).length} 位成员`)}catch(e){if(++failures>=3){stop();throw e}status('会议连接暂时中断，正在重试…')}finally{busy=false;if(!stopped)timer=setTimeout(()=>poll().catch(()=>{}),4000)}}
 const captionStatus=text=>root.querySelector('[data-caption-status]').textContent=text;
 let captionGeneration=0;
 async function publishCaption(text){let translation='';try{translation=(await translate(text,profile.language==='vi'?'vi':'zh-CN',profile.language==='vi'?'zh-CN':'vi')).text}catch(e){captionStatus(e.message)}if(!stopped)await api('meeting-caption',{groupId:group.id,peerId,caption:{text,translation,lang:profile.language}})}
 root.querySelector('[data-caption-form]').onsubmit=async e=>{e.preventDefault();const input=e.target.querySelector('input'),text=input.value.trim();if(!text||!peerId)return;const b=e.target.querySelector('button');b.disabled=true;try{await publishCaption(text);input.value=''}catch(err){captionStatus(err.message)}finally{b.disabled=false}};
 async function captionsStart(){const generation=++captionGeneration;recognition?.stop();recognition=null;root.querySelector('[data-captions]').disabled=true;
 try{let config={};try{const r=await fetch('/api/speech-config',{credentials:'same-origin'});if(r.ok)config=await r.json()}catch{}
 if(stopped||generation!==captionGeneration)return;
 const callbacks={language:profile.language==='vi'?'vi-VN':'zh-CN',onText:({text,isFinal})=>{if(isFinal&&!stopped&&generation===captionGeneration)publishCaption(text.slice(0,450)).catch(e=>captionStatus(e.message))},onError:e=>{captionStatus(e.message);recognition?.stop();recognition=null;root.querySelector('[data-captions]').textContent='重试翻译字幕'}};
 const apple=createAppleSpeech({...callbacks,stream,onState:()=>{}});
 if(apple.supported){recognition=apple;if(await apple.start()){if(stopped||generation!==captionGeneration){apple.stop();return}captionStatus('正在本机识别语音');root.querySelector('[data-captions]').textContent='关闭翻译字幕';return}}
 if(stopped||generation!==captionGeneration)return;
 if(!translationPreferences().onlineSpeech||!config.configured||!config.authorized)throw Error('本机识别不可用，云端字幕需要用户授权；可先输入文字字幕。');
 recognition=createAudioTranscriber({...callbacks,stream});
 if(!recognition.supported)throw Error('当前设备无法开启语音识别，云端识别需已授权账号；可先输入文字字幕。');
 captionStatus('云端识别 · 发言后约数秒显示中越字幕');root.querySelector('[data-captions]').textContent='关闭翻译字幕';await recognition.start();
 }catch(e){captionStatus(e.message);recognition?.stop();recognition=null;root.querySelector('[data-captions]').textContent='重试翻译字幕'}finally{root.querySelector('[data-captions]').disabled=false}}
 root.querySelector('[data-captions]').onclick=()=>{if(recognition){captionGeneration++;recognition.stop();recognition=null;captionStatus('翻译字幕已关闭');root.querySelector('[data-captions]').textContent='开启翻译字幕'}else captionsStart()};
 root.querySelector('[data-mic]').onclick=e=>{const track=stream?.getAudioTracks()[0];if(track){track.enabled=!track.enabled;e.target.textContent=track.enabled?'关闭麦克风':'开启麦克风'}};
 root.querySelector('[data-camera]').onclick=e=>{const track=stream?.getVideoTracks()[0];if(track){track.enabled=!track.enabled;e.target.textContent=track.enabled?'关闭摄像头':'开启摄像头'}};
 root.querySelector('[data-play]').onclick=()=>root.querySelectorAll('video').forEach(v=>v.play().catch(()=>{}));
 try{
 const media=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:{ideal:true}},video:{width:{ideal:480},height:{ideal:360},frameRate:{ideal:15,max:20}}});if(stopped){media.getTracks().forEach(t=>t.stop());return}stream=media;
 const joined=await api('meeting-join',{groupId:group.id});peerId=joined.peerId;if(stopped){api('meeting-leave',{groupId:group.id,peerId}).catch(()=>{});return}
 let turnToken='';try{turnToken=localStorage.getItem('yueliao-mailbox-secret')||''}catch{}const [Peer,response]=await Promise.all([loadPeerClient(),fetch('/api/turn',{cache:'no-store',headers:turnToken?{Authorization:`Bearer ${turnToken}`}:{}})]);if(stopped)return;if(!response.ok)throw Error('无法读取通话中继配置');const ice=await response.json();
 peer=new Peer(peerId,{debug:0,...(ice.configured?{config:ice.iceServers?{iceServers:ice.iceServers}:ice.config}:{})});
 peer.on('call',async call=>{try{const data=await api('meeting-poll',{groupId:group.id,peerId});if(stopped||!data.participants.some(m=>m.peerId===call.peer)||calls.has(call.peer)){call.close();return}roster=data.participants;attach(call);call.answer(stream)}catch{call.close()}});
 await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('会议连接超时，请重新加入')),15000);peer.once('open',()=>{clearTimeout(timeout);resolve()});peer.on('error',e=>{clearTimeout(timeout);status(e.message||'会议连接错误');reject(e)})});if(stopped)return;
 tile(peerId,profile.name+'（我）',stream,true);await poll();if(!stopped)captionsStart();return stop;
 }catch(e){stop();throw e}
}


const sessions = new Map();
let installCallback = false;

function createAppleSpeech({stream,language,onText,onState,onError}) {
  const channel=nativeChannel('yueliaoSpeech');
  const Audio=globalThis.AudioContext || globalThis.webkitAudioContext;
  const track=stream?.getAudioTracks().find(t=>t.readyState==='live');
  const supported=Boolean(channel && Audio && track);
  let context,source,processor,id,running,startResult,startTimer,stopped;
  const stop=()=>{
    stopped=true;
    if (!id) return;
    const closing=id; id=null; running=false;
    clearTimeout(startTimer);
    sessions.delete(closing);
    startResult?.(false);
    processor?.disconnect(); source?.disconnect();
    if (processor) processor.onaudioprocess=null;
    context?.close().catch(()=>{});
    try { channel.postMessage({action:'stop',id:closing}); } catch {}
  };

  return {supported,stop, async start() {
    if (!supported || id || stopped) return false;
    try {
      context=new Audio();
      source=context.createMediaStreamSource(new MediaStream([track]));
      processor=context.createScriptProcessor(4096,1,1);
      await context.resume();
      if(stopped){await context.close();return false;}
      id=crypto.randomUUID();
      if (!installCallback) {
        window.__onYueLiaoSpeech=(session,event)=>sessions.get(session)?.(event);
        installCallback=true;
      }
      const ready=new Promise(resolve=>{startResult=resolve;});
      startTimer=setTimeout(stop,8000);
      sessions.set(id,event=>{
        if (event.state==='ready') {
          clearTimeout(startTimer);
          running=true;
          onState('listening');
          startResult(true);
        } else if (event.error) {
          const wasRunning=running;
          stop();
          if (wasRunning) onError(Object.assign(Error(event.error),{code:'LOCAL_SPEECH'}));
        } else if (typeof event.text==='string') {
          onText({text:event.text,isFinal:event.final===true});
        }
      });
      processor.onaudioprocess=event=>{
        // The graph must remain live, but must never output captured samples.
        event.outputBuffer.getChannelData(0).fill(0);
        if (!running || !track.enabled || track.muted) return;
        const input=event.inputBuffer.getChannelData(0);
        const pcm=new Int16Array(input.length);
        for(let i=0;i<input.length;i++) pcm[i]=Math.round(Math.min(1,Math.max(-1,input[i]))*32767);
        const bytes=new Uint8Array(pcm.buffer);
        try { channel.postMessage({action:'pcm',id,pcm:btoa(String.fromCharCode(...bytes))}); }
        catch (error) { stop(); onError(error); }
      };
      source.connect(processor);
      processor.connect(context.destination);
      channel.postMessage({action:'start',id,language,sampleRate:context.sampleRate});
      return await ready;
    } catch {
      if (id) stop(); else context?.close().catch(()=>{});
      return false;
    }
  }};
}
