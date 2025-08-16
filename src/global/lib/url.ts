/**
 * URL 인코딩된 문자열을 안전하게 디코딩합니다.
 * @param code - 디코딩할 문자열
 * @returns 디코딩된 문자열, 실패시 원본 문자열 반환
 */
export function decode(code: string): string {
    try {
        return decodeURIComponent(code);
    } catch {
        return code;
    }
}

/**
 * 문자열을 URL에 안전하게 인코딩합니다.
 * @param text - 인코딩할 문자열
 * @returns 인코딩된 문자열
 */
export function encode(text: string): string {
    return encodeURIComponent(text);
}