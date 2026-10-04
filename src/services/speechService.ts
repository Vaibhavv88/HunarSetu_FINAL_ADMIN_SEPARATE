// Web Speech API wrapper for low-digital literacy users with Hindi/English support

export function speakText(text: string, language: 'en' | 'hi', onEnd?: () => void): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Cancel any existing speech
    // Clean markdown asterisks and hashtags for clean speech audio
    const cleanText = text.replace(/[*#_`]/g, '').replace(/\[.*?\]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95; // Slightly slower for low-literacy clarity
    utterance.pitch = 1.0;

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    // Try finding an Indian accent or Hindi voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v =>
      language === 'hi'
        ? v.lang.includes('hi') || v.name.includes('Hindi')
        : v.lang.includes('en-IN') || v.name.includes('India')
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    return false;
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export interface SpeechRecognitionListener {
  onResult: (transcript: string) => void;
  onError: (err: any) => void;
  onEnd: () => void;
}

export function startSpeechRecognition(language: 'en' | 'hi', listener: SpeechRecognitionListener): any {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    listener.onError(new Error('Speech recognition not supported in this browser.'));
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      listener.onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      listener.onError(event.error);
    };

    recognition.onend = () => {
      listener.onEnd();
    };

    recognition.start();
    return recognition;
  } catch (err) {
    listener.onError(err);
    return null;
  }
}
