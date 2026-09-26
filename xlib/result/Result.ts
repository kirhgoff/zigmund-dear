export type ResultSuccess<T> = { success: true; data: T; error?: never };
export type ResultError<E> = { success: false; data?: never; error: E };
export type Result<Data, Error> = ResultSuccess<Data> | ResultError<Error>;

const success = <T>(data: T): ResultSuccess<T> => ({ success: true, data });
const error = <E>(err: E): ResultError<E> => ({ success: false, error: err });

export const R = { success, error } as const;

export const isSuccess = <T, E>(result: Result<T, E>): result is ResultSuccess<T> => result.success;
export const isError = <T, E>(result: Result<T, E>): result is ResultError<E> => !result.success;
