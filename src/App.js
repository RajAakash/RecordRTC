import React, { useEffect } from "react";
import RecordRTC, { invokeSaveAsDialog } from "recordrtc";

const App = () => {
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
        recorder.startRecording();

        const sleep = (m) => new Promise((r) => setTimeout(r, m));
        await sleep(15000);

        // recorder.stopRecording(function () {
        //   let blob = recorder.getBlob();
        //   invokeSaveAsDialog(blob);
        // });
      });
  };
  const stopRecording = async () => {
    let stream = MediaDevices.getUserMedia({
      video: true,
      audio: true,
    }).then(async function (stream) {
      var recorder = RecordRTC(stream, {
        type: "video",
        timeSlice: 1000,
      });

      await recorder.stopRecording();
      let blob = await recorder.getBlob();
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
