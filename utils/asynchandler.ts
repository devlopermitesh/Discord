import { NextRequest, NextResponse } from 'next/server'
import { ApiError } from './apierror'

/**
 * Type for async route handler function
 */
type AsyncRouteHandler<T extends Record<string, string> = Record<string, string>> = (
  req: NextRequest,
  context: { params: T }
) => Promise<NextResponse>

/**
 * Wraps async route handlers with error handling
 *
 * @param fn - The async route handler function
 * @returns A wrapped handler with automatic error handling
 *
 * @example
 * export const GET = asyncHandler(async (req) => {
 *   const data = await fetchData();
 *   return NextResponse.json({ data });
 * });
 */
// Update your AsyncRouteHandler type definition
// Make AsyncRouteHandler generic to accept specific param types

export const asyncHandler = <T extends Record<string, string> = Record<string, string>>(
  fn: AsyncRouteHandler<T>
) => {
  return async (req: NextRequest, context?: { params: Promise<T> | T }): Promise<NextResponse> => {
    try {
      // Handle both Promise and non-Promise params, and undefined context
      const resolvedParams = context?.params
        ? context.params instanceof Promise
          ? await context.params
          : context.params
        : ({} as T)

      const resolvedContext = {
        params: resolvedParams,
      }

      return (await fn(req, resolvedContext)) as NextResponse
    } catch (error) {
      console.error('Route handler error:', error)

      // Handle different error types
      if (error instanceof ApiError) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            ...(process.env.NODE_ENV === 'development' && {
              stack: error.stack,
            }),
          },
          { status: 500 }
        )
      }

      // Unknown error type
      return NextResponse.json(
        {
          success: false,
          error: 'An unexpected error occurred',
        },
        { status: 500 }
      )
    }
  }
}
