import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

enum RoleEnum {
  USER = "USER",
  ADMIN = "ADMIN",
}

export const UserModel = types
  .model("User")
  .props({
    id: types.number,
    createdAt: types.Date,
    updatedAt: types.Date,
    email: types.string,
    role: types.enumeration<RoleEnum>("RoleEnum", Object.values(RoleEnum)),
    active: types.boolean,
  })
  .actions(withSetPropAction)

export interface User extends Instance<typeof UserModel> {}
export interface UserSnapshotOut extends SnapshotOut<typeof UserModel> {}
export interface UserSnapshotIn extends SnapshotIn<typeof UserModel> {}
