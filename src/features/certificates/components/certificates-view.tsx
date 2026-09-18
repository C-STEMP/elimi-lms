"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiAward } from "react-icons/fi";
import { Button } from "@/shared/components/ui/button";
import { InlineSpinner } from "@/shared/components/ui/loader";
import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import { useMyCertificates } from "@/features/certificates/hooks";
import { useResolveAssets } from "@/features/storage/hooks";

export const CertificatesView: React.FC = () => {
  const { data: certificates, isLoading } = useMyCertificates();

  const assetIds = useMemo(
    () => (certificates?.data ?? []).map((c) => c.assetId).filter((id): id is string => Boolean(id)),
    [certificates]
  );
  const { data: resolvedAssets } = useResolveAssets(assetIds);
  const urlByAssetId = useMemo(() => {
    const map = new Map<string, string>();
    resolvedAssets?.assets.forEach((asset) => map.set(asset.assetId, asset.url));
    return map;
  }, [resolvedAssets]);

  return (
    <div className="w-full min-h-screen bg-input-bg/40 flex flex-col">
      <DashboardNav title="Certificates" />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-7xl xl:max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col gap-6"
      >
        <p className="text-neutral-secondary text-sm -mt-2">
          Certificates you&apos;ve earned by completing courses.
        </p>

        {isLoading ? (
          <InlineSpinner />
        ) : !certificates?.data.length ? (
          <div className="bg-white border border-border-gray/60 rounded-2xl py-16 flex flex-col items-center gap-3 text-center">
            <FiAward className="w-10 h-10 text-neutral-secondary/40" />
            <p className="text-neutral-primary font-semibold">No certificates yet</p>
            <p className="text-neutral-secondary text-sm max-w-sm">
              Finish a course&apos;s modules and assessment to earn your first certificate.
            </p>
            <Link href="/courses">
              <Button type="button" variant="secondary" size="sm">
                Browse Courses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.data.map((certificate) => {
              const url = certificate.assetId ? urlByAssetId.get(certificate.assetId) : undefined;
              return (
                <div
                  key={certificate.id}
                  className="bg-white border border-border-gray/60 rounded-2xl p-5 flex flex-col gap-3"
                >
                  <div className="w-11 h-11 rounded-full bg-secondary/10 flex items-center justify-center">
                    <FiAward className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-text-dark text-sm leading-tight">
                      {certificate.courseTitle || "Course Certificate"}
                    </h3>
                    <p className="text-neutral-secondary text-xs mt-1">
                      {certificate.status === "revoked"
                        ? "Revoked"
                        : `Issued ${new Date(certificate.issuedAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    fullWidth
                    disabled={!url || certificate.status === "revoked"}
                    onClick={() => url && window.open(url, "_blank", "noopener,noreferrer")}
                  >
                    {certificate.status === "revoked"
                      ? "Revoked"
                      : url
                        ? "View Certificate"
                        : "Generating..."}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};
