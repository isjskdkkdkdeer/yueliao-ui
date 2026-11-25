const CLOUDFLARE_MODEL = '@cf/meta/m2m100-1.2b';
const GLM_MODEL = 'glm-4.5-flash';
const CLOUDFLARE_WAIT_MS = 2000;
const cloudflareLanguages = new Map([
  ['zh-CN', 'zh'],
  ['vi', 'vi'],
]);

/**
 * Call after the Worker has checked device identity, consent, input, and
 * charged the existing translation quota. Pass its existing deadline signal
 * and GLM function. Return the result through the existing response handler.
 *
 * The GLM function receives {text, source, target, model, signal} and should
 * return the same result it did before. Bind Workers AI as AI in the deployed
 * Worker. The binding needs no HTTP token.
 */
export async function translateWithFallback(env, {text, source, target, signal}, translateGlm) {
  signal.throwIfAborted();
  const sourceLang = cloudflareLanguages.get(source);
  const targetLang = cloudflareLanguages.get(target);

  if (env.AI && sourceLang && targetLang) {
    const attemptSignal = AbortSignal.any([signal, AbortSignal.timeout(CLOUDFLARE_WAIT_MS)]);
    let onAbort;
    try {
      const interrupted = new Promise((_, reject) => {
        onAbort = () => reject(attemptSignal.reason);
        attemptSignal.addEventListener('abort', onAbort, {once: true});
      });
      const result = await Promise.race([
        env.AI.run(CLOUDFLARE_MODEL, {
          text,
          source_lang: sourceLang,
          target_lang: targetLang,
        }),
        interrupted,
      ]);
      signal.throwIfAborted();
      const translated = result?.translated_text;
      if (typeof translated === 'string' && translated.length <= 6000 && translated.trim()) {
        return {text: translated.trim(), provider: 'cloudflare', model: CLOUDFLARE_MODEL};
      }
    } catch {
      // A provider error or short wait leaves the rest of the deadline for GLM.
    } finally {
      attemptSignal.removeEventListener('abort', onAbort);
    }
  }

  signal.throwIfAborted();
  return translateGlm({text, source, target, model: GLM_MODEL, signal});
}
