import React from 'react';
import { Helmet } from 'react-helmet';
import CarInfoHeader from '../main/Geral/Navbar/CarInfoHeader';
import CarInfoFooter from '../main/Geral/Footer/CarInfoFooter';
import CardWrapper from '../../components/main/Cars/CarInfoBox/CardWrapper';
import OtherSuggestions from '../../components/main/Cars/OtherSuggestions/OtherSuggestions';
import LineBetweenSections from '../../components/main/Cars/LineBetweenSections/LineBetweenSections';

function CarInfoPage() {
  return (
    <div>
      <Helmet>
        <title>Detalhes do Carro Clássico | J.Barquinha</title>
        <meta name="description" content="Veja detalhes completos sobre o carro clássico selecionado. Especificações, imagens e muito mais na J.Barquinha." />
        <meta name="keywords" content="carros clássicos, detalhes, ficha técnica, venda, Portugal" />
        <meta property="og:title" content="Carro Clássico à Venda | J.Barquinha" />
        <meta property="og:description" content="Veja todas as informações sobre este modelo clássico disponível para venda." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.jbarquinha.com/car" />
        <meta property="og:image" content="https://www.jbarquinha.com/Website_Images/Icons/logo.webp" />
      </Helmet>

      <CarInfoHeader />
      <CardWrapper />
      <LineBetweenSections />
      <OtherSuggestions />
      <CarInfoFooter />
    </div>
  );
}

export default CarInfoPage;
