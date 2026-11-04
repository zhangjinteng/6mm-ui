import { IconName } from '../icon';
import { ComplianceDetail, ComplianceDraft, ComplianceMode, ComplianceProfile, ComplianceType } from './types';
export declare const complianceTypes: {
    value: ComplianceType;
    label: string;
    icon: IconName;
    description: string;
}[];
export declare const profileFields: {
    key: keyof ComplianceProfile;
    label: string;
    token: string;
    max: number;
    type?: string;
}[];
export declare const modeLabel: (mode: ComplianceMode) => string;
export declare const stateLabel: (state: string) => string;
export declare function toComplianceDraft(detail: ComplianceDetail): ComplianceDraft;
export declare function normalizeCompliance(draft: ComplianceDraft): ComplianceDraft;
export declare function validComplianceUrl(value: string): boolean;
export declare function validateCompliance(draft: ComplianceDraft): Record<string, string>;
