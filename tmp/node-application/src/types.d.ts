declare module '*.txt' {
  const content: string
  export default content
}

declare module '*.svg' {
  const content: any
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.json' {
  const content: {
    [prop:string]: any
  }
  export default content
}

/**
 * 用以指代任一对象
 */
export interface AnyObject {
  [prop: string]: any
}
