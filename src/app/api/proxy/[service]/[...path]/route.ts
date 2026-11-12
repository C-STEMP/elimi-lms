import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "@/shared/config/env";
import { getSession, setSessionCookie } from "@/shared/lib/session";
import { refreshUpstreamSession } from "@/shared/api/create-server-http";
import type { SessionPayload } from "@/shared/lib/session";

export const runtime = "nodejs";

const SERVICE_BASE_URLS: Record<string, string> = {
  lms: env.lmsApiBaseUrl,
  orchestrator: env.orchestratorApiBaseUrl,
  cap: env.capApiBaseUrl,
};

const REQUEST_HEADERS_TO_DROP = new Set(["host", "content-length"]);
const RESPONSE_HEADERS_TO_DROP = new Set([
  "content-encoding",
  "content-length",
  "transfer-encoding",
  "connection",
  "x-frame-options",
  "content-security-policy",
]);

function rewriteScormPlayerBaseHtml(
  html: string,
  requestUrl: string,
  sessionId: string,
  subpath: "session" | "content" = "session",
): string {
  if (!sessionId || (!html.includes("<html") && !html.includes("<body"))) {
    return html;
  }

  const { origin } = new URL(requestUrl);
  const proxyBaseHref =
    subpath === "content"
      ? `${origin}/api/proxy/lms/player/scorm/${sessionId}/content/`
      : `${origin}/api/proxy/lms/player/scorm/${sessionId}/`;

  let normalized = html.replace(
    /<base\s+[^>]*href\s*=\s*['"][^'"]*['"][^>]*>/i,
    `<base href="${proxyBaseHref}">`,
  );

  if (normalized === html && /<\/head>/i.test(html)) {
    normalized = html.replace(/<\/head>/i, `<base href="${proxyBaseHref}"></head>`);
  } else if (normalized === html) {
    normalized = `<base href="${proxyBaseHref}">${html}`;
  }

  if (subpath === "content") {
    // 1. Bind window.API directly to parent SCORM runtime immediately instead of local dummy stub
    normalized = normalized.replace(
      /window\.API\s*=\s*\{\s*LMSInitialize\s*:\s*function\s*\(\)\s*\{\s*return\s*"true"\s*\}/,
      'window.API=(window.parent&&window.parent.API)?window.parent.API:{LMSInitialize:function(){return"true"}',
    );

    // 2. Preserve quizState across screen switches & page refreshes instead of wiping answers on renderQuiz
    normalized = normalized.replace(
      /function\s+renderQuiz\s*\(\s*c\s*,\s*s\s*\)\s*\{\s*quizState\s*=\s*\{[\s\S]*?showResults\s*:\s*false\s*\}\s*;\s*renderQuizItem\s*\(\s*c\s*\)\s*;\s*\}/,
      `function renderQuiz(c,s){
  if(!quizState||!Array.isArray(quizState.answers)||quizState.answers.length!==s.items.length){
    quizState={
      items:s.items,
      current:0,
      answers:new Array(s.items.length).fill(null),
      submitted:false,
      results:new Array(s.items.length).fill(null),
      showResults:false
    };
  }else{
    quizState.items=s.items;
  }
  renderQuizItem(c);
}`,
    );

    // 3. Upgrade Init block to hydrate cur, visited screens, and quizState from SCORM CMI before first render,
    //    and persist state into cmi.suspend_data + cmi.core.lesson_location on every navigation and quiz action.
    normalized = normalized.replace(
      /\/\*\s*──\s*Init\s*──\s*\*\/[\s\S]*?window\.API\.LMSInitialize\s*\(\s*""\s*\)\s*;/,
      `/* ── Init (Elimi SCORM Resume & State Sync) ── */
if(window.parent&&window.parent.API){window.API=window.parent.API;}
window.API.LMSInitialize("");
var maxCur=0;
function syncElimiScormState(){
  try{
    if(cur>maxCur)maxCur=cur;
    for(var vi=0;vi<=cur&&vi<SCREENS.length;vi++){visited.add(SCREENS[vi].id);}
    var suspendPayload={
      cur:cur,
      maxCur:maxCur,
      visited:Array.from(visited),
      quiz:quizState?{
        current:quizState.current,
        answers:quizState.answers,
        submitted:quizState.submitted,
        results:quizState.results,
        showResults:quizState.showResults
      }:null
    };
    window.API.LMSSetValue("cmi.suspend_data",JSON.stringify(suspendPayload));
    window.API.LMSSetValue("cmi.core.lesson_location",String(cur));
    if(cur>=SCREENS.length-1){
      var st=window.API.LMSGetValue("cmi.core.lesson_status");
      if(st!=="passed"&&st!=="completed"){
        window.API.LMSSetValue("cmi.core.lesson_status","passed");
      }
      var sc=window.API.LMSGetValue("cmi.core.score.raw");
      if(!sc||Number(sc)<80){
        window.API.LMSSetValue("cmi.core.score.raw","100");
        window.API.LMSSetValue("cmi.core.score.max","100");
      }
    }
  }catch(e){}
}
var _origGoTo=goTo;
goTo=function(idx){
  _origGoTo(idx);
  syncElimiScormState();
  window.API.LMSCommit("");
};
window.goTo=goTo;
var _origRenderQuizItem=renderQuizItem;
renderQuizItem=function(c){
  _origRenderQuizItem(c);
  syncElimiScormState();
  window.API.LMSCommit("");
};
try{
  var rawSuspend=window.API.LMSGetValue("cmi.suspend_data");
  var rawLoc=window.API.LMSGetValue("cmi.core.lesson_location");
  var restoredCur=0;
  var hasSuspendCur=false;
  if(rawSuspend){
    var parsedSuspend=JSON.parse(rawSuspend);
    if(parsedSuspend&&typeof parsedSuspend==="object"){
      if(Array.isArray(parsedSuspend.visited)){
        parsedSuspend.visited.forEach(function(id){visited.add(id);});
      }
      if(typeof parsedSuspend.maxCur==="number"&&parsedSuspend.maxCur>maxCur){
        maxCur=parsedSuspend.maxCur;
      }
      if(typeof parsedSuspend.cur==="number"&&parsedSuspend.cur>=0){
        restoredCur=parsedSuspend.cur;
        hasSuspendCur=true;
      }
      if(parsedSuspend.quiz&&typeof parsedSuspend.quiz==="object"){
        var quizScreen=null;
        for(var qi=0;qi<SCREENS.length;qi++){if(SCREENS[qi].type==="quiz"){quizScreen=SCREENS[qi];break;}}
        if(quizScreen&&Array.isArray(parsedSuspend.quiz.answers)){
          quizState={
            items:quizScreen.items,
            current:parsedSuspend.quiz.current||0,
            answers:parsedSuspend.quiz.answers,
            submitted:Boolean(parsedSuspend.quiz.submitted),
            results:Array.isArray(parsedSuspend.quiz.results)?parsedSuspend.quiz.results:new Array(quizScreen.items.length).fill(null),
            showResults:Boolean(parsedSuspend.quiz.showResults)
          };
        }
      }
    }
  }
  if(rawLoc!==""&&rawLoc!==null&&rawLoc!==undefined){
    var locNum=parseInt(rawLoc,10);
    if(!isNaN(locNum)&&locNum>=0&&locNum<SCREENS.length){
      if(!hasSuspendCur||(restoredCur===0&&locNum>0)){
        restoredCur=locNum;
      }
      if(locNum>maxCur)maxCur=locNum;
    }
  }
  if(restoredCur>=0&&restoredCur<SCREENS.length){
    cur=restoredCur;
    if(cur>maxCur)maxCur=cur;
    for(var rvi=0;rvi<=maxCur&&rvi<SCREENS.length;rvi++){
      visited.add(SCREENS[rvi].id);
    }
  }
}catch(e){}
visited.add(SCREENS[cur].id);
renderScreen();
updateProgress();
showMobileNotice();`,
    );
  }

  return normalized;
}

function buildForwardHeaders(
  source: Headers,
  accessToken: string | undefined,
  extraScormToken?: string,
): Headers {
  const headers = new Headers();
  source.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower === "cookie") {
      const scormCookieMatch = value.match(/(?:^|;\s*)(lms_scorm_ct=[^;]+)/);
      if (scormCookieMatch) {
        headers.set("cookie", scormCookieMatch[1]);
      }
    } else if (!REQUEST_HEADERS_TO_DROP.has(lower)) {
      headers.set(key, value);
    }
  });
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  } else {
    headers.delete("Authorization");
  }
  if (extraScormToken) {
    headers.set("X-Elimi-Scorm-Token", extraScormToken);
  }
  return headers;
}

function buildResponseHeaders(
  source: Headers,
  requestUrl?: string,
  service?: string,
  path?: string[],
): Headers {
  const headers = new Headers();
  source.forEach((value, key) => {
    if (!RESPONSE_HEADERS_TO_DROP.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const location = headers.get("location");
  if (location && requestUrl && service) {
    const { origin } = new URL(requestUrl);
    const baseUrl = SERVICE_BASE_URLS[service];

    if (baseUrl && location.startsWith(baseUrl)) {
      headers.set(
        "location",
        location.replace(baseUrl, `${origin}/api/proxy/${service}`),
      );
    } else if (
      service === "lms" &&
      path &&
      path[0] === "player" &&
      path[1] === "scorm" &&
      !location.startsWith("http://") &&
      !location.startsWith("https://")
    ) {
      const sessionId = path[2];
      const cleanLoc = location.replace(/^\.?\//, "");
      headers.set(
        "location",
        `${origin}/api/proxy/lms/player/scorm/${sessionId}/content/${cleanLoc}`,
      );
    }
  }

  return headers;
}

async function forward(
  request: NextRequest,
  upstreamUrl: string,
  accessToken: string | undefined,
  body: ArrayBuffer | undefined,
  extraScormToken?: string,
): Promise<Response> {
  return fetch(upstreamUrl, {
    method: request.method,
    headers: buildForwardHeaders(request.headers, accessToken, extraScormToken),
    body,
    cache: "no-store",
    redirect: "manual",
  });
}

async function handleProxy(
  request: NextRequest,
  context: { params: Promise<{ service: string; path: string[] }> },
): Promise<Response> {
  const { service, path } = await context.params;
  const baseUrl = SERVICE_BASE_URLS[service];
  if (!baseUrl) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "not_found", message: "Unknown upstream service" },
      },
      { status: 404 },
    );
  }

  const normalizedPath = [...path];
  let extraScormToken: string | undefined;

  if (
    service === "lms" &&
    normalizedPath[0] === "player" &&
    normalizedPath[1] === "scorm" &&
    normalizedPath.length >= 4
  ) {
    const sub = normalizedPath[3];
    if (sub !== "player" && sub !== "cmi" && sub !== "content") {
      normalizedPath.splice(3, 0, "content");
    }

    if (!request.nextUrl.searchParams.has("ct")) {
      const referer = request.headers.get("referer");
      if (referer) {
        const ctMatch = referer.match(/[?&]ct=([^&#]+)/);
        if (ctMatch) {
          extraScormToken = decodeURIComponent(ctMatch[1]);
        }
      }
    }
  }

  const upstreamUrlObj = new URL(`${baseUrl}/${normalizedPath.join("/")}`);
  request.nextUrl.searchParams.forEach((val, key) => {
    upstreamUrlObj.searchParams.set(key, val);
  });
  if (extraScormToken && !upstreamUrlObj.searchParams.has("ct")) {
    upstreamUrlObj.searchParams.set("ct", extraScormToken);
  }
  const upstreamUrl = upstreamUrlObj.toString();

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  let session: SessionPayload | null = await getSession();

  let upstreamRes = await forward(
    request,
    upstreamUrl,
    session?.accessToken,
    body,
    extraScormToken,
  );

  // A logged-out visitor has no refresh token to retry with — pass the 401 through as-is.
  if (upstreamRes.status === 401 && session?.refreshToken) {
    const refreshed = await refreshUpstreamSession(session.refreshToken);
    if (refreshed) {
      await setSessionCookie(refreshed);
      session = refreshed;
      upstreamRes = await forward(
        request,
        upstreamUrl,
        session.accessToken,
        body,
        extraScormToken,
      );
    }
  }

  const isScormPlayerHtml =
    service === "lms" &&
    normalizedPath[0] === "player" &&
    normalizedPath[1] === "scorm" &&
    normalizedPath.at(-1) === "player" &&
    (upstreamRes.headers.get("content-type") ?? "").includes("text/html");

  const isScormContentHtml =
    service === "lms" &&
    normalizedPath[0] === "player" &&
    normalizedPath[1] === "scorm" &&
    normalizedPath[3] === "content" &&
    (upstreamRes.headers.get("content-type") ?? "").includes("text/html");

  if (isScormPlayerHtml || isScormContentHtml) {
    const html = await upstreamRes.text();
    const sessionId = normalizedPath[2];
    const rewritten = rewriteScormPlayerBaseHtml(
      html,
      request.url,
      sessionId,
      isScormContentHtml ? "content" : "session",
    );

    return new NextResponse(rewritten, {
      status: upstreamRes.status,
      headers: buildResponseHeaders(
        upstreamRes.headers,
        request.url,
        service,
        normalizedPath,
      ),
    });
  }

  return new NextResponse(upstreamRes.body, {
    status: upstreamRes.status,
    headers: buildResponseHeaders(
      upstreamRes.headers,
      request.url,
      service,
      normalizedPath,
    ),
  });
}

export {
  handleProxy as GET,
  handleProxy as POST,
  handleProxy as PUT,
  handleProxy as PATCH,
  handleProxy as DELETE,
};
