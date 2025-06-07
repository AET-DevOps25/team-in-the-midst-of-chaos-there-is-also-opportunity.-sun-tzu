export enum BadRequestType {

}

export const BadRequestTypeArray = Object.values(BadRequestType);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isBadRequestError(value: any): value is BadRequestType {
  return BadRequestTypeArray.includes(value);
}
