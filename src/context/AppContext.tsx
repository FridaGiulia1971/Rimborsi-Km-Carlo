import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppState, Person, Vehicle, Trip, SavedRoute, MonthlyReport, RouteDistance } from '../types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { useDebounce } from '../hooks/useDebounce';

// Migration function to convert old SavedRoute format to new format
const migrateSavedRoutes = (routes: any[]): SavedRoute[] => {
  return routes.map(route => {
    // If route already has distances array, return as is
    if (route.distances && Array.isArray(route.distances)) {
      return route as SavedRoute;
    }
    
    // If route has old distance property, convert it
    if (typeof route.distance === 'number') {
      return {
        ...route,
        distances: [
          {
            id: uuidv4(),
            label: 'Percorso Standard',
            distance: route.distance
          }
        ]
      } as SavedRoute;
    }
    
    // Fallback for malformed data
    return {
      ...route,
      distances: []
    } as SavedRoute;
  });
};

// Default state with sample data
const defaultState: AppState = {
  people: [
    {
      id: '1',
      name: 'Marco',
      surname: 'Rossi',
      role: 'docente',
      email: 'marco.rossi@itfv.it',
    },
    {
      id: '2',
      name: 'Giulia',
      surname: 'Bianchi',
      role: 'dipendente',
      email: 'giulia.bianchi@itfv.it',
    },
    {
      id: '3',
      name: 'Alessandro',
      surname: 'Verdi',
      role: 'amministratore',
      email: 'alessandro.verdi@itfv.it',
    }
  ],
  vehicles: [
    {
      id: '1',
      personId: '1',
      make: 'Fiat',
      model: '500',
      plate: 'AB123CD',
      reimbursementRate: 0.35,
    },
    {
      id: '2',
      personId: '2',
      make: 'Renault',
      model: 'Clio',
      plate: 'EF456GH',
      reimbursementRate: 0.38,
    }
  ],
  savedRoutes: [
    {
      id: '1',
      name: 'Sede Treviso - Sede Vicenza',
      origin: 'Via della Quercia 2/B, Treviso',
      destination: 'Via Pola 30, Torre di Quartesolo, Vicenza',
      distances: [
        {
          id: uuidv4(),
          label: 'Strada Normale',
          distance: 65.2
        },
        {
          id: uuidv4(),
          label: 'Autostrada',
          distance: 58.7
        }
      ]
    },
    {
      id: '2',
      name: 'Sede Treviso - Sede Marcon',
      origin: 'Via della Quercia 2/B, Treviso',
      destination: 'Viale della Stazione 3, Marcon',
      distances: [
        {
          id: uuidv4(),
          label: 'Strada Normale',
          distance: 25.7
        },
        {
          id: uuidv4(),
          label: 'Tangenziale',
          distance: 23.4
        }
      ]
    }
  ],
  trips: []
};

// Create the context
interface AppContextType {
  state: AppState;
  addPerson: (person: Omit<Person, 'id'>) => void;
  updatePerson: (person: Person) => void;
  deletePerson: (id: string) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
  addSavedRoute: (route: Omit<SavedRoute, 'id'>) => void;
  updateSavedRoute: (route: SavedRoute) => void;
  deleteSavedRoute: (id: string) => void;
  addRouteDistance: (routeId: string, distance: Omit<RouteDistance, 'id'>) => void;
  updateRouteDistance: (routeId: string, distance: RouteDistance) => void;
  deleteRouteDistance: (routeId: string, distanceId: string) => void;
  generateMonthlyReport: (personId: string, month: number, year: number) => MonthlyReport | null;
  getPerson: (id: string) => Person | undefined;
  getVehicle: (id: string) => Vehicle | undefined;
  getVehiclesForPerson: (personId: string) => Vehicle[];
  getSavedRoute: (id: string) => SavedRoute | undefined;
  getRouteDistance: (routeId: string, distanceId: string) => RouteDistance | undefined;
  formatDate: (dateString: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const savedState = localStorage.getItem('itfvAppState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Migrate saved routes if needed
        if (parsedState.savedRoutes) {
          parsedState.savedRoutes = migrateSavedRoutes(parsedState.savedRoutes);
        }
        return parsedState;
      } catch (error) {
        console.error('Error parsing saved state:', error);
        return defaultState;
      }
    }
    return defaultState;
  });

  // Debounce the state to reduce localStorage writes
  // Wait 500ms after the last state change before saving
  const debouncedState = useDebounce(state, 500);

  // Save to localStorage only when debouncedState changes
  useEffect(() => {
    localStorage.setItem('itfvAppState', JSON.stringify(debouncedState));
  }, [debouncedState]);

  const addPerson = (person: Omit<Person, 'id'>) => {
    const newPerson = { ...person, id: uuidv4() };
    setState(prev => ({
      ...prev,
      people: [...prev.people, newPerson]
    }));
  };

  const updatePerson = (person: Person) => {
    setState(prev => ({
      ...prev,
      people: prev.people.map(p => p.id === person.id ? person : p)
    }));
  };

  const deletePerson = (id: string) => {
    setState(prev => ({
      ...prev,
      people: prev.people.filter(p => p.id !== id),
      vehicles: prev.vehicles.filter(v => v.personId !== id),
      trips: prev.trips.filter(t => t.personId !== id)
    }));
  };

  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const newVehicle = { ...vehicle, id: uuidv4() };
    setState(prev => ({
      ...prev,
      vehicles: [...prev.vehicles, newVehicle]
    }));
  };

  const updateVehicle = (vehicle: Vehicle) => {
    setState(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(v => v.id === vehicle.id ? vehicle : v)
    }));
  };

  const deleteVehicle = (id: string) => {
    setState(prev => ({
      ...prev,
      vehicles: prev.vehicles.filter(v => v.id !== id),
      trips: prev.trips.filter(t => t.vehicleId !== id)
    }));
  };

  const addTrip = (trip: Omit<Trip, 'id'>) => {
    const newTrip = { ...trip, id: uuidv4() };
    setState(prev => ({
      ...prev,
      trips: [...prev.trips, newTrip]
    }));
  };

  const updateTrip = (trip: Trip) => {
    setState(prev => ({
      ...prev,
      trips: prev.trips.map(t => t.id === trip.id ? trip : t)
    }));
  };

  const deleteTrip = (id: string) => {
    setState(prev => ({
      ...prev,
      trips: prev.trips.filter(t => t.id !== id)
    }));
  };

  const addSavedRoute = (route: Omit<SavedRoute, 'id'>) => {
    const newRoute = { ...route, id: uuidv4() };
    setState(prev => ({
      ...prev,
      savedRoutes: [...prev.savedRoutes, newRoute]
    }));
  };

  const updateSavedRoute = (route: SavedRoute) => {
    setState(prev => ({
      ...prev,
      savedRoutes: prev.savedRoutes.map(r => r.id === route.id ? route : r)
    }));
  };

  const deleteSavedRoute = (id: string) => {
    setState(prev => ({
      ...prev,
      savedRoutes: prev.savedRoutes.filter(r => r.id !== id)
    }));
  };

  const addRouteDistance = (routeId: string, distance: Omit<RouteDistance, 'id'>) => {
    const newDistance = { ...distance, id: uuidv4() };
    setState(prev => ({
      ...prev,
      savedRoutes: prev.savedRoutes.map(route => 
        route.id === routeId 
          ? { ...route, distances: [...route.distances, newDistance] }
          : route
      )
    }));
  };

  const updateRouteDistance = (routeId: string, distance: RouteDistance) => {
    setState(prev => ({
      ...prev,
      savedRoutes: prev.savedRoutes.map(route => 
        route.id === routeId 
          ? { 
              ...route, 
              distances: route.distances.map(d => d.id === distance.id ? distance : d)
            }
          : route
      )
    }));
  };

  const deleteRouteDistance = (routeId: string, distanceId: string) => {
    setState(prev => ({
      ...prev,
      savedRoutes: prev.savedRoutes.map(route => 
        route.id === routeId 
          ? { ...route, distances: route.distances.filter(d => d.id !== distanceId) }
          : route
      )
    }));
  };

  const getPerson = (id: string) => state.people.find(p => p.id === id);
  
  const getVehicle = (id: string) => state.vehicles.find(v => v.id === id);
  
  const getVehiclesForPerson = (personId: string) => 
    state.vehicles.filter(v => v.personId === personId);
  
  const getSavedRoute = (id: string) => state.savedRoutes.find(r => r.id === id);

  const getRouteDistance = (routeId: string, distanceId: string) => {
    const route = getSavedRoute(routeId);
    return route?.distances.find(d => d.id === distanceId);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: it });
  };

  const generateMonthlyReport = (personId: string, month: number, year: number): MonthlyReport | null => {
    const person = state.people.find(p => p.id === personId);
    if (!person) return null;

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const personTrips = state.trips.filter(trip => {
      const tripDate = new Date(trip.date);
      return trip.personId === personId && 
             tripDate >= startDate && 
             tripDate <= endDate;
    });

    if (personTrips.length === 0) return null;

    let totalDistance = 0;
    let totalReimbursement = 0;

    personTrips.forEach(trip => {
      const vehicle = state.vehicles.find(v => v.id === trip.vehicleId);
      if (vehicle) {
        const tripDistance = trip.isRoundTrip ? trip.distance * 2 : trip.distance;
        totalDistance += tripDistance;
        totalReimbursement += tripDistance * vehicle.reimbursementRate;
      }
    });

    return {
      month,
      year,
      personId,
      trips: personTrips,
      totalDistance,
      totalReimbursement
    };
  };

  const value = {
    state,
    addPerson,
    updatePerson,
    deletePerson,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addTrip,
    updateTrip,
    deleteTrip,
    addSavedRoute,
    updateSavedRoute,
    deleteSavedRoute,
    addRouteDistance,
    updateRouteDistance,
    deleteRouteDistance,
    generateMonthlyReport,
    getPerson,
    getVehicle,
    getVehiclesForPerson,
    getSavedRoute,
    getRouteDistance,
    formatDate
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook for using the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};