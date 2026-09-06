let activeAudio;
let generation = 0;
let cancelPending;

export function stopSpeech() {
  generation += 1;
  cancelPending?.();
  cancelPending = undefined;
  if (activeAudio) { activeAudio.pause(); activeAudio.removeAttribute('src'); activeAudio.load(); activeAudio = undefined; }
  window.speechSynthesis?.cancel();
}

export function speakWord(word) {
  stopSpeech();
  const token = generation;
  return new Promise(resolve => {
    let settled = false;
    let fallbackStarted = false;
    let timer;
    const finish = result => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (token === generation) cancelPending = undefined;
      resolve(result);
    };
    cancelPending = () => finish('cancelled');
    const fallback = () => {
      if (token !== generation || settled || fallbackStarted) return;
      fallbackStarted = true;
      if (activeAudio) { activeAudio.pause(); activeAudio.removeAttribute('src'); activeAudio = undefined; }
      if (!window.speechSynthesis) return finish('unavailable');
      const speech = new SpeechSynthesisUtterance(word);
      speech.lang = 'en-US'; speech.rate = 0.8;
      const voice = window.speechSynthesis.getVoices().find(v => /^en[-_]US$/i.test(v.lang));
      if (voice) speech.voice = voice;
      speech.onend = () => finish('played');
      speech.onerror = () => finish('unavailable');
      clearTimeout(timer);
      timer = setTimeout(() => { window.speechSynthesis.cancel(); finish('unavailable'); }, 12000);
      window.speechSynthesis.speak(speech);
    };
    activeAudio = new Audio(`https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=0`);
    activeAudio.onended = () => finish('played');
    activeAudio.onerror = fallback;
    activeAudio.onplaying = () => clearTimeout(timer);
    timer = setTimeout(fallback, 3000);
    activeAudio.play().catch(fallback);
  });
}
