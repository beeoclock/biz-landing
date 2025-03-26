import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'featureTranslate',
  standalone: true,
})
export class FeatureTranslatePipe implements PipeTransform {
  transform(featureKey: string): string {
    const translations: Record<string, string> = {
      unlimitedPlugins: $localize`:@@unlimitedPlugins:Plugins unlimited`,
      emailNotification: $localize`:@@emailNotification:Email notification`,
      smsNotification: $localize`:@@smsNotification:SMS Notification`,
      jsonLD: $localize`:@@jsonLD:JSON LD`,
      seoOptimization: $localize`:@@seoOptimization:SEO Package`,
      confirmationAfterUserPayment: $localize`:@@confirmationAfterUserPayment:Payment Confirmation`,
      adminPanel: $localize`:@@adminPanel:Admin panel`,
      publicPage: $localize`:@@publicPage:Public page`,
      assistantAI: $localize`:@@assistantAI:AI assistant`,
      publicRestApi: $localize`:@@publicRestApi:Public rest API`,
      chat: $localize`:@@chat:Chat support`,
    };

    return translations[featureKey] ?? featureKey;
  }
}
