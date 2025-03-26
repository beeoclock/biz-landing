export function formatToLast10MinuteISO(timestampMs: number): string {
    const date = new Date(timestampMs);

    // Обрізаємо до останніх 10 хвилин
    date.setMinutes(Math.floor(date.getMinutes() / 10) * 10);
    date.setSeconds(0);
    date.setMilliseconds(0);

    // Конвертуємо у ISO-формат
    return date.toISOString();
}
