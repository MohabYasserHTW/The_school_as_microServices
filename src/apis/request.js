import axios from "axios"

export const request = async (req) => {
  
  const response = await axios({
    method: req.method,
    url: req.url,
    params: {
      filters: req.filters,
      pagination: req.pagination,
      ...req.params
    },
    data: req.body,
    headers:{
      Authorization: `Bearer ${req.auth}`,
      ...req.headers
      }
  })

  return response
}