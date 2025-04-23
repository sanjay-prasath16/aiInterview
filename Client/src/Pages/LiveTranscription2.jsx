import { useState, useRef } from 'react';

function App() {
    const [transcript, setTranscript] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const socketRef = useRef(null);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        socketRef.current = new WebSocket('ws://localhost:5555/listen');

        mediaRecorderRef.current.addEventListener('dataavailable', async (event) => {
            if (event.data.size > 0 && socketRef.current.readyState === 1) {
                socketRef.current.send(event.data);
            }
        });

        socketRef.current.onmessage = (message) => {
            setTranscript(prev => prev + ' ' + message.data);
        };

        mediaRecorderRef.current.start(250);
        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        socketRef.current.close();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Live Transcription</h1>
            <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-4 py-2 font-semibold text-sm bg-${isRecording ? 'red' : 'blue'}-500 text-white rounded-full shadow-sm`}
            >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <p className="mt-4 w-full max-w-md p-4 bg-white shadow rounded-lg">
                {transcript}
            </p>
        </div>
    );
}

export default App;