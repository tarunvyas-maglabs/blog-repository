import { create } from 'zustand'
import blogService from './services/blogs'

const useNotificationStore = create((set) => ({
  notification: null,
  actions: {
    setNotification: value => set(() => ({ notification: value }))
  }
}))

export const useBlogStore = create((set) => ({
  blogs: [],
  actions: {
    initialize: async () => {
      const blogs = await blogService.getAll()
      set(() => ({ blogs }))
    },
    createBlog: async (blogObject) => {
      const newBlog = await blogService.create(blogObject)
      set((state) => ({ blogs: state.blogs.concat(newBlog) }))
    },
    deleteBlog: async (blogId) => {
      await blogService.deleteBlog(blogId)
      set((state) => ({ blogs: state.blogs.filter(blog => blog.id !== blogId) }))
    },
    updateBlog: async(id, updatedBlogObject) => {
      const updatedBlog = await blogService.updateLikes(id, updatedBlogObject)
      set((state) => ({ blogs: state.blogs.map(blog => blog.id === id ? updatedBlog: blog) }))
    },
    addComment: async(id, comment) => {
      const updatedBlog = await blogService.commentOnBlog(id, comment)
      set((state) => ({ blogs: state.blogs.map(blog => blog.id === id ? updatedBlog : blog) }))
    }
  }
}))

const useUserStore = create((set) => ({
  user: null,
  setUser: (value) => set({ user: value })
}))

export const useNotification = () => useNotificationStore(state => state.notification)

export const useNotificationActions = () => useNotificationStore(state => state.actions)

export const useBlogs = () => {
  const blogs = useBlogStore(state => state.blogs)
  return blogs.sort((a, b) => b.likes - a.likes)
}

export const useBlogActions = () => useBlogStore(state => state.actions)

export const useUser = () => useUserStore(state => state.user)

export const useUserAction = () => useUserStore(state => state.setUser)