export interface QuizQuestion {
    question: string;
    options?: string[];
    answer: string;
    type: 'mcq' | 'boolean' | 'fill';
}

export const generateQuiz = async (content: string): Promise<QuizQuestion[]> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mocked AI responses based on common neurodivergent-friendly strategies
    // (Clear instructions, manageable units)
    return [
        {
            type: 'mcq',
            question: "What is the primary design philosophy of Lumiu?",
            options: ["Gamified competition", "Sensory-safe and calm", "Streak-based pressure", "Complex navigation"],
            answer: "Sensory-safe and calm"
        },
        {
            type: 'boolean',
            question: "Lumiu prioritizes emotionally sustainable motivation over guilt-based streaks.",
            answer: "true"
        },
        {
            type: 'fill',
            question: "The visual interface of Lumiu uses a _______ theme where tasks appear as stars.",
            answer: "Galaxy"
        }
    ];
};
