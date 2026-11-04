import { useState, useEffect, useRef, useCallback } from 'react';

interface UseVoiceConversationOptions {
  onTranscript: (text: string) => void;
  onError?: (error: string) => void;
  autoPlayResponses?: boolean;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function useVoiceConversation({ 
  onTranscript, 
  onError,
  autoPlayResponses = true 
}: UseVoiceConversationOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isProcessingAudioRef = useRef(false);
  const currentAudioUrlRef = useRef<string | null>(null);
  
  // Store callbacks in refs to avoid effect re-runs
  const onTranscriptRef = useRef(onTranscript);
  const onErrorRef = useRef(onError);
  
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
    onErrorRef.current = onError;
  }, [onTranscript, onError]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-GB'; // British English
      
      recognition.addEventListener('result', (event: Event) => {
        const speechEvent = event as SpeechRecognitionEvent;
        const transcript = speechEvent.results[0][0].transcript;
        onTranscriptRef.current(transcript);
        setIsListening(false);
      });
      
      recognition.addEventListener('error', (event: Event) => {
        const errorEvent = event as SpeechRecognitionErrorEvent;
        console.error('Speech recognition error:', errorEvent.error);
        onErrorRef.current?.(errorEvent.error);
        setIsListening(false);
      });
      
      recognition.addEventListener('end', () => {
        setIsListening(false);
      });
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // Clean up current audio and queue on unmount
      if (currentAudioUrlRef.current) {
        URL.revokeObjectURL(currentAudioUrlRef.current);
        currentAudioUrlRef.current = null;
      }
      audioQueueRef.current.forEach(url => URL.revokeObjectURL(url));
      audioQueueRef.current = [];
    };
  }, []); // Empty deps - only run once

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start recognition:', error);
      onErrorRef.current?.('Failed to start voice recognition');
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    
    recognitionRef.current.stop();
    setIsListening(false);
  }, [isListening]);

  const processAudioQueue = useCallback(async () => {
    if (isProcessingAudioRef.current || audioQueueRef.current.length === 0) {
      return;
    }

    isProcessingAudioRef.current = true;
    const audioUrl = audioQueueRef.current.shift()!;
    currentAudioUrlRef.current = audioUrl; // Track current audio

    try {
      setIsSpeaking(true);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      await new Promise<void>((resolve, reject) => {
        audio.addEventListener('ended', () => {
          URL.revokeObjectURL(audioUrl);
          currentAudioUrlRef.current = null;
          setIsSpeaking(false);
          resolve();
        });
        audio.addEventListener('error', (e) => {
          URL.revokeObjectURL(audioUrl);
          currentAudioUrlRef.current = null;
          setIsSpeaking(false);
          reject(e);
        });
        audio.play().catch(reject);
      });
    } catch (error) {
      console.error('Audio playback error:', error);
      // Clean up on play() rejection
      URL.revokeObjectURL(audioUrl);
      currentAudioUrlRef.current = null;
      setIsSpeaking(false);
    } finally {
      isProcessingAudioRef.current = false;
      if (audioQueueRef.current.length > 0) {
        processAudioQueue();
      }
    }
  }, []);

  const speak = useCallback(async (text: string) => {
    if (!autoPlayResponses) return;

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'fable' }), // Male British voice
      });

      if (!response.ok) {
        throw new Error('TTS request failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      audioQueueRef.current.push(audioUrl);
      processAudioQueue();
    } catch (error) {
      console.error('TTS error:', error);
      onErrorRef.current?.('Failed to generate speech');
    }
  }, [autoPlayResponses, processAudioQueue]);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Clean up current audio
    if (currentAudioUrlRef.current) {
      URL.revokeObjectURL(currentAudioUrlRef.current);
      currentAudioUrlRef.current = null;
    }
    // Clean up all pending blob URLs
    audioQueueRef.current.forEach(url => URL.revokeObjectURL(url));
    audioQueueRef.current = [];
    setIsSpeaking(false);
    isProcessingAudioRef.current = false;
  }, []);

  return {
    isListening,
    isSpeaking,
    isSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
