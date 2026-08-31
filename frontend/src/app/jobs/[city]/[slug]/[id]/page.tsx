import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, DollarSign, Briefcase, Building2, Calendar, Phone, Mail, Clock, ExternalLink, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Header } from '../../../../../components/Header';
import { jobApi } from '../../../../../services/api';
import { Job } from '../../../../../types';
import { getExactCompanyLogoUrl, getBackupGoogleFaviconUrl } from '../../../../../utils/companyLogos';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    city: string;
    slug: string;
    id: string;
  }> | {
    city: string;
    slug: string;
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const jobId = resolvedParams?.id || '1';
    const job = await jobApi.getJobById(jobId);
    if (!job) return { title: 'Job Details - LycheeJob.com' };

    const compName = job.company?.name || 'Company';
    return {
      title: `${job.title} at ${compName} (${job.city || 'India'}) | LycheeJob.com`,
      description: `${job.title} job in ${job.city || 'India'} at ${compName}. Apply directly on LycheeJob.com.`,
      openGraph: {
        title: `${job.title} - ${compName}`,
        description: (job.description || '').substring(0, 160)
      }
    };
  } catch (err) {
    return { title: 'Job Details - LycheeJob.com' };
  }
}

export default async function JobDetailsPage({ params }: PageProps) {
  let job: Job | null = null;

  try {
    const resolvedParams = await Promise.resolve(params);
    const rawId = resolvedParams?.id || '1';
    job = await jobApi.getJobById(rawId);
  } catch (err) {
    console.error('Failed to fetch job details', err);
  }

  if (!job) {
    job = await jobApi.getJobById(101);
  }

  const compName = job.company?.name || 'Company';
  const logoUrl = getExactCompanyLogoUrl(compName, job.company?.website, job.company?.logoUrl);

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    identifier: {
      '@type': 'PropertyValue',
      name: compName,
      value: job.externalJobId || job.id.toString()
    },
    datePosted: job.postedDate,
    validThrough: job.expiryDate,
    employmentType: job.jobType === 'FullTime' ? 'FULL_TIME' : job.jobType === 'PartTime' ? 'PART_TIME' : 'CONTRACTOR',
    hiringOrganization: {
      '@type': 'Organization',
      name: compName,
      sameAs: job.company?.website,
      logo: logoUrl
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.city,
        addressRegion: job.state,
        addressCountry: job.country
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Schema.org JSON-LD for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        
        {/* Back Link */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-rose-600 transition bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-rose-600" />
            <span>Back to Map Search</span>
          </Link>

          {(job.sourceName === 'GovernmentJobs' || job.id >= 500) && (
            <Link
              href="/govt-jobs"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 transition px-3.5 py-2 rounded-xl border border-amber-200 shadow-xs"
            >
              <span>🏛️ Back to Sarkari Jobs</span>
            </Link>
          )}
        </div>

        {/* Main Job Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-lg space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              
              {/* Logo */}
              <div className="w-16 h-16 rounded-2xl bg-white p-1.5 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden shadow-md">
                {logoUrl ? (
                  <img src={logoUrl} alt={compName} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-rose-600 font-extrabold text-xl">
                    {compName.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{job.title}</h1>
                <div className="flex items-center gap-2 text-sm text-slate-600 mt-1 font-medium">
                  <span className="text-rose-600 font-bold">{compName}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-semibold">📍 {job.city || 'India'}, {job.state || ''}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {job.originalUrl && (
                <a
                  href={job.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-xs transition flex items-center justify-center gap-1.5"
                  title="View Official Recruitment PDF"
                >
                  <span>📄 Official PDF</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <a
                href={job.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-2"
              >
                <span>{job.sourceName === 'GovernmentJobs' ? 'Apply on Govt Portal' : 'Apply on Original Site'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <div className="text-slate-500 text-xs font-semibold flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                Salary Range
              </div>
              <div className="font-extrabold text-emerald-600 text-base mt-1">
                {job.salaryMin && job.salaryMax
                  ? `₹${(job.salaryMin/100000).toFixed(1)} - ₹${(job.salaryMax/100000).toFixed(1)} LPA`
                  : 'Undisclosed'}
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <div className="text-slate-500 text-xs font-semibold flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                Experience Needed
              </div>
              <div className="font-extrabold text-slate-900 text-base mt-1">
                {job.experienceMin || 0} - {job.experienceMax || 5} Years
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <div className="text-slate-500 text-xs font-semibold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                Work Mode
              </div>
              <div className="font-extrabold text-slate-900 text-base mt-1">
                {job.workMode === 'OnSite' ? 'On-site' : job.workMode}
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <div className="text-slate-500 text-xs font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                Job Source
              </div>
              <div className="font-extrabold text-purple-700 text-base mt-1">
                {job.sourceName}
              </div>
            </div>
          </div>

          {/* Legitimate Contact Card if available */}
          {(job.contactName || job.contactPhone || job.contactEmail) && (
            <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                Verified Recruiter Contact
              </div>
              <div className="grid sm:grid-cols-3 gap-3 text-xs pt-1">
                {job.contactName && <div><span className="text-slate-500">Contact:</span> <span className="font-bold text-slate-900">{job.contactName}</span></div>}
                {job.contactPhone && <div><span className="text-slate-500">Phone:</span> <a href={`tel:${job.contactPhone}`} className="font-bold text-rose-600 hover:underline">{job.contactPhone}</a></div>}
                {job.contactEmail && <div><span className="text-slate-500">Email:</span> <a href={`mailto:${job.contactEmail}`} className="font-bold text-rose-600 hover:underline">{job.contactEmail}</a></div>}
              </div>
            </div>
          )}

          {/* Walk-in Interview Details */}
          {job.interviewDate && !isNaN(new Date(job.interviewDate).getTime()) && (
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Walk-in Interview Schedule</span>
              </div>
              <div className="text-xs space-y-1">
                <div><span className="font-semibold">Date:</span> {new Date(job.interviewDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                {job.interviewStartTime && <div><span className="font-semibold">Timings:</span> {job.interviewStartTime} {job.interviewEndTime && `- ${job.interviewEndTime}`}</div>}
                {job.interviewLocation && <div><span className="font-semibold">Venue Address:</span> 📍 {job.interviewLocation}</div>}
              </div>
            </div>
          )}

          {/* Description Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Job Description</h2>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-200/60">
              {job.description}
            </div>
          </div>

          {/* Skills Required */}
          {job.skills && job.skills.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Required Skills & Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200/80">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
