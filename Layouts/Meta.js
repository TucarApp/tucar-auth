import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";

function Meta({ children, title, ...customMeta }) {
  const router = useRouter();
  const cdnUrl = "https://storage.googleapis.com/tucar-dev-bucket/public";



  const meta = {
    title: title ? `${title} | Tucar` : "Tucar",
    type: "website",
    description:
      "Tucar administra vehículos en arriendo, a través de su software de aplicación web, que conecta los conductores y propietarios de los vehículos registrados en su servicio.",
    image: `${cdnUrl}/isotipo/isotipo.svg`,
    keywords:
      "Arriendo de autos, Arriendo de auto Santiago, Arriendo de autos Santiago, Arriendo de vehículos, Arriendo de vehículos, Arriendos económicos, Arriendos baratos, Alquiler de autos, Alquiler de auto, Alquiler de vehículos, Autos para uber,  Arriendo auto para uber, Arriendos de autos para uber, Autos para Uber, Mejores autos para uber, Autos en Arriendo para Uber , Uber",
    ...customMeta,
  };



  return (
    <>
      <Head>


        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta content={meta.description} name="description" />
        <meta name="keywords" content={meta.keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:url" content={`https://tucar.app${router.asPath}`} />
        <link rel="canonical" href={`https://tucar.app${router.asPath}`} />
        <link rel="icon" href={`${cdnUrl}/favicon.ico`} />

        <meta charSet="UTF-8" />
        <meta content={meta.description} name="description" />
        <meta property="og:type" content={meta.type} />
        <meta property="og:site_name" content="Tucar" />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@rentacapp" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter.description" content={meta.keywords} />
        <meta name="twitter:image" content={meta.image} />
        <meta property="og:image" content={meta.image} />
        <meta property="og:image:secure_url" content={meta.image} />
        {meta.data && (
          <meta property="article:published_time" content={meta.date} />
        )}

        {/* Google Tag Manager */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-BF7HR647WQ`}
        />

        {/* Script para inicializar gtag */}
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BF7HR647WQ', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
        {/* Hotjar Tracking Code */}
        <Script strategy="lazyOnload">
          {`
          (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:5155505,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
        </Script>
      </Head>
    </>
  );
}

export default Meta;
