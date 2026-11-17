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
  return async (file: File, signal?: AbortSignal): Promise<MediaUploadResult> => {
    const data = new FormData()
    data.append('file', file)
    try {
      return await request.post<MediaUploadResult>(
        { url: endpoint, data, signal, headers: { 'Content-Type': 'multipart/form-data' } },
        { isOpenRetry: false }
      )
    } catch (error) {
      if (!error || typeof error !== 'object' || signal?.aborted) throw error
      const failure = error as { code?: string; message?: string; msg?: string; response?: { data?: { msg?: string } } }
      if (failure.code === 'ERR_CANCELED') throw error
      const message = failure.response?.data?.msg || failure.msg ||
        (failure.code === 'ECONNABORTED' || failure.code === 'ETIMEDOUT'
          ? '图片上传超时，上传结果暂未确认，请稍后重试'
          : failure.code === 'ERR_NETWORK'
            ? '图片上传失败，无法连接后台服务，请检查网络后重试'
            : failure.message || '图片上传失败，请稍后重试')
      // Preserve field errors and response metadata for existing page validation handlers.
      throw Object.assign(new Error(message), error, { message })
    }
  }
}
