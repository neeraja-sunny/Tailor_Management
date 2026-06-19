"use client";

import { useEffect, useRef, useState } from "react";
import { AudioLinesIcon, StopCircleIcon } from "lucide-react";

interface AudioRecorderProps {
  onRecorded: (file: File) => void;
}

export default function AudioRecorder({ onRecorded }: AudioRecorderProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });

      const file = new File([audioBlob], "instruction.webm", {
        type: "audio/webm",
      });

      onRecorded(file);
      audioChunksRef.current = [];
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="space-y-2">
      {!recording ? (
        <button
          onClick={startRecording}
          className="px-4 py-2 border border-emerald-600 text-emerald-600 font-semibold rounded-lg"
        >
            <AudioLinesIcon />Record Audio
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="px-4 py-2 border border-red-600 font-semibold text-red-600 rounded"
        >
            <StopCircleIcon />Stop Recording
        </button>
      )}
    </div>
  );
}
