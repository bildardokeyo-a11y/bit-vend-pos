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
    code: 'AF',
    name: 'Afghanistan',
    states: [
      { code: 'KAB', name: 'Kabul', cities: ['Kabul', 'Char Asiab', 'Paghman'] },
      { code: 'HER', name: 'Herat', cities: ['Herat', 'Guzara', 'Injil'] }
    ]
  },
  {
    code: 'AL',
    name: 'Albania',
    states: [
      { code: 'TIR', name: 'Tirana', cities: ['Tirana', 'Kamëz', 'Kashar'] },
      { code: 'DUR', name: 'Durrës', cities: ['Durrës', 'Shijak', 'Sukth'] }
    ]
  },
  {
    code: 'DZ',
    name: 'Algeria',
    states: [
      { code: 'ALG', name: 'Algiers', cities: ['Algiers', 'Bab Ezzouar', 'Dar El Beïda'] },
      { code: 'ORA', name: 'Oran', cities: ['Oran', 'Es Senia', 'Bir El Djir'] }
    ]
  },
  {
    code: 'AD',
    name: 'Andorra',
    states: [
      { code: 'AD7', name: 'Andorra la Vella', cities: ['Andorra la Vella'] },
      { code: 'AD2', name: 'Canillo', cities: ['Canillo', 'El Tarter'] }
    ]
  },
  {
    code: 'AO',
    name: 'Angola',
    states: [
      { code: 'LUA', name: 'Luanda', cities: ['Luanda', 'Viana', 'Cacuaco'] },
      { code: 'BGO', name: 'Bengo', cities: ['Caxito', 'Dande', 'Nambuangongo'] }
    ]
  },
  {
    code: 'AR',
    name: 'Argentina',
    states: [
      { code: 'BA', name: 'Buenos Aires', cities: ['Buenos Aires', 'La Plata', 'Mar del Plata', 'Bahía Blanca'] },
      { code: 'CO', name: 'Córdoba', cities: ['Córdoba', 'Villa María', 'Río Cuarto'] },
      { code: 'SF', name: 'Santa Fe', cities: ['Santa Fe', 'Rosario', 'Venado Tuerto'] }
    ]
  },
  {
    code: 'AM',
    name: 'Armenia',
    states: [
      { code: 'ER', name: 'Yerevan', cities: ['Yerevan'] },
      { code: 'GR', name: 'Gegharkunik', cities: ['Gavar', 'Sevan'] }
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
      },
      {
        code: 'SA',
        name: 'South Australia',
        cities: ['Adelaide', 'Mount Gambier', 'Whyalla', 'Port Augusta']
      },
      {
        code: 'TAS',
        name: 'Tasmania',
        cities: ['Hobart', 'Launceston', 'Devonport', 'Burnie']
      }
    ]
  },
  {
    code: 'AT',
    name: 'Austria',
    states: [
      { code: 'W', name: 'Vienna', cities: ['Vienna'] },
      { code: 'ST', name: 'Styria', cities: ['Graz', 'Leoben'] }
    ]
  },
  {
    code: 'AZ',
    name: 'Azerbaijan',
    states: [
      { code: 'BA', name: 'Baku', cities: ['Baku'] },
      { code: 'GAN', name: 'Ganja', cities: ['Ganja'] }
    ]
  },
  {
    code: 'BS',
    name: 'Bahamas',
    states: [
      { code: 'NP', name: 'New Providence', cities: ['Nassau'] },
      { code: 'FP', name: 'Freeport', cities: ['Freeport'] }
    ]
  },
  {
    code: 'BH',
    name: 'Bahrain',
    states: [
      { code: 'MW', name: 'Manama', cities: ['Manama', 'Riffa'] }
    ]
  },
  {
    code: 'BD',
    name: 'Bangladesh',
    states: [
      { code: 'DHA', name: 'Dhaka', cities: ['Dhaka', 'Gazipur', 'Narayanganj'] },
      { code: 'CHI', name: 'Chittagong', cities: ['Chittagong', 'Cox\'s Bazar'] }
    ]
  },
  {
    code: 'BB',
    name: 'Barbados',
    states: [
      { code: 'ST_MICHAEL', name: 'Saint Michael', cities: ['Bridgetown'] }
    ]
  },
  {
    code: 'BY',
    name: 'Belarus',
    states: [
      { code: 'HM', name: 'Minsk', cities: ['Minsk'] },
      { code: 'BR', name: 'Brest', cities: ['Brest'] }
    ]
  },
  {
    code: 'BE',
    name: 'Belgium',
    states: [
      { code: 'BRU', name: 'Brussels', cities: ['Brussels'] },
      { code: 'AN', name: 'Antwerp', cities: ['Antwerp', 'Mechelen'] },
      { code: 'LI', name: 'Liège', cities: ['Liège', 'Verviers'] }
    ]
  },
  {
    code: 'BZ',
    name: 'Belize',
    states: [
      { code: 'BZ', name: 'Belize', cities: ['Belize City'] }
    ]
  },
  {
    code: 'BJ',
    name: 'Benin',
    states: [
      { code: 'LI', name: 'Littoral', cities: ['Cotonou'] },
      { code: 'OU', name: 'Ouémé', cities: ['Porto-Novo'] }
    ]
  },
  {
    code: 'BT',
    name: 'Bhutan',
    states: [
      { code: 'TH', name: 'Thimphu', cities: ['Thimphu'] }
    ]
  },
  {
    code: 'BO',
    name: 'Bolivia',
    states: [
      { code: 'LP', name: 'La Paz', cities: ['La Paz', 'El Alto'] },
      { code: 'SC', name: 'Santa Cruz', cities: ['Santa Cruz de la Sierra'] }
    ]
  },
  {
    code: 'BA',
    name: 'Bosnia and Herzegovina',
    states: [
      { code: 'SA', name: 'Sarajevo', cities: ['Sarajevo'] },
      { code: 'BL', name: 'Banja Luka', cities: ['Banja Luka'] }
    ]
  },
  {
    code: 'BW',
    name: 'Botswana',
    states: [
      { code: 'SE', name: 'South-East', cities: ['Gaborone'] }
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
      },
      {
        code: 'BA',
        name: 'Bahia',
        cities: ['Salvador', 'Feira de Santana', 'Vitória da Conquista']
      }
    ]
  },
  {
    code: 'BN',
    name: 'Brunei',
    states: [
      { code: 'BM', name: 'Brunei-Muara', cities: ['Bandar Seri Begawan'] }
    ]
  },
  {
    code: 'BG',
    name: 'Bulgaria',
    states: [
      { code: 'SZ', name: 'Sofia', cities: ['Sofia'] },
      { code: 'PV', name: 'Plovdiv', cities: ['Plovdiv'] }
    ]
  },
  {
    code: 'BF',
    name: 'Burkina Faso',
    states: [
      { code: 'KAD', name: 'Kadiogo', cities: ['Ouagadougou'] }
    ]
  },
  {
    code: 'BI',
    name: 'Burundi',
    states: [
      { code: 'BM', name: 'Bujumbura Mairie', cities: ['Bujumbura'] }
    ]
  },
  {
    code: 'CV',
    name: 'Cabo Verde',
    states: [
      { code: 'PR', name: 'Praia', cities: ['Praia'] }
    ]
  },
  {
    code: 'KH',
    name: 'Cambodia',
    states: [
      { code: 'PP', name: 'Phnom Penh', cities: ['Phnom Penh'] }
    ]
  },
  {
    code: 'CM',
    name: 'Cameroon',
    states: [
      { code: 'CE', name: 'Centre', cities: ['Yaoundé'] },
      { code: 'LT', name: 'Littoral', cities: ['Douala'] }
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
      },
      {
        code: 'MB',
        name: 'Manitoba',
        cities: ['Winnipeg', 'Brandon', 'Steinbach']
      },
      {
        code: 'SK',
        name: 'Saskatchewan',
        cities: ['Saskatoon', 'Regina', 'Prince Albert']
      }
    ]
  },
  {
    code: 'CF',
    name: 'Central African Republic',
    states: [
      { code: 'BGF', name: 'Bangui', cities: ['Bangui'] }
    ]
  },
  {
    code: 'TD',
    name: 'Chad',
    states: [
      { code: 'ND', name: 'N\'Djamena', cities: ['N\'Djamena'] }
    ]
  },
  {
    code: 'CL',
    name: 'Chile',
    states: [
      { code: 'RM', name: 'Santiago Metropolitan', cities: ['Santiago', 'Puente Alto', 'Maipú'] },
      { code: 'VS', name: 'Valparaíso', cities: ['Valparaíso', 'Viña del Mar'] }
    ]
  },
  {
    code: 'CN',
    name: 'China',
    states: [
      { code: 'BJ', name: 'Beijing', cities: ['Beijing'] },
      { code: 'SH', name: 'Shanghai', cities: ['Shanghai'] },
      { code: 'GD', name: 'Guangdong', cities: ['Guangzhou', 'Shenzhen', 'Dongguan'] },
      { code: 'ZJ', name: 'Zhejiang', cities: ['Hangzhou', 'Ningbo', 'Wenzhou'] }
    ]
  },
  {
    code: 'CO',
    name: 'Colombia',
    states: [
      { code: 'DC', name: 'Bogotá D.C.', cities: ['Bogotá'] },
      { code: 'ANT', name: 'Antioquia', cities: ['Medellín', 'Bello', 'Itagüí'] },
      { code: 'VAC', name: 'Valle del Cauca', cities: ['Cali', 'Palmira'] }
    ]
  },
  {
    code: 'KM',
    name: 'Comoros',
    states: [
      { code: 'G', name: 'Grande Comore', cities: ['Moroni'] }
    ]
  },
  {
    code: 'CG',
    name: 'Congo',
    states: [
      { code: 'BZV', name: 'Brazzaville', cities: ['Brazzaville'] }
    ]
  },
  {
    code: 'CR',
    name: 'Costa Rica',
    states: [
      { code: 'SJ', name: 'San José', cities: ['San José', 'Cartago'] }
    ]
  },
  {
    code: 'HR',
    name: 'Croatia',
    states: [
      { code: 'ZG', name: 'Zagreb', cities: ['Zagreb'] },
      { code: 'ST', name: 'Split-Dalmatia', cities: ['Split'] }
    ]
  },
  {
    code: 'CU',
    name: 'Cuba',
    states: [
      { code: 'CH', name: 'Havana', cities: ['Havana'] }
    ]
  },
  {
    code: 'CY',
    name: 'Cyprus',
    states: [
      { code: 'NI', name: 'Nicosia', cities: ['Nicosia'] }
    ]
  },
  {
    code: 'CZ',
    name: 'Czech Republic',
    states: [
      { code: 'PR', name: 'Prague', cities: ['Prague'] },
      { code: 'JM', name: 'South Moravian', cities: ['Brno'] }
    ]
  },
  {
    code: 'DK',
    name: 'Denmark',
    states: [
      { code: 'CP', name: 'Capital Region', cities: ['Copenhagen', 'Frederiksberg'] },
      { code: 'CD', name: 'Central Denmark', cities: ['Aarhus', 'Odense'] }
    ]
  },
  {
    code: 'DJ',
    name: 'Djibouti',
    states: [
      { code: 'DJ', name: 'Djibouti', cities: ['Djibouti'] }
    ]
  },
  {
    code: 'DM',
    name: 'Dominica',
    states: [
      { code: 'GE', name: 'Saint George', cities: ['Roseau'] }
    ]
  },
  {
    code: 'DO',
    name: 'Dominican Republic',
    states: [
      { code: 'DN', name: 'Distrito Nacional', cities: ['Santo Domingo'] }
    ]
  },
  {
    code: 'EC',
    name: 'Ecuador',
    states: [
      { code: 'P', name: 'Pichincha', cities: ['Quito'] },
      { code: 'G', name: 'Guayas', cities: ['Guayaquil'] }
    ]
  },
  {
    code: 'EG',
    name: 'Egypt',
    states: [
      { code: 'C', name: 'Cairo', cities: ['Cairo', 'Giza'] },
      { code: 'ALX', name: 'Alexandria', cities: ['Alexandria'] }
    ]
  },
  {
    code: 'SV',
    name: 'El Salvador',
    states: [
      { code: 'SS', name: 'San Salvador', cities: ['San Salvador'] }
    ]
  },
  {
    code: 'GQ',
    name: 'Equatorial Guinea',
    states: [
      { code: 'I', name: 'Insular Region', cities: ['Malabo'] }
    ]
  },
  {
    code: 'ER',
    name: 'Eritrea',
    states: [
      { code: 'MA', name: 'Maekel', cities: ['Asmara'] }
    ]
  },
  {
    code: 'EE',
    name: 'Estonia',
    states: [
      { code: 'HR', name: 'Harju', cities: ['Tallinn'] }
    ]
  },
  {
    code: 'SZ',
    name: 'Eswatini',
    states: [
      { code: 'HH', name: 'Hhohho', cities: ['Mbabane'] }
    ]
  },
  {
    code: 'ET',
    name: 'Ethiopia',
    states: [
      { code: 'AA', name: 'Addis Ababa', cities: ['Addis Ababa'] }
    ]
  },
  {
    code: 'FJ',
    name: 'Fiji',
    states: [
      { code: 'C', name: 'Central', cities: ['Suva'] }
    ]
  },
  {
    code: 'FI',
    name: 'Finland',
    states: [
      { code: 'US', name: 'Uusimaa', cities: ['Helsinki', 'Espoo', 'Vantaa'] },
      { code: 'PS', name: 'Pirkanmaa', cities: ['Tampere'] }
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
      },
      {
        code: 'OCC',
        name: 'Occitania',
        cities: ['Toulouse', 'Montpellier', 'Nîmes', 'Perpignan']
      }
    ]
  },
  {
    code: 'GA',
    name: 'Gabon',
    states: [
      { code: 'ES', name: 'Estuaire', cities: ['Libreville'] }
    ]
  },
  {
    code: 'GM',
    name: 'Gambia',
    states: [
      { code: 'B', name: 'Banjul', cities: ['Banjul'] }
    ]
  },
  {
    code: 'GE',
    name: 'Georgia',
    states: [
      { code: 'TB', name: 'Tbilisi', cities: ['Tbilisi'] }
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
      },
      {
        code: 'BE',
        name: 'Berlin',
        cities: ['Berlin']
      },
      {
        code: 'HH',
        name: 'Hamburg',
        cities: ['Hamburg']
      }
    ]
  },
  {
    code: 'GH',
    name: 'Ghana',
    states: [
      { code: 'AA', name: 'Greater Accra', cities: ['Accra', 'Tema'] }
    ]
  },
  {
    code: 'GR',
    name: 'Greece',
    states: [
      { code: 'A', name: 'Attica', cities: ['Athens', 'Piraeus'] },
      { code: 'B', name: 'Central Macedonia', cities: ['Thessaloniki'] }
    ]
  },
  {
    code: 'GD',
    name: 'Grenada',
    states: [
      { code: 'GD', name: 'Saint George', cities: ['St. George\'s'] }
    ]
  },
  {
    code: 'GT',
    name: 'Guatemala',
    states: [
      { code: 'GU', name: 'Guatemala', cities: ['Guatemala City'] }
    ]
  },
  {
    code: 'GN',
    name: 'Guinea',
    states: [
      { code: 'C', name: 'Conakry', cities: ['Conakry'] }
    ]
  },
  {
    code: 'GW',
    name: 'Guinea-Bissau',
    states: [
      { code: 'BS', name: 'Bissau', cities: ['Bissau'] }
    ]
  },
  {
    code: 'GY',
    name: 'Guyana',
    states: [
      { code: 'DE', name: 'Demerara-Mahaica', cities: ['Georgetown'] }
    ]
  },
  {
    code: 'HT',
    name: 'Haiti',
    states: [
      { code: 'OU', name: 'Ouest', cities: ['Port-au-Prince'] }
    ]
  },
  {
    code: 'VA',
    name: 'Holy See',
    states: [
      { code: 'VA', name: 'Vatican City', cities: ['Vatican City'] }
    ]
  },
  {
    code: 'HN',
    name: 'Honduras',
    states: [
      { code: 'FM', name: 'Francisco Morazán', cities: ['Tegucigalpa'] }
    ]
  },
  {
    code: 'HU',
    name: 'Hungary',
    states: [
      { code: 'BU', name: 'Budapest', cities: ['Budapest'] },
      { code: 'PE', name: 'Pest', cities: ['Debrecen'] }
    ]
  },
  {
    code: 'IS',
    name: 'Iceland',
    states: [
      { code: 'RV', name: 'Reykjavík', cities: ['Reykjavík'] }
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
      },
      {
        code: 'UP',
        name: 'Uttar Pradesh',
        cities: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad']
      },
      {
        code: 'WB',
        name: 'West Bengal',
        cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol']
      }
    ]
  },
  {
    code: 'ID',
    name: 'Indonesia',
    states: [
      { code: 'JK', name: 'Jakarta', cities: ['Jakarta', 'Depok', 'Bekasi'] },
      { code: 'JB', name: 'West Java', cities: ['Bandung', 'Bogor', 'Cimahi'] }
    ]
  },
  {
    code: 'IR',
    name: 'Iran',
    states: [
      { code: 'TH', name: 'Tehran', cities: ['Tehran', 'Karaj'] },
      { code: 'ES', name: 'Isfahan', cities: ['Isfahan'] }
    ]
  },
  {
    code: 'IQ',
    name: 'Iraq',
    states: [
      { code: 'BG', name: 'Baghdad', cities: ['Baghdad'] },
      { code: 'NI', name: 'Nineveh', cities: ['Mosul'] }
    ]
  },
  {
    code: 'IE',
    name: 'Ireland',
    states: [
      { code: 'D', name: 'Dublin', cities: ['Dublin', 'Cork', 'Limerick'] }
    ]
  },
  {
    code: 'IL',
    name: 'Israel',
    states: [
      { code: 'JM', name: 'Jerusalem', cities: ['Jerusalem'] },
      { code: 'TA', name: 'Tel Aviv', cities: ['Tel Aviv', 'Haifa'] }
    ]
  },
  {
    code: 'IT',
    name: 'Italy',
    states: [
      { code: 'LZ', name: 'Lazio', cities: ['Rome'] },
      { code: 'LM', name: 'Lombardy', cities: ['Milan', 'Bergamo', 'Brescia'] },
      { code: 'CA', name: 'Campania', cities: ['Naples', 'Salerno'] },
      { code: 'TO', name: 'Tuscany', cities: ['Florence', 'Pisa'] }
    ]
  },
  {
    code: 'JM',
    name: 'Jamaica',
    states: [
      { code: 'KI', name: 'Kingston', cities: ['Kingston', 'Spanish Town'] }
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
      },
      {
        code: 'KN',
        name: 'Kanagawa',
        cities: ['Yokohama', 'Kawasaki', 'Sagamihara']
      }
    ]
  },
  {
    code: 'JO',
    name: 'Jordan',
    states: [
      { code: 'AM', name: 'Amman', cities: ['Amman'] }
    ]
  },
  {
    code: 'KZ',
    name: 'Kazakhstan',
    states: [
      { code: 'ALA', name: 'Almaty', cities: ['Almaty'] },
      { code: 'AST', name: 'Nur-Sultan', cities: ['Nur-Sultan'] }
    ]
  },
  {
    code: 'KE',
    name: 'Kenya',
    states: [
      { code: 'NAI', name: 'Nairobi', cities: ['Nairobi'] },
      { code: 'MSA', name: 'Mombasa', cities: ['Mombasa'] }
    ]
  },
  {
    code: 'KI',
    name: 'Kiribati',
    states: [
      { code: 'G', name: 'Gilbert Islands', cities: ['South Tarawa'] }
    ]
  },
  {
    code: 'KP',
    name: 'North Korea',
    states: [
      { code: 'PY', name: 'Pyongyang', cities: ['Pyongyang'] }
    ]
  },
  {
    code: 'KR',
    name: 'South Korea',
    states: [
      { code: 'SE', name: 'Seoul', cities: ['Seoul', 'Incheon'] },
      { code: 'BS', name: 'Busan', cities: ['Busan'] },
      { code: 'DG', name: 'Daegu', cities: ['Daegu'] }
    ]
  },
  {
    code: 'KW',
    name: 'Kuwait',
    states: [
      { code: 'KU', name: 'Kuwait', cities: ['Kuwait City'] }
    ]
  },
  {
    code: 'KG',
    name: 'Kyrgyzstan',
    states: [
      { code: 'GB', name: 'Bishkek', cities: ['Bishkek'] }
    ]
  },
  {
    code: 'LA',
    name: 'Laos',
    states: [
      { code: 'VT', name: 'Vientiane', cities: ['Vientiane'] }
    ]
  },
  {
    code: 'LV',
    name: 'Latvia',
    states: [
      { code: 'RIX', name: 'Riga', cities: ['Riga'] }
    ]
  },
  {
    code: 'LB',
    name: 'Lebanon',
    states: [
      { code: 'BA', name: 'Beirut', cities: ['Beirut'] }
    ]
  },
  {
    code: 'LS',
    name: 'Lesotho',
    states: [
      { code: 'MS', name: 'Maseru', cities: ['Maseru'] }
    ]
  },
  {
    code: 'LR',
    name: 'Liberia',
    states: [
      { code: 'MO', name: 'Montserrado', cities: ['Monrovia'] }
    ]
  },
  {
    code: 'LY',
    name: 'Libya',
    states: [
      { code: 'TB', name: 'Tripoli', cities: ['Tripoli'] }
    ]
  },
  {
    code: 'LI',
    name: 'Liechtenstein',
    states: [
      { code: 'VZ', name: 'Vaduz', cities: ['Vaduz'] }
    ]
  },
  {
    code: 'LT',
    name: 'Lithuania',
    states: [
      { code: 'VL', name: 'Vilnius', cities: ['Vilnius'] }
    ]
  },
  {
    code: 'LU',
    name: 'Luxembourg',
    states: [
      { code: 'LU', name: 'Luxembourg', cities: ['Luxembourg City'] }
    ]
  },
  {
    code: 'MG',
    name: 'Madagascar',
    states: [
      { code: 'AN', name: 'Antananarivo', cities: ['Antananarivo'] }
    ]
  },
  {
    code: 'MW',
    name: 'Malawi',
    states: [
      { code: 'LI', name: 'Lilongwe', cities: ['Lilongwe'] }
    ]
  },
  {
    code: 'MY',
    name: 'Malaysia',
    states: [
      { code: 'KUL', name: 'Kuala Lumpur', cities: ['Kuala Lumpur', 'Petaling Jaya'] },
      { code: 'JOH', name: 'Johor', cities: ['Johor Bahru'] }
    ]
  },
  {
    code: 'MV',
    name: 'Maldives',
    states: [
      { code: 'MLE', name: 'Malé', cities: ['Malé'] }
    ]
  },
  {
    code: 'ML',
    name: 'Mali',
    states: [
      { code: 'BKO', name: 'Bamako', cities: ['Bamako'] }
    ]
  },
  {
    code: 'MT',
    name: 'Malta',
    states: [
      { code: 'VLT', name: 'Valletta', cities: ['Valletta'] }
    ]
  },
  {
    code: 'MH',
    name: 'Marshall Islands',
    states: [
      { code: 'MAJ', name: 'Majuro', cities: ['Majuro'] }
    ]
  },
  {
    code: 'MR',
    name: 'Mauritania',
    states: [
      { code: 'NKC', name: 'Nouakchott', cities: ['Nouakchott'] }
    ]
  },
  {
    code: 'MU',
    name: 'Mauritius',
    states: [
      { code: 'PL', name: 'Port Louis', cities: ['Port Louis'] }
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
      },
      {
        code: 'PU',
        name: 'Puebla',
        cities: ['Puebla', 'Tehuacán', 'Atlixco']
      }
    ]
  },
  {
    code: 'FM',
    name: 'Micronesia',
    states: [
      { code: 'PON', name: 'Pohnpei', cities: ['Palikir'] }
    ]
  },
  {
    code: 'MD',
    name: 'Moldova',
    states: [
      { code: 'CH', name: 'Chișinău', cities: ['Chișinău'] }
    ]
  },
  {
    code: 'MC',
    name: 'Monaco',
    states: [
      { code: 'MC', name: 'Monaco', cities: ['Monaco'] }
    ]
  },
  {
    code: 'MN',
    name: 'Mongolia',
    states: [
      { code: 'UB', name: 'Ulaanbaatar', cities: ['Ulaanbaatar'] }
    ]
  },
  {
    code: 'ME',
    name: 'Montenegro',
    states: [
      { code: 'PG', name: 'Podgorica', cities: ['Podgorica'] }
    ]
  },
  {
    code: 'MA',
    name: 'Morocco',
    states: [
      { code: 'RBA', name: 'Rabat-Salé-Kénitra', cities: ['Rabat'] },
      { code: 'CAS', name: 'Casablanca-Settat', cities: ['Casablanca'] }
    ]
  },
  {
    code: 'MZ',
    name: 'Mozambique',
    states: [
      { code: 'MPM', name: 'Maputo', cities: ['Maputo'] }
    ]
  },
  {
    code: 'MM',
    name: 'Myanmar',
    states: [
      { code: 'YGN', name: 'Yangon', cities: ['Yangon'] },
      { code: 'NPT', name: 'Naypyidaw', cities: ['Naypyidaw'] }
    ]
  },
  {
    code: 'NA',
    name: 'Namibia',
    states: [
      { code: 'KH', name: 'Khomas', cities: ['Windhoek'] }
    ]
  },
  {
    code: 'NR',
    name: 'Nauru',
    states: [
      { code: 'YA', name: 'Yaren', cities: ['Yaren'] }
    ]
  },
  {
    code: 'NP',
    name: 'Nepal',
    states: [
      { code: 'BA', name: 'Bagmati', cities: ['Kathmandu'] }
    ]
  },
  {
    code: 'NL',
    name: 'Netherlands',
    states: [
      { code: 'NH', name: 'North Holland', cities: ['Amsterdam', 'Haarlem'] },
      { code: 'ZH', name: 'South Holland', cities: ['The Hague', 'Rotterdam'] }
    ]
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    states: [
      { code: 'AUK', name: 'Auckland', cities: ['Auckland'] },
      { code: 'WGN', name: 'Wellington', cities: ['Wellington'] },
      { code: 'CAN', name: 'Canterbury', cities: ['Christchurch'] }
    ]
  },
  {
    code: 'NI',
    name: 'Nicaragua',
    states: [
      { code: 'MN', name: 'Managua', cities: ['Managua'] }
    ]
  },
  {
    code: 'NE',
    name: 'Niger',
    states: [
      { code: 'NI', name: 'Niamey', cities: ['Niamey'] }
    ]
  },
  {
    code: 'NG',
    name: 'Nigeria',
    states: [
      { code: 'LA', name: 'Lagos', cities: ['Lagos'] },
      { code: 'AB', name: 'Abuja', cities: ['Abuja'] },
      { code: 'KA', name: 'Kano', cities: ['Kano'] }
    ]
  },
  {
    code: 'MK',
    name: 'North Macedonia',
    states: [
      { code: 'SK', name: 'Skopje', cities: ['Skopje'] }
    ]
  },
  {
    code: 'NO',
    name: 'Norway',
    states: [
      { code: 'OS', name: 'Oslo', cities: ['Oslo'] },
      { code: 'BG', name: 'Bergen', cities: ['Bergen'] }
    ]
  },
  {
    code: 'OM',
    name: 'Oman',
    states: [
      { code: 'MS', name: 'Muscat', cities: ['Muscat'] }
    ]
  },
  {
    code: 'PK',
    name: 'Pakistan',
    states: [
      { code: 'IS', name: 'Islamabad', cities: ['Islamabad'] },
      { code: 'PB', name: 'Punjab', cities: ['Lahore', 'Faisalabad', 'Rawalpindi'] },
      { code: 'SD', name: 'Sindh', cities: ['Karachi', 'Hyderabad'] }
    ]
  },
  {
    code: 'PW',
    name: 'Palau',
    states: [
      { code: 'KOR', name: 'Koror', cities: ['Koror'] }
    ]
  },
  {
    code: 'PA',
    name: 'Panama',
    states: [
      { code: 'PA', name: 'Panama', cities: ['Panama City'] }
    ]
  },
  {
    code: 'PG',
    name: 'Papua New Guinea',
    states: [
      { code: 'NCD', name: 'National Capital District', cities: ['Port Moresby'] }
    ]
  },
  {
    code: 'PY',
    name: 'Paraguay',
    states: [
      { code: 'ASU', name: 'Asunción', cities: ['Asunción'] }
    ]
  },
  {
    code: 'PE',
    name: 'Peru',
    states: [
      { code: 'LI', name: 'Lima', cities: ['Lima'] },
      { code: 'AR', name: 'Arequipa', cities: ['Arequipa'] }
    ]
  },
  {
    code: 'PH',
    name: 'Philippines',
    states: [
      { code: 'NCR', name: 'National Capital Region', cities: ['Manila', 'Quezon City', 'Makati'] },
      { code: 'CEB', name: 'Cebu', cities: ['Cebu City'] }
    ]
  },
  {
    code: 'PL',
    name: 'Poland',
    states: [
      { code: 'MZ', name: 'Masovian', cities: ['Warsaw'] },
      { code: 'MP', name: 'Lesser Poland', cities: ['Kraków'] },
      { code: 'SL', name: 'Silesian', cities: ['Katowice'] }
    ]
  },
  {
    code: 'PT',
    name: 'Portugal',
    states: [
      { code: 'LI', name: 'Lisbon', cities: ['Lisbon'] },
      { code: 'PO', name: 'Porto', cities: ['Porto'] }
    ]
  },
  {
    code: 'QA',
    name: 'Qatar',
    states: [
      { code: 'DO', name: 'Doha', cities: ['Doha'] }
    ]
  },
  {
    code: 'RO',
    name: 'Romania',
    states: [
      { code: 'B', name: 'Bucharest', cities: ['Bucharest'] },
      { code: 'CJ', name: 'Cluj', cities: ['Cluj-Napoca'] }
    ]
  },
  {
    code: 'RU',
    name: 'Russia',
    states: [
      { code: 'MOW', name: 'Moscow', cities: ['Moscow'] },
      { code: 'SPE', name: 'Saint Petersburg', cities: ['Saint Petersburg'] },
      { code: 'NSK', name: 'Novosibirsk', cities: ['Novosibirsk'] }
    ]
  },
  {
    code: 'RW',
    name: 'Rwanda',
    states: [
      { code: 'KI', name: 'Kigali', cities: ['Kigali'] }
    ]
  },
  {
    code: 'KN',
    name: 'Saint Kitts and Nevis',
    states: [
      { code: 'N', name: 'Nevis', cities: ['Charlestown'] }
    ]
  },
  {
    code: 'LC',
    name: 'Saint Lucia',
    states: [
      { code: 'CAS', name: 'Castries', cities: ['Castries'] }
    ]
  },
  {
    code: 'VC',
    name: 'Saint Vincent and the Grenadines',
    states: [
      { code: 'GE', name: 'Saint George', cities: ['Kingstown'] }
    ]
  },
  {
    code: 'WS',
    name: 'Samoa',
    states: [
      { code: 'AA', name: 'A\'ana', cities: ['Apia'] }
    ]
  },
  {
    code: 'SM',
    name: 'San Marino',
    states: [
      { code: 'SM', name: 'San Marino', cities: ['San Marino'] }
    ]
  },
  {
    code: 'ST',
    name: 'Sao Tome and Principe',
    states: [
      { code: 'S', name: 'São Tomé', cities: ['São Tomé'] }
    ]
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    states: [
      { code: 'RI', name: 'Riyadh', cities: ['Riyadh'] },
      { code: 'MK', name: 'Makkah', cities: ['Mecca', 'Jeddah'] }
    ]
  },
  {
    code: 'SN',
    name: 'Senegal',
    states: [
      { code: 'DK', name: 'Dakar', cities: ['Dakar'] }
    ]
  },
  {
    code: 'RS',
    name: 'Serbia',
    states: [
      { code: 'BG', name: 'Belgrade', cities: ['Belgrade'] }
    ]
  },
  {
    code: 'SC',
    name: 'Seychelles',
    states: [
      { code: 'EN', name: 'English River', cities: ['Victoria'] }
    ]
  },
  {
    code: 'SL',
    name: 'Sierra Leone',
    states: [
      { code: 'W', name: 'Western Area', cities: ['Freetown'] }
    ]
  },
  {
    code: 'SG',
    name: 'Singapore',
    states: [
      { code: 'SG', name: 'Singapore', cities: ['Singapore'] }
    ]
  },
  {
    code: 'SK',
    name: 'Slovakia',
    states: [
      { code: 'BA', name: 'Bratislava', cities: ['Bratislava'] }
    ]
  },
  {
    code: 'SI',
    name: 'Slovenia',
    states: [
      { code: 'LJ', name: 'Ljubljana', cities: ['Ljubljana'] }
    ]
  },
  {
    code: 'SB',
    name: 'Solomon Islands',
    states: [
      { code: 'GU', name: 'Guadalcanal', cities: ['Honiara'] }
    ]
  },
  {
    code: 'SO',
    name: 'Somalia',
    states: [
      { code: 'BN', name: 'Banaadir', cities: ['Mogadishu'] }
    ]
  },
  {
    code: 'ZA',
    name: 'South Africa',
    states: [
      { code: 'GT', name: 'Gauteng', cities: ['Johannesburg', 'Pretoria'] },
      { code: 'WC', name: 'Western Cape', cities: ['Cape Town'] },
      { code: 'KZN', name: 'KwaZulu-Natal', cities: ['Durban'] }
    ]
  },
  {
    code: 'SS',
    name: 'South Sudan',
    states: [
      { code: 'JU', name: 'Juba', cities: ['Juba'] }
    ]
  },
  {
    code: 'ES',
    name: 'Spain',
    states: [
      { code: 'M', name: 'Madrid', cities: ['Madrid'] },
      { code: 'CT', name: 'Catalonia', cities: ['Barcelona'] },
      { code: 'AN', name: 'Andalusia', cities: ['Seville', 'Málaga'] },
      { code: 'VC', name: 'Valencia', cities: ['Valencia'] }
    ]
  },
  {
    code: 'LK',
    name: 'Sri Lanka',
    states: [
      { code: 'WP', name: 'Western Province', cities: ['Colombo'] }
    ]
  },
  {
    code: 'SD',
    name: 'Sudan',
    states: [
      { code: 'KH', name: 'Khartoum', cities: ['Khartoum'] }
    ]
  },
  {
    code: 'SR',
    name: 'Suriname',
    states: [
      { code: 'PM', name: 'Paramaribo', cities: ['Paramaribo'] }
    ]
  },
  {
    code: 'SE',
    name: 'Sweden',
    states: [
      { code: 'AB', name: 'Stockholm', cities: ['Stockholm'] },
      { code: 'O', name: 'Västra Götaland', cities: ['Gothenburg'] }
    ]
  },
  {
    code: 'CH',
    name: 'Switzerland',
    states: [
      { code: 'ZH', name: 'Zurich', cities: ['Zurich'] },
      { code: 'BE', name: 'Bern', cities: ['Bern'] },
      { code: 'GE', name: 'Geneva', cities: ['Geneva'] }
    ]
  },
  {
    code: 'SY',
    name: 'Syria',
    states: [
      { code: 'DI', name: 'Damascus', cities: ['Damascus'] },
      { code: 'HL', name: 'Aleppo', cities: ['Aleppo'] }
    ]
  },
  {
    code: 'TW',
    name: 'Taiwan',
    states: [
      { code: 'TPE', name: 'Taipei', cities: ['Taipei'] },
      { code: 'KHH', name: 'Kaohsiung', cities: ['Kaohsiung'] }
    ]
  },
  {
    code: 'TJ',
    name: 'Tajikistan',
    states: [
      { code: 'DU', name: 'Dushanbe', cities: ['Dushanbe'] }
    ]
  },
  {
    code: 'TZ',
    name: 'Tanzania',
    states: [
      { code: 'DS', name: 'Dar es Salaam', cities: ['Dar es Salaam'] },
      { code: 'DO', name: 'Dodoma', cities: ['Dodoma'] }
    ]
  },
  {
    code: 'TH',
    name: 'Thailand',
    states: [
      { code: 'BKK', name: 'Bangkok', cities: ['Bangkok'] },
      { code: 'CM', name: 'Chiang Mai', cities: ['Chiang Mai'] }
    ]
  },
  {
    code: 'TL',
    name: 'Timor-Leste',
    states: [
      { code: 'DI', name: 'Dili', cities: ['Dili'] }
    ]
  },
  {
    code: 'TG',
    name: 'Togo',
    states: [
      { code: 'M', name: 'Maritime', cities: ['Lomé'] }
    ]
  },
  {
    code: 'TO',
    name: 'Tonga',
    states: [
      { code: 'TO', name: 'Tongatapu', cities: ['Nuku\'alofa'] }
    ]
  },
  {
    code: 'TT',
    name: 'Trinidad and Tobago',
    states: [
      { code: 'POS', name: 'Port of Spain', cities: ['Port of Spain'] }
    ]
  },
  {
    code: 'TN',
    name: 'Tunisia',
    states: [
      { code: 'TU', name: 'Tunis', cities: ['Tunis'] }
    ]
  },
  {
    code: 'TR',
    name: 'Turkey',
    states: [
      { code: 'IST', name: 'Istanbul', cities: ['Istanbul'] },
      { code: 'ANK', name: 'Ankara', cities: ['Ankara'] },
      { code: 'IZ', name: 'İzmir', cities: ['İzmir'] }
    ]
  },
  {
    code: 'TM',
    name: 'Turkmenistan',
    states: [
      { code: 'A', name: 'Ahal', cities: ['Ashgabat'] }
    ]
  },
  {
    code: 'TV',
    name: 'Tuvalu',
    states: [
      { code: 'FUN', name: 'Funafuti', cities: ['Funafuti'] }
    ]
  },
  {
    code: 'UG',
    name: 'Uganda',
    states: [
      { code: 'KLA', name: 'Kampala', cities: ['Kampala'] }
    ]
  },
  {
    code: 'UA',
    name: 'Ukraine',
    states: [
      { code: 'KY', name: 'Kiev', cities: ['Kiev'] },
      { code: 'KH', name: 'Kharkiv', cities: ['Kharkiv'] }
    ]
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    states: [
      { code: 'DU', name: 'Dubai', cities: ['Dubai'] },
      { code: 'AD', name: 'Abu Dhabi', cities: ['Abu Dhabi'] }
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
      },
      {
        code: 'PA',
        name: 'Pennsylvania',
        cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie']
      },
      {
        code: 'OH',
        name: 'Ohio',
        cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo']
      },
      {
        code: 'GA',
        name: 'Georgia',
        cities: ['Atlanta', 'Augusta', 'Columbus', 'Savannah']
      },
      {
        code: 'NC',
        name: 'North Carolina',
        cities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham']
      },
      {
        code: 'MI',
        name: 'Michigan',
        cities: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights']
      }
    ]
  },
  {
    code: 'UY',
    name: 'Uruguay',
    states: [
      { code: 'MO', name: 'Montevideo', cities: ['Montevideo'] }
    ]
  },
  {
    code: 'UZ',
    name: 'Uzbekistan',
    states: [
      { code: 'TK', name: 'Tashkent', cities: ['Tashkent'] }
    ]
  },
  {
    code: 'VU',
    name: 'Vanuatu',
    states: [
      { code: 'SH', name: 'Shefa', cities: ['Port Vila'] }
    ]
  },
  {
    code: 'VE',
    name: 'Venezuela',
    states: [
      { code: 'DC', name: 'Capital District', cities: ['Caracas'] }
    ]
  },
  {
    code: 'VN',
    name: 'Vietnam',
    states: [
      { code: 'HN', name: 'Hanoi', cities: ['Hanoi'] },
      { code: 'SG', name: 'Ho Chi Minh City', cities: ['Ho Chi Minh City'] }
    ]
  },
  {
    code: 'YE',
    name: 'Yemen',
    states: [
      { code: 'SA', name: 'Sana\'a', cities: ['Sana\'a'] }
    ]
  },
  {
    code: 'ZM',
    name: 'Zambia',
    states: [
      { code: 'LS', name: 'Lusaka', cities: ['Lusaka'] }
    ]
  },
  {
    code: 'ZW',
    name: 'Zimbabwe',
    states: [
      { code: 'HA', name: 'Harare', cities: ['Harare'] }
    ]
  }
];