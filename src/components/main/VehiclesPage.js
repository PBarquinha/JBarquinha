import React from 'react';
import { Helmet } from 'react-helmet';
import CarInfoHeader from '../main/Geral/Navbar/CarInfoHeader';
import VehiclesPageFooter from '../main/Geral/Footer/VehiclesPageFooter';
import ListOfCars from '../main/Vehicles/ListOfCars/ListOfCars';

function VehiclesPage() {
  return (
    <div>
      <Helmet>
        <title>Carros Clássicos à Venda | J.Barquinha</title>
        <meta name="description" content="Veja a nossa coleção de carros clássicos à venda. Modelos raros e em excelente estado. Jaguar, Fiat, Mercedes e muito mais." />
        <meta name="keywords" content="carros clássicos, carros antigos, venda, Portugal, catálogo, Jaguar, Mercedes, Fiat" />
        <meta property="og:title" content="Catálogo de Clássicos à Venda | J.Barquinha" />
        <meta property="og:description" content="Descubra os carros clássicos atualmente disponíveis para compra em Portugal." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.jbarquinha.com/vehicles" />
        <meta property="og:image" content="https://www.jbarquinha.com/Website_Images/Icons/logo.webp" />
      </Helmet>

      <CarInfoHeader />
      <ListOfCars />
      <VehiclesPageFooter />
    </div>
  );
}

export default VehiclesPage;
