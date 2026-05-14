import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import LoginCard from "@/components/LoginCard";
import { DocsLink } from "@/components/DocsLink";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useApp } from "@/lib/hooks";
import Head from "next/head";
import pako from "pako";

function decodeSamlRequest(raw: string): string {
  const bytes = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
  // HTTP-POST binding: bytes are already raw XML.
  // HTTP-Redirect binding: bytes are raw DEFLATE-compressed XML.
  if (bytes[0] === 0x3c /* '<' */) return new TextDecoder().decode(bytes);
  return pako.inflateRaw(bytes, { to: "string" });
}

export default function Page() {
  const router = useRouter();
  const app = useApp(router.query.id as string);

  const samlRequest = router.query.SAMLRequest
    ? decodeSamlRequest(router.query.SAMLRequest as string)
    : "";

  return (
    <Layout>
      <Head>
        <title>Simulate Login | DummyIDP</title>
      </Head>

      <div className="px-8">
        <div className="mx-auto max-w-7xl">
          <Breadcrumb className="mt-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Apps</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/apps/${app?.id}`}>
                  {app?.id}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Simulate SAML Login</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="mt-2 text-3xl font-semibold">Simulate SAML login</h1>
          <p className="mt-1 text-muted-foreground">
            Simulate a SAML login as any user you've configured on this DummyIDP
            app.
            <DocsLink to="https://ssoready.com/docs/dummyidp#simulating-saml-logins" />
          </p>

          {app && <LoginCard app={app} samlRequest={samlRequest} />}
        </div>
      </div>
    </Layout>
  );
}
