type ResultSuccess<T> = { success: true; data: T; error?: never };
type ResultError<E> = { success: false; data?: never; error: E };

const success = <T>(data: T): ResultSuccess<T> => ({ success: true, data });
const error = <E>(err: E): ResultError<E> => ({ success: false, error: err });

export const R = { success, error } as const;
