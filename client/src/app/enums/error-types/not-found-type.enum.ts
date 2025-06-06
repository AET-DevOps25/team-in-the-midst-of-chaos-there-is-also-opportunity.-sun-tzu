export enum NotFoundType {
  RadioNotFound = 'RadioNotFound',
  User = 'UserNotFound',
}

export const NotFoundTypeArray = Object.values(NotFoundType);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNotFoundError(value: any): value is NotFoundType {
  return NotFoundTypeArray.includes(value);
}
