import { expect, it, vi } from 'vitest'
import { createMediaUploader } from '../services/media-upload'

it('keeps authorization with the host transport and returns the uploaded ID and URL', async () => {
  const result = { media_id: '7', url: 'https://cdn.test/image.png' }
  const post = vi.fn().mockResolvedValue(result)
  const upload = createMediaUploader({ post }, '/brand/assets/upload')
  const file = new File(['image'], 'cover.png', { type: 'image/png' })
  const signal = new AbortController().signal
  expect(await upload(file, signal)).toEqual(result)
  const [options, config] = post.mock.calls[0]
  expect(options.url).toBe('/brand/assets/upload')
  expect(options.signal).toBe(signal)
  expect(options.data.get('file').name).toBe(file.name)
  expect(config.isOpenRetry).toBe(false)
})

it('shows the backend upload message instead of the Axios HTTP status text', async () => {
  const failure = Object.assign(new Error('Request failed with status code 502'), {
    response: { status: 502, data: { code: 0, show: 1,
      msg: '图片存储服务拒绝上传，请联系管理员检查服务端凭据或访问策略',
      data: { error_code: 'MEDIA_STORAGE_REJECTED' } } }
  })
  const post = vi.fn().mockRejectedValue(failure)
  const upload = createMediaUploader({ post }, '/cms/news/upload')
  await expect(upload(new File(['image'], 'cover.png'))).rejects.toMatchObject({
    message: failure.response.data.msg, response: failure.response
  })
  expect(post).toHaveBeenCalledTimes(1)
})

it.each([
  ['ERR_NETWORK', '图片上传失败，无法连接后台服务，请检查网络后重试'],
  ['ECONNABORTED', '图片上传超时，上传结果暂未确认，请稍后重试'],
])('provides a safe %s fallback without retrying', async (code, message) => {
  const post = vi.fn().mockRejectedValue(Object.assign(new Error('Network Error'), { code }))
  const upload = createMediaUploader({ post }, '/cms/news/upload')
  await expect(upload(new File(['image'], 'cover.png'))).rejects.toMatchObject({ message })
  expect(post).toHaveBeenCalledTimes(1)
})

it('keeps cancellation unchanged', async () => {
  const failure = Object.assign(new Error('canceled'), { code: 'ERR_CANCELED' })
  const upload = createMediaUploader({ post: vi.fn().mockRejectedValue(failure) }, '/cms/news/upload')
  await expect(upload(new File(['image'], 'cover.png'))).rejects.toBe(failure)
})
