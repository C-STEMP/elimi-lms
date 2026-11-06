"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoChevronBack, IoDownloadOutline } from "react-icons/io5";
import { CertificateName } from "@/features/certificates/components/certificate-name";
import type { CertificateRenderData } from "@/features/certificates/types";

export const CERTIFICATE_ASSETS = {
  "elimi-logo_dark": "/elimi-logo-dark.svg" as string | null,
  director_sign: null as string | null,
  coordinator_sign: null as string | null,
  "error-icon": null as string | null,
};

const CERT_WIDTH = 1123;
const CERT_HEIGHT = 794;

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const Img: React.FC<{
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}> = ({
  src,
  alt,
  className = "w-full h-full object-contain object-center",
  priority,
}) =>
  src ? (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill
      unoptimized
      priority={priority}
    />
  ) : null;

export function CertificateTemplate({
  data,
}: {
  data: CertificateRenderData | undefined;
}) {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const update = () => setScale(Math.min(1, frame.clientWidth / CERT_WIDTH));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [data]);
  const [loading, setLoading] = useState<boolean>(false);
  const date = data?.dateOfCompletion
    ? new Date(data.dateOfCompletion)
    : new Date();
  const formattedDate = `${ordinal(date.getDate())} ${date.toLocaleString("en-US", { month: "long" })}, ${date.getFullYear()}`;

  const handleDownload = async () => {
    const element = mainRef.current;
    if (!element) return;
    setLoading(true);

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        onclone: (doc) => {
          const scaler = doc.querySelector<HTMLElement>("[data-cert-scaler]");
          if (scaler) scaler.style.transform = "none";
        },
      });
      const result = canvas.toDataURL("image/png", 1);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: "a4",
      });

      const imgProperties = pdf.getImageProperties(result);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

      pdf.addImage(result, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data?.course.name}-Certificate.pdf`);
    } catch (error) {
      console.error("Certificate download failed", error);
    } finally {
      setLoading(false);
    }
  };

  const programme = data?.organization?.programmeDetails;

  return (
    <>
      {data ? (
        <main className="relative space-y-4 md:space-y-6 bg-white">
          <section className="p-4 bg-white">
            <div className="container mx-auto py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="relative">
                <h2 className="text-2xl md:text-3xl text-neutral-primary/90 font-work font-semibold">
                  Congratulations!
                </h2>
                <p className="text-sm md:text-base text-neutral-primary/70 leading-tight font-normal font-sans w-full max-w-xl mx-auto">
                  Download the certificate and share it with your friends,
                  family and loved ones. Enjoy!
                </p>
              </div>
              <button
                onClick={handleDownload}
                disabled={loading}
                className="w-max py-2 px-6 md:px-8 text-white bg-primary rounded-md cursor-pointer relative z-50 flex items-center gap-2"
              >
                {loading ? (
                  <span className="animate-spin border-2 border-white border-r-transparent rounded-full h-5 w-5 grid place-items-center"></span>
                ) : (
                  <IoDownloadOutline />
                )}
                {loading ? "Downloading..." : "Download"}
              </button>
            </div>
          </section>
          <section className="bg-primary/5 flex flex-col items-center px-3 sm:px-6 py-6 md:py-10">
            <div
              ref={frameRef}
              className="w-full max-w-280.75 flex justify-center"
            >
              <div
                className="shadow-xl print:shadow-none overflow-hidden"
                style={{
                  width: CERT_WIDTH * scale,
                  height: CERT_HEIGHT * scale,
                }}
              >
                <div
                  data-cert-scaler
                  style={{
                    width: CERT_WIDTH,
                    height: CERT_HEIGHT,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                >
                  <aside
                    ref={mainRef}
                    className="relative my-0 mx-auto"
                    style={{ width: CERT_WIDTH, height: CERT_HEIGHT }}
                  >
                    <div className="w-full h-full break-before-auto break-after-auto p-10 bg-white shadow-lg print:shadow-none relative before:absolute before:w-[25%] before:h-[35%] before:bottom-4 before:left-4 before:border-primary before:border-50 before:border-t-0 before:border-r-0 after:absolute after:w-[25%] after:h-[35%] after:top-4 after:right-4 after:border-primary after:border-50 after:border-b-0 after:border-l-0">
                      <div className="flex flex-col justify-between gap-4 p-8 border-4 rounded-md h-full border-primary relative before:absolute before:w-[30%] before:h-[29.5%] before:bottom-10 before:left-10 before:border-primary before:border-15 before:border-t-0 before:border-r-0 after:absolute after:w-[30%] after:h-[29.5%] after:top-10 after:right-10 after:border-primary after:border-15 after:border-b-0 after:border-l-0">
                        <div className="w-full flex justify-between gap-4 -mt-2">
                          <div className=""></div>
                          <div className="flex gap-2 divide-x divide-border-gray w-max bg-white p-2 z-40">
                            <div className="h-14 w-24 bg-white flex justify-center relative shrink-0">
                              <Img
                                src={CERTIFICATE_ASSETS["elimi-logo_dark"]}
                                alt="elimi-logo_dark"
                              />
                            </div>
                            {
                              // Render the organization's logos when it has at least one non-empty logo.
                              programme?.logos.length &&
                              programme.logos[0] !== ""
                                ? programme.logos.map((el, i) => (
                                    <div
                                      key={i.toString()}
                                      className="h-14 w-24 shrink-0 bg-white flex justify-center relative"
                                    >
                                      <Img src={el} alt="" />
                                    </div>
                                  ))
                                : null
                            }
                          </div>
                          <div className=""></div>
                        </div>
                        <div className="flex flex-col text-center text-neutral-primary font-sans">
                          <h2 className="text-4xl text-neutral-primary uppercase font-work font-semibold">
                            CERTIFICATE
                          </h2>
                          <h5 className="text-2xl text-neutral-primary font-medium tracking-widest font-sans">
                            of Completion
                          </h5>
                          <h5 className="text-base pt-5 text-neutral-primary font-sans">
                            This is to certify that
                          </h5>
                        </div>
                        <CertificateName fullname={data.user.fullName} />
                        {data.organization?.name ? (
                          <p className="pt-10 text-center text-neutral-primary max-w-[72%] mx-auto leading-relaxed relative z-10">
                            has successfully completed{" "}
                            <span className="text-xl font-bold capitalize">
                              {data.course.name}
                            </span>{" "}
                            on{" "}
                            <span className="font-semibold whitespace-nowrap">
                              {formattedDate}
                            </span>{" "}
                            sponsored by&nbsp;
                            {data.organization.name}{" "}
                            {programme?.name ? (
                              <>
                                {" "}
                                under the{" "}
                                <span className="font-bold">
                                  {programme.name}.
                                </span>
                              </>
                            ) : (
                              "."
                            )}
                          </p>
                        ) : (
                          <p className="pt-10 text-center text-neutral-primary max-w-[72%] mx-auto leading-relaxed relative z-10">
                            has successfully completed{" "}
                            <span className="text-xl font-bold capitalize">
                              {data.course.name}
                            </span>{" "}
                            on{" "}
                            <span className="font-semibold whitespace-nowrap">
                              {formattedDate}
                            </span>{" "}
                            presented by E-Limi.
                          </p>
                        )}
                        <div className="w-[85%] mx-auto flex justify-between items-center gap-10 mb-6">
                          {programme?.signatories.coordinator &&
                          programme.signatories.coordinator !== "" ? (
                            <div className="flex flex-col items-center gap-0">
                              <div className="relative h-10 w-40 bg-white">
                                <Img
                                  src={
                                    programme.signatories.coordinator ||
                                    CERTIFICATE_ASSETS.coordinator_sign
                                  }
                                  alt="coordinator_sign"
                                />
                              </div>
                              <div className="flex flex-col text-center">
                                <p className="text-neutral-primary text-lg font-bold font-sans capitalize">
                                  {data.organization?.name || "Coordinator"}
                                </p>
                                <p className="text-neutral-primary text-sm font-sans uppercase">
                                  Programme Coordinator
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-0">
                              <div className="relative h-10 w-40 bg-white">
                                <Img
                                  src={CERTIFICATE_ASSETS.director_sign}
                                  alt="director_sign"
                                />
                              </div>
                              <div className="flex flex-col text-center">
                                <p className="text-neutral-primary text-lg font-sans font-bold">
                                  Anthony Okwa
                                </p>
                                <p className="text-neutral-primary text-sm font-sans uppercase">
                                  DG, C-STEMP
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="flex flex-col items-center gap-0">
                            {data.organization?.name ? (
                              <>
                                <div className="relative h-10 w-40 bg-white">
                                  <Img
                                    src={CERTIFICATE_ASSETS.director_sign}
                                    alt="director_sign"
                                  />
                                </div>
                                <div className="flex flex-col text-center">
                                  <p className="text-neutral-primary text-lg font-sans font-bold">
                                    Anthony Okwa
                                  </p>
                                  <p className="text-neutral-primary text-sm font-sans uppercase">
                                    DG, C-STEMP
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="relative h-10 w-40 bg-white"></div>
                                <div className="flex flex-col text-center">
                                  <p className="text-neutral-primary text-lg font-bold font-sans capitalize">
                                    {data.course.instructors[0]?.fullName ||
                                      "C-STEMP Admin"}
                                  </p>
                                  <p className="text-neutral-primary text-sm font-sans uppercase">
                                    Instructor
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <>
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-neutral-primary text-center py-10 opacity-60 font-work font-bold">
            Nice try. But there is no certificate course available for you at
            this time.
          </h2>
          <section className="py-20 px-4 min-h-[80vh]">
            <div className="container mx-auto flex flex-col md:flex-row-reverse gap-4 md:gap-8">
              <aside className="flex-1 relative py-5 md:py-10 min-h-60 md:min-h-96">
                <Img
                  src={CERTIFICATE_ASSETS["error-icon"]}
                  alt="error-icon"
                  className="object-contain xl:object-cover"
                  priority
                />
              </aside>
              <aside className="flex-1 relative py-10 flex flex-col justify-center items-center md:items-start gap-4 md:gap-4 md:max-w-lg text-center md:text-left">
                <h2 className="text-3xl md:text-5xl text-neutral-primary opacity-60 font-work font-bold">
                  No Certificate Found!
                </h2>
                <h3 className="text-xl md:text-2xl text-neutral-primary font-work font-bold">
                  Oops! We could not find any certificate for you at this time.
                </h3>
                <p className="text-sm md:text-base text-neutral-primary opacity-70 font-sans font-medium">
                  If you visit this page by mistake. It’s look that your
                  requested could not be found. It&apos;s look like the link is
                  broken or the page is removed.
                </p>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-white text-base md:text-lg bg-primary w-max py-3 px-6 md:px-10 rounded-md"
                >
                  <IoChevronBack /> Go back to the Dashboard
                </Link>
              </aside>
            </div>
          </section>
        </>
      )}
    </>
  );
}
