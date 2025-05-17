import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchEmotionInsightVectors } from "../services/insightService";
import { getUserTestSummaries } from "../services/testService";
import { getChatCompletion } from "../services/openaiService";
import { getUserProgress } from "../services/progressService";
import exerciseService from "../services/exerciseService";
export const getPersonalizedDailyTips = async () => {
  const today = new Date().toISOString().split("T")[0];

  await AsyncStorage.removeItem("personalized_tips_cache");

  try {
    const [emotionDataRaw, testSummaryDataRaw, allExercisesRaw, userStringRaw] = await Promise.allSettled([
      fetchEmotionInsightVectors(),
      getUserTestSummaries(),
      exerciseService.getAllExercises(),
      AsyncStorage.getItem("user"),
    ]);

    const emotionData = emotionDataRaw.status === "fulfilled" ? emotionDataRaw.value : null;
    const testSummaryData = testSummaryDataRaw.status === "fulfilled" ? testSummaryDataRaw.value : { success: false };
    const allExercises = allExercisesRaw.status === "fulfilled" ? allExercisesRaw.value : [];
    const userString = userStringRaw.status === "fulfilled" ? userStringRaw.value : null;
    const user = userString ? JSON.parse(userString) : null;

    const userProgress = user?.id
      ? await getUserProgress(user.id).catch(() => null)
      : null;

    const { declaredByUser = [], detectedFromJournal = [], detectedFromBreathing = [] } = emotionData || {};
    const summaries = testSummaryData.success ? testSummaryData.summaries : {};

    const categories = Array.isArray(allExercises)
      ? [...new Set(allExercises.map((ex) => ex.category?.name).filter(Boolean))]
      : [];

    const totalExercises = userProgress?.filter(p => p.exerciseId).length || 0;

    const testContext = Object.values(summaries)
      .map((data) => {
        return `Recently, you’ve shown signs of ${data.latestInterpretation?.toLowerCase()} and a general trend of ${data.averageInterpretation?.toLowerCase()}.`;
      })
      .join(" ");

    const progressContext = totalExercises > 0
      ? `You’ve completed ${totalExercises} exercises so far, showing consistency in self-care.`
      : null;

    // 🧠 Pregătim datele pentru prompt
    const promptSections = {
      selfPerception: declaredByUser.length > 0 ? declaredByUser.join(", ") : null,
      journalInsights: detectedFromJournal.length > 0 ? detectedFromJournal.join(", ") : null,
      breathingEmotions: detectedFromBreathing.length > 0 ? detectedFromBreathing.join(", ") : null,
      testContext: testContext || null,
      progressContext,
      categories: categories.length > 0 ? categories.join(", ") : null,
    };

    const meaningful = Object.values(promptSections).some(Boolean); // măcar un element existent

    if (!meaningful) {
      return ["Take a deep breath. You're doing your best – and that’s more than enough."];
    }

    const prompt = `
You're a compassionate mental health companion. Write a short, warm message (max 5 sentences, 2 short paragraphs) to someone who recently added a journal entry, completed a self-assessment, or finished a mindfulness exercise.

The first paragraph should acknowledge their effort and emotional state based on recent activity. Do not directly name their feelings, but show attunement. Avoid judgment.

The second paragraph should offer gentle encouragement and, if fitting, suggest 1–2 practice categories like a therapist in a casual talk — not as a list.

Avoid structured formatting. Use a friendly tone. Refer to the user as "you".

Self-perception: ${promptSections.selfPerception || "none"}
Journal insights: ${promptSections.journalInsights || "none"}
Facial expressions: ${promptSections.breathingEmotions || "none"}
Mental health trends: ${promptSections.testContext || "none"}
Activity summary: ${promptSections.progressContext || "none"}
Available practice categories: ${promptSections.categories || "none"}
    `.trim();
    console.log("Prompt for AI:", prompt);
    const aiResponse = await getChatCompletion([{ role: "user", content: prompt }]);

if (!aiResponse || aiResponse.trim().length === 0) {
  throw new Error("AI response was empty");
}

const cleanMessage = aiResponse.trim().replace(/^[•\-\—\d\s]*\s*/, '');
return [cleanMessage];

  } catch (error) {
    console.error("❌ Failed to generate tips:", error.message);
    return ["Take a deep breath. You're doing your best – and that’s more than enough."];
  }
};
