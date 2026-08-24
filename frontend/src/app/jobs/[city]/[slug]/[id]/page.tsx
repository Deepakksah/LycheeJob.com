import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, DollarSign, Briefcase, Building2, Calendar, Phone, Mail, Clock, ExternalLink, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Header } from '../../../../../components/Header';
import { jobApi } from '../../../../../services/api';
import { Job } from '../../../../../types';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    city: string;
    slug: string;
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const jobId = parseInt(params.id, 10);
    const job = await jobApi.getJobById(jobId);
    if (!job) return { title: 'Job Not Found - MapJobHub' };

    return {
      title: `${job.title} at ${job.company.name} (${job.city || 'India'}) | MapJobHub`,
      description: `${job.title} job in ${job.city || 'India'} at ${job.company.name}. Salary: ${job.salaryMin ? `₹${(job.salaryMin/100000).toFixed(1)} LPA+` : 'Best in industry'}. Apply directly.`,
      openGraph: {
        title: `${job.title} - ${job.company.name}`,
        description: job.description.substring(0, 160),
        images: job.company.logoUrl ? [{ url: job.company.logoUrl }] : []
      }
    };
  } catch (err) {
    return { title: 'Job Details - MapJobHub' };
  }
}

export default async function JobDetailsPage({ params }: PageProps) {
  const jobId = parseInt(params.id, 10);
  let job: Job | null = null;

  try {
    job = await jobApi.getJobById(jobId);
  } catch (err) {
    console.error('Failed to fetch job details', err);
  }

  if (!job) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    identifier: {
      '@type': 'PropertyValue',
      name: job.company.name,
      value: job.externalJobId || job.id.toString()
    },
    datePosted: job.postedDate,
    validThrough: job.expiryDate,
    employmentType: job.jobType === 'FullTime' ? 'FULL_TIME' : job.jobType === 'PartTime' ? 'PART_TIME' : 'CONTRACTOR',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company.name,
      sameAs: job.company.website,
      logo: job.company.logoUrl
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.city,
        addressRegion: job.state,
        addressCountry: job.country
      }
    },
    baseSalary: job.salaryMin ? {
      '@type': 'MonetaryAmount',
      currency: job.currency || 'INR',
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salaryMin,
        maxValue: job.salaryMax,
        unitText: 'YEAR'
      }
    } : undefined
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Schema.org JSON-LD for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Job Search</span>
        </Link>

        {/* Main Job Banner Card */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              
              {/* Logo */}
              <div className="w-16 h-16 rounded-2xl bg-white p-1.5 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden shadow-lg">
                {job.company.logoUrl ? (
                  <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-slate-900 font-extrabold text-xl">
                    {job.company.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{job.title}</h1>
                <div className="flex items-center gap-2 text-sm text-slate-300 mt-1 font-medium">
                  <span className="text-blue-400 font-bold">{job.company.name}</span>
                  <span className="text-slate-500">•</span>
                  <span>📍 {job.city}, {job.state}</span>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <a
              href={job.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2"
            >
              <span>Apply Now on Original Site</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
              <div className="text-slate-400 text-xs flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Salary Range
              </div>
              <div className="font-extrabold text-emerald-400 text-base mt-1">
                {job.salaryMin && job.salaryMax
                  ? `₹${(job.salaryMin/100000).toFixed(1)} - ₹${(job.salaryMax/100000).toFixed(1)} LPA`
                  : 'Undisclosed'}
              </div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
              <div className="text-slate-400 text-xs flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                Experience Needed
              </div>
              <div className="font-extrabold text-white text-base mt-1">
                {job.experienceMin || 0} - {job.experienceMax || 5} Years
              </div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
              <div className="text-slate-400 text-xs flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                Work Mode
              </div>
              <div className="font-extrabold text-white text-base mt-1">
                {job.workMode === 'OnSite' ? 'On-site' : job.workMode}
              </div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
              <div className="text-slate-400 text-xs flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                Job Source
              </div>
              <div className="font-extrabold text-purple-300 text-base mt-1">
                {job.sourceName}
              </div>
            </div>
          </div>

          {/* Legitimate Contact Card if available */}
          {(job.contactName || job.contactPhone || job.contactEmail) && (
            <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified Contact Details (Legitimately Provided)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                {job.contactName && <div><span className="text-slate-400">Recruiter:</span> <span className="font-semibold text-white">{job.contactName}</span></div>}
                {job.contactPhone && <div><span className="text-slate-400">Phone:</span> <a href={`tel:${job.contactPhone}`} className="text-blue-400 font-bold hover:underline">{job.contactPhone}</a></div>}
                {job.contactEmail && <div><span className="text-slate-400">Email:</span> <a href={`mailto:${job.contactEmail}`} className="text-blue-400 font-bold hover:underline truncate">{job.contactEmail}</a></div>}
              </div>
            </div>
          )}

          {/* Legitimate Walk-in / Interview Card if available */}
          {job.interviewDate && (
            <div className="bg-amber-500/10 p-5 rounded-2xl border border-amber-500/30 text-amber-200 space-y-2">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Scheduled Walk-in Interview Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div><span className="text-amber-400/80">Interview Date:</span> <span className="font-bold text-white">{new Date(job.interviewDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                {job.interviewStartTime && <div><span className="text-amber-400/80">Timing:</span> <span className="font-bold text-white">{job.interviewStartTime} {job.interviewEndTime && `- ${job.interviewEndTime}`}</span></div>}
                {job.interviewLocation && <div className="sm:col-span-2"><span className="text-amber-400/80">Location:</span> <span className="font-semibold text-white">{job.interviewLocation}</span></div>}
                {job.interviewMode && <div><span className="text-amber-400/80">Mode:</span> <span className="font-bold text-amber-300">{job.interviewMode}</span></div>}
                {job.interviewNotes && <div className="sm:col-span-2 text-slate-300 italic">Note: {job.interviewNotes}</div>}
              </div>
            </div>
          )}

          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Required Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span key={skill} className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-blue-300">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Job Description */}
          <div>
            <h3 className="text-base font-bold text-white mb-3">Full Job Description</h3>
            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
              {job.description}
            </div>
          </div>

          {/* Map Location Section */}
          <div>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              Job Location
            </h3>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-white text-sm">{job.address || job.city}</div>
              <div>{job.city}, {job.state}, {job.country}</div>
              {job.latitude && job.longitude && (
                <div className="text-slate-400 font-mono pt-1">
                  Coordinates: Lat {job.latitude.toFixed(4)}, Lng {job.longitude.toFixed(4)}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
