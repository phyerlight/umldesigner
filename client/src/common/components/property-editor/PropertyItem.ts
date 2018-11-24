export interface PropertyItem {
  key: string,
  name: string,
  type: 'text' | 'textarea' | 'number' | 'list',
  options?: PropertyListItem[]
}

export interface PropertyListItem {
  key: string,
  name: string
}