import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, object) => {
  const request = axios.put(`${baseUrl}/${id}`, object)
  return request.then(response => response.data)
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default {
  getAll, create, update , remove
}