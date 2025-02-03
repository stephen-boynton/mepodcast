import { ExternalLinkIcon } from "@radix-ui/react-icons";
import styles from "./LinkOut.styles.module.scss";

export const LinkOut = ({
  href,
  children,
}: {
  href: string;
  children: string;
}) => {
  return (
    <a
      className={styles.container}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <>
        {children}
        <ExternalLinkIcon />
      </>
    </a>
  );
};
