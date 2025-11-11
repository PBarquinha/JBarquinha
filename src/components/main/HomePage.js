import React, { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet';
import HomePageHeader from '../main/Geral/Navbar/HomePageHeader';
import Hero from '../main/HomePage/Hero/Hero';
import Informations from '../main/HomePage/Informations/Informations';
import Footer from '../main/Geral/Footer/Footer';

const TopPicks = lazy(() => import('../main/HomePage/topPicks/TopPicks'));
const Services = lazy(() => import('../../components/main/HomePage/Services-/Services'));
const SubscribeNewsletter = lazy(() => import('../../components/main/HomePage/Newsletter/SubscribeNewsletter'));
const ContactForm = lazy(() => import('../../components/main/HomePage/ContactForm/ContactForm'));
const AboutUs = lazy(() => import('../main/HomePage/AboutUs/AboutUs'));

function HomePage() {
  return (
    <div>
      <Helmet>
        <title>Carros Clássicos em Portugal | J.Barquinha</title>
        <meta name="description" content="Explore os melhores carros clássicos à venda em Portugal. Jaguar, Bentley, Mercedes, Fiat e mais — tradição e qualidade desde 1990." />
        <meta name="keywords" content="carros clássicos, carros antigos, carros vintage, Portugal, à venda, J.Barquinha, Jaguar, Bentley, Mercedes, Porto" />
        <meta property="og:title" content="J.Barquinha - Carros Clássicos à Venda" />
        <meta property="og:description" content="Descubra a nossa coleção exclusiva de carros clássicos em Portugal. Tradição & excelência desde 1990." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.jbarquinha.com/" />
        <meta property="og:image" content="https://www.jbarquinha.com/Website_Images/Icons/logo.webp" />
      </Helmet>

      <HomePageHeader />
      <Hero />
      <Informations />

      <Suspense fallback={<div>Loading featured cars...</div>}>
        <TopPicks />
      </Suspense>

      <Suspense fallback={<div>Loading services...</div>}>
        <Services />
      </Suspense>

      <Suspense fallback={<div>Loading about us...</div>}>
        <AboutUs />
      </Suspense>

      <Suspense fallback={<div>Loading newsletter...</div>}>
        <SubscribeNewsletter />
      </Suspense>

      <Suspense fallback={<div>Loading contact form...</div>}>
        <ContactForm />
      </Suspense>

      <Footer />
    </div>
  );
}

export default HomePage;

