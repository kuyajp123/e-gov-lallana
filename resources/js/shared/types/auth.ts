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

export type AppNotificationType = {
    id: string;
    user_id: number;
    type: string;
    title: string;
    message: string;
    action_url: string | null;
    related_entity_type: string | null;
    related_entity_id: number | null;
    read_at: string | null;
    created_at: string;
    updated_at: string;
};

export type NotificationPreferenceType = {
    id: number;
    user_id: number;
    preferred_channel: 'in_app_only' | 'email' | 'sms' | 'both';
    notify_document_updates: boolean;
    notify_household_updates: boolean;
    notify_announcements: boolean;
    created_at?: string;
    updated_at?: string;
};

export type Auth = {
    user: User;
    unreadNotificationsCount?: number;
    recentNotifications?: AppNotificationType[];
};
