export interface BatchMenu {
  address: string;
  produceType: string;
  dateTimeCreated: string;
  dateTimeUpdated: string;
}

export interface HarvestDetails {
  batchDetails?: BatchDetails;
  metadata?: Metadata;
}

export interface BatchDetails {
  farmInfo?: FarmInfo;
  vineyardDetails?: VineyardDetails;
  cultivationPractices?: CultivationPractices;
  environmentalConditions?: EnvironmentalConditions;
  harvestInfo?: HarvestInfo;
  postHarvestHandling?: PostHarvestHandling;
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

export interface Metadata {
  created?: string;
  updated?: string;
  governorAddress?: string;
  stateControllerAddress?: string;
}
