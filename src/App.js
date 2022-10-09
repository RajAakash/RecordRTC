import React, { useEffect, useRef, useState } from "react";
import RecordRTC from "recordrtc";
import { io } from "socket.io-client";
import { appendBuffer } from "./utils/AppendBuffer";
import { ArrayBufferToBlob } from "./utils/ArrayBufferToBlob";
import { BlobtoArrayBuffer } from "./utils/BlobToArrayBuffer";

const App = () => {
  const recorder = useRef(null);
  const myVideoRef = useRef(null);
  const socket = useRef(null);
  const playbackRef = useRef(null);
  const [halted, setHalted] = useState(false);
  const [chunk, setChunk] = useState([]);

  useEffect(() => {
    socket.current = io("http://localhost:4000");
  }, []);

  useEffect(() => {
    if (!halted && chunk.length > 1) {
      playbackRef.current.src = URL.createObjectURL(
        ArrayBufferToBlob(chunk[0])
      );
      playbackRef.current.play();
      setHalted(false);
    }
    if (chunk.length > 2) {
      let chunks = chunk.slice(1);
      setChunk(chunks);
    }
    if (socket.current) {
      socket.current.on("stream", (ch) => {
        setChunk((prev) => [...prev, ch]);
      });
    }
  }, [socket, chunk, halted]);
  const onEnded = () => {
    playbackRef.current.src = URL.createObjectURL(ArrayBufferToBlob(chunk[1]));
    playbackRef.current.play();
  };

  const [stream, setStream] = useState(null);
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
    setStream(stream);
    myVideoRef.current.srcObject = stream;

    window.stream = stream;
    var rec = RecordRTC(stream, {
      type: "video/webm;codecs=vp9",
      timeSlice: 5000,
      ondataavailable: async function (blob) {
        const arrayBuffer = await BlobtoArrayBuffer(blob);
        socket.current.emit("buffer", arrayBuffer);
      },
    });

    rec.startRecording();
    recorder.current = rec;
  };
  const stopRecording = async () => {
    recorder.current.stopRecording(async function () {
      let blob = recorder.current.getBlob();
      const arrayBuffer = await BlobtoArrayBuffer(blob);
      socket.current.emit("buffer", arrayBuffer);
      for (const track of stream.getTracks()) {
        track.stop();
      }
      recorder.current = null;
    });
  };

  return (
    <div>
      <p>Hello</p>
      {!recorder.current ? (
        <button onClick={startRecording}> Start recording</button>
      ) : (
        <button onClick={stopRecording}> Stop recording</button>
      )}
      <h2>My Preview</h2>
      <video ref={myVideoRef} autoPlay controls muted></video>

      <video ref={playbackRef} controls onEnded={onEnded}></video>
    </div>
  );
};

export default App;
