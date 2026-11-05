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
