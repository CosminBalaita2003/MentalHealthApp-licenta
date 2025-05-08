import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchEmotionInsightVectors } from "../services/insightService";
import { getUserTestSummaries } from "../services/testService";
import { getChatCompletion } from "../services/openaiService";
import exerciseService from "../services/exerciseService";

const STORAGE_KEY = "personalized_tips_cache";
export const getPersonalizedDailyTips = async () => {
  const today = new Date().toISOString().split("T")[0];
  // if (!force) {
  //   const cached = await AsyncStorage.getItem(STORAGE_KEY);
  //   if (cached) {
  //     const { tips, date } = JSON.parse(cached);
  //     if (date === today && tips?.length) return tips;
  //   }
  // }
  await AsyncStorage.removeItem(STORAGE_KEY);
  // 1. Fetch emotion & test data
  const [emotionData, testSummaryData, allExercises] = await Promise.all([
    fetchEmotionInsightVectors(),
    getUserTestSummaries(),
    exerciseService.getAllExercises(),
  ]);

  if (!emotionData || !testSummaryData.success) {
    return ["Take a deep breath. You're doing your best - and that's enough."];
  }

  const { declaredByUser, detectedFromJournal, detectedFromBreathing } = emotionData;
  const summaries = testSummaryData.summaries;

  const testContext = Object.values(summaries)
    .map((data) => {
      return `Recently, you’ve shown signs of ${data.latestInterpretation.toLowerCase()} and have had a general trend of ${data.averageInterpretation.toLowerCase()}.`;
    })
    .join(" ");

  const categories = [
    ...new Set(allExercises.map((ex) => ex.category).filter(Boolean)),
  ];

  const prompt = `
  You're a compassionate mental health companion. Write a short, warm message (two short paragraphs, no more than 5 total sentences) to someone who recently expressed inner thoughts in a journal and went through breathing-based reflection.
  
  The first paragraph should acknowledge their effort and inner state in a gentle way - without labeling their emotions directly. Just reflect what someone like them might be going through.
  
  The second paragraph should offer kind, human guidance or encouragement. If it feels appropriate, you may softly suggest 1–2 relevant practices from the categories below, but do not present them as a list. Integrate them naturally into the message, like a therapist would during a casual, safe conversation.
  
  Avoid using any bullets, lists, or structured formatting. Keep the tone warm, clear, and human. Write directly to the user, using "you".
  
  Self-perception: ${declaredByUser.join(", ") || "none"}
  Journal insights: ${detectedFromJournal.join(", ") || "none"}
  Facial patterns during breathing: ${detectedFromBreathing.join(", ") || "none"}
  Well-being trends: ${testContext}
  Available practice categories: ${categories.join(", ")}
  `;
  

  const aiResponse = await getChatCompletion([
    { role: "user", content: prompt.trim() },
  ]);

  const message = aiResponse.trim();
  console.log("AI Response:", message);
  const cleanMessage = message.replace(/^[•\-\d\s]*\s*/, '');

  return [cleanMessage];
};
