import {useEffect, useState} from 'react';

/**
 * 스크롤 위치에 따라 shadow 상태를 관리하는 훅
 * @param threshold - shadow가 나타날 스크롤 임계값 (기본값: 10px)
 * @returns isScrolled - 임계값을 넘어 스크롤된 상태인지 여부
 */
export function useScrollShadow(threshold: number = 10) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            setIsScrolled(scrollTop > threshold);
        };

        // 초기 스크롤 위치 확인
        handleScroll();

        // 스크롤 이벤트 리스너 등록
        window.addEventListener('scroll', handleScroll, {passive: true});

        // 클린업
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [threshold]);

    return isScrolled;
}