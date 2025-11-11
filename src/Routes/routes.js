import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const HomePage = lazy(() => import('../components/main/HomePage'));
const CarInfoPage = lazy(() => import('../components/main/CarInfoPage'));
const VehiclesPage = lazy(() => import('../components/main/VehiclesPage'));

const Routes = () => {
    return (
        <Router basename="/">
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/car/:carId" component={CarInfoPage} />
                    <Route path="/vehicles" component={VehiclesPage} />
                </Switch>
            </Suspense>
        </Router>
    );
};

export default Routes;
