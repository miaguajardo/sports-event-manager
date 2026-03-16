/**
 * Generic result type and helpers for consistent error handling across server actions
 */

export type Result<T, E = string> =
    | { success: true; data: T }
    | { success: false; message: E };

export function ok<T>(data: T): Result<T> {
    return { success: true, data };
}

export function err<E = string>(message: E): Result<never, E> {
    return { success: false, message };
}

export function isOk<T, E>(r: Result<T, E>): r is { success: true; data: T } {
    return r.success;
}

export function isErr<T, E>(r: Result<T, E>): r is { success: false; message: E } {
    return !r.success;
}

/**
 * Unwraps a Supabase query/mutation response into a Result
 * Use for single-row or single-entity responses
 */
export async function withSafeQuery<T>(
    promise: Promise<{ data: T | null; error: { message: string } | null }>
): Promise<Result<T>> {
    const { data, error } = await promise;
    if (error) return err(error.message);
    if (data === null) return err("Not found");
    return ok(data);
}

/**
 * Unwraps a Supabase query that returns an array
 * Never fails with "Not found" for empty array; use for list queries
 */
export async function withSafeQueryList<T>(
    promise: Promise<{ data: T[] | null; error: { message: string } | null }>
): Promise<Result<T[]>> {
    const { data, error } = await promise;
    if (error) return err(error.message);
    return ok(data ?? []);
}
