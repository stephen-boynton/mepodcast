import { Button, Checkbox, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import styles from "./Filters.style.module.scss";

export const SearchFilters = () => {
  return (
    <form className={styles.container}>
      <Text as="label" size="2">
        <Flex gap="2">
          <Checkbox defaultChecked />
          Series
        </Flex>
      </Text>
      <Text as="label" size="2">
        <Flex gap="2">
          <Checkbox defaultChecked />
          Episodes
        </Flex>
      </Text>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="soft" size="2">
            Sort by:
            <DropdownMenu.TriggerIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content size="2">
          <DropdownMenu.Item>Title</DropdownMenu.Item>
          <DropdownMenu.Item>Last Date Published</DropdownMenu.Item>
          <DropdownMenu.Item>Listener Favorites</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </form>
  );
};
