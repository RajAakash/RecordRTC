import React, { useEffect, useState } from "react";
import RecordRTC, { invokeSaveAsDialog } from "recordrtc";

const App = () => {
  const [recorder, setRecorder] = useState();
  const [stream, setStream] = useState();

  const startRecording = () => {
    const stream = navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then(async function (stream) {
        var recorder = RecordRTC(stream, {
          type: "video",
          timeSlice: 1000,
        });
        console.log("RECORDER", recorder);
        recorder.startRecording();

        setRecorder(recorder);
        setStream(stream);

        const sleep = (m) => new Promise((r) => setTimeout(r, m));
        await sleep(15000);

        // recorder.stopRecording(function () {
        //   let blob = recorder.getBlob();
        //   invokeSaveAsDialog(blob);
        // });
      });
  };
  const stopRecording = async () => {
    recorder.stopRecording(function () {
      let blob = recorder.getBlob();
      invokeSaveAsDialog(blob);

      stream.getTracks().forEach(function (track) {
        track.stop();
        console.log("STOP hune", stream);
      });
    });
  };

  return (
    <div>
      <button onClick={startRecording}> Start recording</button>
      <button onClick={stopRecording}> Stop recording</button>
    </div>
  );
};

export default App;
