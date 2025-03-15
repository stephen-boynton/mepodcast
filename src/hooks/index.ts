import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useRef, useState } from 'react'

export const usePodcastApi = () => {}

type UseDexieProps<Data, Vars> = {
  query: (data?: Vars) => Promise<Data>
  variables?: Vars
  onCompleted?: (data: Data) => void
}

export const useDexie = <Data, Vars>({
  query,
  variables,
  onCompleted
}: UseDexieProps<Data, Vars>) => {
  //   const [initialized, setInitialized] = useState(false)
  //   const [loading, setLoading] = useState(true)
  //   const prev = useRef<Data>(null)
  //   const data = useLiveQuery(
  //     () => query(variables),
  //     variables && [variables],
  //     null
  //   )
  //   useEffect(() => {
  //     if (data && data !== prev.current) {
  //       setInitialized(true)
  //       setLoading(false)
  //       prev.current = data
  //       onCompleted?.(data)
  //     }
  //   }, [data, onCompleted])
  //   return { initialized, loading, data }
}
