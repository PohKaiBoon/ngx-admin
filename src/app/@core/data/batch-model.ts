export interface BatchMenu {
  address: string;
  produceType: string;
  dateTimeCreated: string;
  dateTimeUpdated: string;
}

export interface Activities {
  batchAddress?: string;
  activity?: Activity[];
  type?: string;
}

export interface Certificates {
  issuedTo?: string;
  type?: string;
  dateTimeCreated: string;
  dateTimeUpdated: string;
  id: string;
}

export interface BatchDetails {
  harvestDetails?: HarvestDetails;
  metadata?: Metadata;
  activity?: Activity[];
  batchId?: string;
  createdBy?: string;
  traceabilityInfo?: TraceabilityInfo[];
  retailerTraceabilityInfo?: TraceabilityInfo[];
}

export interface HarvestDetails {
  farmInfo?: FarmInfo;
  vineyardDetails?: VineyardDetails;
  cultivationPractices?: CultivationPractices;
  environmentalConditions?: EnvironmentalConditions;
  harvestInfo?: HarvestInfo;
  postHarvestHandling?: PostHarvestHandling;
  remarks?: Remarks;
}

export interface FarmInfo {
  farmName?: string;
  farmAddress?: string;
  farmerName?: string;
  farmerContact?: string;
  latitude?: number;
  longitude?: number;
}

export interface VineyardDetails {
  vineyardId?: string;
  grapeVariety?: string;
  plantingDate?: string;
  soilType?: string;
}

export interface CultivationPractices {
  irrigation?: string;
  fertilizationType?: string;
  fertilizationQuantity?: string;
  fertilizationDate?: string;
  pesticide?: string;
  pesticideApplicationDate?: string;
  compliance?: string;
  pruning?: string;
}

export interface EnvironmentalConditions {
  weatherDate?: string;
  temperature?: string;
  rainfall?: string;
  humidity?: string;
}

export interface HarvestInfo {
  harvestDate?: string;
  harvestMethod?: string;
  laborDetails?: string;
  yield?: string;
}

export interface PostHarvestHandling {
  remarks?: string;
}

export interface Remarks {
  remarks?: string;
}

export interface Metadata {
  created?: string;
  updated?: string;
  governorAddress?: string;
  stateControllerAddress?: string;
}

export interface Activity {
  message?: string;
  dateTime?: string;
}

export interface TraceabilityInfo {
  type?: string;
  vcString?: string;
  dateTime?: string;
  activity?: Activity[];
  issuer?: string;
}

export interface Activity {
  message?: string;
  dateTime?: string;
}

export interface OrganicCertificationCredential {
  "@context"?: string;
  type?: string[];
  credentialSubject?: CredentialSubject;
  issuer?: string;
  issuanceDate?: string;
  expirationDate?: string;
}

export interface CredentialSubject {
  id?: string;
  certificateDetails?: CertificateDetails;
}

export interface CertificateDetails {
  entityCertified?: EntityCertified;
  certificationStandard?: string;
  certificateType?: string;
  lastInspectionDate?: string;
  anniversaryDate?: string;
  scope?: string;
  authorizedBy?: AuthorizedBy;
}

export interface EntityCertified {
  name?: string;
  address?: string;
  entityDid?: string;
}

export interface AuthorizedBy {
  name?: string;
  title?: string;
}
