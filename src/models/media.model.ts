export interface Media {
  id: string;
  type: 'image' | 'video' | 'youtube';
  url?: string; // For images or self-hosted videos
  videoId?: string; // For YouTube videos
  entityType: string;
  entityId: string;
  createdAt: Date;
}
