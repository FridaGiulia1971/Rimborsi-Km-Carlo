import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Map, BarChart3, Route } from 'lucide-react';
import Card from '../components/Card';
import { useAppContext } from '../context/AppContext';

const HomePage: React.FC = () => {
  const { state } = useAppContext();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // Count trips for current month
  const currentMonthTrips = state.trips.filter(trip => {
    const tripDate = new Date(trip.date);
    return tripDate.getMonth() === currentMonth && tripDate.getFullYear() === currentYear;
  });

  const stats = [
    { 
      title: 'Persone', 
      value: state.people.length, 
      icon: <Users className="h-8 w-8 text-blue-500" />, 
      link: '/persone',
      color: 'bg-blue-100' 
    },
    { 
      title: 'Tragitti Totali', 
      value: state.trips.length, 
      icon: <Map className="h-8 w-8 text-purple-500" />, 
      link: '/tragitti',
      color: 'bg-purple-100' 
    },
    { 
      title: 'Tragitti Questo Mese', 
      value: currentMonthTrips.length, 
      icon: <BarChart3 className="h-8 w-8 text-amber-500" />, 
      link: '/report',
      color: 'bg-amber-100' 
    },
    { 
      title: 'Percorsi Salvati', 
      value: state.savedRoutes.length, 
      icon: <Route className="h-8 w-8 text-rose-500" />, 
      link: '/percorsi',
      color: 'bg-rose-100' 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestione Rimborsi Chilometrici
        </h1>
        <p className="mt-2 text-gray-600">
          Istituto Veneto di Terapia Familiare
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.title} to={stat.link} className="transition-transform hover:scale-105">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className={`${stat.color} p-4 rounded-lg mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{stat.title}</h3>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card title="Benvenuto nell'applicazione">
        <p className="text-gray-600 mb-4">
          Questa applicazione ti permette di gestire i rimborsi chilometrici per il personale
          dell'Istituto Veneto di Terapia Familiare.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Funzionalità:</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Gestione unificata di persone e veicoli</li>
              <li>Tracciamento dei viaggi con calcolo automatico dei rimborsi</li>
              <li>Percorsi salvati con opzioni multiple di distanza</li>
              <li>Selezione automatica del veicolo per persona</li>
              <li>Generazione di report mensili per i rimborsi</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Per iniziare:</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Aggiungi il personale e i loro veicoli in <Link to="/persone" className="text-teal-600 hover:underline">Persone</Link></li>
              <li>Crea percorsi frequenti in <Link to="/percorsi" className="text-teal-600 hover:underline">Percorsi Salvati</Link></li>
              <li>Registra i viaggi effettuati in <Link to="/tragitti" className="text-teal-600 hover:underline">Tragitti</Link></li>
              <li>Genera report mensili nella sezione <Link to="/report" className="text-teal-600 hover:underline">Report</Link></li>
            </ul>
          </div>
        </div>
      </Card>

      <Card title="Novità - Gestione Semplificata">
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <h4 className="font-semibold text-teal-800 mb-2">🚗 Veicoli integrati nelle Persone</h4>
          <p className="text-teal-700 text-sm mb-3">
            Ora puoi gestire i veicoli direttamente dalla pagina di ogni persona. Quando crei un nuovo tragitto, 
            il veicolo della persona selezionata verrà automaticamente scelto, semplificando il processo.
          </p>
          
          <h4 className="font-semibold text-teal-800 mb-2">🛣️ Percorsi con opzioni multiple</h4>
          <p className="text-teal-700 text-sm">
            I percorsi salvati ora supportano più opzioni di distanza (strada normale, autostrada, ecc.), 
            permettendoti di scegliere rapidamente l'opzione più appropriata per ogni viaggio.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default HomePage;