import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/blogs', () => ({
  default: {
    getAll: vi.fn(),
    setToken: vi.fn(),
    create: vi.fn(),
    updateLikes: vi.fn(),
    deleteBlog: vi.fn(),
    commentOnBlog: vi.fn(),
  }
}))

import blogService from './services/blogs'
import { useBlogStore, useBlogActions, useBlogs } from './store'

beforeEach(() => {
  useBlogStore.setState({ blogs: [] })
  vi.clearAllMocks()
})

describe('useBlogActions', () => {
  it.only('initialize loads blogs from service', async () => {
    const mockBlogs = [{
      id: 1,
      title: 'Clean code is required',
      author: 'Uncle Bob',
      url: 'http://objectorientedprogamming.com',
      likes: 8,
      user: 'Matti',
      comments: []
    }]

    blogService.getAll.mockResolvedValue(mockBlogs)

    const { result } = renderHook(() => useBlogActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: blogsResult } = renderHook(() => useBlogs())
    expect(blogsResult.current).toEqual(mockBlogs)
  })
})