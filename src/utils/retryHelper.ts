/**
 * Retry Helper Utility
 * Provides retry logic for network operations with exponential backoff
 */

interface RetryOptions {
    maxAttempts?: number;
    delayMs?: number;
    backoffMultiplier?: number;
    shouldRetry?: (error: any) => boolean;
}

/**
 * Execute a function with retry logic
 * @param fn - Async function to execute
 * @param options - Retry configuration options
 * @returns Result of the function
 * @throws Last error if all retries fail
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const {
        maxAttempts = 3,
        delayMs = 1000,
        backoffMultiplier = 2,
        shouldRetry = defaultShouldRetry,
    } = options;

    let lastError: any;
    let currentDelay = delayMs;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            // Don't retry if this is the last attempt or if error is not retryable
            if (attempt === maxAttempts || !shouldRetry(error)) {
                throw error;
            }

            console.log(`Attempt ${attempt} failed, retrying in ${currentDelay}ms...`, error);

            // Wait before retrying
            await delay(currentDelay);

            // Increase delay for next attempt (exponential backoff)
            currentDelay *= backoffMultiplier;
        }
    }

    throw lastError;
}

/**
 * Default function to determine if an error should trigger a retry
 * @param error - Error object
 * @returns true if error is retryable
 */
function defaultShouldRetry(error: any): boolean {
    // Retry on network errors
    if (error?.code === 'auth/network-request-failed') {
        return true;
    }

    // Retry on Firestore unavailable errors
    if (error?.code === 'unavailable') {
        return true;
    }

    // Retry on timeout errors
    if (error?.message?.toLowerCase().includes('timeout')) {
        return true;
    }

    // Retry on connection errors
    if (error?.message?.toLowerCase().includes('connection')) {
        return true;
    }

    // Don't retry on authentication errors (except network)
    if (error?.code?.startsWith('auth/')) {
        return false;
    }

    // Don't retry on permission errors
    if (error?.code === 'permission-denied') {
        return false;
    }

    // Don't retry on not found errors
    if (error?.code === 'not-found') {
        return false;
    }

    // Retry on other errors by default
    return true;
}

/**
 * Delay execution for specified milliseconds
 * @param ms - Milliseconds to delay
 */
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if error is a network error
 * @param error - Error object
 * @returns true if error is network-related
 */
export function isNetworkError(error: any): boolean {
    if (!error) return false;

    const errorCode = error?.code?.toLowerCase() || '';
    const errorMessage = error?.message?.toLowerCase() || '';

    return (
        errorCode.includes('network') ||
        errorCode === 'unavailable' ||
        errorMessage.includes('network') ||
        errorMessage.includes('connection') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('offline')
    );
}

/**
 * Check if error is a permission error
 * @param error - Error object
 * @returns true if error is permission-related
 */
export function isPermissionError(error: any): boolean {
    if (!error) return false;

    const errorCode = error?.code?.toLowerCase() || '';

    return (
        errorCode === 'permission-denied' ||
        errorCode === 'auth/insufficient-permission'
    );
}
