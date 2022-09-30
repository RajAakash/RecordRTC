import React, { useEffect, useState } from "react";
import RecordRTC, { invokeSaveAsDialog } from "recordrtc";

const App = () => {
  const [recorder, setRecorder] = useState();

  const startRecording = () => {
    navigator.mediaDevices
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
