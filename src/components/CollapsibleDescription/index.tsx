import { useCollapse } from 'react-collapsed'

export const CollapsibleDescription = ({
  children
}: React.PropsWithChildren) => {
  const { getCollapseProps, getToggleProps } = useCollapse()

  return (
    <div>
      <div {...getToggleProps()}>Show description</div>
      <div {...getCollapseProps()}>{children}</div>
    </div>
  )
}
