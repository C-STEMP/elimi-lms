"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiAward, FiCalendar } from "react-icons/fi";
import { Button } from "@/shared/components/ui/button";
import { InlineSpinner } from "@/shared/components/ui/loader";
import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import {
  useMyCertificates,
  useMyLevelCertificates,
} from "@/features/certificates/hooks";

function formatIssuedDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function shortCredentialId(id: string): string {
  const clean = id.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return clean.length > 8 ? clean.slice(-8) : clean;
}

interface CertificateCardProps {
  id: string;
  href: string;
  eyebrow: string;
  title: string;
  issuedAt?: string;
  isRevoked: boolean;
  isLevel?: boolean;
}

const CertificateCard: React.FC<CertificateCardProps> = ({
  id,
  href,
  eyebrow,
  title,
  issuedAt,
  isRevoked,
  isLevel = false,
}) => {
  const issuedLabel = formatIssuedDate(issuedAt);
  const credCode = shortCredentialId(id);

  const cardContent = (
    <article
      className={`group bg-white border rounded-xl overflow-hidden flex flex-col transition-all duration-200 ${
        isRevoked
          ? "border-gray-200 opacity-75"
          : "border-gray-200/90 hover:border-primary-solid/40 hover:shadow-md hover:-translate-y-0.5"
      }`}
    >
      {/* Top burgundy & gold accent rule */}
      <div
        className={`h-1.5 w-full ${
          isLevel
            ? "bg-linear-to-r from-secondary via-primary to-primary-solid"
            : "bg-linear-to-r from-primary-solid via-primary to-secondary"
        }`}
      />

      {/* Parchment diploma preview surface */}
      <div className="p-4 bg-[#fcfaf4]">
        <div className="border border-[#e7dcc7] rounded-lg p-4 sm:p-5 bg-[#fffdf8] relative flex flex-col justify-between min-h-[148px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-1.5 border border-[#efe7d7] rounded-[5px]"
          />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary-solid/80">
                {eyebrow}
              </span>
              <div className="w-8 h-[2px] bg-secondary rounded-full" />
            </div>
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
                isRevoked
                  ? "bg-gray-100 border-gray-200 text-gray-400"
                  : isLevel
                    ? "bg-primary-solid/10 border-primary-solid/25 text-primary-solid"
                    : "bg-[#fef7e6] border-[#f2d491] text-[#b4690e]"
              }`}
            >
              <FiAward className="w-4 h-4" />
            </div>
          </div>

          <div className="relative z-10 mt-4">
            <h3 className="font-serif font-bold text-neutral-primary text-base sm:text-[17px] leading-snug line-clamp-2 group-hover:text-primary-solid transition-colors">
              {title}
            </h3>
            <p className="text-[11px] text-neutral-secondary mt-1.5">
              Awarded by <span className="font-semibold text-neutral-primary">ELIMI</span>
            </p>
          </div>
        </div>
      </div>

      {/* Clean metadata & action footer */}
      <div className="px-5 py-3.5 bg-white border-t border-gray-100 flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          {isRevoked ? (
            <span className="text-xs font-semibold text-red-700">Revoked</span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-neutral-secondary">
              <FiCalendar className="w-3.5 h-3.5 shrink-0 text-neutral-secondary/70" />
              <span>Issued {issuedLabel}</span>
            </span>
          )}
          {credCode && (
            <span className="text-[10px] font-mono text-neutral-secondary/75">
              ID · {credCode}
            </span>
          )}
        </div>

        {isRevoked ? (
          <span className="text-xs font-medium text-neutral-secondary">
            Unavailable
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-solid shrink-0">
            <span>View</span>
            <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        )}
      </div>
    </article>
  );

  return isRevoked ? (
    <div>{cardContent}</div>
  ) : (
    <Link
      href={href}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid rounded-xl"
    >
      {cardContent}
    </Link>
  );
};

export const CertificatesView: React.FC = () => {
  const { data: certificates, isLoading: isLoadingUnits } = useMyCertificates();
  const { data: levelCertificates, isLoading: isLoadingLevels } =
    useMyLevelCertificates();

  const unitItems = certificates?.data ?? [];
  const levelItems = levelCertificates?.data ?? [];
  const totalCount = unitItems.length + levelItems.length;
  const isLoading = isLoadingUnits || isLoadingLevels;

  return (
    <div className="w-full min-h-screen bg-[#f8f7f5] flex flex-col">
      <DashboardNav title="Certificates" />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-7xl xl:max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col gap-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200/80">
          <p className="text-neutral-secondary text-sm">
            Verified qualification level and unit certificates earned from completed courses.
          </p>
          {!isLoading && totalCount > 0 && (
            <span className="text-xs font-medium text-neutral-secondary tabular-nums">
              {totalCount} {totalCount === 1 ? "certificate" : "certificates"}
            </span>
          )}
        </div>

        {isLoading ? (
          <InlineSpinner />
        ) : totalCount === 0 ? (
          <div className="bg-white border border-gray-200/80 rounded-xl py-16 px-6 flex flex-col items-center gap-3 text-center">
            <FiAward className="w-10 h-10 text-neutral-secondary/40" />
            <p className="text-neutral-primary font-semibold">No certificates yet</p>
            <p className="text-neutral-secondary text-sm max-w-sm">
              Finish a course&apos;s modules and assessment to earn your first certificate.
            </p>
            <Link href="/courses" className="mt-1">
              <Button type="button" variant="primary" size="sm">
                Browse Courses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Level Certificates Section */}
            {levelItems.length > 0 && (
              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-neutral-primary">
                    Qualification Level Certificates
                  </h2>
                  <span className="text-xs text-neutral-secondary tabular-nums">
                    {levelItems.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {levelItems.map((cert) => {
                    const title =
                      cert.title ||
                      cert.offeringTitle ||
                      (cert.tradeName && cert.level !== undefined
                        ? `${cert.tradeName} — Level ${cert.level}`
                        : cert.tradeName) ||
                      "Qualification Level Certificate";
                    return (
                      <CertificateCard
                        key={cert.id}
                        id={cert.id}
                        href={`/certificates/level/${cert.id}`}
                        eyebrow="Qualification Level Certificate"
                        title={title}
                        issuedAt={cert.issuedAt}
                        isRevoked={cert.status === "revoked"}
                        isLevel
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* Unit Certificates Section */}
            {unitItems.length > 0 && (
              <section className="flex flex-col gap-4">
                {levelItems.length > 0 && (
                  <div className="flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-bold text-neutral-primary">
                      Unit Certificates
                    </h2>
                    <span className="text-xs text-neutral-secondary tabular-nums">
                      {unitItems.length}
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unitItems.map((certificate) => (
                    <CertificateCard
                      key={certificate.id}
                      id={certificate.id}
                      href={`/certificates/${certificate.id}`}
                      eyebrow="Certificate of Completion"
                      title={certificate.courseTitle || "Course Certificate"}
                      issuedAt={certificate.issuedAt}
                      isRevoked={certificate.status === "revoked"}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
