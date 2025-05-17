import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OPENAI_API_KEY } from '@env';
import { API_URL } from "@env";
import { TTS_API_URL } from "@env";

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export const getChatCompletion = async (messages) => {
  try {
    const response = await axios.post(
      OPENAI_URL,
      {
        model: "gpt-4.1-mini", // sau "gpt-4"
        messages,
        temperature: 0.85,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    console.log("🤖 OpenAI raw content:", content);

    if (!content || content.trim().length === 0) {
      throw new Error("OpenAI returned empty response");
    }

    return content.trim();
  } catch (error) {
    console.error('❌ OpenAI error:', error.response?.data || error.message);
    throw error;
  }
};
