function ylToken(){let t=localStorage.getItem('yueliao-mailbox-secret');if(!/^[a-f0-9]{64}$/.test(t||'')){t=[...crypto.getRandomValues(new Uint8Array(32))].map(x=>x.toString(16).padStart(2,'0')).join('');localStorage.setItem('yueliao-mailbox-secret',t)}return t}
/**
 * Transcribes independent four-second clips from an existing call audio stream.
 * Never requests microphone permission or stops the call's shared audio tracks.
 * Requires a configured, authenticated same-origin /api/speech service.
 * Silence may still be uploaded. Each clip includes its own container headers.
 */
export function createAudioTranscriber({
  stream,
  language = 'zh',
  onText = () => {},
  onState = () => {},
  onError = () => {},
  endpoint = '/api/speech',
  segmentMs = 4000,
} = {}) {
  const supported = Boolean(globalThis.MediaRecorder && globalThis.MediaStream && globalThis.fetch);
  const lang = /^vi(?:-|$)/i.test(language) ? 'vi' : 'zh';
  let session = null;

  function error(message, code) {
    const value = new Error(message);
    value.code = code;
    return value;
  }
  const current = value => session === value && value.active;
  function state(value, name, details) {
    if (current(value)) onState(name, details);
  }
  function monitorAudio(value) {
    const AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContext) return;
    let context;
    try {
      context = new AudioContext();
      const input = context.createMediaStreamSource(value.audioStream);
      const meter = context.createAnalyser();
      meter.fftSize = 1024;
      // Keep WebKit processing the analyser without playing microphone audio.
      const sink = context.createGain();
      sink.gain.value = 0;
      input.connect(meter);
      meter.connect(sink);
      sink.connect(context.destination);
      const samples = new Float32Array(meter.fftSize);
      const timer = setInterval(() => {
        if (context.state !== 'running' || globalThis.document?.visibilityState === 'hidden') return;
        meter.getFloatTimeDomainData(samples);
        let sum = 0, squares = 0;
        for (const sample of samples) {
          sum += sample;
          squares += sample * sample;
        }
        const mean = sum / samples.length;
        const rms = Math.sqrt(Math.max(0, squares / samples.length - mean * mean));
        if (value.levels.length < 300) value.levels.push(rms);
      }, 50);
      value.stopMeter = () => {
        clearInterval(timer);
        input.disconnect();
        meter.disconnect();
        sink.disconnect();
        context.close().catch(() => {});
      };
      if (context.state === 'suspended') context.resume().catch(() => {});
    } catch {
      context?.close().catch(() => {});
    }
  }

  function hasAudioActivity(levels) {
    // A stopped, suspended or throttled meter cannot establish silence.
    if (levels.length < 12) return true;
    const sorted = levels.slice().sort((a, b) => a - b);
    const noiseFloor = sorted[Math.floor(sorted.length * 0.2)];
    const threshold = Math.min(0.004, Math.max(0.0008, noiseFloor * 2.5));
    let audibleFrames = 0;
    for (const level of levels) {
      if (level >= threshold && ++audibleFrames >= 2) return true;
    }
    return false;
  }

  function close(value, emitIdle = true) {
    if (!value || !value.active) return;
    const wasCurrent = session === value;
    value.active = false;
    clearTimeout(value.clipTimer);
    clearTimeout(value.requestTimer);
    value.stopMeter?.();
    value.queue.length = 0;
    value.request?.abort();
    const recorder = value.recorder;
    value.recorder = null;
    // onstop may fire later. Its current() guard discards the unfinished clip.
    if (recorder && recorder.state !== 'inactive') {
      try { recorder.stop(); } catch { /* Already ending. */ }
    }
    if (wasCurrent) {
      session = null;
      if (emitIdle) onState('idle');
    }
  }
  function fatal(value, valueError) {
    if (!current(value)) return;
    close(value, false);
    onError(valueError);
    onState('idle');
  }

  async function upload(value, clip) {
    const controller = new AbortController();
    value.request = controller;
    let timedOut = false;
    value.requestTimer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 12000);
    try {
      const data = new FormData();
      const extension = /mp4|m4a|aac/i.test(clip.type) ? 'm4a' : /ogg/i.test(clip.type) ? 'ogg' : 'webm';
      data.append('file', clip, `speech.${extension}`);
      data.append('language', lang);
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {'X-YueLiao-Consent':'speech',Authorization:'Bearer '+ylToken()},
        body: data,
        signal: controller.signal,
      });
      if (!current(value)) return;
      let result;
      try { result = await response.json(); } catch {
        throw error('语音识别服务返回无效结果，请稍后重试。', 'INVALID_RESPONSE');
      }
      if (!current(value)) return;
      if (!response.ok || result?.error) {
        const code = typeof result?.code === 'string' ? result.code : response.status === 429
          ? 'RATE_LIMIT' : response.status === 401 || response.status === 403 ? 'AUTH_REQUIRED' : 'UNAVAILABLE';
        const fallback = code === 'NOT_CONFIGURED' ? '尚未配置云端语音识别服务。'
          : code === 'AUTH_REQUIRED' ? '请先登录，再开启云端字幕。'
          : code === 'RATE_LIMIT' ? '语音识别额度暂时不足，请稍后重试。'
          : '语音识别服务暂时不可用，请稍后重试。';
        throw error(typeof result?.error === 'string' ? result.error : fallback, code);
      }
      if (typeof result?.text !== 'string') throw error('语音识别服务未返回文字。', 'INVALID_RESPONSE');
      const text = result.text.trim();
      if (text) onText({text, isFinal: true});
    } catch (cause) {
      if (!current(value)) return;
      const issue = timedOut ? error('语音识别超时，请检查网络后重试。', 'TIMEOUT')
        : cause?.code ? cause : error('无法连接语音识别服务，请检查网络。', 'NETWORK');
      if (['NOT_CONFIGURED', 'AUTH_REQUIRED', 'FORBIDDEN', 'RATE_LIMIT'].includes(issue.code)) fatal(value, issue);
      else onError(issue);
    } finally {
      clearTimeout(value.requestTimer);
      value.request = null;
    }
  }

  async function pump(value) {
    if (value.busy || !current(value)) return;
    value.busy = true;
    try {
      while (current(value) && value.queue.length) {
        const clip = value.queue.shift();
        state(value, 'transcribing');
        await upload(value, clip);
      }
    } finally {
      value.busy = false;
      state(value, 'listening');
    }
  }
  function enqueue(value, clip) {
    if (!current(value) || !clip.size) return;
    // At most one request plus one waiting clip; keep the newest waiting audio.
    if (value.queue.length + Number(value.busy) >= 2) {
      value.queue.shift();
      state(value, 'waiting', {
        reason: 'backpressure',
        message: '语音识别处理较慢，已跳过较早的等待片段。',
      });
    }
    value.queue.push(clip);
    void pump(value);
  }
  function recordSegment(value) {
    if (!current(value)) return;
    try {
      const Recorder = globalThis.MediaRecorder;
      const mime = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus']
        .find(type => typeof Recorder.isTypeSupported === 'function' && Recorder.isTypeSupported(type));
      const recorder = mime ? new Recorder(value.audioStream, {mimeType: mime}) : new Recorder(value.audioStream);
      value.recorder = recorder;
      const chunks = [];
      recorder.ondataavailable = event => {
        if (current(value) && event.data?.size) chunks.push(event.data);
      };
      recorder.onerror = event => fatal(value, error(event.error?.message || '无法录制通话音频。', 'RECORDING'));
      recorder.onstop = () => {
        if (!current(value) || value.recorder !== recorder) return;
        value.recorder = null;
        clearTimeout(value.clipTimer);
        const blob = new Blob(chunks, {type: recorder.mimeType || mime || chunks[0]?.type || 'audio/webm'});
        // Only discard clips that the active meter sampled reliably.
        const active = hasAudioActivity(value.levels);
        value.levels = [];
        recordSegment(value);
        if (active) enqueue(value, blob);
      };
      recorder.start();
      state(value, value.busy ? 'transcribing' : 'listening');
      value.clipTimer = setTimeout(() => {
        if (!current(value) || value.recorder !== recorder) return;
        try { recorder.stop(); } catch {
          fatal(value, error('音频分段失败，请重新开启字幕。', 'RECORDING'));
        }
      }, Math.max(4000, segmentMs));
    } catch (cause) {
      fatal(value, error(cause?.message || '此浏览器无法录制通话音频。', 'RECORDING'));
    }
  }

  return {
    supported,
    start() {
      if (session?.active) return true;
      if (!supported) throw error('此浏览器不支持通话音频转写，请使用新版 Safari。', 'UNSUPPORTED');
      const tracks = stream?.getAudioTracks?.().filter(track => track.readyState !== 'ended') || [];
      if (!tracks.length) throw error('通话麦克风尚未开启，请先接通通话。', 'NO_AUDIO');
      const value = {
        active: true, audioStream: new MediaStream(tracks), queue: [], busy: false,
        levels: [],
        recorder: null, request: null, clipTimer: null, requestTimer: null,
      };
      session = value;
      monitorAudio(value);
      recordSegment(value);
      return current(value);
    },
    stop() { close(session); },
  };
}
