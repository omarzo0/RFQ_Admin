export type WarningSeverity = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export type WarningCategory =
    | "GENERAL"
    | "PAYMENT"
    | "POLICY_VIOLATION"
    | "SECURITY"
    | "PERFORMANCE"
    | "COMPLIANCE"
    | "ABUSE"
    | "OTHER";

export interface CompanyWarning {
    id: string;
    companyId: string;
    title: string;
    reason: string;
    severity: WarningSeverity;
    category: WarningCategory;
    issuedBy: string;
    issuedAt: string;
    expiresAt?: string | null;
    isResolved: boolean;
    resolvedAt?: string | null;
    resolvedBy?: string | null;
    actionRequired?: string | null;
    notes?: string | null;
    company?: {
        id: string;
        name: string;
        email: string;
    };
    admin?: {
        id: string;
        firstName: string;
        lastName: string;
    };
    resolver?: {
        id: string;
        firstName: string;
        lastName: string;
    } | null;
}

export interface WarningsListResponse {
    warnings: CompanyWarning[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface WarningStats {
    total: number;
    active: number;
    resolved: number;
    bySeverity: Record<WarningSeverity, number>;
    byCategory: Record<WarningCategory, number>;
}

export interface CreateWarningPayload {
    companyId: string;
    title: string;
    reason: string;
    severity?: WarningSeverity;
    category?: WarningCategory;
    expiresAt?: string | null;
    actionRequired?: string | null;
    notes?: string | null;
}
