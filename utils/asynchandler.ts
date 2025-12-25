import { NextRequest, NextResponse } from 'next/server'
import { ApiError } from './apierror'

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

type RouteContext<T extends Record<string, string> = Record<string, string>> = {
  params: Promise<T>
}

type AsyncRouteHandler<T extends Record<string, string> = Record<string, string>> = (
  req: NextRequest,
  context?: { params: T } // Context ko optional bana diya
) => Promise<NextResponse>

export const asyncHandler = <T extends Record<string, string> = Record<string, string>>(
  fn: AsyncRouteHandler<T>
) => {
  return async (
    req: NextRequest,
    context?: RouteContext<T> // Yahan bhi optional
  ): Promise<NextResponse> => {
    try {
      // Agar context hai toh params resolve karo, nahi toh empty object
      const params = context ? await context.params : ({} as T)
      return await fn(req, { params })
    } catch (error) {
      console.error('Route handler error:', error)

      if (error instanceof ApiError) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
          },
          { status: 500 }
        )
      }

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
