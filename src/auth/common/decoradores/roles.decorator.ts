import { SetMetadata } from "@nestjs/common";
import { ROLES } from "src/auth/enum/role.auth";

export const Roles = (role:ROLES) => SetMetadata("roles", role);