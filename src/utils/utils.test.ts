// test for utils

import { clean, convertFromUnix, sortByIds, truncate } from './'

describe('truncate', () => {
  it('should return the correct time', () => {
    expect(truncate('Hello world', 5)).toBe('Hello...')
  })

  it('should return the original string if it is shorter than the max length', () => {
    expect(truncate('Hello', 10)).toBe('Hello')
  })

  it('should return the original string if it is equal to the max length', () => {
    expect(truncate('Hello', 5)).toBe('Hello')
  })

  it('should return the original string if it is longer than the max length', () => {
    expect(truncate('Hello world', 5)).toBe('Hello...')
  })
})

describe('clean', () => {
  it.each([
    ['<p>Hello world</p>', '<p>Hello world</p>'],
    ['<script>alert("Hello world")</script>', ''],
    ['<img src="https://example.com/image.jpg" />', ''],
    ['<img src="https://example.com/image.jpg" />', '']
  ])('should return the correct string for %s: %s', (input, expected) => {
    expect(clean(input)).toBe(expected)
  })
})

describe('convertFromUnix', () => {
  it('converts unix time to date string', () => {
    expect(convertFromUnix(1713379200)).toBe('Wed Apr 17 2024')
  })
})

describe('sortByIds', () => {
  it('sorts an array of objects by id', () => {
    expect(sortByIds([1, 2, 3], [{ id: 1 }, { id: 2 }, { id: 3 }])).toEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ])
  })
})
