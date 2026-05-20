'use client';

import { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { isSignInWithEmailLink, onAuthStateChanged, sendSignInLinkToEmail, signInWithEmailLink, signOut, User } from 'firebase/auth';
import { CalendarCheck, Check, Lock, Mail, Send, X } from 'lucide-react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';

import { isCompanyEmail } from '@/lib/company-email';
import type { RemotePageContent } from '@/lib/cdn-content';

type AppointmentForm = {
  firstName: string;
  lastName: string;
  contactNumber: string;
  companyName: string;
  jobTitle: string;
  projectType: string;
  requirement: string;
};

type ContactFormSection = {
  component: 'ContactForm';
  eyebrow: string;
  title: string;
  verification: {
    title: string;
    subtitle: string;
    signedInLabels: {
      email: string;
      verified: string;
      companyEmail: string;
      yes: string;
      no: string;
    };
    unverifiedMessage: string;
    signOutLabel: string;
    fields: Array<{
      name: 'companyEmail';
      type: 'email';
      label: string;
      placeholder: string;
      required: boolean;
    }>;
    helperText: string;
    submitLabel: string;
    loadingLabel: string;
  };
  appointment: {
    title: string;
    subtitle: string;
    fields: Array<
      | {
          name: 'firstName' | 'lastName' | 'contactNumber' | 'companyName' | 'jobTitle';
          type: 'text' | 'tel';
          label: string;
          placeholder: string;
          required: boolean;
        }
      | {
          name: 'projectType';
          type: 'select';
          label: string;
          required: boolean;
          options: string[];
        }
      | {
          name: 'requirement';
          type: 'textarea';
          label: string;
          placeholder: string;
          rows: number;
          required: boolean;
        }
    >;
    submitLabel: string;
    loadingLabel: string;
  };
  messages: {
    closeLabel: string;
    missingEmail: string;
    invalidContactNumber: string;
    verificationSuccess: string;
    verificationFailure: string;
    linkSent: string;
    authFailure: string;
    signInRequired: string;
    submissionSuccess: string;
    submissionFailure: string;
  };
};

export type AppointmentContent = RemotePageContent;

function getContactFormSection(appointmentContent: AppointmentContent): ContactFormSection {
  const section = appointmentContent.sections.find((item) => item.component === 'ContactForm');

  if (!section) {
    throw new Error('Missing ContactForm section in appointment-content.json');
  }

  return section as ContactFormSection;
}

function getInitialForm(contactForm: ContactFormSection): AppointmentForm {
  return {
    firstName: '',
    lastName: '',
    contactNumber: '',
    companyName: '',
    jobTitle: '',
    projectType: contactForm.appointment.fields.find((field) => field.name === 'projectType')?.options?.[0] ?? '',
    requirement: ''
  };
}

export default function AppointmentPageClient({ appointmentContent }: { appointmentContent: AppointmentContent }) {
  const router = useRouter();
  const contactForm = useMemo(() => getContactFormSection(appointmentContent), [appointmentContent]);
  const initialForm = useMemo(() => getInitialForm(contactForm), [contactForm]);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (current) => setUser(current));
  }, [contactForm.messages.missingEmail, contactForm.messages.verificationFailure, contactForm.messages.verificationSuccess]);

  useEffect(() => {
    async function completeEmailLinkSignIn() {
      if (typeof window === 'undefined') return;
      if (!isSignInWithEmailLink(auth, window.location.href)) return;

      const storedEmail = window.localStorage.getItem('gromosome-signin-email') ?? '';

      if (!storedEmail) {
        setMessage(contactForm.messages.missingEmail);
        return;
      }

      try {
        setIsLoading(true);
        await signInWithEmailLink(auth, storedEmail, window.location.href);
        window.localStorage.removeItem('gromosome-signin-email');
        window.history.replaceState({}, document.title, window.location.pathname);
        setMessage(contactForm.messages.verificationSuccess);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : contactForm.messages.verificationFailure);
      } finally {
        setIsLoading(false);
      }
    }

    completeEmailLinkSignIn();
  }, []);

  const isCompanyUser = useMemo(() => Boolean(user?.email && isCompanyEmail(user.email)), [user]);



  async function handleAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    try {
      setIsLoading(true);
      const actionCodeSettings = {
        url: `${window.location.origin}${window.location.pathname}`,
        handleCodeInApp: true
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('gromosome-signin-email', email);
      setMessage(contactForm.messages.linkSent);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : contactForm.messages.authFailure);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAppointment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (!user?.email) {
      setMessage(contactForm.messages.signInRequired);
      return;
    }

    const phoneNumber = parsePhoneNumberFromString(form.contactNumber);

    if (!phoneNumber?.isValid()) {
      setMessage(contactForm.messages.invalidContactNumber);
      return;
    }

    const formattedContactNumber = phoneNumber.formatInternational();
    const appointmentCollection = isCompanyUser ? 'companyAppointments' : 'appointments';
    const companyDetails = isCompanyUser
      ? {
          companyName: form.companyName,
          jobTitle: form.jobTitle
        }
      : {};

    try {
      setIsLoading(true);
      await addDoc(collection(db, appointmentCollection), {
        firstName: form.firstName,
        lastName: form.lastName,
        contactNumber: formattedContactNumber,
        projectType: form.projectType,
        requirement: form.requirement,
        ...companyDetails,
        isCompany: isCompanyUser,
        requestedBy: user.email,
        status: 'new',
        createdAt: serverTimestamp()
      });

      setForm(initialForm);
      router.push('submission-success');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : contactForm.messages.submissionFailure);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="gromo-grid px-5 py-16 lg:px-8">
      <NotificationToast
        message={message}
        closeLabel={contactForm.messages.closeLabel}
        onClose={() => setMessage('')}
      />

      <section className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gromo-600 dark:text-gromo-300">{contactForm.eyebrow}</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">{contactForm.title}</h1>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="card-surface rounded-3xl p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-orange-500/10 p-3 text-gromo-700 dark:text-orange-200"><Lock /></div>
              <div>
                <h2 className="text-2xl font-black">{contactForm.verification.title}</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{contactForm.verification.subtitle}</p>
              </div>
            </div>

            {user ? (
              <div className="space-y-4">
                <table className="w-full overflow-hidden rounded-2xl bg-orange-50 text-sm dark:bg-zinc-900">
                  <tbody className="divide-y divide-orange-500/10 dark:divide-zinc-800">
                    <tr>
                      <th scope="row" className="px-4 py-3 text-left font-bold text-zinc-800 dark:text-zinc-100">{contactForm.verification.signedInLabels.email}</th>
                      <td className="px-4 py-3 text-right text-zinc-700 dark:text-zinc-300">{user.email}</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 text-left font-bold text-zinc-800 dark:text-zinc-100">{contactForm.verification.signedInLabels.verified}</th>
                      <td className="px-4 py-3">
                        <span className="flex justify-end">
                          {user.emailVerified ? (
                            <Check size={18} className="text-green-600" aria-hidden="true" />
                          ) : (
                            <X size={18} className="text-red-600" aria-hidden="true" />
                          )}
                          <span className="sr-only">{user.emailVerified ? contactForm.verification.signedInLabels.yes : contactForm.verification.signedInLabels.no}</span>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 text-left font-bold text-zinc-800 dark:text-zinc-100">{contactForm.verification.signedInLabels.companyEmail}</th>
                      <td className="px-4 py-3">
                        <span className="flex justify-end">
                          {user.email && isCompanyEmail(user.email) ? (
                            <Check size={18} className="text-green-600" aria-hidden="true" />
                          ) : (
                            <X size={18} className="text-red-600" aria-hidden="true" />
                          )}
                          <span className="sr-only">{user.email && isCompanyEmail(user.email) ? contactForm.verification.signedInLabels.yes : contactForm.verification.signedInLabels.no}</span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {!user?.email && <p className="text-sm font-semibold text-gromo-700 dark:text-orange-200">{contactForm.verification.unverifiedMessage}</p>}
                <button onClick={() => signOut(auth)} className="rounded-full border border-orange-500/30 px-5 py-3 text-sm font-bold">{contactForm.verification.signOutLabel}</button>
              </div>
            ) : (
              <form onSubmit={handleAuth} className="space-y-4">
                {contactForm.verification.fields.map((field) => (
                  <label key={field.name} className="block">
                    <span className="text-sm font-bold">{field.label}</span>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type={field.type} placeholder={field.placeholder} className="mt-2 w-full rounded-2xl border border-orange-500/20 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 dark:bg-zinc-950" required={field.required} />
                  </label>
                ))}
                <p className="text-xs leading-6 text-zinc-500 dark:text-zinc-400">{contactForm.verification.helperText}</p>
                <button disabled={isLoading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3 font-bold text-white disabled:opacity-60 dark:bg-orange-500 dark:text-black">
                  <Mail size={18} /> {isLoading ? contactForm.verification.loadingLabel : contactForm.verification.submitLabel}
                </button>
              </form>
            )}
          </section>

          <section className="card-surface rounded-3xl p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-orange-500/10 p-3 text-gromo-700 dark:text-orange-200"><CalendarCheck /></div>
              <div>
                <h2 className="text-2xl font-black">{contactForm.appointment.title}</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{contactForm.appointment.subtitle}</p>
              </div>
            </div>

            <form onSubmit={handleAppointment} className="space-y-4">
              {contactForm.appointment.fields.map((field) => {
                if ((field.name === 'companyName' || field.name === 'jobTitle') && !isCompanyUser) {
                  return null;
                }

                if (field.type === 'select') {
                  return (
                    <label key={field.name} className="block">
                      <span className="text-sm font-bold">{field.label}</span>
                      <select value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })} className="mt-2 w-full rounded-2xl border border-orange-500/20 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 dark:bg-zinc-950" required={field.required}>
                        {field.options.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  );
                }

                if (field.type === 'textarea') {
                  return (
                    <label key={field.name} className="block">
                      <span className="text-sm font-bold">{field.label}</span>
                      <textarea value={form.requirement} onChange={(e) => setForm({ ...form, requirement: e.target.value })} rows={field.rows} className="mt-2 w-full rounded-2xl border border-orange-500/20 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 dark:bg-zinc-950" placeholder={field.placeholder} required={field.required} />
                    </label>
                  );
                }

                return (
                  <label key={field.name} className="block">
                    <span className="text-sm font-bold">{field.label}</span>
                    <input value={form[field.name]} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} type={field.type} placeholder={field.placeholder} className="mt-2 w-full rounded-2xl border border-orange-500/20 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 dark:bg-zinc-950" required={field.required} />
                  </label>
                );
              })}
              <button disabled={isLoading || !user?.email} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-orange-500 dark:text-black">
                <Send size={18} /> {isLoading ? contactForm.appointment.loadingLabel : contactForm.appointment.submitLabel}
              </button>
            </form>
          </section>
        </div>

      </section>
    </main>
  );
}

function NotificationToast({
  message,
  closeLabel,
  onClose
}: {
  message: string;
  closeLabel: string;
  onClose: () => void;
}) {
  if (!message) return null;

  return (
    <div className="fixed left-4 right-4 top-4 z-50 sm:left-auto sm:right-6 sm:top-6 sm:w-full sm:max-w-md" role="status" aria-live="polite">
      <div className="flex items-start gap-3 rounded-2xl border border-orange-500/20 bg-white/95 p-4 text-sm font-semibold text-gromo-900 shadow-xl shadow-orange-950/10 backdrop-blur dark:bg-zinc-950/95 dark:text-orange-100">
        <p className="min-w-0 flex-1 leading-6">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-orange-500/20 text-zinc-700 transition hover:bg-orange-100 dark:text-orange-100 dark:hover:bg-orange-500/10"
          aria-label={closeLabel}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
