import { TRevenue } from "./definitions";

export function customCurrencyFormatter(amount: number) {
    const formatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'eur', minimumSignificantDigits: 2})
    return formatter.format(amount);
}
export function customDateFormatter(dateStr: string, locale: string = 'de-DE') {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'long', year: '2-digit' }
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date);
}
export function customGeneratePagination(aktuellSeite: number, seiteAnzahl: number) {
    

    if (seiteAnzahl < 7) {
        return Array.from({length: seiteAnzahl}, (e, i) => i + 1);
    }
    if (aktuellSeite >= seiteAnzahl - 2) {
        return [1, 2, '...', seiteAnzahl - 2, seiteAnzahl - 1, seiteAnzahl];
    }

    if (aktuellSeite < 3) {
        return [1, 2, 3, '...', seiteAnzahl - 1, seiteAnzahl];
    }
    return [
        1, '...', aktuellSeite - 1, aktuellSeite, aktuellSeite + 1, '...', seiteAnzahl
    ]
}

export function customGeneratseYAxis(revenues: TRevenue[]) {
    const labels = [];
    const maxRevenue = Math.max(...revenues.map((r => r.revenue)));
    const topLabel = Math.ceil((maxRevenue / 1000)) * 1000;

    for (let i = topLabel; i >= 0 ; i - 1000) {
        labels.push(`$${i}K`)
    }
    return { labels, topLabel };
}

