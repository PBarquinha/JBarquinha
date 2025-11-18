import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const HomePage = lazy(() => import('../components/main/HomePage'));
const CarInfoPage = lazy(() => import('../components/main/CarInfoPage'));
const VehiclesPage = lazy(() => import('../components/main/VehiclesPage'));
const AdminCarsList = lazy(() => import('../components/main/Admin/AdminCarsList'));
const AdminAddCar = lazy(() => import('../components/main/Admin/AdminAddCar'));
const AdminEditCar = lazy(() => import('../components/main/Admin/AdminEditCar')); // ✅ NEW

const Routes = () => {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    {/* PUBLIC ROUTES */}
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/car/:carId" component={CarInfoPage} />
                    <Route exact path="/vehicles" component={VehiclesPage} />

                    {/* ADMIN ROUTES */}
                    <Route exact path="/admin/cars" component={AdminCarsList} />
                    <Route exact path="/admin/add-car" component={AdminAddCar} />
                    <Route exact path="/admin/edit/:id" component={AdminEditCar} /> {/* ✅ NEW */}

                    {/* 404 FALLBACK */}
                    <Route render={() => <h1>404 Not Found</h1>} />
                </Switch>
            </Suspense>
        </Router>
    );
};

export default Routes;
