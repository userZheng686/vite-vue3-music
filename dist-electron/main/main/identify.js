function cutAudio(buffer) {
  return new Promise((resolve) => {
    let audioCtx = new AudioContext();
    audioCtx.decodeAudioData(buffer).then(function(audioBuffer) {
      let channels = audioBuffer.numberOfChannels;
      let rate = audioBuffer.sampleRate;
      let startOffset = 0;
      let endOffset = rate * 8;
      let frameCount = endOffset - startOffset;
      let newAudioBuffer = new AudioContext().createBuffer(channels, endOffset - startOffset, rate);
      let anotherArray = new Float32Array(frameCount);
      let offset = 0;
      for (let channel = 0; channel < channels; channel++) {
        audioBuffer.copyFromChannel(anotherArray, channel, startOffset);
        newAudioBuffer.copyToChannel(anotherArray, channel, offset);
      }
      resolve(newAudioBuffer);
    });
  });
}
