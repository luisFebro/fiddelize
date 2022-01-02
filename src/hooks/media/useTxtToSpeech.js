// reference: https://wicg.github.io/speech-api/#tts-section
import { useEffect } from "react";
let utterance;

// onvoiceschanged to make sure the target selected voice is the one which is running...
window.speechSynthesis.onvoiceschanged = () => {
    if (!window.SpeechSynthesisUtterance) return null;
    utterance = new SpeechSynthesisUtterance();
    const allVoiceList = window.speechSynthesis.getVoices();

    // all br voices: eSpeak-PT eSpeak-PT+F2 Google português do Brasil (female)
    const brVoice = allVoiceList.find(
        (v) => v.name === "Google português do Brasil"
    );
    utterance.rate = 1; // This attribute specifies the speaking rate for the utterance. It is relative to the default rate for this voice. 1 is the default rate supported by the speech synthesis engine or specific voice (which should correspond to a normal speaking rate). 2 is twice as fast, and 0.5 is half as fast. Values below 0.1 or above 10 are strictly disallowed, but speech synthesis engines or specific voices may constrain the minimum and maximum rates further, for example, a particular voice may not actually speak faster than 3 times normal even if you specify a value larger than 3. If SSML is used, this value will be overridden by prosody tags in the markup.
    utterance.volume = 1; // This attribute specifies the speaking volume for the utterance. It ranges between 0 and 1 inclusive, with 0 being the lowest volume and 1 the highest volume, with a default of 1. If SSML is used, this value will be overridden by prosody tags in the markup.
    utterance.pitch = 1; // This attribute specifies the speaking pitch for the utterance. It ranges between 0 and 2 inclusive, with 0 being the lowest pitch and 2 the highest pitch. 1 corresponds to the default pitch of the speech synthesis engine or specific voice. Speech synthesis engines or voices may constrain the minimum and maximum rates further. If SSML is used, this value will be overridden by prosody tags in the markup.
    utterance.localService = true;
    utterance.voice = brVoice;

    return null;
};

export default function useTxtToSpeech(autoplayTxt) {
    function speak(txt) {
        if (!window.speechSynthesis) return;
        if (utterance) {
            utterance.text = txt;
            speechSynthesis.speak(utterance);
        }
    }

    useEffect(() => {
        if (autoplayTxt) speak(autoplayTxt);
    }, [autoplayTxt]);

    return speak;
}
