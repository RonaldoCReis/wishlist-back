import z from "zod";

export const UpdateUser = z.object({
  email: z.string().email(),
  username: z.string(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  profileImageUrl: z.string().nullish(),
  bio: z.string().nullish(),
});

export type UpdateUser = z.infer<typeof UpdateUser>;

export const NewUser = UpdateUser.extend({
  id: z.string(),
});

export type NewUser = z.infer<typeof NewUser>;

export const User = NewUser.extend({
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof User>;

export const Users = z.array(User);

export type Users = z.infer<typeof Users>;
