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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-BF7HR647WQ"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-BF7HR647WQ');
            `,
          }}
        />
      </Head>
    </>
  );
}

export default Meta;
