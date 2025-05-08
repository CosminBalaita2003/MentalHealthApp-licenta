import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchEmotionInsightVectors } from "../services/insightService";
import { getUserTestSummaries } from "../services/testService";
import { getChatCompletion } from "../services/openaiService";
import { getUserProgress } from "../services/progressService";
import exerciseService from "../services/exerciseService";

export const getPersonalizedDailyTips = async () => {
  const today = new Date().toISOString().split("T")[0];

  // 👇 Eliminat caching, dar se poate readăuga aici dacă vrei.
  await AsyncStorage.removeItem("personalized_tips_cache");

  try {
    const [emotionData, testSummaryData, allExercises, userString] = await Promise.all([
      fetchEmotionInsightVectors(),
      getUserTestSummaries(),
      exerciseService.getAllExercises(),
      AsyncStorage.getItem("user"),
    ]);

    if (!emotionData || !testSummaryData.success || !userString) {
      throw new Error("Missing data");
    }

    const user = JSON.parse(userString);
    const userProgress = await getUserProgress(user.id);

    const { declaredByUser, detectedFromJournal, detectedFromBreathing } = emotionData;
    const summaries = testSummaryData.summaries;

    const testContext = Object.values(summaries)
      .map((data) => {
        return `Recently, you’ve shown signs of ${data.latestInterpretation.toLowerCase()} and a general trend of ${data.averageInterpretation.toLowerCase()}.`;
      })
      .join(" ");

    const categories = [
  ...new Set(allExercises.map((ex) => ex.category?.name).filter(Boolean)),
];


    const totalExercises = userProgress?.filter(p => p.exerciseId).length || 0;
    const progressContext = `You’ve completed ${totalExercises} exercises so far, showing consistency in self-care.`

    const prompt = `
You're a compassionate mental health companion. Write a short, warm message (max 5 sentences, 2 short paragraphs) to someone who recently added a journal entry, completed a self-assessment, and finished a mindfulness exercise.

The first paragraph should acknowledge their effort and emotional state based on recent activity. Do not directly name their feelings, but show attunement. Avoid judgment.

The second paragraph should offer gentle encouragement and, if fitting, suggest 1–2 practice categories like a therapist in a casual talk — not as a list.

Avoid structured formatting. Use a friendly tone. Refer to the user as "you".

Self-perception: ${declaredByUser.join(", ") || "none"}
Journal insights: ${detectedFromJournal.join(", ") || "none"}
Facial expressions: ${detectedFromBreathing.join(", ") || "none"}
Mental health trends: ${testContext}
Activity summary: ${progressContext}
Available practice categories: ${categories.join(", ")}
    `.trim();

    console.log(prompt);
    const aiResponse = await getChatCompletion([
      { role: "user", content: prompt }
    ]);

    const cleanMessage = aiResponse.trim().replace(/^[•\-\—\d\s]*\s*/, '');

    console.log("🧠 AI Daily Tip:", cleanMessage);
    return [cleanMessage];
  } catch (error) {
    console.error("❌ Failed to generate tips:", error.message);
    return ["Take a deep breath. You're doing your best – and that’s more than enough."];
  }
};
