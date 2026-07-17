import React from "react";

export type UserRole = "user" | "admin" | "scorer";

interface RoleGuardProps {
    userRole: UserRole | undefined | null;
    allowedRoles: UserRole[];
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
    userRole,
    allowedRoles,
    fallback = null,
    children,
}) => {
    if (!userRole || !allowedRoles.includes(userRole)) {
        return <>{fallback}</>;
    }
    return <>{children}</>;
};