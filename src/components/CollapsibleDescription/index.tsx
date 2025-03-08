import { Box, Flex } from '@radix-ui/themes'
import { useCollapse } from 'react-collapsed'

export const CollapsibleDescription = ({
  children
}: React.PropsWithChildren) => {
  const { getCollapseProps, getToggleProps } = useCollapse()

  return (
    <Box>
      <Flex {...getToggleProps()}>Show description</Flex>
      <Flex {...getCollapseProps()}>{children}</Flex>
    </Box>
  )
}
