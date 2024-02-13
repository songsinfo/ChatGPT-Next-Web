import * as sdk from "microsoft-cognitiveservices-speech-sdk";

// 这些信息应该从环境变量或配置文件中获取，不应硬编码在脚本中。
const serviceRegion = "eastus"; // 例如 "westus"
export default function convertTextToSpeech(text: string) {
  let subscriptionKey = process.env.NEXT_PUBLIC_AZURE_TTS_KEY || "";
  // 创建语音识别器
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    subscriptionKey,
    serviceRegion,
  );
  return new Promise((resolve, reject) => {
    speechConfig.speechSynthesisVoiceName = "zh-CN-XiaoshuangNeural"; // 使用 Azure 提供的声音名列表，选择合适的声音

    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput(); // 设置音频输出来自默认扬声器

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(
      text,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          resolve("Speech synthesis completed successfully.");
        } else {
          reject(`Text to speech failed. Reason: ${result.reason}`);
        }
        synthesizer.close();
      },
      (error) => {
        console.error(error);
        synthesizer.close();
        reject(error);
      },
    );
  });
}
