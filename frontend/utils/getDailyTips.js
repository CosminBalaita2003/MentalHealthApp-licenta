// utils/getPersonalizedDailyTips.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchEmotionInsightVectors } from "../services/insightService";
import { getUserTestSummaries } from "../services/testService";
import exerciseService from "../services/exerciseService";
import { getUserProgress } from "../services/progressService";
import { getChatCompletion } from "../services/openaiService";

const CACHE_KEY = "personalized_tips_cache";

export const getPersonalizedDailyTips = async () => {
  try {
    // 1. Încarcă cache-ul
    const cacheRaw = await AsyncStorage.getItem(CACHE_KEY);
    const cache = cacheRaw ? JSON.parse(cacheRaw) : null;

    // 2. Fetch date actuale
    const [
      emotionDataRaw,
      testSummaryDataRaw,
      allExercisesRaw,
      userStringRaw
    ] = await Promise.allSettled([
      fetchEmotionInsightVectors(),
      getUserTestSummaries(),
      exerciseService.getAllExercises(),
      AsyncStorage.getItem("user")
    ]);

    const emotionData = emotionDataRaw.status === "fulfilled" ? emotionDataRaw.value : {};
    const testSummaryData = testSummaryDataRaw.status === "fulfilled" && testSummaryDataRaw.value.success
      ? testSummaryDataRaw.value.summaries
      : {};
    const allExercises = allExercisesRaw.status === "fulfilled" ? allExercisesRaw.value : [];
    const user = userStringRaw.status === "fulfilled" && userStringRaw.value
      ? JSON.parse(userStringRaw.value)
      : null;

    // 3. Deriveşte lista de emoţii unice
    const declared   = emotionData.declaredByUser    || [];
    const journaled  = emotionData.detectedFromJournal|| [];
    const breathed   = emotionData.detectedFromBreathing || [];
    const emotions   = Array.from(new Set([...declared, ...journaled, ...breathed]));

    // 4. Deriveşte lista de exerciţii finalizate (doar id-uri)
    const progress = user
      ? await getUserProgress(user.id).catch(() => [])
      : [];
    const exercises = Array.from(new Set(progress.map(p => p.exerciseId)));

    // 5. Deriveşte lista testelor făcute (cheile din summaries)
    const tests = Object.keys(testSummaryData);

    // 6. Compară cu cache
    const sortedEq = (a, b) =>
      Array.isArray(a) &&
      Array.isArray(b) &&
      JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());

    if (
      cache &&
      sortedEq(cache.emotions, emotions) &&
      sortedEq(cache.exercises, exercises) &&
      sortedEq(cache.tests, tests)
    ) {
      // nimic nou → returnează sfaturile din cache
      return cache.tips;
    }

    // 7. Construieşte contextul pentru prompt
    const totalExercises = exercises.length;
    const progressContext = totalExercises
      ? `You’ve completed ${totalExercises} exercises so far, showing consistency.`
      : null;

    const testContext = tests.length
      ? `You’ve taken ${tests.join(", ")} tests recently.`
      : null;

    const categories = [...new Set(
      allExercises.map(ex => ex.category?.name).filter(Boolean)
    )];

    // 8. Dacă nu e nimic de spus
    const meaningful = emotions.length || testContext || progressContext || categories.length;
    if (!meaningful) {
      return ["Take a deep breath. You’re doing your best – and that’s more than enough."];
    }

    // 9. Formează promptul şi apelează AI-ul
    const prompt = `
You’re a compassionate mental health companion. Write a short, warm message (max 5 sentences) acknowledging:
• recent emotions: ${emotions.join(", ") || "none"}  
• recent progress: ${progressContext || "none"}  
• recent tests: ${testContext || "none"}.  
Then offer gentle encouragement and suggest 1–2 practice categories like ${categories.slice(0,2).join(" or ")}.
Without mentioning specific counts or naming emotions/tests directly.
    `.trim();

    const aiResp = await getChatCompletion([{ role: "user", content: prompt }]);
    const clean = aiResp?.trim().replace(/^[•\-\—\d\s]*/,"") ||
      "Take a deep breath. You’re doing your best – and that’s enough.";

    // 10. Salvează noua stare + mesaj în cache
    const newCache = { emotions, exercises, tests, tips: [clean] };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(newCache));

    return [clean];

  } catch (error) {
    console.error("❌ Failed to generate tips:", error);
    return ["Take a deep breath. You’re doing your best – and that’s enough."];
  }
};
