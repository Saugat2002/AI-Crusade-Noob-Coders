import React, { createContext, useState, useContext, ReactNode } from 'react';

interface TranscriptionContextType {
  accumulatedTranscriptions: string;
  addTranscription: (transcription: string) => void;
}

const TranscriptionContext = createContext<TranscriptionContextType | undefined>(undefined);

export const TranscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [accumulatedTranscriptions, setAccumulatedTranscriptions] = useState<string>("");

  const addTranscription = (transcription: string) => {
    setAccumulatedTranscriptions((prev) => prev + " " + transcription);
  };

  return (
    <TranscriptionContext.Provider value={{ accumulatedTranscriptions, addTranscription }}>
      {children}
    </TranscriptionContext.Provider>
  );
};

export const useTranscription = () => {
  const context = useContext(TranscriptionContext);
  if (context === undefined) {
    throw new Error('useTranscription must be used within a TranscriptionProvider');
  }
  return context;
};