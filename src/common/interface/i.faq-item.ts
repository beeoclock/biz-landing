interface IFaqItem {
  title: string;
  content?: string;
  description?: string;
  list?: string[];
  listType?: 'ordered' | 'unordered';
  pricing?: IPricing;
}

interface IPricingPlan {
  value: number;
  currency: string;
}

interface IPricing {
  free: {
    monthly: IPricingPlan;
    annual: IPricingPlan;
  };
  basic: {
    monthly: IPricingPlan;
    annual: IPricingPlan;
    discountBasic?: IPricingPlan;
  };
  pro: {
    monthly: IPricingPlan;
    annual: IPricingPlan;
    discountPro?: IPricingPlan;
  };
}

export function getFaqItems(pricing: IPricing, currencyCode: string): IFaqItem[] {
  return [
    {
      title: $localize`How quickly can you get started with Bee o’clock?`,
      content: $localize`Starting to use the service is very simple: `,
      description: $localize`register on the platform, add basic information about your business and services, and the system will be ready to go. You have the option to use the free plan (Free) with basic functionality, which will allow you to immediately test the key features of Bee o’clock without any costs.`
    },
    {
      title: $localize`What features does Bee o’clock provide and how does it differ from other services?`,
      content: $localize`Bee o’clock offers a comprehensive set `,
      description: $localize`tools for automating online bookings`,
      list: [
        $localize`Automation of bookings: the system automatically records new bookings and reserves time in the calendar.`,
        $localize`Reminders to clients: SMS and e-mail notifications will help reduce the number of missed appointments.`,
        $localize`Customization for your brand: you can change the appearance of your public page and customize the interface to suit your business.`,
        $localize`Online booking management: the entire schedule is always at hand and can be accessed from a smartphone or computer.`,
        $localize`Analytics and development: the service tracks statistics so you can improve customer interactions.`,
        $localize`Various pricing plans: from free to advanced PRO, with the ability to connect an AI assistant and public REST API.`,
      ],
      listType: 'unordered',
    },
    {
      title: $localize`How to set up and manage online bookings in Bee o’clock?`,
      content: $localize`Everything happens in a few simple steps`,
      list: [
        $localize`Register on the platform: create an account and enter your business details.`,
        $localize`Service settings: add a list of services, set the duration and price.`,
        $localize`Invite customers: share a unique link to your profile via your website, social media, or email.`,
        $localize`Online customer booking: customers can book a service in a few clicks, and you will receive notifications about each new booking.`,
        $localize`Manage your recordings: Conveniently change your schedule, track activity, and get notified about changes.`,
        $localize`Analysis and development: View statistics to evaluate performance and improve your service.`
      ],
      listType: 'ordered'
    },
    {
      title: $localize`Can I accept online payments and receive notifications about successful transactions?`,
      description: $localize`Yes, the BASIC and PRO plans have a <b>Payment Confirmation</b> feature that allows you to track customer payments. The service also sends SMS and email notifications so that you and your customers are always up to date with booking and payment updates. All this ensures safe and transparent transactions.`
    },
    {
      title: $localize`What tariff plans are available and how do they differ?`,
      list: [
        $localize`Free (${pricing.free.monthly.value} ${currencyCode}): 1 user, public page, admin panel, SEO Package, JSON LD, e-mail notifications. Suitable for small projects or testing.`,
        $localize`Basic (${pricing.basic.monthly.value} ${currencyCode}): 5 users, public page, admin panel, SEO Package, JSON LD, email notifications, unlimited plugins, Payment Confirmation and SMS Notifications. Solution for small and medium businesses.`,
        $localize`Pro (${pricing.pro.monthly.value} ${currencyCode}): unlimited users, full access to features, including AI assistant and Public REST API. Ideal for advanced and scalable projects.`
      ]
    },
  ];
}


