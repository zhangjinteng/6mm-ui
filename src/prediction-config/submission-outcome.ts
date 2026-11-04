interface Failure {
    client_request_id?: unknown
    control?: { submission_outcome?: unknown }
    detail?: { control?: { submission_outcome?: unknown } }
}

// A negative receipt can resolve an earlier timeout only for the original request.
export function submissionOutcome(error: unknown, requestId: unknown): 'rejected' | 'unverified' | undefined {
    if (!error || typeof error !== 'object') return
    const failure = error as Failure
    const outcomes = [failure.control?.submission_outcome, failure.detail?.control?.submission_outcome]
    if (outcomes.includes('UNVERIFIED') || (failure.client_request_id !== undefined && failure.client_request_id !== requestId)) return 'unverified'
    if (outcomes.includes('REJECTED')) return failure.client_request_id === requestId ? 'rejected' : 'unverified'
}
