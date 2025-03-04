export enum Role {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_MEMBER = 'ROLE_MEMBER',
}

export const getRoleDisplayName = (role: Role): string => {
  switch (role) {
    case Role.ROLE_ADMIN:
      return '관리자';
    case Role.ROLE_MEMBER:
      return '회원';
    default:
      return role;
  }
};

export const USER_ROLES = [Role.ROLE_MEMBER];
