export const safeQuestion = (answer: ExamAttemptAnswer) => answer.exam_question ?? ({} as ExamQuestion);
