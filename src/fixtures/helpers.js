export function sanitizeText(text) {
    return text.split("\n") // split string by new lines
        .filter(line => line.length > 0) // remove empty lines
        .map(line => line.replace(/\s{2,}/g, "")) // remove multiple spaces
}
