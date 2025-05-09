import sanitizeHtml from 'sanitize-html'

export const truncate = (str: string, n: number) => {
  return str?.length > n ? `${str.slice(0, n)}...` : str
}

export const clean = (dirty: string) =>
  sanitizeHtml(dirty, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li'],
    allowedAttributes: {
      a: ['href']
    }
  })

export const removeHtml = (dirty: string) => {
  return dirty.replace(/<[^>]*>?/g, '')
}

export const convertFromUnix = (unix: number) => {
  return new Date(unix * 1000).toDateString()
}

export const sortByIds = <T extends { id: number | string }>(
  ids: (number | string)[],
  data: T[]
) => {
  return data.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
}
