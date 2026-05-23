const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_BASE_URL;

const cdnBaseUrl = CDN_BASE_URL?.trim().replace(/\/$/, '');

function createContentUrl(path: string): string {
  if (!cdnBaseUrl) return `fallback://${path}`;
  return `${cdnBaseUrl}/${path}`;
}

export const contentUrls = {
  about: createContentUrl('about-content.json'),
  appointment: createContentUrl('appointment-content.json'),
  home: createContentUrl('home-content.json')
} as const;

export type RemotePageContent = {
  page: {
    title: string;
    description: string;
  };
  sections: Array<{ component: string } & Record<string, unknown>>;
};

const fallbackContent: Record<'about' | 'appointment' | 'home', RemotePageContent> = {
  about: {
    page: {
      title: 'About Gromosome',
      description: 'Fallback content while remote JSON is unavailable.'
    },
    sections: []
  },
  home: {
    page: {
      title: 'Gromosome',
      description: 'Fallback content while remote JSON is unavailable.'
    },
    sections: []
  },
  appointment: {
    page: {
      title: 'Connect with Gromosome',
      description: 'Fallback appointment content while remote JSON is unavailable.'
    },
    sections: [
      {
        component: 'ContactForm',
        eyebrow: 'Connect',
        title: 'Book a consultation',
        verification: {
          title: 'Verify company email',
          subtitle: 'Sign in to continue with appointment request.',
          signedInLabels: {
            email: 'Email',
            verified: 'Verified',
            companyEmail: 'Company email',
            yes: 'Yes',
            no: 'No'
          },
          unverifiedMessage: 'Please verify with your company email to continue.',
          signOutLabel: 'Sign out',
          fields: [
            {
              name: 'companyEmail',
              type: 'email',
              label: 'Company email',
              placeholder: 'name@company.com',
              required: true
            }
          ],
          helperText: 'We send a secure sign-in link to your inbox.',
          submitLabel: 'Send link',
          loadingLabel: 'Sending...'
        },
        appointment: {
          title: 'Appointment request',
          subtitle: 'Share your project details.',
          fields: [
            { name: 'firstName', type: 'text', label: 'First name', placeholder: 'First name', required: true },
            { name: 'lastName', type: 'text', label: 'Last name', placeholder: 'Last name', required: true },
            { name: 'contactNumber', type: 'tel', label: 'Contact number', placeholder: '+1 555 555 5555', required: true },
            { name: 'companyName', type: 'text', label: 'Company name', placeholder: 'Company name', required: false },
            { name: 'jobTitle', type: 'text', label: 'Job title', placeholder: 'Job title', required: false },
            { name: 'projectType', type: 'select', label: 'Project type', required: true, options: ['Discovery'] },
            { name: 'requirement', type: 'textarea', label: 'Requirement', placeholder: 'Tell us what you need.', rows: 6, required: true }
          ],
          submitLabel: 'Submit',
          loadingLabel: 'Submitting...'
        },
        messages: {
          closeLabel: 'Close',
          missingEmail: 'Please provide your email to complete sign in.',
          invalidContactNumber: 'Enter a valid contact number.',
          verificationSuccess: 'Email verified successfully.',
          verificationFailure: 'Could not verify email link.',
          linkSent: 'Verification link sent.',
          authFailure: 'Authentication failed.',
          signInRequired: 'Sign in is required before submitting.',
          submissionSuccess: 'Request submitted successfully.',
          submissionFailure: 'Unable to submit request.'
        }
      }
    ]
  }
};

function getFallbackByUrl(url: string): RemotePageContent | null {
  if (url === contentUrls.about) return fallbackContent.about;
  if (url === contentUrls.home) return fallbackContent.home;
  if (url === contentUrls.appointment) return fallbackContent.appointment;
  return null;
}

export async function getRemoteContent<T extends RemotePageContent>(url: string): Promise<T> {
  const fallback = getFallbackByUrl(url);

  if (url.startsWith('fallback://')) {
    if (fallback) return fallback as T;
    throw new Error('Fallback content is not available for this page.');
  }

  const response = await fetch(url, {
    next: {
      revalidate: 3600
    }
  });

  if (!response.ok) {
    if (fallback) return fallback as T;
    throw new Error(`Failed to load content from ${url}: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
