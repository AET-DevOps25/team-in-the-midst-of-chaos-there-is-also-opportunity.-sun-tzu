export enum ConflictType {
  EmailAlreadyExists = 'EmailAlreadyExists',
}

export const ConflictTypeArray = Object.values(ConflictType);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isConflictError(value: any): value is ConflictType {
  return ConflictTypeArray.includes(value);
}
