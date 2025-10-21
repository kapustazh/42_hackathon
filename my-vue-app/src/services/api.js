// API wrapper using axios with environment-based configuration
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

console.log('🌐 API Base URL:', BASE_URL)
console.log('🏗️ Environment:', import.meta.env.VITE_ENVIRONMENT || 'development')

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

export async function getMe(){
  return (await client.get('/auth/me')).data
}

export async function logout(){
  return (await client.post('/auth/logout')).data
}

export async function fetchPosts(params = {}){
  return (await client.get('/posts', { params })).data
}

export async function createPost(payload){
  // payload: { content, categories }
  return (await client.post('/posts', payload)).data
}

export async function votePost(id, voteType){
  return (await client.post(`/posts/${id}/vote`, { voteType })).data
}

export async function fetchCategories(){
  return (await client.get('/categories')).data
}

export default client

// Backwards-compatible aliases for older message components
export const fetchMessages = fetchPosts
export const createMessage = createPost
export const vote = (id, type) => votePost(id, type)
export const fetchSpam = async () => { return [] }

