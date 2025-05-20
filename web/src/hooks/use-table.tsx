import React from 'react'
import instance from '@/lib/axios'

export function useTableData<T>(endpoint: string) {
  const [data, setData] = React.useState<T[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchData = React.useCallback(() => {
    setLoading(true)
    instance
      .get(endpoint)
      .then((res) => setData(res.data.data))
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [endpoint])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, fetchData }
}