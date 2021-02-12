export const getGradeText = (g) => {
    if (2 > g) return "Precário";
    if (g >= 2 && g < 3) return "Péssimo";
    if (g >= 3 && g < 4) return "Ruim";
    if (g >= 4 && g < 5) return "Regular";
    if (g >= 5 && g < 6) return "Na média";
    if (g >= 6 && g < 7) return "Ok";
    if (g >= 7 && g < 8) return "Bom";
    if (g >= 8 && g < 9) return "Ótimo";
    if (g >= 9 && g <= 10) return "Excelente";
};

export const getColorGrade = (g) => {
    if (!g) return;
    if (g < 1) return "grade-1";
    if (g >= 1 && g < 2) return "grade-1";
    if (g >= 2 && g < 3) return "grade-2";
    if (g >= 3 && g < 4) return "grade-3";
    if (g >= 4 && g < 5) return "grade-4";
    if (g >= 5 && g < 6) return "grade-5";
    if (g >= 6 && g < 7) return "grade-6";
    if (g >= 7 && g < 8) return "grade-7";
    if (g >= 8 && g < 9) return "grade-8";
    if (g >= 9 && g <= 10) return "grade-9";
    if (g <= 10) return "grade-10";
};
