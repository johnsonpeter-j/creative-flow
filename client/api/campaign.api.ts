import axiosInstance from './axios';

export interface CampaignIdea {
  title: string;
  description: string;
  score: number;
  reasoning?: string;
}

export interface CreateCampaignRequest {
  campaign_brief: string;
  objective: string;
  target_audience: string;
  ad_formats: string[];
}

export interface TextLayer {
  text: string;
  type: 'headline' | 'body' | 'cta';
  fontSize: number;
  fontFamily: string;
  fill: string;
  left: number;
  top: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
}

export interface AdCopy {
  headline: string;
  body: string;
  call_to_action: string;
  visual_direction: string;
  image_url?: string;
  text_layers?: TextLayer[];
}

export interface CampaignResponse {
  id: string;
  user_id: string;
  campaign_brief: string;
  objective: string;
  target_audience: string;
  ad_formats: string[];
  all_ideas: CampaignIdea[];
  top_ideas: CampaignIdea[];
  selected_idea_index?: number;
  ad_copy?: AdCopy;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GenerateIdeasResponse {
  campaign_id: string;
  top_ideas: CampaignIdea[];
  message: string;
}

/**
 * Create a new campaign
 */
export const createCampaignApi = async (data: CreateCampaignRequest) => {
  const response = await axiosInstance.post<CampaignResponse>('/campaigns/create', data);
  return response.data;
};

/**
 * Generate campaign ideas using multi-agent system
 */
export const generateCampaignIdeasApi = async (campaignId: string) => {
  // Use longer timeout for this endpoint as it involves AI generation
  const response = await axiosInstance.post<GenerateIdeasResponse>(
    `/campaigns/${campaignId}/generate-ideas`,
    {},
    { timeout: 120000 } // 120 seconds timeout for AI generation
  );
  return response.data;
};

/**
 * Get campaign by ID
 */
export const getCampaignApi = async (campaignId: string) => {
  const response = await axiosInstance.get<CampaignResponse>(`/campaigns/${campaignId}`);
  return response.data;
};

/**
 * Get all campaigns for current user
 */
export const getUserCampaignsApi = async () => {
  const response = await axiosInstance.get<CampaignResponse[]>('/campaigns/');
  return response.data;
};

/**
 * Generate ad copy and visual direction
 */
export interface GenerateAdCopyRequest {
  campaign_id: string;
  selected_idea_index: number;
}

export interface GenerateAdCopyResponse {
  campaign_id: string;
  ad_copy: AdCopy;
  message: string;
}

export const generateAdCopyApi = async (campaignId: string, selectedIdeaIndex: number) => {
  const response = await axiosInstance.post<GenerateAdCopyResponse>(
    `/campaigns/${campaignId}/generate-ad-copy`,
    {
      campaign_id: campaignId,
      selected_idea_index: selectedIdeaIndex
    },
    { timeout: 120000 } // 120 seconds timeout for AI generation
  );
  return response.data;
};

/**
 * Generate or regenerate image for campaign ad copy
 */
export const generateImageApi = async (campaignId: string) => {
  const response = await axiosInstance.post<GenerateAdCopyResponse>(
    `/campaigns/${campaignId}/generate-image`,
    {},
    { timeout: 120000 } // 120 seconds timeout for AI image generation
  );
  return response.data;
};


