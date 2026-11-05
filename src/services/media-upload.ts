export interface MediaUploadResult {
  url: string
  /** Present for registry-backed endpoints; older URL-only endpoints remain compatible. */
  media_id?: string
}

interface UploadTransport {
  post<T>(options: Record<string, any>, config?: Record<string, any>): Promise<T>
}

/** Bind the application's authorized upload endpoint; do not create a reference until save. */
export function createMediaUploader(request: UploadTransport, endpoint: string) {
  return (file: File, signal?: AbortSignal): Promise<MediaUploadResult> => {
    const data = new FormData()
    data.append('file', file)
    return request.post<MediaUploadResult>(
      { url: endpoint, data, signal, headers: { 'Content-Type': 'multipart/form-data' } },
      { isOpenRetry: false }
    )
  }
}
