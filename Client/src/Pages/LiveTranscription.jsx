import { useState, useRef } from "react";

const AudioTranscriber = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const mediaRecorderRef = useRef(null);
    const socketRef = useRef(null);

    const startRecording = async () => {
        setTranscript("");

        try {
            socketRef.current = new WebSocket("wss://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&interim_results=false", [
                "token",
                "b4054c210f01b3a751034d1d400c1ac6e3c7ea3f",
            ]);

            socketRef.current.onopen = () => {
                console.log("Connected to Deepgram");
            };

            socketRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.channel.alternatives[0]?.transcript) {
                    setTranscript((prev) => prev + " " + data.channel.alternatives[0].transcript);
                }
            };

            socketRef.current.onclose = () => {
                console.log("WebSocket closed");
            };

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.send(event.data);
                }
            };

            mediaRecorder.start(500);
            setIsRecording(true);
        } catch (error) {
            console.error("Error starting transcription:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }

        if (socketRef.current) {
            socketRef.current.close();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-xl font-bold text-gray-800">AI Live Transcription</h1>
                <div className="mt-4">
                    {!isRecording ? (
                        <button
                            onClick={startRecording}
                            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                        >
                            Start Recording
                        </button>
                    ) : (
                        <button
                            onClick={stopRecording}
                            className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                        >
                            Stop Recording
                        </button>
                    )}
                </div>
                {transcript && (
                    <div className="mt-4 p-4 bg-gray-50 rounded">
                        <p className="text-gray-800">{transcript}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AudioTranscriber;