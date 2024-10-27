export default function isRelativeUrl(url: string): boolean {
    return url?.startsWith('http') == false;
}
