export interface Country {
  code: string;
  name: string;
  states: State[];
}

export interface State {
  code: string;
  name: string;
  cities: string[];
}

export const countries: Country[] = [
  {
    code: 'US',
    name: 'United States',
    states: [
      {
        code: 'CA',
        name: 'California',
        cities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'Fresno', 'Oakland']
      },
      {
        code: 'NY',
        name: 'New York',
        cities: ['New York City', 'Buffalo', 'Rochester', 'Syracuse', 'Albany', 'Yonkers']
      },
      {
        code: 'TX',
        name: 'Texas',
        cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso']
      },
      {
        code: 'FL',
        name: 'Florida',
        cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale', 'Tallahassee']
      },
      {
        code: 'IL',
        name: 'Illinois',
        cities: ['Chicago', 'Aurora', 'Peoria', 'Rockford', 'Elgin', 'Joliet']
      }
    ]
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    states: [
      {
        code: 'ENG',
        name: 'England',
        cities: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Sheffield']
      },
      {
        code: 'SCT',
        name: 'Scotland',
        cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Stirling', 'Perth']
      },
      {
        code: 'WLS',
        name: 'Wales',
        cities: ['Cardiff', 'Swansea', 'Newport', 'Bangor', 'St. Davids', 'Wrexham']
      },
      {
        code: 'NIR',
        name: 'Northern Ireland',
        cities: ['Belfast', 'Derry', 'Lisburn', 'Newtownabbey', 'Bangor', 'Craigavon']
      }
    ]
  },
  {
    code: 'CA',
    name: 'Canada',
    states: [
      {
        code: 'ON',
        name: 'Ontario',
        cities: ['Toronto', 'Ottawa', 'Hamilton', 'London', 'Mississauga', 'Brampton']
      },
      {
        code: 'BC',
        name: 'British Columbia',
        cities: ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond', 'Abbotsford']
      },
      {
        code: 'QC',
        name: 'Quebec',
        cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke']
      },
      {
        code: 'AB',
        name: 'Alberta',
        cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat', 'Grande Prairie']
      }
    ]
  },
  {
    code: 'AU',
    name: 'Australia',
    states: [
      {
        code: 'NSW',
        name: 'New South Wales',
        cities: ['Sydney', 'Newcastle', 'Wollongong', 'Maitland', 'Wagga Wagga', 'Albury']
      },
      {
        code: 'VIC',
        name: 'Victoria',
        cities: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Latrobe', 'Warrnambool']
      },
      {
        code: 'QLD',
        name: 'Queensland',
        cities: ['Brisbane', 'Gold Coast', 'Townsville', 'Cairns', 'Toowoomba', 'Rockhampton']
      },
      {
        code: 'WA',
        name: 'Western Australia',
        cities: ['Perth', 'Fremantle', 'Rockingham', 'Mandurah', 'Bunbury', 'Geraldton']
      }
    ]
  },
  {
    code: 'DE',
    name: 'Germany',
    states: [
      {
        code: 'BY',
        name: 'Bavaria',
        cities: ['Munich', 'Nuremberg', 'Augsburg', 'Würzburg', 'Regensburg', 'Ingolstadt']
      },
      {
        code: 'NW',
        name: 'North Rhine-Westphalia',
        cities: ['Cologne', 'Düsseldorf', 'Dortmund', 'Essen', 'Duisburg', 'Bochum']
      },
      {
        code: 'BW',
        name: 'Baden-Württemberg',
        cities: ['Stuttgart', 'Mannheim', 'Karlsruhe', 'Freiburg', 'Heidelberg', 'Ulm']
      }
    ]
  },
  {
    code: 'FR',
    name: 'France',
    states: [
      {
        code: 'IDF',
        name: 'Île-de-France',
        cities: ['Paris', 'Boulogne-Billancourt', 'Saint-Denis', 'Argenteuil', 'Montreuil', 'Créteil']
      },
      {
        code: 'PACA',
        name: 'Provence-Alpes-Côte d\'Azur',
        cities: ['Marseille', 'Nice', 'Toulon', 'Aix-en-Provence', 'Avignon', 'Antibes']
      },
      {
        code: 'ARA',
        name: 'Auvergne-Rhône-Alpes',
        cities: ['Lyon', 'Grenoble', 'Saint-Étienne', 'Villeurbanne', 'Clermont-Ferrand', 'Chambéry']
      }
    ]
  },
  {
    code: 'IN',
    name: 'India',
    states: [
      {
        code: 'MH',
        name: 'Maharashtra',
        cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur']
      },
      {
        code: 'KA',
        name: 'Karnataka',
        cities: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga']
      },
      {
        code: 'TN',
        name: 'Tamil Nadu',
        cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli']
      },
      {
        code: 'DL',
        name: 'Delhi',
        cities: ['New Delhi', 'Delhi Cantonment', 'Karol Bagh', 'Lajpat Nagar', 'Connaught Place', 'Dwarka']
      }
    ]
  },
  {
    code: 'JP',
    name: 'Japan',
    states: [
      {
        code: 'TK',
        name: 'Tokyo',
        cities: ['Tokyo', 'Shibuya', 'Shinjuku', 'Harajuku', 'Ginza', 'Akihabara']
      },
      {
        code: 'OS',
        name: 'Osaka',
        cities: ['Osaka', 'Sakai', 'Higashiosaka', 'Hirakata', 'Toyonaka', 'Suita']
      },
      {
        code: 'KY',
        name: 'Kyoto',
        cities: ['Kyoto', 'Uji', 'Kameoka', 'Joyo', 'Mukō', 'Yawata']
      }
    ]
  },
  {
    code: 'BR',
    name: 'Brazil',
    states: [
      {
        code: 'SP',
        name: 'São Paulo',
        cities: ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santo André', 'Osasco']
      },
      {
        code: 'RJ',
        name: 'Rio de Janeiro',
        cities: ['Rio de Janeiro', 'Nova Iguaçu', 'Niterói', 'Duque de Caxias', 'São Gonçalo', 'Campos dos Goytacazes']
      },
      {
        code: 'MG',
        name: 'Minas Gerais',
        cities: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', 'Montes Claros']
      }
    ]
  },
  {
    code: 'MX',
    name: 'Mexico',
    states: [
      {
        code: 'DF',
        name: 'Mexico City',
        cities: ['Mexico City', 'Iztapalapa', 'Ecatepec', 'Guadalajara', 'Puebla', 'Tijuana']
      },
      {
        code: 'JAL',
        name: 'Jalisco',
        cities: ['Guadalajara', 'Zapopan', 'Tlaquepaque', 'Tonalá', 'Puerto Vallarta', 'Lagos de Moreno']
      },
      {
        code: 'NL',
        name: 'Nuevo León',
        cities: ['Monterrey', 'Guadalupe', 'San Nicolás de los Garza', 'Apodaca', 'General Escobedo', 'Santa Catarina']
      }
    ]
  }
];