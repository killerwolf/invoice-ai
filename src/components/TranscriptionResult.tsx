import type React from "react";

interface TranscriptionResultProps {
  result: string;
}

const TranscriptionResult: React.FC<TranscriptionResultProps> = ({
  result,
}) => {
  return (
    <div className="transcription-result">
      <h2>Résultat de la transcription</h2>
      <p>{result}</p>
    </div>
  );
};

export default TranscriptionResult;
