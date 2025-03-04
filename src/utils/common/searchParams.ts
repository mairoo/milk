import { PaginationParams } from '@/types/common/pagination';

/**
 * 페이지네이션 파라미터를 스프링부트 호환 URLSearchParams로 변환합니다.
 *
 * @param params - 페이지네이션 정보 (페이지 번호, 페이지 크기, 정렬 조건)
 * @returns URLSearchParams 객체
 *
 * @example
 * // 기본 사용
 * const params = createPaginationSearchParams({ page: 0, size: 10 });
 * // 결과: "page=0&size=10"
 *
 * // 정렬 조건 추가
 * const params = createPaginationSearchParams({
 *   page: 0,
 *   size: 10,
 *   sort: ['name,asc', 'id,desc']
 * });
 * // 결과: "page=0&size=10&sort=name,asc&sort=id,desc"
 */
export const createPaginationSearchParams = (
  params: PaginationParams,
): URLSearchParams => {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined)
    searchParams.append('page', params.page.toString());
  if (params.size !== undefined)
    searchParams.append('size', params.size.toString());
  if (params.sort)
    params.sort.forEach((sort) => searchParams.append('sort', sort));

  return searchParams;
};

/**
 * 객체 형태의 검색 파라미터들을 URLSearchParams에 일괄 추가합니다.
 * 페이지네이션 관련 파라미터(page, size, sort)는 제외됩니다.
 *
 * @param searchParams - 대상 URLSearchParams 객체
 * @param params - 검색 파라미터 객체
 * @param keyMap - 파라미터 키 매핑 객체 (선택적). 객체의 키를 URL 파라미터 키로 변환할 때 사용
 *
 * @example
 * // 기본 사용
 * const params = new URLSearchParams();
 * appendSearchParams(params, {
 *   name: 'John',
 *   age: 25,
 *   isActive: true
 * });
 * // 결과: "name=John&age=25&isActive=true"
 *
 * // 키 매핑 사용
 * const params = new URLSearchParams();
 * appendSearchParams(
 *   params,
 *   { userName: 'John', userAge: 25 },
 *   { userName: 'name', userAge: 'age' }
 * );
 * // 결과: "name=John&age=25"
 *
 * // 단일 파라미터 추가
 * const params = new URLSearchParams();
 * appendSearchParams(params, { name: 'John' });
 * // 결과: "name=John"
 *
 * @template T - 검색 파라미터 객체의 타입
 */
export const appendSearchParams = <T extends Record<string, any>>(
  searchParams: URLSearchParams,
  params: T,
  keyMap?: Partial<Record<keyof T, string>>,
) => {
  Object.entries(params).forEach(([key, value]) => {
    // 페이지네이션 파라미터는 제외하고 처리
    if (
      value !== undefined &&
      key !== 'page' &&
      key !== 'size' &&
      key !== 'sort'
    ) {
      const paramKey = keyMap?.[key as keyof T] || key;
      searchParams.append(paramKey, value.toString());
    }
  });
};
