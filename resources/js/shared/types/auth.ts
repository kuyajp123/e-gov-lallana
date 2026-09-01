export type Role = {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
};

export type User = {
    id: number;
    name: string;
    email: string;
    phone_number?: string | null;
    avatar?: string;
    role?: Role | null;
    role_id?: number | null;
    status?: string;
    email_verified_at: string | null;
    phone_verified_at?: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};
