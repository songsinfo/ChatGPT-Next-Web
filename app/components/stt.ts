import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const serviceRegion = "eastus"; // 例如 "westus"
// 创建语音识别器
export default function recognizeSpeech(): Promise<string> {
  let subscriptionKey = process.env.NEXT_PUBLIC_AZURE_TTS_KEY || "";
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    subscriptionKey,
    serviceRegion,
  );
  // 设置语音识别的语言
  speechConfig.speechRecognitionLanguage = "zh-CN";
  const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
  return new Promise<string>((resolve, reject) => {
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    console.log("开始语音识别，请说话...");
    recognizer.recognizeOnceAsync(
      (result) => {
        console.log(`识别结果： ${result.text}`);
        recognizer.close();
        resolve(result.text);
      },
      (err) => {
        console.trace("出现错误： ", err);
        recognizer.close();
        reject(err);
      },
    );
  });
}
