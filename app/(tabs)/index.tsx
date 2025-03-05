import { StyleSheet } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { AudioContext, StretcherNode } from "react-native-audio-api";

export default function HomeScreen() {
  const [rate, setRate] = useState(100);
  const [rate2, setRate2] = useState(100);
  const stretchNodeRef = useRef<StretcherNode | null>(null);
  const stretchNodeRef2 = useRef<StretcherNode | null>(null);
  const aCtxRef = useRef<AudioContext | null>(null);
  const hasRun = useRef(false);
  const [isReady, setIsReady] = useState(false);

  const onStartPress = useCallback(async () => {
    console.log(aCtxRef.current?.state);
    if (aCtxRef.current?.state === "suspended") {
      await aCtxRef.current.resume();
    }

    if (stretchNodeRef.current) {
      try {
        stretchNodeRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  }, [rate]);

  const onStartPress2 = useCallback(async () => {
    console.log(aCtxRef.current?.state);
    if (aCtxRef.current?.state === "suspended") {
      await aCtxRef.current.resume();
    }

    if (stretchNodeRef2.current) {
      try {
        stretchNodeRef2.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  }, [rate]);

  useEffect(() => {
    if (stretchNodeRef.current) {
      stretchNodeRef.current.playbackRate = rate / 100.0;
    }
  }, [rate]);

  useEffect(() => {
    if (stretchNodeRef2.current) {
      stretchNodeRef2.current.playbackRate = rate2 / 100.0;
    }
  }, [rate2]);

  useEffect(() => {
    if (hasRun.current) {
      return;
    }

    hasRun.current = true;
    async function loadExample() {
      console.log("loading example");
      const aCtx = new AudioContext();

      const stretchNode = await aCtx.createStretcher();
      const stereo1 = aCtx.createStereoPanner();

      stereo1.pan.value = -1;
      stretchNode.connect(stereo1);
      stereo1.connect(aCtx.destination);

      console.log("1231231");
      const audioBuffer = await aCtx.decodeAudioDataSource("/exzoltraak.mp3");

      aCtxRef.current = aCtx;
      stretchNodeRef.current = stretchNode;

      stretchNode.buffer = audioBuffer;

      const stretchNode2 = await aCtx.createStretcher();
      const audioBuffer2 = await aCtx.decodeAudioDataSource("/muzak.mp3");
      const stereo2 = aCtx.createStereoPanner();
      stereo2.pan.value = 1;

      stretchNode2.connect(stereo2);
      stereo2.connect(aCtx.destination);

      stretchNode2.buffer = audioBuffer2;
      stretchNodeRef2.current = stretchNode2;

      setIsReady(true);
    }

    loadExample();
  });

  return (
    <div
      style={{
        padding: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        paddingTop: 160,
      }}
    >
      <div>
        <button type="button" onClick={onStartPress} disabled={!isReady}>
          Start 1
        </button>
        <button type="button" onClick={onStartPress2} disabled={!isReady}>
          Start 2
        </button>
      </div>
      <br />
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "16px",
          color: "white",
        }}
      >
        <label htmlFor="rate">Rate: {(rate / 100.0).toFixed(2)}</label>
        <input
          id="rate"
          type="range"
          min="25"
          max="500"
          step="1"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "16px",
          color: "white",
        }}
      >
        <label htmlFor="rate">Rate2: {(rate2 / 100.0).toFixed(2)}</label>
        <input
          id="rate"
          type="range"
          min="25"
          max="500"
          step="1"
          value={rate2}
          onChange={(e) => setRate2(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
