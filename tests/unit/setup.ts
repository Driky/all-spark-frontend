import type { H3Event, EventHandlerRequest } from 'h3';
import { vi } from 'vitest';

type Handler = (event: H3Event<EventHandlerRequest>) => Promise<unknown>

export function useH3TestUtils() {
    const h3 = vi.hoisted(() => ({
        defineEventHandler: vi.fn((handler: Handler) => handler),
        readBody: vi.fn(async (event: H3Event) => {
            if (event._requestBody && typeof event._requestBody === 'string') {
                return JSON.parse(event._requestBody)
            }
            return event._requestBody || {}
        }),
        getRouterParams: vi.fn((event: H3Event) => event.context?.params || {}),
        getQuery: vi.fn((event: H3Event) => event.context?.query || {}),
        createError: vi.fn(),
    }))

    // Stub the global functions to support auto-imports in your tests
    vi.stubGlobal('defineEventHandler', h3.defineEventHandler)
    vi.stubGlobal('readBody', h3.readBody)
    vi.stubGlobal('getRouterParams', h3.getRouterParams)
    vi.stubGlobal('getQuery', h3.getQuery)
    vi.stubGlobal('createError', h3.createError)

    return h3
}