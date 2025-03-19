export interface SendContactFormDto {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  object: 'SendContactFormDto'
}
