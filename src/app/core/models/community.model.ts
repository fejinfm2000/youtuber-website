export interface ChatMessage {
  id: string;
  senderUid: string;
  displayName: string;
  content: string;
  createdAt: any;
  isCreator: boolean;
  isPinned?: boolean;
  isDeleted?: boolean;
}

export interface BusinessEnquiry {
  id?: string;
  name: string;
  company?: string;
  email: string;
  website?: string;
  enquiryType: 'SPONSORSHIP' | 'PRODUCT_PROMOTION' | 'COLLABORATION' | 'SPEAKING' | 'MEDIA' | 'OTHER';
  message: string;
  status?: 'NEW' | 'VIEWED' | 'CONTACTED' | 'CLOSED' | 'SPAM';
  createdAt?: string;
}

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  name?: string;
  subscribedAt?: string;
  active?: boolean;
}
