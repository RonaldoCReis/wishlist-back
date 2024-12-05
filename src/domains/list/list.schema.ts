import z from "zod";
import { User } from "../user/user.schema";

export const NewList = z.object({
  userId: User.shape.id,
  name: z.string(),
});

export type NewList = z.infer<typeof NewList>;

export const List = NewList.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type List = z.infer<typeof List>;

export const Lists = z.array(List);

export type Lists = z.infer<typeof Lists>;

export const UpdateList = NewList.omit({ userId: true });

export type UpdateList = z.infer<typeof UpdateList>;
