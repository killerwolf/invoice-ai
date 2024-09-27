import React from 'react';

interface TranscriptionResultProps {
  result: string;
}

const TranscriptionResult: React.FC<TranscriptionResultProps> = ({ result }) => {
  return (
    <div className="transcription-result">
      <h2>Transcription Result</h2>
      <p>{result}</p>
    </div>
  );
};

export default TranscriptionResult;
