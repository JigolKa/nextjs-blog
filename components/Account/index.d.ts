import { User } from "@prisma/client";

export type AltProps = {
 user: User;
 classes: Record<"form" | "danger" | "notActivated", string>;
};
